import axios from 'axios';

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

// Get theme from database
export const getTheme = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/theme`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting theme:', error);
    throw error;
  }
};

// Update theme in database
export const updateTheme = async (theme) => {
  try {
    const response = await axios.put(`${API_URL}/auth/theme`, {
      theme,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error;
  }
};
