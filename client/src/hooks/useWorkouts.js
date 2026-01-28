import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Get API URL - always use VITE_API_URL (or localhost fallback)
const getApiUrl = () => {
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
      // Improved error handling with English messages
      let errorMsg = 'Error loading workouts';
      if (err.response) {
        const status = err.response.status;
        if (status === 401 || status === 403) {
          errorMsg = 'Authentication required. Please log in again.';
        } else if (status === 404) {
          errorMsg = 'Workouts not found';
        } else if (status >= 500) {
          errorMsg = err.response.data?.error || 'Server error. Please try again later.';
        } else {
          errorMsg = err.response.data?.error || err.response.data?.message || `Server error (${status})`;
        }
      } else if (err.request) {
        errorMsg = 'Unable to connect to server. Please ensure the server is running and try again.';
      } else {
        errorMsg = err.message || 'Error loading workouts';
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
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error creating workout';
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
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error updating workout';
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
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Error deleting workout';
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

