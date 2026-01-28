import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================
// CRUD Operations for Workouts
// ============================================

/**
 * Get all workouts for the authenticated user
 * @returns {Promise} Array of workouts
 */
export const getAllWorkouts = async () => {
  try {
    console.log('API: Fetching all workouts');
    const response = await axios.get(`${API_URL}/workouts`, {
      headers: getAuthHeader(),
    });
    console.log(`API: Successfully fetched ${response.data.data.length} workouts`);
    return response.data.data;
  } catch (error) {
    console.error('API: Error fetching workouts:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get a single workout by ID
 * @param {string} id - Workout ID
 * @returns {Promise} Workout object
 */
export const getWorkoutById = async (id) => {
  try {
    console.log(`API: Fetching workout with ID: ${id}`);
    const response = await axios.get(`${API_URL}/workouts/${id}`, {
      headers: getAuthHeader(),
    });
    console.log('API: Successfully fetched workout');
    return response.data.data;
  } catch (error) {
    console.error('API: Error fetching workout:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Create a new workout
 * @param {Object} workoutData - Workout data {title, duration, notes}
 * @returns {Promise} Created workout object
 */
export const createWorkout = async (workoutData) => {
  try {
    console.log('API: Creating new workout:', workoutData);
    const response = await axios.post(`${API_URL}/workouts`, workoutData, {
      headers: getAuthHeader(),
    });
    console.log('API: Successfully created workout');
    return response.data.data;
  } catch (error) {
    console.error('API: Error creating workout:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing workout
 * @param {string} id - Workout ID
 * @param {Object} workoutData - Updated workout data
 * @returns {Promise} Updated workout object
 */
export const updateWorkout = async (id, workoutData) => {
  try {
    console.log(`API: Updating workout ${id}:`, workoutData);
    const response = await axios.put(`${API_URL}/workouts/${id}`, workoutData, {
      headers: getAuthHeader(),
    });
    console.log('API: Successfully updated workout');
    return response.data.data;
  } catch (error) {
    console.error('API: Error updating workout:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a workout
 * @param {string} id - Workout ID
 * @returns {Promise} Success response
 */
export const deleteWorkout = async (id) => {
  try {
    console.log(`API: Deleting workout ${id}`);
    const response = await axios.delete(`${API_URL}/workouts/${id}`, {
      headers: getAuthHeader(),
    });
    console.log('API: Successfully deleted workout');
    return response.data;
  } catch (error) {
    console.error('API: Error deleting workout:', error.response?.data || error.message);
    throw error;
  }
};
