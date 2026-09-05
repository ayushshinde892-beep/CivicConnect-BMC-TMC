import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('civic_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('civic_token');
      const savedUser = localStorage.getItem('civic_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        } catch (e) {
          localStorage.removeItem('civic_token');
          localStorage.removeItem('civic_user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.data) {
        const { token, id, name, email: userEmail, phone, role } = res.data;
        const userData = { id, name, email: userEmail, phone, role };
        
        localStorage.setItem('civic_token', token);
        localStorage.setItem('civic_user', JSON.stringify(userData));
        
        setToken(token);
        setUser(userData);
        return { success: true, user: userData };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.data) {
        const { token, id, name, email: userEmail, phone, role } = res.data;
        const newUser = { id, name, email: userEmail, phone, role };
        
        localStorage.setItem('civic_token', token);
        localStorage.setItem('civic_user', JSON.stringify(newUser));
        
        setToken(token);
        setUser(newUser);
        return { success: true, user: newUser };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('civic_token');
    localStorage.removeItem('civic_user');
    setToken(null);
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'ROLE_ADMIN';
  const isOfficer = user?.role === 'ROLE_OFFICER';
  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ROLE_OFFICER';
  const isCitizen = user?.role === 'ROLE_CITIZEN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isAdmin,
        isSuperAdmin,
        isOfficer,
        isCitizen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
