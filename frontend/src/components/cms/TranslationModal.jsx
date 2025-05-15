import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, Languages, CheckCircle, Info, AlertTriangle, Globe } from 'lucide-react';

/**
 * TranslationModal component for selecting languages to translate to
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing modal
 * @param {Array} props.languages - Array of all available languages (assumed to be active and non-English)
 * @param {Function} props.onTranslate - Function to call with selected languages when translating
 * @param {boolean} props.isLoading - Whether translation is in progress
 * @param {Function} props.onCancel - Function to call when canceling translation
 */
const TranslationModal = ({ isOpen, onClose, languages, onTranslate, isLoading, onCancel }) => {
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  // const [activeTab, setActiveTab] = useState('website'); // REMOVED
  
  // Reset selection when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedLanguages([]);
      // setActiveTab('website'); // REMOVED
    }
  }, [isOpen]);
  
  // Filter out English from the provided languages list as it's the source language
  // The parent component should ideally pass already filtered (active, non-English) languages.
  const displayLanguages = useMemo(() => {
    return languages.filter(lang => lang.code !== 'en');
  }, [languages]);
  
  // Handle selection of a language
  const toggleLanguage = (langCode) => {
    setSelectedLanguages(prev => {
      if (prev.includes(langCode)) {
        return prev.filter(code => code !== langCode);
      } else {
        return [...prev, langCode];
      }
    });
  };
  
  // Handle select all visible languages
  const selectAll = () => {
    const allLangCodes = displayLanguages.map(lang => lang.code);
    setSelectedLanguages(allLangCodes);
  };
  
  // Handle unselect all languages
  const unselectAll = () => {
    setSelectedLanguages([]);
  };
  
  // Get recommended batch size based on selection
  const getRecommendedBatches = () => {
    const totalLangs = selectedLanguages.length;
    if (totalLangs <= 5) return 1;
    return Math.ceil(totalLangs / 5);
  };
  
  // Check if too many languages are selected
  const tooManyLanguages = selectedLanguages.length > 15;
  
  // Handle submit translation
  const handleTranslate = () => {
    if (selectedLanguages.length === 0) {
      alert('Please select at least one language for translation');
      return;
    }
    
    // If too many languages are selected, show a confirmation
    if (tooManyLanguages) {
      const confirmMessage = `You have selected ${selectedLanguages.length} languages. This could take a long time and might timeout. The system will process languages in batches, but it's recommended to select fewer languages for reliability. Continue anyway?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    
    onTranslate(selectedLanguages);
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (isLoading) {
      // If translation is in progress, ask for confirmation before canceling
      if (window.confirm('Translation is in progress. Are you sure you want to cancel?')) {
        onCancel?.();
      } else {
        return;
      }
    }
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Languages className="mr-2 h-5 w-5 text-teal-600" />
            Translate Content
          </h2>
          <button 
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-gray-700 mb-4">
            Select the languages you want to translate your content to. The translation will be performed automatically based on the English version of your content.
          </p>
          
          {/* Warning about translation limits */}
          <div className={`border rounded-md p-3 mb-4 ${tooManyLanguages ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <p className={`text-sm ${tooManyLanguages ? 'text-red-800' : 'text-yellow-800'}`}>
              <strong>{tooManyLanguages ? '⚠️ Warning:' : '💡 Translation Tip:'}</strong> {
                tooManyLanguages ?
                `You've selected ${selectedLanguages.length} languages. This could cause performance issues or timeouts. For best results, translate 5-10 languages at a time.` :
                `For best results, translate 5-10 languages at a time. The system will process translations in ${getRecommendedBatches()} batch(es).`
              }
            </p>
          </div>
          
          {/* Select/Unselect All Buttons */}
          <div className="flex justify-between mb-4">
            <button 
              className="text-sm text-teal-600 hover:text-teal-800 flex items-center"
              onClick={selectAll}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Select All ({displayLanguages.length})
            </button>
            <button 
              className="text-sm text-gray-600 hover:text-gray-800"
              onClick={unselectAll}
              disabled={isLoading}
            >
              Unselect All
            </button>
          </div>
          
          {/* REMOVED Language group tabs */}
          
          {/* Selected language count */}
          <div className="mb-3 text-sm text-gray-600">
            {selectedLanguages.length > 0 ? (
              <p>{selectedLanguages.length} of {displayLanguages.length} languages selected for translation</p>
            ) : (
              <p>No languages selected yet. Choose from {displayLanguages.length} available languages.</p>
            )}
          </div>
          
          {/* Language Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayLanguages.map(lang => (
              <div 
                key={lang.code}
                className={`border rounded-lg p-3 cursor-pointer transition-colors flex items-center justify-between ${
                  selectedLanguages.includes(lang.code) 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => toggleLanguage(lang.code)}
              >
                <div className="flex items-center">
                  <span className="mr-2 text-lg">{lang.flag || '🌐'}</span>
                  <span>{lang.name}</span>
                </div>
                {selectedLanguages.includes(lang.code) && (
                  <Check className="h-5 w-5 text-teal-600" />
                )}
              </div>
            ))}
          </div>
          
          {displayLanguages.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No other languages available for translation. Please add and activate more languages in the CMS settings.
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 hover:bg-gray-300 transition-colors"
            onClick={handleCancel}
          >
            {isLoading ? 'Cancel Translation' : 'Cancel'}
          </button>
          <button 
            className={`px-4 py-2 rounded-md text-white flex items-center ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : tooManyLanguages
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-teal-600 hover:bg-teal-700'
            }`}
            onClick={handleTranslate}
            disabled={isLoading || selectedLanguages.length === 0}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Translating...</span>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </>
            ) : (
              <>
                <Languages className="h-4 w-4 mr-2" />
                Translate {selectedLanguages.length ? `(${selectedLanguages.length})` : ''}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationModal;