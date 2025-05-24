import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('GoogleCallback');
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          throw new Error('No token received from Google authentication');
        }

        await handleGoogleCallback(token);
        navigate('/dashboard');
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/login', { state: { error: 'Google authentication failed' } });
      }
    };

    handleCallback();
  }, [location, handleGoogleCallback, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
    </div>
  );
};

export default GoogleCallback; 