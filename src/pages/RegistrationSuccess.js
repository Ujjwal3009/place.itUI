import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegistrationSuccess.css';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to onboarding after 3 seconds
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1>Registration Successful!</h1>
        <p>Welcome to place.it</p>
        <p className="redirect-text">Redirecting you to onboarding page...</p>
      </div>
    </div>
  );
};

export default RegistrationSuccess; 