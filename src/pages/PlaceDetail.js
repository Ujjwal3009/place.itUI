import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styles/PlaceDetail.css';

const PlaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const placeData = location.state?.place;

  // Dummy comments data
  const comments = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "https://placehold.co/40x40"
      },
      text: "Such a beautiful place! The sunset view from here is absolutely stunning. Make sure to visit during evening hours.",
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
    },
    {
      id: 3,
      user: {
        name: "Emma Wilson",
        avatar: "https://placehold.co/40x40"
      },
      text: "The local food stalls nearby are amazing! Don't miss trying the street food.",
      date: "2 weeks ago",
      likes: 15
    }
  ];

  // Fallback data in case of direct URL access
  const fallbackPlace = {
    name: "Place not found",
    location: "Location unavailable",
    address: "Address unavailable",
    image: "https://placehold.co/600x400",
    images: ["https://placehold.co/600x400"],
    tags: []
  };

  // Use passed data or fallback
  const place = placeData || fallbackPlace;

  // Create images array from single image if needed
  const images = place.images || [place.image];

  // If no place data and not fallback, could redirect to 404
  if (!placeData && id !== 'not-found') {
    console.warn('Place data not available, consider implementing proper data fetching');
  }

  return (
    <div className="place-detail-page">
      <div className="place-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      
      <div className="place-detail-content">
        <div className="image-gallery">
          <div className="main-image-container">
            <img src={images[0]} alt={place.name} className="main-image" />
          </div>
          <div className="thumbnail-container">
            {images.map((image, index) => (
              <div key={index} className="thumbnail">
                <img src={image} alt={`${place.name} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="place-info">
          <h1>{place.name}</h1>
          <p className="location">{place.location}</p>
          
          <div className="tags">
            {place.tags?.map((tag, index) => (
              <span key={index} className={`tag ${tag.toLowerCase()}`}>
                {tag}
              </span>
            ))}
          </div>

          <div className="info-section">
            <h3>Before you visit...</h3>
            <div className="address">
              <strong>Address</strong>
              <p>{place.address}</p>
            </div>
          </div>

          <div className="actions">
            <button className="add-to-placelist">+ Add to placelist</button>
            <button className="open-maps">
              Open in Google Maps
            </button>
          </div>

          <div className="comments-section">
            <h3>What others are saying...</h3>
            <div className="comment-box">
              <textarea placeholder="Been here? Share your thoughts!" />
              <button className="post-button">Post</button>
            </div>
          </div>
        </div>
      </div>

      <div className="comments-container">
        <h2>Comments</h2>
        <div className="new-comment">
          <img src="https://placehold.co/40x40" alt="User" className="user-avatar" />
          <div className="comment-input-wrapper">
            <textarea 
              placeholder="Share your experience..."
              className="comment-input"
            />
            <button className="post-comment-btn">Post Comment</button>
          </div>
        </div>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-user">
                  <img src={comment.user.avatar} alt={comment.user.name} className="user-avatar" />
                  <div className="user-info">
                    <h4>{comment.user.name}</h4>
                    <span className="comment-date">{comment.date}</span>
                  </div>
                </div>
                <button className="like-button">
                  ♥ {comment.likes}
                </button>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail; 