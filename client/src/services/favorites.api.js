import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get all favorites for the authenticated user
 * @returns {Promise} Array of favorite videos
 */
export const getFavorites = async () => {
  try {
    console.log('API: Fetching favorites from database');
    const response = await axios.get(`${API_URL}/auth/favorites`, {
      headers: getAuthHeader(),
    });
    console.log(`API: Successfully fetched ${response.data.data.length} favorites`);
    return response.data.data;
  } catch (error) {
    console.error('API: Error fetching favorites:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Add a video to favorites
 * @param {Object} video - Video object to add
 * @returns {Promise} Updated favorites array
 */
export const addFavoriteToDb = async (video) => {
  try {
    console.log('API: Adding favorite to database:', video.id.videoId);
    const response = await axios.post(
      `${API_URL}/auth/favorites`,
      { video },
      {
        headers: getAuthHeader(),
      }
    );
    console.log('API: Successfully added favorite');
    return response.data.data;
  } catch (error) {
    console.error('API: Error adding favorite:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Remove a video from favorites
 * @param {string} videoId - YouTube video ID
 * @returns {Promise} Updated favorites array
 */
export const removeFavoriteFromDb = async (videoId) => {
  try {
    console.log('API: Removing favorite from database:', videoId);
    const response = await axios.delete(`${API_URL}/auth/favorites/${videoId}`, {
      headers: getAuthHeader(),
    });
    console.log('API: Successfully removed favorite');
    return response.data.data;
  } catch (error) {
    console.error('API: Error removing favorite:', error.response?.data || error.message);
    throw error;
  }
};
