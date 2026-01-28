import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Get API URL - always use VITE_API_URL (or localhost fallback)
const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set up axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        console.log('Loading user from token...');
        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data.data);
          console.log('User loaded successfully:', response.data.data.email);
        } catch (error) {
          // Token is invalid, clear it
          console.error('Failed to load user - token invalid:', error.response?.status || error.message);
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      } else {
        console.log('No token found, user not authenticated');
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    console.log(`Login attempt for email: ${email}`);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data.data;
      setToken(newToken);
      setUser(userData);

      console.log(`Login successful for user: ${userData.email}`);

      return { success: true };
    } catch (error) {
      // Improved error handling
      let errorMessage = 'Login failed';
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data?.error || error.response.data?.message;
        errorMessage = serverError || `Server error (${status})`;
        console.error(`Login failed - Server error (${status}):`, serverError);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please ensure the server is running.';
        console.error('Login failed - Unable to connect to server');
      } else {
        // Error in request setup
        errorMessage = error.message || 'Login error';
        console.error('Login failed - Request setup error:', error.message);
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password) => {
    console.log(`Registration attempt for email: ${email}`);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data.data;
      setToken(newToken);
      setUser(userData);

      console.log(`Registration successful for user: ${userData.email}`);

      return { success: true };
    } catch (error) {
      // Improved error handling
      let errorMessage = 'Registration failed';
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data?.error || error.response.data?.message;
        errorMessage = serverError || `Server error (${status})`;
        console.error(`Registration failed - Server error (${status}):`, serverError);
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please ensure the server is running.';
        console.error('Registration failed - Unable to connect to server');
      } else {
        // Error in request setup
        errorMessage = error.message || 'Registration error';
        console.error('Registration failed - Request setup error:', error.message);
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    console.log('User logging out');

    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];

    console.log('Logout successful');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

