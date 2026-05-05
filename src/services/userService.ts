import type { StoredUser, UserRole } from '../types';
import { mockUsers } from '../data/mockData';

const USERS_KEY = 'managedUsers';
const USERS_VERSION_KEY = 'managedUsersVersion';
const USERS_VERSION = 'v1';

const readUsers = (): StoredUser[] => {
  const savedVersion = localStorage.getItem(USERS_VERSION_KEY);
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw || savedVersion !== USERS_VERSION) {
    return mockUsers.map(u => ({ ...u }));
  }

  try {
    const parsed = JSON.parse(raw) as StoredUser[];
    return Array.isArray(parsed) ? parsed : mockUsers.map(u => ({ ...u }));
  } catch {
    return mockUsers.map(u => ({ ...u }));
  }
};

const usersStore: StoredUser[] = readUsers();

const persist = () => {
  localStorage.setItem(USERS_KEY, JSON.stringify(usersStore));
  localStorage.setItem(USERS_VERSION_KEY, USERS_VERSION);
};

if (!localStorage.getItem(USERS_KEY) || localStorage.getItem(USERS_VERSION_KEY) !== USERS_VERSION) {
  persist();
}

export const getUsers = (): StoredUser[] => [...usersStore];

export const getUserByUsername = (username: string): StoredUser | undefined => {
  return usersStore.find(u => u.username === username);
};

export const addUser = (userData: Omit<StoredUser, 'id'>): StoredUser | { error: string } => {
  if (usersStore.some(u => u.username === userData.username)) {
    return { error: 'Username-ul există deja.' };
  }

  const maxId = usersStore.length > 0 ? Math.max(...usersStore.map(u => u.id)) : 0;
  const newUser: StoredUser = { ...userData, id: maxId + 1 };
  usersStore.push(newUser);
  persist();
  return newUser;
};

export const updateUserRole = (id: number, role: UserRole): StoredUser | undefined => {
  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) return undefined;
  usersStore[index] = { ...usersStore[index], role };
  persist();
  return usersStore[index];
};

export const deleteUser = (id: number): boolean => {
  const index = usersStore.findIndex(u => u.id === id);
  if (index === -1) return false;
  usersStore.splice(index, 1);
  persist();
  return true;
};
