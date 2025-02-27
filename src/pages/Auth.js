import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logger } from '../utils/logger';
import { API_CONFIG } from '../config/api';
import { isAuthenticatedSync } from '../utils/auth';
import '../styles/Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticatedSync()) {
      logger.info('Auth', 'checkAuth', 'User already logged in, redirecting to discover');
      navigate('/discover');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (email, password) => {
    logger.startGroup('Login Process');
    logger.info('Auth', 'handleLogin', 'Attempting login', { email });

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and force a page reload to update auth state
      localStorage.setItem('token', data.token);
      window.location.href = '/discover';  // This will force a full page reload
      return { success: true, data };

    } catch (err) {
      console.error('Login error:', err);
      logger.error('Auth', 'handleLogin', err, { email });
      throw err;
    }
  };

  const handleSignup = async (email, password) => {
    logger.startGroup('Signup Process');
    logger.info('Auth', 'handleSignup', 'Attempting signup', { email });

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      logger.info('Auth', 'handleSignup', 'Registration successful');
      localStorage.setItem('token', data.token);
      return { success: true, data };

    } catch (err) {
      logger.error('Auth', 'handleSignup', err, { email });
      throw err;
    } finally {
      logger.endGroup();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'signup') {
        logger.info('Auth', 'handleSubmit', 'Starting signup process', { email: formData.email });

        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        await handleSignup(formData.email, formData.password);
        logger.info('Auth', 'handleSubmit', 'Redirecting to onboarding');
        navigate('/onboarding');

      } else {
        logger.info('Auth', 'handleSubmit', 'Starting login process', { email: formData.email });
        const { data } = await handleLogin(formData.email, formData.password);
        
        logger.info('Auth', 'handleSubmit', 'Redirecting to discover page');
        navigate('/discover');
      }
    } catch (err) {
      logger.error('Auth', 'handleSubmit', err, { email: formData.email });
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      logger.info('Auth', 'handleSubmit', 'Form submission completed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <svg className="brand-svg" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: '#FF385C', stopOpacity: 0.15}} />
              <stop offset="100%" style={{stopColor: '#FF385C', stopOpacity: 0.05}} />
            </linearGradient>
            
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Pattern definition */}
            <pattern id="logoPattern" x="0" y="0" width="400" height="400" patternUnits="userSpaceOnUse">
              <text 
                x="200" 
                y="200" 
                className="brand-text"
                textAnchor="middle"
                filter="url(#glow)"
              >
                place.it
              </text>
            </pattern>
          </defs>

          {/* Background with repeating pattern */}
          <rect x="0" y="0" width="100%" height="100%" fill="url(#logoPattern)" className="pattern-rect"/>
          
          {/* Large centered logo with reflection */}
          <g className="center-logo">
            <text 
              x="1000" 
              y="1000" 
              className="brand-text-large"
              textAnchor="middle"
              filter="url(#glow)"
            >
              place.it
            </text>
            {/* Reflection */}
            <text 
              x="1000" 
              y="1000" 
              className="brand-text-reflection"
              textAnchor="middle"
            >
              place.it
            </text>
          </g>
        </svg>
      </div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button 
            className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input 
              type="email" 
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {activeTab === 'signup' && (
            <div className="form-group">
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className={`submit-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              activeTab === 'login' ? 'Login' : 'Create Account'
            )}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <button type="button" className="google-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth; 