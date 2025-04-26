// A utility file that provides direct access to translation files
// This bypasses potential issues with the i18next system's fallback mechanism

// Import direct translations for all supported languages
import enPricing from '../i18n/locales/en/pricing.json';
import dePricing from '../i18n/locales/de/pricing.json';
import esPricing from '../i18n/locales/es/pricing.json';
import frPricing from '../i18n/locales/fr/pricing.json';
import jaPricing from '../i18n/locales/ja/pricing.json';
import ruPricing from '../i18n/locales/ru/pricing.json';
import arPricing from '../i18n/locales/ar/pricing.json';
import koPricing from '../i18n/locales/ko/pricing.json';
import idPricing from '../i18n/locales/id/pricing.json';
import msPricing from '../i18n/locales/ms/pricing.json';
import itPricing from '../i18n/locales/it/pricing.json';
import huPricing from '../i18n/locales/hu/pricing.json';
import nlPricing from '../i18n/locales/nl/pricing.json';
import noPricing from '../i18n/locales/no/pricing.json';
import plPricing from '../i18n/locales/pl/pricing.json';
import viPricing from '../i18n/locales/vi/pricing.json';
import thPricing from '../i18n/locales/th/pricing.json';
import ptPricing from '../i18n/locales/pt/pricing.json';
import elPricing from '../i18n/locales/el/pricing.json';
import trPricing from '../i18n/locales/tr/pricing.json';
import svPricing from '../i18n/locales/sv/pricing.json';
import zhTWPricing from '../i18n/locales/zh-TW/pricing.json';

import enCommon from '../i18n/locales/en/common.json';
import deCommon from '../i18n/locales/de/common.json';
import esCommon from '../i18n/locales/es/common.json';
import frCommon from '../i18n/locales/fr/common.json';
import jaCommon from '../i18n/locales/ja/common.json';
import ruCommon from '../i18n/locales/ru/common.json';
import idCommon from '../i18n/locales/id/common.json';
import msCommon from '../i18n/locales/ms/common.json';
import itCommon from '../i18n/locales/it/common.json';
import huCommon from '../i18n/locales/hu/common.json';
import nlCommon from '../i18n/locales/nl/common.json';
import noCommon from '../i18n/locales/no/common.json';
import plCommon from '../i18n/locales/pl/common.json';
import commonAR from '../i18n/locales/ar/common.json';
import commonKO from '../i18n/locales/ko/common.json';
import commonTR from '../i18n/locales/tr/common.json';
import commonEL from '../i18n/locales/el/common.json';

// Import blog translations
import enBlog from '../i18n/locales/en/blog.json';
import frBlog from '../i18n/locales/fr/blog.json';
import esBlog from '../i18n/locales/es/blog.json';
import jaBlog from '../i18n/locales/ja/blog.json';
import ruBlog from '../i18n/locales/ru/blog.json';
import arBlog from '../i18n/locales/ar/blog.json';
import koBlog from '../i18n/locales/ko/blog.json';
import idBlog from '../i18n/locales/id/blog.json';
import msBlog from '../i18n/locales/ms/blog.json';
import itBlog from '../i18n/locales/it/blog.json';
import trBlog from '../i18n/locales/tr/blog.json';
import huBlog from '../i18n/locales/hu/blog.json';
import plBlog from '../i18n/locales/pl/blog.json';
import noBlog from '../i18n/locales/no/blog.json';
import elBlog from '../i18n/locales/el/blog.json';

// Add other translation imports as needed for different namespaces

// Map of all direct translations by language and namespace
export const directTranslations = {
  en: {
    pricing: enPricing,
    common: enCommon,
    blog: enBlog
  },
  de: {
    pricing: dePricing,
    common: deCommon,
    blog: enBlog // Using English as fallback
  },
  es: {
    pricing: esPricing,
    common: esCommon,
    blog: esBlog
  },
  fr: {
    pricing: frPricing,
    common: frCommon,
    blog: frBlog
  },
  ja: {
    pricing: jaPricing,
    common: jaCommon,
    blog: jaBlog
  },
  ru: {
    pricing: ruPricing,
    common: ruCommon,
    blog: ruBlog
  },
  ar: {
    pricing: arPricing,
    common: commonAR,
    blog: arBlog
  },
  ko: {
    pricing: koPricing,
    common: commonKO,
    blog: koBlog
  },
  id: {
    pricing: idPricing,
    common: idCommon,
    blog: idBlog
  },
  ms: {
    pricing: msPricing,
    common: msCommon,
    blog: msBlog
  },
  it: {
    pricing: itPricing,
    common: itCommon,
    blog: itBlog
  },
  hu: {
    pricing: huPricing,
    common: huCommon,
    blog: huBlog
  },
  nl: {
    pricing: nlPricing,
    common: nlCommon,
    blog: enBlog // Using English as fallback
  },
  no: {
    pricing: noPricing,
    common: noCommon,
    blog: noBlog
  },
  pl: {
    pricing: plPricing,
    common: plCommon,
    blog: plBlog
  },
  tr: {
    pricing: trPricing,
    common: commonTR,
    blog: trBlog
  },
  el: {
    pricing: elPricing,
    common: commonEL,
    blog: elBlog
  },
  sv: {
    pricing: svPricing,
    common: enCommon, // Using English as fallback
    blog: enBlog // Using English as fallback
  },
  "zh-TW": {
    pricing: zhTWPricing,
    common: enCommon, // Using English as fallback
    blog: enBlog // Using English as fallback
  },
  vi: {
    pricing: viPricing,
    common: enCommon, // Using English as fallback
    blog: enBlog // Using English as fallback
  },
  th: {
    pricing: thPricing,
    common: enCommon, // Using English as fallback
    blog: enBlog // Using English as fallback
  },
  pt: {
    pricing: ptPricing,
    common: enCommon, // Using English as fallback
    blog: enBlog // Using English as fallback
  }
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
  // Special case for Traditional Chinese which has a hyphen in its code
  if (language === 'zh-TW' && directTranslations['zh-TW']) {
    if (directTranslations['zh-TW'][namespace]) {
      return getPathValue(directTranslations['zh-TW'][namespace], key, fallback);
    }
  }
  
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