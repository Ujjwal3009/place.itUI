import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, isAuthenticatedSync, getCurrentUser, logout } from '../utils/auth';
import '../styles/Navbar.css';
import Logo from './Logo';

// Pexels API key
const PEXELS_API_KEY = 'bj5Sr52WZYM80EO4WyNnnm5CFOzzDm46RHj0vOn31UbNyQvpGswUwZ3d';

const Navbar = () => {
  // Initialize with sync check for immediate UI update
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticatedSync());
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const navigate = useNavigate();

  // Fetch random profile image from Pexels
  const fetchRandomProfileImage = async () => {
    try {
      const response = await fetch(
        'https://api.pexels.com/v1/search?query=portrait&per_page=1&page=' + Math.floor(Math.random() * 100),
        {
          headers: {
            Authorization: PEXELS_API_KEY
          }
        }
      );
      
      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        setProfileImage(data.photos[0].src.medium);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Use the simplified isAuthenticated function
        const authenticated = isAuthenticated();
        setIsLoggedIn(authenticated);
        
        if (authenticated) {
          const userData = getCurrentUser();
          setUser(userData);
          
          // If user has no profile image, fetch a random one
          if (!userData?.profilePhoto) {
            fetchRandomProfileImage();
          } else {
            setProfileImage(userData.profilePhoto);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsLoggedIn(false);
      }
    };

    // Check immediately
    checkAuth();
    
    // Set up an interval to check periodically
    const interval = setInterval(checkAuth, 5000);
    
    // Also check when localStorage changes
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUser(null);
    setShowDropdown(false);
    navigate('/discover');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Logo />
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search..." 
          />
        </div>
        
        <div className="nav-items">
          <Link to="/discover" className="nav-link">Discover</Link>
          {isLoggedIn && (
            <>
              <Link to="/my-places" className="nav-link">My Places</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" className="login-button">Sign in</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 