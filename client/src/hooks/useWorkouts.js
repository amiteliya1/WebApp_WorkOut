import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useWorkouts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/workouts`);
      setData(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch workouts');
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
      const response = await axios.post(`${API_URL}/api/workouts`, workoutData);
      setData((prev) => [response.data.data, ...prev]);
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create workout';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const updateWorkout = async (id, workoutData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_URL}/api/workouts/${id}`, workoutData);
      setData((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item))
      );
      return { success: true, data: response.data.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update workout';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const deleteWorkout = async (id) => {
    try {
      setError(null);
      await axios.delete(`${API_URL}/api/workouts/${id}`);
      setData((prev) => prev.filter((item) => item._id !== id));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete workout';
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

