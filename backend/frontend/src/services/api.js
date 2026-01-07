import axios from 'axios';
import config from '../config/config';

/**
 * Create axios instance with configuration
 */
const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for API calls
 */
api.interceptors.request.use(
  (config) => {
    // You could add auth tokens here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for API calls
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);

// API services
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/api/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/api/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  }
};

export const destinationService = {
  getDestinations: async () => {
    try {
      const response = await api.get('/destination');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch destinations' };
    }
  }
};

export const chatService = {
  getMessages: async () => {
    try {
      const response = await api.get('/api/messages');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/api/messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  }
};

export default api;
