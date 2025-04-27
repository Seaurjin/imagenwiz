import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Simple component to provide direct links to pricing page in specific languages
const LangQuickSwitcher = () => {
  const { i18n } = useTranslation();
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
  const buttonStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    color: 'white',
    backgroundColor: isActive ? '#10b981' : '#6366f1',
    fontWeight: 'medium',
    transition: 'background-color 150ms ease',
    gap: '8px',
  });

  // Method to directly change language and reload
  const setLanguageAndNavigate = (langCode) => {
    console.log(`Setting language to: ${langCode}`);
    
    // First, set in localStorage (most important for page reload)
    localStorage.setItem('i18nextLng', langCode);
    
    // Now change i18n language (this triggers the event listeners)
    i18n.changeLanguage(langCode).then(() => {
      console.log(`Language changed to: ${langCode}`);
      
      // Force reload to ensure everything is updated
      setTimeout(() => {
        window.location.href = '/pricing';
      }, 100);
    });
  };

  // Get current language from i18n
  const currentLanguage = i18n.language || localStorage.getItem('i18nextLng') || 'en';
  console.log(`Current language in switcher: ${currentLanguage}`);

  return (
    <div style={containerStyle}>
      <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '14px' }}>
        Language
      </h3>
      {languages.map((lang) => {
        const isActive = currentLanguage === lang.code;
        return (
          <button
            key={lang.code}
            style={buttonStyle(isActive)}
            onClick={() => setLanguageAndNavigate(lang.code)}
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