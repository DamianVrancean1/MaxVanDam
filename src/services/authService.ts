import type { AuthResponse, User, UserRole } from '../types';
import { getUserByUsername } from './userService';

const AUTH_STORAGE_KEY = 'authUser';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';

const normalizeRole = (role: string): UserRole =>
  role.toLowerCase() === 'admin' ? 'admin' : 'user';

const toUser = (payload: AuthResponse): User => ({
  id:       payload.id,
  username: payload.username,
  role:     normalizeRole(payload.role),
  email:    payload.email,
});

export const persistUser = (user: User): void => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
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

const loginWithApi = async (
  username: string,
  password: string
): Promise<{ user: User } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method:      'POST',
      headers:     { 'Content-Type': 'application/json' },
      credentials: 'include',
      body:        JSON.stringify({ username, password }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as AuthResponse;
    return { user: toUser(payload) };
  } catch {
    return null;
  }
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ user: User } | null> => {
  const apiLogin = await loginWithApi(username, password);
  if (apiLogin) {
    persistUser(apiLogin.user);
    return { user: apiLogin.user };
  }

  // Local fallback (mock users — dev only)
  const foundUser = getUserByUsername(username);
  if (!foundUser || foundUser.password !== password) return null;

  const fallbackUser: User = {
    id:       foundUser.id,
    username: foundUser.username,
    role:     foundUser.role,
    email:    foundUser.email,
  };
  persistUser(fallbackUser);
  return { user: fallbackUser };
};

export const logoutUser = (): void => {
  fetch(`${API_BASE_URL}/api/auth/logout`, {
    method:      'POST',
    credentials: 'include',
  }).catch(() => { /* ignore — we're logging out regardless */ });
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const userIsAdmin = (user: User | null): boolean =>
  user?.role === 'admin';
