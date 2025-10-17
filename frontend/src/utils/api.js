import { getCurrentUserToken } from './auth';

const API_BASE_URL = 'http://localhost:4000';

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

// Quiz API
export const quizAPI = {
  getAll: (moduleId) => apiRequest(`/quizzes${moduleId ? `?moduleId=${moduleId}` : ''}`),
  getById: (quizId) => apiRequest(`/quizzes/${quizId}`),
  getForTaking: (quizId) => apiRequest(`/quizzes/${quizId}/take`),
  getProblems: (quizId) => apiRequest(`/quizzes/${quizId}/problems`),
  getProblem: (quizId, questionId) => apiRequest(`/quizzes/${quizId}/problems/${questionId}`),
  submitAttempt: (quizId, answers) => apiRequest(`/quizzes/${quizId}/attempt`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  }),
  getAttempts: (quizId) => apiRequest(`/quizzes/${quizId}/attempts`),
  getAllAttempts: () => apiRequest('/quizzes/attempts/all'),
  getHistory: (limit = 10) => apiRequest(`/quizzes/history?limit=${limit}`),
  getResults: (attemptId) => apiRequest(`/quizzes/attempts/${attemptId}/results`)
};

// Analytics API
export const analyticsAPI = {
  getUser: () => apiRequest('/analytics/user'),
  getMetrics: () => apiRequest('/analytics/metrics'),
  getTrends: (period = 'week') => apiRequest(`/analytics/trends?period=${period}`),
  getModule: (moduleId) => apiRequest(`/analytics/module/${moduleId}`),
  getProgress: () => apiRequest('/analytics/user/progress'),
  getModules: () => apiRequest('/analytics/user/modules')
};

// Timetable API
export const timetableAPI = {
  get: () => apiRequest('/timetable'),
  update: (data) => apiRequest('/timetable', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  addScheduleItem: (day, data) => apiRequest(`/timetable/schedule/${day}`, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateScheduleItem: (day, itemId, data) => apiRequest(`/timetable/schedule/${day}/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteScheduleItem: (day, itemId) => apiRequest(`/timetable/schedule/${day}/${itemId}`, {
    method: 'DELETE'
  }),
  getPreferences: () => apiRequest('/timetable/preferences'),
  updatePreferences: (data) => apiRequest('/timetable/preferences', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  getUpcoming: (limit = 10) => apiRequest(`/timetable/upcoming?limit=${limit}`),
  getSchedule: (day) => apiRequest(`/timetable/schedule/${day}`)
};

// Module API
export const moduleAPI = {
  getAll: () => apiRequest('/modules'),
  getById: (moduleId) => apiRequest(`/modules/${moduleId}`),
  getWithQuizzes: (moduleId) => apiRequest(`/modules/${moduleId}/quizzes`),
  getProgress: (moduleId) => apiRequest(`/modules/${moduleId}/progress`)
};

// Dashboard API
export const dashboardAPI = {
  getData: () => apiRequest('/dashboard'),
  getStats: () => apiRequest('/dashboard/stats')
};

export default {
  auth: authAPI,
  user: userAPI,
  quiz: quizAPI,
  analytics: analyticsAPI,
  timetable: timetableAPI,
  module: moduleAPI,
  dashboard: dashboardAPI
};
