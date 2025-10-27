import { getCurrentUserToken } from './auth';
import { API_BASE } from '../config';

const API_BASE_URL = API_BASE || 'http://localhost:4000';

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await getCurrentUserToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = await getAuthHeaders();
  
  const config = {
    headers,
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (email, password) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  verify: (idToken) => apiRequest('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ idToken })
  })
};

// User API
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  updateProfile: (data) => apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getSettings: () => apiRequest('/users/settings'),
  updateSettings: (data) => apiRequest('/users/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getAccount: () => apiRequest('/users/account'),
  updateAccount: (data) => apiRequest('/users/account', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getProgress: () => apiRequest('/users/progress'),
  updateProgress: (data) => apiRequest('/users/progress', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};






 





export default {
  auth: authAPI,
  user: userAPI,
};
