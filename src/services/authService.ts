import type { AuthResponse, User, UserRole } from '../types';
import { getUserByUsername } from './userService';

const AUTH_STORAGE_KEY = 'authUser';
const TOKEN_STORAGE_KEY = 'authToken';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ?? '';

const normalizeRole = (role: string): UserRole => {
  return role.toLowerCase() === 'admin' ? 'admin' : 'user';
};

const toUser = (payload: AuthResponse): User => ({
  id: payload.id,
  username: payload.username,
  role: normalizeRole(payload.role),
  email: payload.email
});

const persistAuth = (user: User, token: string | null) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const getStoredUser = (): User | null => {
  const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const loginWithApi = async (username: string, password: string): Promise<{ user: User; token: string | null } | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AuthResponse;
    return {
      user: toUser(payload),
      token: payload.token ?? null
    };
  } catch {
    return null;
  }
};

export const loginUser = async (username: string, password: string): Promise<{ user: User; token: string | null } | null> => {
  const apiLogin = await loginWithApi(username, password);
  if (apiLogin) {
    persistAuth(apiLogin.user, apiLogin.token);
    return apiLogin;
  }

  const foundUser = getUserByUsername(username);

  if (!foundUser || foundUser.password !== password) {
    return null;
  }

  const fallbackUser: User = {
    id: foundUser.id,
    username: foundUser.username,
    role: foundUser.role,
    email: foundUser.email
  };

  persistAuth(fallbackUser, null);
  return { user: fallbackUser, token: null };
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const userIsAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};
