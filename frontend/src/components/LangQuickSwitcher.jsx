import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Simple component to provide direct language switching
const LangQuickSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('i18nextLng') || 'en');
  
  const languages = [
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇨🇳' },
  ];

  useEffect(() => {
    // Update current language when i18n language changes
    const updateCurrentLang = () => {
      const storedLang = localStorage.getItem('i18nextLng');
      if (storedLang && storedLang !== currentLang) {
        setCurrentLang(storedLang);
      }
    };
    
    // Initial check
    updateCurrentLang();
    
    // Set up interval to check for changes
    const interval = setInterval(updateCurrentLang, 1000);
    
    return () => clearInterval(interval);
  }, [currentLang]);

  // Style for the container
  const containerStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'white',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  };

  // Style for language buttons
  const buttonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'white',
    backgroundColor: isActive ? '#10b981' : '#6366f1',
    fontWeight: 'medium',
    transition: 'background-color 150ms ease',
    gap: '8px',
    width: '100%',
  });

  // Direct method to change language
  const changeLanguage = (langCode) => {
    console.log(`Directly changing language to: ${langCode}`);
    
    // Set in localStorage first
    localStorage.setItem('i18nextLng', langCode);
    
    // Update state
    setCurrentLang(langCode);
    
    // Change document language attribute directly
    document.documentElement.lang = langCode;
    
    try {
      // Force location change to refresh the page with the new language
      window.location = `/pricing?lang=${langCode}&_=${Date.now()}`;
    } catch (error) {
      console.error('Error during language change:', error);
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '14px' }}>
        Language
      </h3>
      {languages.map((lang) => {
        const isActive = currentLang === lang.code;
        return (
          <button
            key={lang.code}
            style={buttonStyle(isActive)}
            onClick={() => changeLanguage(lang.code)}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
            {isActive && <span style={{ marginLeft: 'auto' }}>✓</span>}
          </button>
        );
      })}
    </div>
  );
};

export default LangQuickSwitcher;