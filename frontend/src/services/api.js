import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);

// ================= AUTH =================
export const authService = {
  // Update credentials to accept loginType
  login: async (username, password, loginType) => {
    try {
      const response = await api.post('/api/login', {
        username,
        password,
        loginType // 👉 Send 'user' or 'admin' to the backend
      });
      return { success: true, data: response.data };
    } catch (error) {
       return { 
         success: false, 
         message: error.response?.data?.message || 'Login failed' 
       };
    }
  }, // ✅ Changed from }; to },

  register: async (userData) => {
    const response = await api.post('/api/register', {
      username: userData.username,
      password: userData.password
    });
    return response.data;
  }
}; // ✅ authService properly closes here

// ================= DESTINATIONS =================
export const destinationService = {
  getDestinations: async () => {
    const response = await api.get('/api/destinations'); 
    return response.data;
  }
};

// ================= CHAT =================
export const chatService = {
  getMessages: async () => {
    const response = await api.get('/api/messages');
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/api/messages', messageData);
    return response.data;
  }
};

export default api;
