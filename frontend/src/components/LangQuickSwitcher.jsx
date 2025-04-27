import React from 'react';
import { Link } from 'react-router-dom';

// Simple component to provide direct links to pricing page in specific languages
const LangQuickSwitcher = () => {
  const languages = [
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇨🇳' },
  ];

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
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: '#6366f1',
    fontWeight: 'medium',
    transition: 'background-color 150ms ease',
    gap: '8px',
  };

  const changeLanguage = (langCode) => {
    // Set localStorage first (most important for page reload)
    localStorage.setItem('i18nextLng', langCode);
    
    // No need to reload as we're navigating to a new page which will load with the new language
  };

  return (
    <div style={containerStyle}>
      {languages.map((lang) => (
        <Link
          key={lang.code}
          to="/pricing"
          style={buttonStyle}
          onClick={() => changeLanguage(lang.code)}
        >
          <span>{lang.flag}</span>
          <span>{lang.nativeName}</span>
        </Link>
      ))}
    </div>
  );
};

export default LangQuickSwitcher;