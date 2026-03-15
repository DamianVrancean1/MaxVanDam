import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import { getStoredUser, loginUser, logoutUser, userIsAdmin } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  const login = (username: string, password: string): boolean => {
    const foundUser = loginUser(username, password);
    if (!foundUser) {
      return false;
    }

    setUser(foundUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    logoutUser();
  };

  const isAdmin = (): boolean => {
    return userIsAdmin(user);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
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
