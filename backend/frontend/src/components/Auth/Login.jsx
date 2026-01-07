import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password');
      return;
    }
    
    setErrorMsg('');
    
    const result = await login(username, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setErrorMsg(result.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-form-container">
          <h2>Login to Travel Blog</h2>
          
          <form id="loginForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="showPassword" 
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>
            
            <button type="submit">Login</button>
            
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
          
          <p className="redirect-text">
            Don't have an account?
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
