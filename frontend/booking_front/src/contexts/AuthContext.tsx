import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '../services/api';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
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

  const login = async (username: string, password: string) => {
    try {
      console.log('Login attempt with:', { username, password });
      console.log('Sending POST request to:', `${API_URL}/auth/login/`);
      
      const response = await authService.login({ username, password });
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setIsAuthenticated(true);
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
          data: error.config?.data
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
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 