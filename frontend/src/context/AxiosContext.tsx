import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

const AxiosContext = createContext<AxiosInstance | undefined>(undefined);

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: 'http://localhost:5228/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de request — loc pentru a adauga token Authorization in viitor
    instance.interceptors.request.use(
      (config) => {
        // Exemplu pentru JWT in viitor:
        // const token = localStorage.getItem('token');
        // if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor de response — gestioneaza erorile global
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;

        if (status === 400) {
          console.warn('[Axios 400] Validare esuata:', error.response?.data);
        } else if (status === 401) {
          console.warn('[Axios 401] Neautorizat. Redirectionare la login...');
          navigate('/login');
        } else if (status === 403) {
          console.warn('[Axios 403] Acces interzis.');
          navigate('/403');
        } else if (status === 404) {
          console.warn('[Axios 404] Resursa negasita.');
        } else if (status === 500) {
          console.error('[Axios 500] Eroare interna de server.');
        }

        return Promise.reject(error);
      }
    );

    return instance;
  }, [navigate]);

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext);
  if (!context) {
    throw new Error('useAxios must be used within AxiosProvider');
  }
  return context;
};
