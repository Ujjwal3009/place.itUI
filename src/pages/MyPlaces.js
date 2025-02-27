import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/MyPlaces.css';

const MyPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9000/api/placelists/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const result = await response.json();
        if (result.success && Array.isArray(result.data)) {
          setPlaces(result.data);
          setFilteredPlaces(result.data);
        } else {
          setPlaces([]);
          setFilteredPlaces([]);
        }
      } catch (err) {
        console.error('Error fetching places:', err);
        setError('Failed to load places');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Search functionality
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredPlaces(places);
      return;
    }

    const filtered = places.filter(place => 
      place.name.toLowerCase().includes(searchTerm) ||
      place.location.toLowerCase().includes(searchTerm) ||
      place.categories?.some(category => 
        category.toLowerCase().includes(searchTerm)
      )
    );

    setFilteredPlaces(filtered);
  };

  if (loading) return <div className="loading">Loading your places...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="my-places-page">
      <div className="places-header">
        <div className="header-content">
          <h1>My Places</h1>
          <div className="header-actions">
            <Link to="/discover" className="add-place-btn">
              <span>+</span> Add place
            </Link>
          </div>
        </div>
      </div>

      <div className="view-toggle">
        <button className="active">Places</button>
        <button>Map</button>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search your places..." 
            value={searchTerm}
            onChange={handleSearch}
          />
          <span className="search-icon">🔍</span>
        </div>
        {searchTerm && (
          <div className="search-results-count">
            Found {filteredPlaces.length} {filteredPlaces.length === 1 ? 'place' : 'places'}
          </div>
        )}
      </div>

      <div className="places-grid">
        {filteredPlaces.map((place) => (
          <div 
            key={place.id} 
            className={`place-card ${searchTerm ? 'search-animation' : ''}`}
          >
            <Link to={`/place/${place.placeId}`} className="place-link">
              <div className="place-image-wrapper">
                <img 
                  src={place.images?.[0]?.large || "https://via.placeholder.com/300x200?text=No+Image"} 
                  alt={place.name}
                  className="place-image"
                />
                <div className="place-badges">
                  {place.categories?.slice(0, 2).map((category, index) => (
                    <span key={index} className="badge">{category}</span>
                  ))}
                </div>
              </div>
              <div className="place-info">
                <h3>{place.name}</h3>
                <p>{place.location}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyPlaces; 