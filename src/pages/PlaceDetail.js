import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/PlaceDetail.css';

const PEXELS_API_KEY = 'bj5Sr52WZYM80EO4WyNnnm5CFOzzDm46RHj0vOn31UbNyQvpGswUwZ3d';

const PlaceDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const placeData = location.state?.place;
  const [photos, setPhotos] = useState([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPexelsPhotos = async () => {
      try {
        const searchQuery = placeData?.name || 'landscape';
        
        // Fetch main place photos
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=10`,
          {
            headers: {
              Authorization: PEXELS_API_KEY
            }
          }
        );

        const data = await response.json();
        setPhotos(data.photos);

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
        setSuggestedPlaces(suggestedData.photos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching photos:', error);
        setLoading(false);
      }
    };

    fetchPexelsPhotos();
  }, [placeData]);

  const handleSuggestedPlaceClick = (place) => {
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
            profilePhoto: ''
          }
        }
      }
    });
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

  return (
    <div className="place-detail-page">
      <div className="place-detail-layout">
        {/* Left side - Images */}
        <div className="images-container">
          {photos.map((photo, index) => (
            <div key={photo.id} className="image-wrapper">
              <img 
                src={photo.src.large} 
                alt={photo.alt} 
                className="place-image"
              />
            </div>
          ))}
        </div>

        {/* Right side - Place Info */}
        <div className="place-info-sidebar">
          <h1 className="place-title">{placeData?.name}</h1>
          <p className="place-location">{placeData?.location || 'Location not specified'}</p>

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
            <button className="add-to-placelist-btn">+ Add to placelist</button>
            <button className="open-maps-btn">Open in Google Maps</button>
          </div>

          <div className="info-box">
            <h3>Before you visit...</h3>
            <div className="address-info">
              <strong>Address</strong>
              <p>{placeData?.address || `${placeData?.name}, ${placeData?.location}`}</p>
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
          {suggestedPlaces.map((place) => (
            <div 
              key={place.id} 
              className="suggested-place"
              onClick={() => handleSuggestedPlaceClick(place)}
            >
              <img src={place.src.large} alt={place.alt} />
              <div className="place-overlay">
                <h3>{place.photographer}</h3>
                <p>{place.location || 'Beautiful destination'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail; 