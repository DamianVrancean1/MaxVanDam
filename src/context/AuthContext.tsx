import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import {
  getStoredToken,
  getStoredUser,
  loginUser,
  logoutUser,
  userIsAdmin
} from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const login = async (username: string, password: string): Promise<User | null> => {
    const authResult = await loginUser(username, password);
    if (!authResult) {
      return null;
    }

    setUser(authResult.user);
    setToken(authResult.token);
    return authResult.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    logoutUser();
  };

  const isAdmin = (): boolean => {
    return userIsAdmin(user);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, logout, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
