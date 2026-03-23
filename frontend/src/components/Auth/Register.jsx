import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import './Auth.css'; // Relies on our newly updated CSS!

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added toggle state
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state for polish
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (username.length < 3 || password.length < 5) {
      setErrorMsg('Username must be 3+ chars & password must be 5+ chars.');
      return;
    }
    
    setErrorMsg('');
    setLoading(true); // Start loading
    
    const result = await register(username, password);
    
    setLoading(false); // Stop loading
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      {/* Anchored Fullscreen Background */}
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-form-container animate-in">
          <div className="auth-header">
            <h2>Create an Account</h2>
            <p>Join our Travel Blog community</p>
          </div>
          
          <form id="registerForm" onSubmit={handleSubmit} noValidate>
            
            {/* Username Input */}
            <div className="input-group">
              <label htmlFor="regUsername">Username</label>
              <div className="input-wrapper">
                {/* User Icon */}
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input 
                  type="text" 
                  id="regUsername" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required 
                />
              </div>
            </div>
            
            {/* Password Input */}
            <div className="input-group password-group">
              <label htmlFor="regPassword">Password</label>
              <div className="input-wrapper">
                {/* Lock Icon */}
                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="regPassword" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  required 
                />
                
                {/* Eye Toggle Button */}
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
            
            {/* Error Message UI */}
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
            
            {/* Submit Button */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
            
          </form>
          
          {/* Footer */}
          <div className="auth-footer">
            <p className="redirect-text">
              Already have an account?
              <Link to="/login">Login here</Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
