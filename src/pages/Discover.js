import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';
import '../styles/Home.css';
import Placelist from '../components/Placelist';

const Discover = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_CONFIG.BASE_URL}/places/discover`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }

        const data = await response.json();
        // Transform API data to match PlaceList expected format
        const transformedPlaces = data.places.map(place => ({
          id: place.id,
          name: place.title,
          image: place.thumbnail,
          images: [place.thumbnail], // Since API provides single image
          tags: place.categories,
          author: place.author.username,
          authorPhoto: place.author.profilePhoto || '/default-avatar.png' // Fallback for empty profile photo
        }));

        setPlaces(transformedPlaces);
      } catch (err) {
        console.error('Error fetching places:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const discoverList = {
    id: 'discover',
    title: "Discover Amazing Places",
    description: "Explore beautiful destinations from around the world",
    author: "LFG Team",
    saves: 2500,
    places: places
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="discover-page">
      <div className="discover-content">
        <Placelist
          title={discoverList.title}
          description={discoverList.description}
          places={discoverList.places}
          author={discoverList.author}
          saves={discoverList.saves}
        />
      </div>
    </div>
  );
};

export default Discover; 