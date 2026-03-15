import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '@/services/api';

export interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, userData?: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (newToken: string, userData?: any) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    if (userData) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    if (user) {
      api.audit.pushLog('LOGOUT', user.name, 'User terminated session');
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
