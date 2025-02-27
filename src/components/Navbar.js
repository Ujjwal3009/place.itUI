import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAuthenticatedSync, getCurrentUser, logout } from '../utils/auth';
import '../styles/Navbar.css';

const Navbar = () => {
  // Initialize with sync check for immediate UI update
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticatedSync());
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log('Current token:', token);

        const authenticated = await isAuthenticated();
        console.log('Is authenticated:', authenticated);
        
        setIsLoggedIn(authenticated);

        if (authenticated) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []); // Run once on mount

  const handleLogout = async () => {
    try {
      await logout();
      setIsLoggedIn(false);
      setUser(null);
      window.location.href = '/discover';  // Force reload
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/discover" className="logo">
          LFG
        </Link>
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search..." 
          />
        </div>

        <div className="nav-items">
          <Link to="/discover" className="nav-link">Discover</Link>
          
          {isLoggedIn ? (
            <div className="auth-buttons">
              <div className="user-profile">
                <img 
                  src={user?.profilePhoto || "/default-avatar.png"} 
                  alt="Profile" 
                  className="avatar"
                />
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 