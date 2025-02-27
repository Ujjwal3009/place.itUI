import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/PlaceDetail.css';
import { isAuthenticated, getCurrentUser } from '../utils/auth';
import { API_CONFIG } from '../config/api';

const PEXELS_API_KEY = 'bj5Sr52WZYM80EO4WyNnnm5CFOzzDm46RHj0vOn31UbNyQvpGswUwZ3d';

const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Image+Unavailable';

const SuccessAnimation = ({ onComplete }) => {
  console.log('SuccessAnimation rendered');

  useEffect(() => {
    console.log('SuccessAnimation effect triggered');
    
    // Create particles
    const createParticles = () => {
      const particlesContainer = document.querySelector('.particles');
      if (!particlesContainer) return;
      
      for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position around the checkmark
        const x = Math.random() * 300 - 150;
        const y = Math.random() * 300 - 150;
        
        // Random size
        const size = Math.random() * 6 + 4;
        
        // Random direction
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        
        // Random delay
        const delay = Math.random() * 0.5;
        
        // Random duration
        const duration = Math.random() * 1 + 1;
        
        // Set styles
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `calc(50% + ${x}px)`;
        particle.style.top = `calc(50% + ${y}px)`;
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.animation = `particleAnimation ${duration}s ease-out forwards ${delay + 0.8}s`;
        
        particlesContainer.appendChild(particle);
      }
    };
    
    // Call the function after a short delay to ensure DOM is ready
    setTimeout(createParticles, 100);
    
    // Set timeout for animation completion
    const timer = setTimeout(() => {
      console.log('Animation timeout completed');
      onComplete();
    }, 3000); // Longer duration for the full cinematic effect

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="success-overlay">
      <div className="lens-flare"></div>
      <div className="particles"></div>
      <div className="success-animation">
        <div className="checkmark-circle">
          <div className="checkmark"></div>
        </div>
        <h2>Added to Placelist!</h2>
      </div>
    </div>
  );
};

// Add this new component for the "already saved" notification
const AlreadySavedAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="already-saved-overlay">
      <div className="already-saved-animation">
        <div className="info-circle">
          <div className="info-icon">i</div>
        </div>
        <h2>Hey mate!</h2>
        <p>You've already saved this place to your placelist.</p>
      </div>
    </div>
  );
};

const formatLocation = (location) => {
  if (!location) return 'Location not specified';
  if (typeof location === 'object') {
    const { city, country, address } = location;
    return [
      address,
      city,
      country
    ].filter(Boolean).join(', ');
  }
  return location;
};

const PlaceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const placeData = location.state?.place;
  const [photos, setPhotos] = useState([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlreadySaved, setShowAlreadySaved] = useState(false);
  console.log('showSuccess state:', showSuccess); // Debug log

  useEffect(() => {
    if (!placeData) {
      setError('Place data not found');
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [placeData]);

  useEffect(() => {
    const fetchPexelsPhotos = async () => {
      try {
        setLoading(true);
        // Initialize with empty arrays to prevent undefined errors
        setPhotos([]);
        setSuggestedPlaces([]);
        
        const searchQuery = placeData?.name || 'landscape';
        
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=15`,
          {
            headers: {
              Authorization: PEXELS_API_KEY
            }
          }
        );

        const data = await response.json();
        
        // Filter valid photos immediately
        const validPhotos = (data.photos || []).filter(photo => 
          photo && photo.src && photo.src.large && typeof photo.src.large === 'string'
        );
        
        setPhotos(validPhotos);

        // Fetch suggested places
        const suggestedResponse = await fetch(
          `https://api.pexels.com/v1/search?query=travel destination&per_page=6`,
          {
            headers: {
              Authorization: PEXELS_API_KEY
            }
          }
        );

        const suggestedData = await suggestedResponse.json();
        
        // Filter valid suggested places immediately
        const validSuggested = (suggestedData.photos || []).filter(place => 
          place && place.src && place.src.large && typeof place.src.large === 'string'
        );
        
        setSuggestedPlaces(validSuggested);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setPhotos([]);
        setSuggestedPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPexelsPhotos();
  }, [placeData]);

  // Update the useEffect for checking if a place is already saved
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        // Get token directly from localStorage
        const token = localStorage.getItem('token');
        
        if (!token || !placeData?.id) {
          return;
        }
        
        console.log('Checking if place is already saved:', placeData.id);
        
        // Make API request to check if place is saved
        const response = await fetch(
          `http://localhost:9000/api/placelists/check/${placeData.id}`, 
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Place saved status:', data);
          
          // If the place is already saved, update the UI
          if (data.isSaved) {
            setIsSaved(true);
          }
        } else {
          console.log('Error checking saved status:', response.status);
        }
      } catch (error) {
        console.error('Error checking if place is saved:', error);
      }
    };

    // Only run if we have place data
    if (placeData) {
      checkIfSaved();
    }
  }, [placeData]);

  const handleSuggestedPlaceClick = (place) => {
    // Only navigate if place has valid data
    if (place && place.src && place.src.large) {
      navigate(`/place/${place.id}`, {
        state: {
          place: {
            id: place.id,
            name: place.photographer,
            location: place.location || 'Location not specified',
            thumbnail: place.src.large,
            categories: ['Photography', 'Travel'],
            author: {
              username: place.photographer,
              profilePhoto: place.photographer_url || ''
            }
          }
        }
      });
    }
  };

  const handleAddToPlacelist = async () => {
    console.log('Starting handleAddToPlacelist function');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login', { 
        state: { 
          from: location.pathname,
          message: 'Please login to save places to your placelist' 
        } 
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Get the first valid photo from Pexels
      const mainImage = photos[0]?.src || {};
      
      // Prepare the data in the format backend expects
      const placeToSave = {
        placeId: placeData._id,
        name: placeData.title || placeData.name,
        location: typeof placeData.location === 'object' 
          ? `${placeData.location.city}, ${placeData.location.country}`
          : placeData.location || 'Location not specified',
        description: placeData.description || 'A beautiful destination worth visiting',
        rating: 5,
        image1: {
          original: mainImage.original || mainImage.large || placeData.images?.[0]?.large,
          large: mainImage.large || placeData.images?.[0]?.large,
          thumbnail: mainImage.small || placeData.images?.[0]?.thumbnail,
          caption: placeData.title || 'Beautiful view'
        },
        categories: placeData.categories || ['Travel', 'Photography']
      };
      
      console.log('Saving place data:', placeToSave);

      const response = await fetch('http://localhost:9000/api/placelists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(placeToSave)
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 400 && data.message?.includes('already saved')) {
          setIsSaved(true);
          setShowAlreadySaved(true);
          return;
        }
        throw new Error(data.message || 'Failed to save place');
      }

      setIsSaved(true);
      setShowSuccess(true);
      
    } catch (error) {
      console.error('Error saving place:', error);
      if (error.message?.includes('already saved')) {
        setIsSaved(true);
        setShowAlreadySaved(true);
      } else {
        alert(error.message || 'Failed to add place to placelist');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Add a separate function to handle animation completion
  const handleAnimationComplete = () => {
    console.log('Animation complete callback triggered'); // Debug log
    setShowSuccess(false);
  };

  // Add a handler for the "already saved" animation completion
  const handleAlreadySavedComplete = () => {
    setShowAlreadySaved(false);
  };

  // Dummy comments for now
  const dummyComments = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "https://placehold.co/40x40"
      },
      text: "Such a beautiful place! The sunset view from here is absolutely stunning.",
      date: "2 days ago",
      likes: 12
    },
    {
      id: 2,
      user: {
        name: "Mike Johnson",
        avatar: "https://placehold.co/40x40"
      },
      text: "Great spot for photography. I'd recommend coming early in the morning to avoid crowds.",
      date: "1 week ago",
      likes: 8
    }
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="place-detail-page">
      {showSuccess && (
        <SuccessAnimation onComplete={handleAnimationComplete} />
      )}
      {showAlreadySaved && (
        <AlreadySavedAnimation onComplete={handleAlreadySavedComplete} />
      )}
      <div className="place-detail-layout">
        {/* Left side - Images */}
        <div className="images-container">
          {Array.isArray(photos) && photos.length > 0 ? (
            photos.map((photo, index) => {
              // Only render if src.large exists and is not empty
              if (!photo?.src?.large) return null;
              
              return (
                <div key={photo.id || `photo-${index}`} className="image-wrapper">
                  <img 
                    src={photo.src.large || null} // Use null instead of empty string
                    alt={photo.alt || `View ${index + 1}`}
                    className="place-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                </div>
              );
            })
          ) : (
            <div className="no-images-message">No images available</div>
          )}
        </div>

        {/* Right side - Place Info */}
        <div className="place-info-sidebar">
          <h1 className="place-title">{placeData?.name}</h1>
          <p className="place-location">{formatLocation(placeData?.location)}</p>

          <div className="interaction-stats">
            <button className="stat-btn">
              <span>0</span> ♡
            </button>
            <button className="stat-btn">
              <span>0</span> ○
            </button>
            <span className="views">👁 46</span>
            <span className="shares">↗ 0</span>
          </div>

          <div className="action-buttons">
            <button 
              className={`add-to-placelist-btn ${isSaved ? 'saved' : ''}`}
              onClick={(e) => {
                e.preventDefault(); // Prevent any form submission
                handleAddToPlacelist();
              }}
              disabled={isSaving || isSaved}
            >
              {isSaving ? 'Saving...' : isSaved ? '✓ Already Saved' : '+ Add to placelist'}
            </button>
            <button className="open-maps-btn">Open in Google Maps</button>
          </div>

          <div className="info-box">
            <h3>Before you visit...</h3>
            <div className="address-info">
              <strong>Address</strong>
              <p>
                {placeData?.location?.address || 
                 formatLocation(placeData?.location) || 
                 'Address not available'}
              </p>
            </div>
          </div>

          <div className="comments-section">
            <h3>What others are saying...</h3>
            <div className="comment-box">
              <textarea placeholder="Been here? Share your thoughts!" />
              <button className="post-btn">Post</button>
            </div>
          </div>
        </div>
      </div>

      <div className="suggested-places">
        <h2>LFG other places you may like~</h2>
        <div className="suggested-grid">
          {Array.isArray(suggestedPlaces) && suggestedPlaces.length > 0 ? (
            suggestedPlaces.map((place, index) => {
              const locationString = formatLocation(place.location);
              return (
                <div 
                  key={place.id || `suggestion-${index}`} 
                  className="suggested-place"
                  onClick={() => handleSuggestedPlaceClick(place)}
                >
                  <img 
                    src={place.images?.[0]?.large || null}
                    alt={place.alt || 'Suggested place'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_PLACEHOLDER;
                    }}
                  />
                  <div className="place-overlay">
                    <h3>{place.title || place.name || 'Unknown'}</h3>
                    <p>{locationString}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-suggestions">No suggested places available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail; 