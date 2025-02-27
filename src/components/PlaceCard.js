const PlaceCard = ({ place }) => {
  return (
    <div className="place-card">
      <img 
        src={place.thumbnail} 
        alt={place.title}
        className="place-thumbnail"
      />
      <div className="hover-card">
        <div className="categories">
          {place.categories.map(category => (
            <span key={category} className="category-chip">
              {category}
            </span>
          ))}
        </div>
        <div className="user-info">
          <img 
            src={place.author.profilePhoto} 
            alt={place.author.username}
            className="user-avatar"
          />
          <span className="username">{place.author.username}</span>
        </div>
      </div>
    </div>
  );
}; 