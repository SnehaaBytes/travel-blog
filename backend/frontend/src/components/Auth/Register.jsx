import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import './Auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (username.length < 3 || password.length < 5) {
      setErrorMsg('Username must be 3+ chars & password must be 5+ chars.');
      return;
    }
    
    setErrorMsg('');
    
    const result = await register(username, password);
    
    if (result.success) {
      alert('Registration successful! Please login.');
      navigate('/login');
    } else {
      setErrorMsg(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-form-container">
          <h2>Register for Travel Blog</h2>
          
          <form id="registerForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="regUsername">Username</label>
              <input 
                type="text" 
                id="regUsername" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="regPassword">Password</label>
              <input 
                type="password" 
                id="regPassword" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button type="submit">Register</button>
            
            {errorMsg && <p className="error-msg">{errorMsg}</p>}
          </form>
          
          <p className="redirect-text">
            Already have an account?
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
