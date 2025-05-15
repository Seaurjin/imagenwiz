import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, changeLanguage } from '../i18n/i18n';

const LanguageSelector = ({ variant = 'default' }) => {
  const { i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Get current language
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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutsideClick(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);
  
  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Function to handle language change
  const handleLanguageChange = (language) => {
    if (language.code === currentLanguageCode || isChanging) {
      setIsOpen(false);
      return;
    }
    
    setIsChanging(true);
    
    changeLanguage(language.code)
      .then(() => {
        // Successful language change
        setIsOpen(false);
        setSearchTerm('');
      })
      .catch(err => {
        console.error("Error changing language:", err);
      })
      .finally(() => {
        setIsChanging(false);
      });
  };
  
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Language selector button */}
      <button 
        onClick={() => !isChanging && setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md 
                  ${variant === 'outline' 
                    ? 'border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-700' 
                    : 'bg-teal-500 text-white hover:bg-teal-600 active:bg-teal-700'}
                  ${isChanging ? 'opacity-70' : ''}
                  transition-all`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        disabled={isChanging}
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
        
        {/* Current language code */}
        <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
        
        {/* Loading indicator or dropdown arrow */}
        {isChanging ? (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {/* Language dropdown menu */}
      {isOpen && !isChanging && (
        <div className="absolute right-0 z-50 mt-2 w-60 sm:w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                ref={searchInputRef}
                className="block w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto py-1">
            {filteredLanguages.length === 0 ? (
              <div className="py-2 px-4 text-sm text-gray-500 text-center">
                No languages found
              </div>
            ) : (
              filteredLanguages.map(language => (
                <button
                  key={language.code}
                  className={`text-left w-full px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-100 ${
                    language.code === currentLanguageCode ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                  }`}
                  onClick={() => handleLanguageChange(language)}
                >
                  <div className="flex items-center">
                    <span className="mr-2 text-lg">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-gray-500">{language.name}</div>
                    </div>
                  </div>
                  
                  {language.code === currentLanguageCode && (
                    <svg className="h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;