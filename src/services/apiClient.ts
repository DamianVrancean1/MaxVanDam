import { getApiUrl } from '../config/api';

const API_BASE = getApiUrl();

// ── Auth bridge — set by AuthContext on mount ──────────────────────────────
let _onForceLogout: () => void = () => {};

export function configureApiClient(onForceLogout: () => void): void {
  _onForceLogout = onForceLogout;
}

// ── Public fetch wrapper ───────────────────────────────────────────────────
// Credentials are sent automatically via HttpOnly cookies.
// A 401 means the session has expired — force a full logout.
export async function apiFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;

  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const response = await fetch(url, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    // Never force-logout on the login endpoint itself
    if (!path.includes('/api/auth/login')) {
      _onForceLogout();
    }
  }

  return response;
}
