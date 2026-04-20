import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.data.user);
      toast.success('Welcome back!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout failed:', error);
    }
  };

  const getProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data) => {
    try {
      const response = await api.post('/auth/signUp', data);
      toast.success('Registration successful! Please login.');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
