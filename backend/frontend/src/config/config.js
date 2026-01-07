/**
 * Application configuration
 *
 * This file centralizes all configuration variables for the application.
 * In a production environment, these would typically come from environment variables.
 */

const config = {
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
