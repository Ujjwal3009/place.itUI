import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/api';
import { logger } from '../utils/logger';
import '../styles/Onboarding.css';

const Onboarding = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    birthday: '',
    currentLocation: '',
    nextLocation: '',
    profilePhoto: null,
    interests: []
  });

  // Available interests with their icons
  const interestOptions = [
    { id: 'budget', label: 'Budget', icon: '💰' },
    { id: 'hidden-gems', label: 'Hidden Gems', icon: '💎' },
    { id: 'foodie', label: 'Foodie', icon: '🍽' },
    { id: 'local', label: 'Local', icon: '🏠' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' },
    { id: 'insta-worthy', label: 'Insta Worthy', icon: '📸' },
    { id: 'nature', label: 'Nature & Outdoors', icon: '🌲' },
    { id: 'relaxing', label: 'Relaxing', icon: '🌅' }
  ];

  const handleInterestToggle = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: file
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'interests') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'profilePhoto' && formData[key]) {
          submitData.append(key, formData[key]);
        } else {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Show success animation
      setShowSuccess(true);
      
      // Navigate after animation
      setTimeout(() => {
        navigate('/discover');
      }, 3000);

    } catch (err) {
      logger.error('Onboarding', 'handleSubmit', err);
    } finally {
      setLoading(false);
    }
  };

  // Add this success animation component
  const SuccessAnimation = () => (
    <div className="success-animation">
      <div className="success-content">
        <div className="plane-animation">
          <svg className="plane" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.99 12.35c-.08-.28-.34-.48-.64-.48h-3.86l-4.24-7.35c-.12-.21-.34-.34-.58-.34-.24 0-.46.13-.58.34l-4.24 7.35H4c-.3 0-.56.2-.64.48-.08.28.02.58.26.74l3.86 2.5-1.47 4.53c-.1.28.02.58.28.74.12.07.25.11.38.11.14 0 .28-.04.4-.13l4.93-3.19 4.93 3.19c.12.09.26.13.4.13.13 0 .26-.04.38-.11.26-.16.38-.46.28-.74l-1.47-4.53 3.86-2.5c.24-.16.34-.46.26-.74z" 
              fill="#FF385C"/>
          </svg>
        </div>
        <div className="success-message">
          Welcome aboard! 🎉
        </div>
      </div>
    </div>
  );

  return (
    <div className="onboarding-container">
      <div className="onboarding-content">
        <h1>Welcome to the LFG fam 🎉</h1>
        <p className="subtitle">
          Let's make your experience more personal! Just a few quick questions to get you 
          started. Don't worry, we hate long forms too 😉
        </p>

        <h2>Let's get to know you!</h2>

        <div className="form-section">
          <label>
            <span>🎂 What's your birthday?</span>
            <input
              type="date"
              value={formData.birthday}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                birthday: e.target.value
              }))}
              placeholder="DD/MM/YYYY"
            />
          </label>
        </div>

        <div className="form-section">
          <label>
            <span>✈️ What interests you when traveling?</span>
            <p className="hint">Select all that match your travel style!</p>
            <div className="interests-grid">
              {interestOptions.map(interest => (
                <button
                  key={interest.id}
                  className={`interest-button ${formData.interests.includes(interest.id) ? 'selected' : ''}`}
                  onClick={() => handleInterestToggle(interest.id)}
                >
                  <span className="interest-icon">{interest.icon}</span>
                  <span className="interest-label">{interest.label}</span>
                </button>
              ))}
            </div>
          </label>
        </div>

        <div className="form-section">
          <label>
            <span>📍 Where in the world are you?</span>
            <p className="hint">Tell us your current location and where you plan to visit next.</p>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                currentLocation: e.target.value
              }))}
              placeholder="Your current IRL"
            />
            <input
              type="text"
              value={formData.nextLocation}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                nextLocation: e.target.value
              }))}
              placeholder="Your next IRL"
            />
            <p className="note">*IRL = in real life</p>
          </label>
        </div>

        <div className="form-section">
          <label>
            <span>📸 Share a profile photo!</span>
            <p className="hint">Upload a photo from your favorite travel moment – it will be your profile picture!</p>
            <div 
              className="photo-upload-area"
              onClick={() => document.getElementById('photo-upload').click()}
            >
              {formData.profilePhoto ? (
                <img 
                  src={URL.createObjectURL(formData.profilePhoto)} 
                  alt="Profile preview" 
                />
              ) : (
                <>
                  <div className="upload-icon">📷</div>
                  <p>Click here to upload your photo</p>
                  <p className="supported-formats">Supported formats: .jpg, .png, and .gif</p>
                </>
              )}
            </div>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              style={{ display: 'none' }}
            />
            <p className="note">*Optional - you can add a photo anytime</p>
          </label>
        </div>

        <button 
          className="continue-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
      {showSuccess && <SuccessAnimation />}
    </div>
  );
};

export default Onboarding; 