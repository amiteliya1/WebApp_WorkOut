import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Get API URL - use relative path for same-origin deployment
const getApiUrl = () => {
  // In production (served from same server), use relative path
  // In development, use environment variable or localhost
  if (import.meta.env.PROD) {
    return '/api';
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

export const useWorkouts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const API_URL = getApiUrl();
      const response = await axios.get(`${API_URL}/workouts`);
      setData(response.data.data || response.data);
    } catch (err) {
      // Improved error handling with Hebrew messages
      let errorMsg = 'שגיאה בטעינת האימונים';
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          errorMsg = 'נדרשת התחברות. אנא התחבר מחדש.';
        } else if (status === 404) {
          errorMsg = 'האימונים לא נמצאו';
        } else if (status >= 500) {
          errorMsg = err.response.data?.error || 'שגיאת שרת. נסה שוב מאוחר יותר.';
        } else {
          errorMsg = err.response.data?.error || err.response.data?.message || `שגיאת שרת (${status})`;
        }
      } else if (err.request) {
        errorMsg = 'לא ניתן להתחבר לשרת. ודא שהשרת פועל ונסה שוב.';
      } else {
        errorMsg = err.message || 'שגיאה בטעינת האימונים';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const createWorkout = async (workoutData) => {
    try {
      setError(null);
      const API_URL = getApiUrl();
      const response = await axios.post(`${API_URL}/workouts`, workoutData);
      setData((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'שגיאה ביצירת אימון';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      setError(null);
      const API_URL = getApiUrl();
      const response = await axios.put(`${API_URL}/workouts/${id}`, workoutData);
      setData((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'שגיאה בעדכון אימון';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteWorkout = async (id) => {
    try {
      setError(null);
      const API_URL = getApiUrl();
      await axios.delete(`${API_URL}/workouts/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'שגיאה במחיקת אימון';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchWorkouts,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
};

