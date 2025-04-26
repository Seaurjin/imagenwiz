// A utility file that provides direct access to translation files
// This bypasses potential issues with the i18next system's fallback mechanism

// Import direct translations for all supported languages
import enPricing from '../i18n/locales/en/pricing.json';
import dePricing from '../i18n/locales/de/pricing.json';
import esPricing from '../i18n/locales/es/pricing.json';
import frPricing from '../i18n/locales/fr/pricing.json';
import jaPricing from '../i18n/locales/ja/pricing.json';
import ruPricing from '../i18n/locales/ru/pricing.json';

import enCommon from '../i18n/locales/en/common.json';
import deCommon from '../i18n/locales/de/common.json';
import esCommon from '../i18n/locales/es/common.json';
import frCommon from '../i18n/locales/fr/common.json';
import jaCommon from '../i18n/locales/ja/common.json';
import ruCommon from '../i18n/locales/ru/common.json';

// Add other translation imports as needed for different namespaces

// Map of all direct translations by language and namespace
export const directTranslations = {
  en: {
    pricing: enPricing,
    common: enCommon,
    // Add other namespaces as needed
  },
  de: {
    pricing: dePricing,
    common: deCommon,
  },
  es: {
    pricing: esPricing,
    common: esCommon,
  },
  fr: {
    pricing: frPricing,
    common: frCommon,
  },
  ja: {
    pricing: jaPricing,
    common: jaCommon,
  },
  ru: {
    pricing: ruPricing,
    common: ruCommon,
  },
};

/**
 * Get a translation value directly from the imported translation files
 * 
 * @param {string} language - The language code (e.g., 'en', 'fr')
 * @param {string} namespace - The translation namespace (e.g., 'pricing', 'common')
 * @param {string} key - The dot-notation path to the translation (e.g., 'plans.lite.features.0')
 * @param {*} fallback - The fallback value if translation is not found
 * @returns {*} - The translated value or fallback
 */
export const getDirectTranslation = (language, namespace, key, fallback = '') => {
  // Get base language (e.g., 'en' from 'en-US')
  const baseLanguage = language.split('-')[0];
  
  // Check if we have translations for this language
  if (!directTranslations[baseLanguage] || !directTranslations[baseLanguage][namespace]) {
    // Fall back to English if the language or namespace doesn't exist
    if (directTranslations.en && directTranslations.en[namespace]) {
      console.log(`Falling back to English for ${baseLanguage}/${namespace}/${key}`);
      return getPathValue(directTranslations.en[namespace], key, fallback);
    }
    return fallback;
  }
  
  // Get the translation value
  const translationData = directTranslations[baseLanguage][namespace];
  return getPathValue(translationData, key, fallback);
};

/**
 * Helper function to get a nested value from an object using dot notation
 * 
 * @param {object} obj - The object to traverse
 * @param {string} path - Dot notation path (e.g., 'plans.lite.features.0')
 * @param {*} fallback - Fallback value if path doesn't exist
 * @returns {*} - The value at the path or fallback
 */
const getPathValue = (obj, path, fallback) => {
  if (!obj || !path) return fallback;
  
  // Split the path into segments
  const segments = path.split('.');
  let current = obj;
  
  // Traverse the object
  for (const segment of segments) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return fallback;
    }
    current = current[segment];
    if (current === undefined) {
      return fallback;
    }
  }
  
  return current !== undefined ? current : fallback;
};

/**
 * Create a translation helper bound to a specific language and namespace
 * 
 * @param {string} language - The language code
 * @param {string} namespace - The translation namespace
 * @returns {Function} - A function that takes a key and fallback and returns the translation
 */
export const createTranslationHelper = (language, namespace) => {
  return (key, fallback = '') => getDirectTranslation(language, namespace, key, fallback);
};

export default getDirectTranslation;