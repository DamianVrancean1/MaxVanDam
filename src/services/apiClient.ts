import { getApiUrl } from '../config/api';

const API_BASE = getApiUrl();

// ── Auth bridge — set by AuthContext on mount ──────────────────────────────
let _onForceLogout: () => void = () => {};

export function configureApiClient(onForceLogout: () => void): void {
  _onForceLogout = onForceLogout;
}

// ── Concurrent refresh queue ───────────────────────────────────────────────
// Prevents multiple simultaneous 401s from each triggering a separate refresh.
// Only one refresh request fires; all others wait in queue.
let isRefreshing = false;
let waitingQueue: Array<{ resolve: () => void; reject: (e: unknown) => void }> = [];

function drainQueue(): void {
  waitingQueue.forEach(p => p.resolve());
  waitingQueue = [];
}

function flushQueue(err: unknown): void {
  waitingQueue.forEach(p => p.reject(err));
  waitingQueue = [];
}

// ── Internal refresh — bypasses the interceptor ───────────────────────────
// Browser sends refresh_token cookie automatically; backend sets new cookies.
async function doRefresh(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method:      'POST',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('refresh_failed');
}

// ── Public fetch wrapper ───────────────────────────────────────────────────
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  let response = await fetch(url, { ...init, headers, credentials: 'include' });

  if (response.status !== 401) return response;

  // Never attempt refresh on the refresh or login endpoints — avoids infinite loops
  if (path.includes('/api/auth/refresh') || path.includes('/api/auth/login')) {
    _onForceLogout();
    return response;
  }

  // Another request is already refreshing → queue and wait
  if (isRefreshing) {
    try {
      await new Promise<void>((resolve, reject) =>
        waitingQueue.push({ resolve, reject })
      );
      // New cookies already set by the refresh — retry with credentials
      return fetch(url, { ...init, headers, credentials: 'include' });
    } catch {
      _onForceLogout();
      return response;
    }
  }

  // This request owns the refresh
  isRefreshing = true;
  try {
    await doRefresh();
    drainQueue();
    response = await fetch(url, { ...init, headers, credentials: 'include' });
    return response;
  } catch (err) {
    flushQueue(err);
    _onForceLogout();
    return response;
  } finally {
    isRefreshing = false;
  }
}
