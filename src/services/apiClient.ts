import { getApiUrl } from '../config/api';

const API_BASE = getApiUrl();
const REFRESH_PATH = '/api/auth/refresh';

// ── Auth bridge — set by AuthContext on mount ──────────────────────────────
let _getToken: () => string | null = () => null;
let _onRefreshed: (accessToken: string, refreshToken: string) => void = () => {};
let _onForceLogout: () => void = () => {};

export function configureApiClient(
  getToken: () => string | null,
  onRefreshed: (accessToken: string, refreshToken: string) => void,
  onForceLogout: () => void
): void {
  _getToken  = getToken;
  _onRefreshed   = onRefreshed;
  _onForceLogout = onForceLogout;
}

// ── Concurrent refresh queue ───────────────────────────────────────────────
let isRefreshing = false;
let waitingQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];

function drainQueue(newToken: string): void {
  waitingQueue.forEach(p => p.resolve(newToken));
  waitingQueue = [];
}

function flushQueue(err: unknown): void {
  waitingQueue.forEach(p => p.reject(err));
  waitingQueue = [];
}

// ── Internal refresh call — bypasses the interceptor ──────────────────────
async function doRefresh(): Promise<string> {
  const raw = localStorage.getItem('refreshToken');
  if (!raw) throw new Error('no_refresh_token');

  const res = await fetch(`${API_BASE}${REFRESH_PATH}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: raw }),
  });

  if (!res.ok) throw new Error('refresh_failed');

  const data = (await res.json()) as { token: string; refreshToken: string };
  _onRefreshed(data.token, data.refreshToken);
  return data.token;
}

// ── Public fetch wrapper ───────────────────────────────────────────────────
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const buildHeaders = (token: string | null): Headers => {
    const h = new Headers(init.headers);
    if (!h.has('Content-Type')) h.set('Content-Type', 'application/json');
    if (token) h.set('Authorization', `Bearer ${token}`);
    return h;
  };

  // First attempt
  let response = await fetch(url, { ...init, headers: buildHeaders(_getToken()) });

  if (response.status !== 401) return response;

  // Never refresh on the refresh or login endpoints themselves — avoids loops
  if (path.includes(REFRESH_PATH) || path.includes('/api/auth/login')) {
    _onForceLogout();
    return response;
  }

  // Another request is already refreshing → queue and wait
  if (isRefreshing) {
    try {
      const newToken = await new Promise<string>((resolve, reject) =>
        waitingQueue.push({ resolve, reject })
      );
      return fetch(url, { ...init, headers: buildHeaders(newToken) });
    } catch {
      _onForceLogout();
      return response;
    }
  }

  // This request takes ownership of the refresh
  isRefreshing = true;
  try {
    const newToken = await doRefresh();
    drainQueue(newToken);
    response = await fetch(url, { ...init, headers: buildHeaders(newToken) });
    return response;
  } catch (err) {
    flushQueue(err);
    _onForceLogout();
    return response;
  } finally {
    isRefreshing = false;
  }
}
