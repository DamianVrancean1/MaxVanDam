import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types';
import {
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  loginUser,
  logoutUser,
  persistTokens,
  userIsAdmin,
} from '../services/authService';
import { configureApiClient } from '../services/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,  setUser]  = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  // Ref keeps the interceptor closure always pointing to the latest token
  // without re-running configureApiClient on every token change
  const tokenRef = useRef<string | null>(token);
  tokenRef.current = token;

  useEffect(() => {
    configureApiClient(
      () => tokenRef.current,

      // Called by the interceptor after a successful silent refresh
      (newAccessToken: string, newRefreshToken: string) => {
        setToken(newAccessToken);
        persistTokens(newAccessToken, newRefreshToken);
      },

      // Called when refresh fails — force full logout
      () => {
        setUser(null);
        setToken(null);
        logoutUser();
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username: string, password: string): Promise<User | null> => {
    const authResult = await loginUser(username, password);
    if (!authResult) return null;
    setUser(authResult.user);
    setToken(authResult.token);
    return authResult.user;
  };

  const logout = (): void => {
    const refreshToken = getStoredRefreshToken();
    setUser(null);
    setToken(null);
    logoutUser(refreshToken ?? undefined);
  };

  const isAdmin = (): boolean => userIsAdmin(user);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
