import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from './api';
import config from '../config/config';

/**
 * Authentication Context
 * Provides user authentication state and methods throughout the application
 */
const AuthContext = createContext();

/**
 * Authentication Provider Component
 * Manages authentication state and provides login/logout functionality
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem(config.auth.storageKey);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(config.auth.storageKey);
      }
    }
    setLoading(false);
  }, []);

  /**
   * Log in a user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Object} Result object with success status and optional error message
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await authService.login({ username, password });

      const userData = { username: response.username };
      setUser(userData);
      localStorage.setItem(config.auth.storageKey, JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register a new user
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {Object} Result object with success status and optional error message
   */
  const register = async (username, password) => {
    try {
      setLoading(true);
      await authService.register({ username, password });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Log out the current user
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(config.auth.storageKey);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
