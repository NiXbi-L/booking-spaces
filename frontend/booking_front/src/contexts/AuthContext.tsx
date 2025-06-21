import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
  isSuperuser: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  username: null,
  isSuperuser: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem('username');
  });
  const [isSuperuser, setIsSuperuser] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Token ${authToken}` },
      });
      setUsername(response.data.username);
      localStorage.setItem('username', response.data.username);
      setIsSuperuser(!!response.data.is_superuser);
      setIsAdmin(!!response.data.is_admin);
    } catch (e) {
      console.error('Failed to fetch user', e);
      // Если токен невалидный, выходим
      logout();
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });

      if (response.data && response.data.token) {
        const authToken = response.data.token;
        localStorage.setItem('token', authToken);
        setToken(authToken);
        setIsAuthenticated(true);
        await fetchUser(authToken); // Получаем данные пользователя
      } else {
        throw new Error('Токен не получен');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Request details:', {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data,
        });
      }
      throw new Error('Ошибка входа. Проверьте правильность данных.');
    }
  };

  const register = async (username: string, password: string) => {
    try {
      console.log('Register attempt with:', { username, password });
      await authService.register({ username, password });
      await login(username, password);
    } catch (error) {
      console.error('Register error:', error);
      throw new Error('Ошибка регистрации. Возможно, пользователь уже существует.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
    setIsAuthenticated(false);
    setIsSuperuser(false); // Сбрасываем при выходе
    setIsAdmin(false); // Сбрасываем при выходе
  };

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        await fetchUser(token);
      }
    };
    checkUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, username, isSuperuser, isAdmin, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 