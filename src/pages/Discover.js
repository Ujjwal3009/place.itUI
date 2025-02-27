import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Discover.css';

const Discover = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Create observer ref for infinite scroll
  const observer = useRef();
  const lastPlaceElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Reached bottom, loading more places...');
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch places for each page
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        console.log(`Fetching places for page ${page}...`);
        
        const response = await fetch(`http://localhost:9000/api/places?page=${page}&limit=50`);
        const data = await response.json();
        
        if (data.places && data.places.length > 0) {
          setPlaces(prevPlaces => [...prevPlaces, ...data.places]);
          console.log(`Fetched ${data.places.length} new places`);
        } else {
          setHasMore(false);
          console.log('No more places to load');
        }
      } catch (error) {
        console.error('Error fetching places:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [page]);

  // Helper function to format location
  const formatLocation = (location) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'object') {
      const { city, country } = location;
      return `${city}${country ? `, ${country}` : ''}`;
    }
    return location;
  };

  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    "Discover amazing places around the world ✨",
    "Your next adventure awaits! 🌎",
    "Find hidden gems everywhere 💎",
    "Travel like never before 🚀"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((current) => (current + 1) % texts.length);
    }, 4000); // Change text every 4 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="discover-page">
      <div className="discover-hero">
        <div className="hero-content">
          <h1>Get place by place.it</h1>
          <p className="hero-subtitle typing-text">
            {texts[textIndex]}
          </p>
          <div className="hero-search">
            <input 
              type="text" 
              placeholder="Search for places..." 
              className="hero-search-input"
            />
            <button className="hero-search-btn">Explore</button>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </div>

      <div className="discover-content">
        {places.map((place, index) => {
          const imageUrl = place.photos?.[0]?.url || 
                          place.images?.[0]?.url || 
                          place.image || 
                          "https://placehold.co/300x400/333/FFF?text=No+Image";

          // Add ref to last element for infinite scroll
          const isLastElement = places.length === index + 1;
          
          return (
            <div 
              key={place._id} 
              className="place-card"
              ref={isLastElement ? lastPlaceElementRef : null}
            >
              <img 
                src={imageUrl}
                alt={place.title || place.name}
                className="place-thumbnail"
                onError={(e) => {
                  console.log('Image failed to load for:', place.title);
                  e.target.src = "https://placehold.co/300x400/333/FFF?text=No+Image";
                }}
              />
              <div className="hover-card">
                <div className="categories">
                  {place.categories?.map((category, idx) => (
                    <span key={idx} className="category-chip">{category}</span>
                  ))}
                </div>
                <div className="place-info">
                  <h3>{place.title || place.name}</h3>
                  <p>{formatLocation(place.location)}</p>
                </div>
              </div>
              <Link to={`/place/${place._id}`} state={{ place }} className="card-link" />
            </div>
          );
        })}
      </div>
      
      {loading && (
        <div className="loading-spinner">
          Loading more places...
        </div>
      )}
      
      {!hasMore && (
        <div className="no-more-places">
          No more places to discover
        </div>
      )}
    </div>
  );
};

export default Discover; 