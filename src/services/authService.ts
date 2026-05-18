import type { AuthResponse, User, UserRole } from '../types';
import { getUserByUsername } from './userService';

const AUTH_STORAGE_KEY    = 'authUser';
const TOKEN_STORAGE_KEY   = 'authToken';
const REFRESH_STORAGE_KEY = 'refreshToken';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';

const normalizeRole = (role: string): UserRole =>
  role.toLowerCase() === 'admin' ? 'admin' : 'user';

const toUser = (payload: AuthResponse): User => ({
  id:       payload.id,
  username: payload.username,
  role:     normalizeRole(payload.role),
  email:    payload.email,
});

export const persistTokens = (accessToken: string, refreshToken: string | null): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_STORAGE_KEY, refreshToken);
  } else {
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  }
};

const persistAuth = (user: User, accessToken: string | null, refreshToken: string | null): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  if (accessToken) {
    persistTokens(accessToken, refreshToken);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_STORAGE_KEY);
  }
};

export const getStoredUser = (): User | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getStoredToken = (): string | null =>
  localStorage.getItem(TOKEN_STORAGE_KEY);

export const getStoredRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_STORAGE_KEY);

const loginWithApi = async (
  username: string,
  password: string
): Promise<{ user: User; token: string | null; refreshToken: string | null } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ username, password }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as AuthResponse;
    return {
      user:         toUser(payload),
      token:        payload.token        ?? null,
      refreshToken: payload.refreshToken ?? null,
    };
  } catch {
    return null;
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ user: User; token: string | null } | null> => {
  const apiLogin = await loginWithApi(username, password);
  if (apiLogin) {
    persistAuth(apiLogin.user, apiLogin.token, apiLogin.refreshToken);
    return { user: apiLogin.user, token: apiLogin.token };
  }

  // Local fallback (mock users — no refresh token)
  const foundUser = getUserByUsername(username);
  if (!foundUser || foundUser.password !== password) return null;

  const fallbackUser: User = {
    id:       foundUser.id,
    username: foundUser.username,
    role:     foundUser.role,
    email:    foundUser.email,
  };
  persistAuth(fallbackUser, null, null);
  return { user: fallbackUser, token: null };
};

export const logoutUser = (rawRefreshToken?: string): void => {
  // Revoke token on backend — fire and forget
  if (rawRefreshToken) {
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken: rawRefreshToken }),
    }).catch(() => { /* ignore — we're logging out regardless */ });
  }
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_STORAGE_KEY);
};

export const userIsAdmin = (user: User | null): boolean =>
  user?.role === 'admin';
