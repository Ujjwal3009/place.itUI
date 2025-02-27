import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Logo.css';

const Logo = () => {
  return (
    <Link to="/discover" className="logo-link">
      <div className="logo">
        <div className="logo-character">
          <div className="character-body">
            <div className="character-face">
              <div className="eyes"></div>
              <div className="blush"></div>
            </div>
            <div className="map-pin"></div>
          </div>
        </div>
        <span className="logo-text">
          Place<span className="logo-dot">.</span>it
        </span>
      </div>
    </Link>
  );
};

export default Logo; 