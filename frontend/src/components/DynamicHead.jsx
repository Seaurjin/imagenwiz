import React, { useEffect } from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

/**
 * DynamicHead component to update the document head elements dynamically
 * This component uses the SiteSettings context to update the favicon
 */
const DynamicHead = () => {
  const { logos } = useSiteSettings();

  useEffect(() => {
    // Update favicon if available in site settings
    if (logos && logos.favicon) {
      // Find existing favicon links
      const existingFavicons = document.querySelectorAll("link[rel*='icon']");
      
      // Remove existing favicon links
      existingFavicons.forEach(favicon => {
        document.head.removeChild(favicon);
      });

      // Create new favicon links
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = logos.favicon;
      link.type = logos.favicon.endsWith('.svg') ? 'image/svg+xml' : 'image/x-icon';
      
      // Add the new favicon link to the document head
      document.head.appendChild(link);
    }
  }, [logos]);

  // This component doesn't render anything visible
  return null;
};

export default DynamicHead;