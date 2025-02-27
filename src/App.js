import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticatedSync } from './utils/auth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import PlaceDetail from './pages/PlaceDetail';
import Auth from './pages/Auth';
import RegistrationSuccess from './pages/RegistrationSuccess';
import Onboarding from './pages/Onboarding';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? '' : 'dark-mode';
  };

  // Add a public route wrapper
  const PublicRoute = ({ children }) => {
    return !isAuthenticatedSync() ? children : <Navigate to="/discover" />;
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Auth />
            </PublicRoute>
          } />
          
          {/* Protected routes */}
          <Route path="/discover" element={<Discover />} />
          <Route path="/registration-success" element={<RegistrationSuccess />} />
          
          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/place/:id" 
            element={
              <ProtectedRoute>
                <PlaceDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            } 
          />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/discover" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App; 