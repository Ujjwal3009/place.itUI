import { useState } from 'react';
import '../styles/Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'beach', label: 'Beaches' },
    { id: 'mountain', label: 'Mountains' },
    { id: 'city', label: 'Cities' },
    { id: 'cultural', label: 'Cultural' },
  ];

  return (
    <div className="search">
      <div className="search-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button">Search</button>
        </div>

        <div className="categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-button ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="search-results">
          {/* Search results will go here */}
        </div>
      </div>
    </div>
  );
};

export default Search; 