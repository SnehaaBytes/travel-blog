import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from './api';
import config from '../config/config';

const AuthContext = createContext();

// EXPLANATION: The stray useState was removed from here because React hooks can 
// only be called inside the AuthProvider function below!

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem(config.auth.storageKey);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem(config.auth.storageKey);
      }
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  // We added loginType here to support Admin vs User tabs
  const login = async (username, password, loginType) => {
    try {
      setLoading(true);

      // Call the fully updated authService we fixed in the previous step
      const result = await authService.login(username, password, loginType);

      if (result.success) {
        // ✅ Store FULL response payload from the API into state & localStorage
        setUser(result.data);
        localStorage.setItem(config.auth.storageKey, JSON.stringify(result.data));
        return { success: true };
      } else {
        // Something went wrong (like invalid password or wrong role)
        return { success: false, message: result.message };
      }

    } catch (error) {
      return {
        success: false,
        message: 'A critical error occurred. Please check your connection.',
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ REGISTER
  const register = async (username, password) => {
    try {
      setLoading(true);

      await authService.register({ username, password });

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Registration failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGOUT
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

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
