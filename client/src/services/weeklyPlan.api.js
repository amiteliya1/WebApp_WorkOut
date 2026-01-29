import axios from 'axios';

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
  return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};

const API_URL = getApiUrl();

// Get weekly plan from database
export const getWeeklyPlan = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/weeklyPlan`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting weekly plan:', error);
    throw error;
  }
};

// Update weekly plan in database
export const updateWeeklyPlan = async (weeklyPlan) => {
  try {
    const response = await axios.put(`${API_URL}/auth/weeklyPlan`, {
      weeklyPlan,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error updating weekly plan:', error);
    throw error;
  }
};
