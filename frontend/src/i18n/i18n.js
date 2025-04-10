import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Define supported languages with their native names and flags
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malaysian', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇹🇼' }
];

// Import English resources (always available as fallback)
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import pricingEN from './locales/en/pricing.json';
import blogEN from './locales/en/blog.json';
import cmsEN from './locales/en/cms.json';

// Import French resources
import commonFR from './locales/fr/common.json';
import blogFR from './locales/fr/blog.json';

// Import Spanish resources
import commonES from './locales/es/common.json';
import blogES from './locales/es/blog.json';

// Import fallback English translations for all other languages
// We'll use dynamic i18next loading instead of static imports
// This prevents the issue of having identical translations copied across languages

// Create resources object with available translations - only include languages we have translations for
const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    pricing: pricingEN,
    blog: blogEN,
    cms: cmsEN
  },
  fr: {
    common: commonFR,
    auth: authEN,
    pricing: pricingEN,
    blog: blogFR,
    cms: cmsEN
  },
  es: {
    common: commonES,
    auth: authEN,
    pricing: pricingEN,
    blog: blogES,
    cms: cmsEN
  }
};

// Add English as fallback for all other languages
SUPPORTED_LANGUAGES.forEach(lang => {
  if (!resources[lang.code]) {
    resources[lang.code] = {
      common: commonEN,
      auth: authEN,
      pricing: pricingEN,
      blog: blogEN,
      cms: cmsEN
    };
  }
});

// Initialize i18next
i18n
  // Enable loading translations via HTTP for lazy loading
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    
    // Default namespace
    defaultNS: 'common',
    
    // Namespace configuration
    ns: ['common', 'auth', 'pricing', 'blog', 'cms', 'dashboard', 'editor'],
    
    // Enable HTTP loading (backend setup)
    backend: {
      // Path to load resources from
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // HTTP method for fetching resources
      requestOptions: {
        cache: 'no-cache'
      }
    },
    
    // Debugging in development mode
    debug: process.env.NODE_ENV === 'development',
    
    // React specific settings
    react: {
      useSuspense: true,
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    
    // Enable local caching
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      lookupCookie: 'i18next',
      caches: ['localStorage', 'cookie'],
    },
  });

// Helper function to check if a language code is RTL
export const isRTL = (languageCode) => {
  // RTL languages: Arabic, Hebrew, Persian (Farsi), Urdu
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode);
};

// Utility function to change language
export const changeLanguage = async (lng) => {
  // First set the localStorage value - critical for page reloads
  localStorage.setItem('i18nextLng', lng);
  
  // Update the document properties
  document.documentElement.lang = lng;
  document.documentElement.dir = isRTL(lng) ? 'rtl' : 'ltr';
  
  // Add RTL class to body for global styling
  if (isRTL(lng)) {
    document.body.classList.add('rtl');
  } else {
    document.body.classList.remove('rtl');
  }
  
  console.log(`Setting language to ${lng}, direction: ${isRTL(lng) ? 'rtl' : 'ltr'}`);
  
  // Change the language in i18next - this should trigger React components to update
  try {
    await i18n.changeLanguage(lng);
    console.log(`Language changed to: ${lng}`);
    
    // Force update any existing dynamic content by dispatching a custom event
    const event = new CustomEvent('languageChanged', { detail: { language: lng } });
    document.dispatchEvent(event);
    
    // Add a global reload trigger after short delay to ensure UI elements update properly
    setTimeout(() => {
      const forceRerenderEvent = new CustomEvent('forceRerender', { detail: { language: lng } });
      document.dispatchEvent(forceRerenderEvent);
    }, 100);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

// Export i18n instance
export default i18n;