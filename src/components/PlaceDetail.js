import { useState } from 'react';
import '../styles/PlaceDetail.css';

const PlaceDetail = ({ place, onClose }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <div className="place-detail-overlay">
      <div className="place-detail-container">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="place-detail-content">
          <div className="image-gallery">
            <div className="main-image-container">
              {place.images && place.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${place.name} ${index + 1}`}
                  className={`gallery-image ${index === selectedImageIndex ? 'active' : ''}`}
                />
              ))}
            </div>
            <div className="thumbnail-container">
              {place.images && place.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="place-info">
            <h1>{place.name}</h1>
            <p className="location">{place.location}</p>
            
            <div className="tags">
              {place.tags && place.tags.map((tag, index) => (
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
              <button className="open-maps" onClick={() => window.open(place.mapsUrl, '_blank')}>
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
      </div>
    </div>
  );
};

export default PlaceDetail; 