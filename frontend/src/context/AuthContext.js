import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        });
        return response.data;
      }
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authAPI.register({ name, email, password });
      if (response.data.success) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setUser({
          _id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        });
        return response.data;
      }
      throw new Error(response.data.message || 'Registration failed');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };

  const updateToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    fetchUser,
    updateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};