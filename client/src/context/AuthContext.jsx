import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Get API URL - ensure it ends with /api
const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  // Ensure baseUrl ends with /api
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
        try {
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data.data);
        } catch (error) {
          // Token is invalid, clear it
          setToken(null);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Improved error handling
      let errorMessage = 'התחברות נכשלה';
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data?.error || error.response.data?.message;
        errorMessage = serverError || `שגיאת שרת (${status})`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'לא ניתן להתחבר לשרת. ודא שהשרת פועל.';
      } else {
        // Error in request setup
        errorMessage = error.message || 'שגיאה בהתחברות';
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data.data;
      setToken(newToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      // Improved error handling
      let errorMessage = 'הרשמה נכשלה';
      if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const serverError = error.response.data?.error || error.response.data?.message;
        errorMessage = serverError || `שגיאת שרת (${status})`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'לא ניתן להתחבר לשרת. ודא שהשרת פועל.';
      } else {
        // Error in request setup
        errorMessage = error.message || 'שגיאה בהרשמה';
      }
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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

