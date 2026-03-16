import type { User, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

const AUTH_STORAGE_KEY = 'authUser';
const REGISTERED_USERS_KEY = 'registeredUsers';

type StoredUser = User & {
  password: string;
};

const normalizeMockUsers = (): StoredUser[] =>
    mockUsers.map((user, index) => ({
      ...user,
      email: user.email ?? `${user.username}@example.com`,
      createdAt: user.createdAt ?? new Date(2026, 2, index + 1).toISOString(),
      password: user.password,
    }));

export const getStoredUser = (): User | null => {
  const rawUser = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as User;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export const getRegisteredUsers = (): StoredUser[] => {
  const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);
  if (!rawUsers) return [];

  try {
    return JSON.parse(rawUsers) as StoredUser[];
  } catch {
    localStorage.removeItem(REGISTERED_USERS_KEY);
    return [];
  }
};

export const saveRegisteredUsers = (users: StoredUser[]) => {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
};

export const getAllUsers = (): StoredUser[] => {
  const registeredUsers = getRegisteredUsers();
  const mock = normalizeMockUsers();

  const merged = [...mock];

  registeredUsers.forEach((registeredUser) => {
    const exists = merged.some((user) => user.username === registeredUser.username);
    if (!exists) {
      merged.push(registeredUser);
    }
  });

  return merged;
};

export const loginUser = (username: string, password: string): User | null => {
  const allUsers = getAllUsers();

  const foundUser = allUsers.find(
      (user) => user.username === username && user.password === password
  );

  if (!foundUser) return null;

  const { password: _password, ...safeUser } = foundUser;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser));
  return safeUser;
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const userIsAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const updateUserRole = (username: string, role: UserRole) => {
  const registeredUsers = getRegisteredUsers();

  const updatedUsers = registeredUsers.map((user) =>
      user.username === username ? { ...user, role } : user
  );

  saveRegisteredUsers(updatedUsers);

  const currentUser = getStoredUser();
  if (currentUser?.username === username) {
    const updatedCurrentUser = { ...currentUser, role };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedCurrentUser));
  }
};

export const deleteRegisteredUser = (username: string) => {
  const registeredUsers = getRegisteredUsers();
  const filteredUsers = registeredUsers.filter((user) => user.username !== username);
  saveRegisteredUsers(filteredUsers);

  const currentUser = getStoredUser();
  if (currentUser?.username === username) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};