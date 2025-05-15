import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/i18n';

/**
 * Debug panel component for development mode only
 * Provides easy language switching and debugging information
 */
const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n, t } = useTranslation();
  
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white p-2 rounded-md shadow-lg"
        title="Debug tools"
      >
        🐞 Debug
      </button>
      
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-md shadow-lg p-4 mt-2 max-w-md">
          <h3 className="font-bold mb-2 border-b pb-2">Debug Panel</h3>
          
          <div className="mb-4">
            <h4 className="font-medium mb-1">Current Language: {i18n.language}</h4>
            <div className="flex flex-wrap gap-1 mt-2">
              {SUPPORTED_LANGUAGES.slice(0, 8).map(lang => (
                <button 
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`${
                    i18n.language === lang.code 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  } px-2 py-1 rounded text-sm flex items-center`}
                >
                  <span className="mr-1">{lang.flag}</span>
                  {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-1">Page Info</h4>
            <div className="text-sm">
              <p>Path: {window.location.pathname}</p>
              <p>Document Dir: {document.documentElement.dir}</p>
              <p>Screen Size: {window.innerWidth}x{window.innerHeight}</p>
            </div>
          </div>
          
          <div className="flex justify-end mt-4 pt-2 border-t">
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebugPanel; 