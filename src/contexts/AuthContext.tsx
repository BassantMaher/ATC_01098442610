import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthState, User } from '../types';
import { API_URL } from '../config';

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<User & { exp: number }>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: true,
            user: {
              _id: decoded._id,
              name: decoded.name,
              email: decoded.email,
              role: decoded.role,
              createdAt: decoded.createdAt,
            },
            loading: false,
          });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setAuthState({
        isAuthenticated: true,
        user,
        loading: false,
      });
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};