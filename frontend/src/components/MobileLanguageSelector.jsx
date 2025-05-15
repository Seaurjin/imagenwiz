import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, changeLanguage } from '../i18n/i18n';

const MobileLanguageSelector = ({ onSelect }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get the current language
  const currentLanguageCode = i18n.language || localStorage.getItem('i18nextLng') || 'en';
  const currentLanguage = SUPPORTED_LANGUAGES.find(
    lang => lang.code === currentLanguageCode
  ) || SUPPORTED_LANGUAGES[0];
  
  // Filter languages based on search
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      lang.name.toLowerCase().includes(searchLower) ||
      lang.nativeName.toLowerCase().includes(searchLower) ||
      lang.code.toLowerCase().includes(searchLower)
    );
  });
  
  // Handle language change
  const handleLanguageChange = (language) => {
    if (language.code === currentLanguageCode || isChanging) {
      setIsOpen(false);
      if (onSelect && typeof onSelect === 'function') {
        onSelect();
      }
      return;
    }
    
    setIsChanging(true);
    
    changeLanguage(language.code)
      .then(() => {
        // Successful language change
        setIsOpen(false);
        setSearchTerm('');
        
        // Call the onSelect callback if provided
        if (onSelect && typeof onSelect === 'function') {
          onSelect();
        }
      })
      .catch(err => {
        console.error("Error changing language:", err);
      })
      .finally(() => {
        setIsChanging(false);
      });
  };

  return (
    <div className="relative">
      {/* Language button */}
      <button 
        onClick={() => !isChanging && setIsOpen(!isOpen)}
        disabled={isChanging}
        className={`flex items-center justify-center space-x-2 bg-teal-500 text-white px-4 py-3 rounded-md w-full ${isChanging ? 'opacity-70' : ''} transition-all`}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Globe icon */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        
        <span className="font-medium">
          {currentLanguage.code.toUpperCase()} - {currentLanguage.nativeName}
        </span>
        
        {isChanging && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
      </button>
      
      {/* Fullscreen Language Selector Modal */}
      {isOpen && !isChanging && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-medium">Select Language</h2>
            <button 
              className="p-2 rounded-full hover:bg-gray-200 text-gray-500"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
              type="button"
              aria-label="Close language selector"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Search input */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                className="block w-full rounded-md border-0 py-3 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Language list */}
          <div className="flex-1 overflow-auto">
            {filteredLanguages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No languages found
              </div>
            ) : (
              <div className="p-2">
                {filteredLanguages.map(language => (
                  <button 
                    key={language.code}
                    className={`w-full text-left mb-2 p-4 rounded-md flex items-center justify-between ${
                      language.code === currentLanguageCode 
                        ? 'bg-teal-50 border border-teal-100' 
                        : 'bg-white border border-gray-200 hover:border-teal-100 hover:bg-gray-50'
                    }`}
                    onClick={() => handleLanguageChange(language)}
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">{language.flag}</span>
                      <div>
                        <div className="font-medium">{language.nativeName}</div>
                        <div className="text-sm text-gray-500">{language.name}</div>
                      </div>
                    </div>
                    
                    {language.code === currentLanguageCode && (
                      <svg className="h-6 w-6 text-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLanguageSelector;