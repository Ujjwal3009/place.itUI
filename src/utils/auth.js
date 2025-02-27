import { API_CONFIG } from '../config/api';
import { logger } from './logger';

// Verify JWT-like token
export const verifyToken = async (token) => {
  try {
    // First check token structure and expiration locally
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      return false;
    }

    const decoded = JSON.parse(atob(payload));
    if (decoded.exp < Date.now()) {
      logger.warn('Auth', 'verifyToken', 'Token expired');
      return false;
    }

    // Verify token with backend
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.ok;

  } catch (err) {
    logger.error('Auth', 'verifyToken', err);
    return false;
  }
};

// Get user from token
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Get fresh user data from API
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return await response.json();

  } catch (err) {
    logger.error('Auth', 'getCurrentUser', err);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Checking token:', token ? 'exists' : 'not found');
    
    if (!token) {
      return false;
    }

    // Check token structure and expiration
    try {
      const [, payload] = token.split('.');
      const decoded = JSON.parse(atob(payload));
      
      const currentTime = Date.now() / 1000;
      console.log('Token expiration:', {
        exp: decoded.exp,
        current: currentTime,
        isExpired: decoded.exp < currentTime
      });
      
      if (decoded.exp < currentTime) {
        console.log('Token expired');
        localStorage.removeItem('token');
        return false;
      }
    } catch (err) {
      console.error('Token parse error:', err);
      localStorage.removeItem('token');
      return false;
    }

    // Verify with backend
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Backend verification:', {
        status: response.status,
        ok: response.ok
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Backend verification error:', err);
      return false;
    }

  } catch (err) {
    console.error('isAuthenticated error:', err);
    return false;
  }
};

// Helper function to get token
export const getToken = () => localStorage.getItem('token');

// Add this function to check auth state without API call
export const isAuthenticatedSync = () => {
  try {
    const token = localStorage.getItem('token');
    console.log('Sync auth check - token:', token ? 'exists' : 'not found');
    
    if (!token) return false;

    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const currentTime = Date.now() / 1000;
    
    console.log('Sync auth check:', {
      exp: decoded.exp,
      current: currentTime,
      isValid: decoded.exp > currentTime
    });
    
    return decoded.exp > currentTime;
  } catch (err) {
    console.error('Sync auth check error:', err);
    return false;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      // Call logout endpoint if available
      try {
        await fetch(`${API_CONFIG.BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        logger.warn('Auth', 'logout', 'API logout failed, continuing with local logout');
      }
    }

    // Clear all auth-related data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear session storage if you're using it
    sessionStorage.clear();

    // Clear any auth-related cookies
    document.cookie.split(";").forEach(cookie => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });

    logger.info('Auth', 'logout', 'User successfully logged out');
    return true;
  } catch (err) {
    logger.error('Auth', 'logout', err);
    throw err;
  }
}; 