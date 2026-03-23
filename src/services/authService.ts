import type { User } from '../types';
import { mockUsers } from '../data/mockData';

const AUTH_STORAGE_KEY = 'authUser';

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

export const loginUser = (username: string, password: string): User | null => {
  const foundUser = mockUsers.find(
      user => user.username === username && user.password === password
  );

  if (!foundUser) {
    return null;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
  return foundUser;
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const userIsAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};