const config = {
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL.replace('/api', ''),
    timeout: 10000, // 10 seconds
  },

  // Authentication configuration
  auth: {
    storageKey: import.meta.env.VITE_AUTH_STORAGE_KEY || 'travelUser',
    tokenExpiryDays: 7,
  },

  // Feature flags
  features: {
    enableChat: import.meta.env.VITE_ENABLE_CHAT !== 'false',
    enableBooking: import.meta.env.VITE_ENABLE_BOOKING === 'true', // Future feature
  },

  // Default image paths
  defaultImages: {
    destination: '/images/default-destination.jpg',
    user: '/images/default-user.jpg',
  }
};

export default config;
