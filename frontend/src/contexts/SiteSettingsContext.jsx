import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const SiteSettingsContext = createContext();

// Hook to use the context
export const useSiteSettings = () => useContext(SiteSettingsContext);

// Provider component
export const SiteSettingsProvider = ({ children }) => {
  const [logos, setLogos] = useState({
    navbar: '/images/imagenwiz-logo-simple.svg',
    footer: '/images/imagenwiz-logo-simple.svg',
    favicon: '/favicon.svg'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to load logos
  const loadLogos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/settings/logo');
      const logoData = response.data;
      
      // Set default values for missing logos
      const updatedLogos = {
        navbar: logoData.navbar || '/images/imagenwiz-logo-simple.svg',
        footer: logoData.footer || '/images/imagenwiz-logo-simple.svg',
        favicon: logoData.favicon || '/favicon.svg'
      };
      
      setLogos(updatedLogos);
      setError(null);
      
      // Update favicon if available
      if (updatedLogos.favicon) {
        const faviconLink = document.querySelector("link[rel*='icon']") || document.createElement('link');
        faviconLink.type = 'image/x-icon';
        faviconLink.rel = 'shortcut icon';
        faviconLink.href = updatedLogos.favicon;
        document.getElementsByTagName('head')[0].appendChild(faviconLink);
      }
    } catch (err) {
      console.error('Error loading logos:', err);
      setError('Failed to load site settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Load logos on mount
  useEffect(() => {
    loadLogos();
  }, []);

  // Reload settings function that can be called from components
  const reloadSettings = () => {
    loadLogos();
  };
  
  // Value to be provided to consumers
  const value = {
    logos,
    isLoading,
    error,
    reloadSettings
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export default SiteSettingsContext;