import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import './Auth.css';

const Login = () => {
  const [loginType, setLoginType] = useState('user'); // 'user' | 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const result = await login(username, password, loginType);

    setLoading(false);

    if (result.success) {
      // 🔥 FIX: Now EVERYONE is redirected to the Home Page! 
      // Admins will just see the special "Admin Panel" button in the Navbar.
      navigate('/'); 
    } else {
      setErrorMsg(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      {/* Background with subtle travel overlay */}
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-form-container animate-in">
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to your {loginType === 'admin' ? 'Administrator' : 'Travel Blog'} account</p>
          </div>

          {/* Login Type Toggle */}
          <div className="login-type-toggle">
            <button
              type="button"
              className={loginType === 'user' ? 'active' : ''}
              onClick={() => setLoginType('user')}
            >
              Traveler
            </button>
            <button
              type="button"
              className={loginType === 'admin' ? 'active' : ''}
              onClick={() => setLoginType('admin')}
            >
              Administrator
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="input-group">
              <label htmlFor="username">
                {loginType === 'admin' ? 'Administrator Username' : 'Username'}
              </label>
              <div className="input-wrapper">
                {/* User Icon */}
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group password-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                {/* Lock Icon */}
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.21-3.1 3.56-5.54 6.44-6.7" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="error-msg-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="error-msg">{errorMsg}</p>
              </div>
            )}

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span>Logging in...</span>
              ) : (
                loginType === 'admin' ? 'Login as Administrator' : 'Login'
              )}
            </button>
          </form>

          {/* Only show User registration prompt if Traveler login is selected */}
          {loginType === 'user' && (
            <div className="auth-footer">
              <p className="redirect-text">
                Don’t have an account? <Link to="/register">Register here</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
