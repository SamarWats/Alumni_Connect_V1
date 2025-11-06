import axios from 'axios';

// Base API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
};

// Profile API calls
export const profileAPI = {
  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/api/profile/me');
    return response.data;
  },

  // Create or update profile
  updateProfile: async (profileData) => {
    const response = await api.post('/api/profile/', profileData);
    return response.data;
  },

  // Get profile by user ID
  getProfileById: async (userId) => {
    const response = await api.get(`/api/profile/user/${userId}`);
    return response.data;
  },

  // Search profiles
  searchProfiles: async (filters) => {
    const response = await api.get('/api/profile/search', { params: filters });
    return response.data;
  },
};

export default api;
