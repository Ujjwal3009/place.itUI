import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Placelist.css';

const Placelist = ({ title, description, places, author, saves }) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality with backend
  };

  const handlePlaceClick = (place) => {
    navigate(`/place/${place.id}`, { 
      state: { place } 
    });
  };

  return (
    <div className="placelist">
      <div className="placelist-header">
        <h2>{title}</h2>
        <button 
          className={`save-button ${isSaved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {isSaved ? '★ Saved' : '☆ Save'}
        </button>
      </div>
      <p className="placelist-description">{description}</p>
      <div className="placelist-author">
        <span>Created by {author}</span>
        <span>•</span>
        <span>{saves} saves</span>
      </div>
      <div className="masonry-grid">
        {places.map((place) => (
          <div key={place.id} className="masonry-item">
            <div 
              className="place-card"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="image-container">
                <img src={place.image} alt={place.name} />
                <div className="overlay">
                  <h3>{place.name}</h3>
                  <p>{place.location}</p>
                  <div className="tags">
                    {place.tags?.map((tag, index) => (
                      <span key={index} className={`tag ${tag.toLowerCase()}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Placelist; 