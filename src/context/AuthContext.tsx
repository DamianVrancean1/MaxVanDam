import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType, UserRole } from '../types';
import {
  getStoredUser,
  loginUser,
  logoutUser,
  persistUser,
  userIsAdmin,
} from '../services/authService';
import { apiFetch, configureApiClient } from '../services/apiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getStoredUser());

  useEffect(() => {
    const onForceLogout = (): void => {
      setUser(null);
      logoutUser();
    };

    // Configure refresh interceptor before any API calls run
    configureApiClient(onForceLogout);

    // Verify the session cookie is still valid on every app mount.
    // getStoredUser() provides optimistic initial state so there's no
    // flash of logged-out UI while the request is in-flight.
    if (getStoredUser()) {
      apiFetch('/api/auth/me')
        .then(async (res) => {
          if (!res.ok) {
            // Cookie expired and refresh also failed — clear state
            onForceLogout();
            return;
          }
          const data = (await res.json()) as {
            id: number;
            username: string;
            role: string;
            email: string;
          };
          const fresh: User = {
            id:       data.id,
            username: data.username,
            role:     data.role as UserRole,
            email:    data.email,
          };
          // Sync React state and localStorage with the server's latest user data
          setUser(fresh);
          persistUser(fresh);
        })
        .catch(() => {
          // Network error — keep optimistic state, don't force logout
        });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username: string, password: string): Promise<User | null> => {
    const authResult = await loginUser(username, password);
    if (!authResult) return null;
    setUser(authResult.user);
    return authResult.user;
  };

  const logout = (): void => {
    setUser(null);
    logoutUser();
  };

  const isAdmin = (): boolean => userIsAdmin(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isAdmin }}>
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
