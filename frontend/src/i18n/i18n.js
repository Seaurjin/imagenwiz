import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
  { code: 'zh-TW', name: 'Traditional Chinese', nativeName: '繁體中文', flag: '🇨🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' }
];

// Import English resources (always available as fallback)
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import pricingEN from './locales/en/pricing.json';
import blogEN from './locales/en/blog.json';
import cmsEN from './locales/en/cms.json';
import homeEN from './locales/en/home.json';

// Import French resources
import commonFR from './locales/fr/common.json';
import blogFR from './locales/fr/blog.json';
import pricingFR from './locales/fr/pricing.json';
import homeFR from './locales/fr/home.json';

// Import Spanish resources
import commonES from './locales/es/common.json';
import blogES from './locales/es/blog.json';
import pricingES from './locales/es/pricing.json';
import homeES from './locales/es/home.json';

// Import Japanese resources
import commonJA from './locales/ja/common.json';
import pricingJA from './locales/ja/pricing.json';
import blogJA from './locales/ja/blog.json';
import homeJA from './locales/ja/home.json';

// Import Arabic resources
import commonAR from './locales/ar/common.json';
import blogAR from './locales/ar/blog.json';
import pricingAR from './locales/ar/pricing.json';
import homeAR from './locales/ar/home.json';

// Import German resources
import commonDE from './locales/de/common.json';
import pricingDE from './locales/de/pricing.json';
import homeDE from './locales/de/home.json';

// Import Russian resources
import commonRU from './locales/ru/common.json';
import pricingRU from './locales/ru/pricing.json';
import blogRU from './locales/ru/blog.json';

// Import Portuguese resources
import commonPT from './locales/pt/common.json';
import pricingPT from './locales/pt/pricing.json';

// Import Korean resources
import commonKO from './locales/ko/common.json';
import blogKO from './locales/ko/blog.json';
import pricingKO from './locales/ko/pricing.json';

// Import Vietnamese resources
import commonVI from './locales/vi/common.json';
import pricingVI from './locales/vi/pricing.json';

// Import Thai resources
import commonTH from './locales/th/common.json';
import pricingTH from './locales/th/pricing.json';

// Import Indonesian resources
import commonID from './locales/id/common.json';
import blogID from './locales/id/blog.json';

// Import Malaysian resources
import commonMS from './locales/ms/common.json';
import blogMS from './locales/ms/blog.json';

// Import Dutch resources
import commonNL from './locales/nl/common.json';

// Import Swedish resources
import commonSV from './locales/sv/common.json';
import pricingSV from './locales/sv/pricing.json';

// Import Traditional Chinese resources
import commonZHTW from './locales/zh-TW/common.json';
import pricingZHTW from './locales/zh-TW/pricing.json';

// Import Greek resources
import commonEL from './locales/el/common.json';
import blogEL from './locales/el/blog.json';
import pricingEL from './locales/el/pricing.json';

// Import Turkish resources
import commonTR from './locales/tr/common.json';
import blogTR from './locales/tr/blog.json';
import pricingTR from './locales/tr/pricing.json';

// Import Italian resources
import commonIT from './locales/it/common.json';
import blogIT from './locales/it/blog.json';

// Import Hungarian resources
import commonHU from './locales/hu/common.json';
import blogHU from './locales/hu/blog.json';

// Import Polish resources
import commonPL from './locales/pl/common.json';
import blogPL from './locales/pl/blog.json';

// Import Norwegian resources
import commonNO from './locales/no/common.json';
import blogNO from './locales/no/blog.json';

// Create resources object with available translations - only include languages we have translations for
const resources = {
  en: {
    common: commonEN,
    auth: authEN,
    pricing: pricingEN,
    blog: blogEN,
    cms: cmsEN,
    home: homeEN
  },
  fr: {
    common: commonFR,
    auth: authEN,
    pricing: pricingFR,
    blog: blogFR,
    cms: cmsEN,
    home: homeFR
  },
  es: {
    common: commonES,
    auth: authEN,
    pricing: pricingES,
    blog: blogES,
    cms: cmsEN,
    home: homeES
  },
  ja: {
    common: commonJA,
    auth: authEN,
    pricing: pricingJA,
    blog: blogJA,
    cms: cmsEN,
    home: homeJA
  },
  ar: {
    common: commonAR,
    auth: authEN,
    pricing: pricingAR,
    blog: blogAR,
    cms: cmsEN,
    home: homeAR
  },
  de: {
    common: commonDE,
    auth: authEN,
    pricing: pricingDE,
    blog: blogEN,
    cms: cmsEN,
    home: homeDE
  },
  ru: {
    common: commonRU,
    auth: authEN,
    pricing: pricingRU,
    blog: blogRU,
    cms: cmsEN
  },
  pt: {
    common: commonPT,
    auth: authEN,
    pricing: pricingPT,
    blog: blogEN,
    cms: cmsEN
  },
  ko: {
    common: commonKO,
    auth: authEN,
    pricing: pricingKO,
    blog: blogKO,
    cms: cmsEN
  },
  vi: {
    common: commonVI,
    auth: authEN,
    pricing: pricingVI,
    blog: blogEN,
    cms: cmsEN
  },
  th: {
    common: commonTH,
    auth: authEN,
    pricing: pricingTH,
    blog: blogEN,
    cms: cmsEN
  },
  id: {
    common: commonID,
    auth: authEN,
    pricing: pricingEN,
    blog: blogID,
    cms: cmsEN
  },
  ms: {
    common: commonMS,
    auth: authEN,
    pricing: pricingEN,
    blog: blogMS,
    cms: cmsEN
  },
  nl: {
    common: commonNL,
    auth: authEN,
    pricing: pricingEN,
    blog: blogEN,
    cms: cmsEN
  },
  sv: {
    common: commonSV,
    auth: authEN,
    pricing: pricingSV,
    blog: blogEN,
    cms: cmsEN
  },
  "zh-TW": {
    common: commonZHTW,
    auth: authEN,
    pricing: pricingZHTW,
    blog: blogEN,
    cms: cmsEN
  },
  "it": {
    common: commonIT,
    auth: authEN,
    pricing: pricingEN,
    blog: blogIT,
    cms: cmsEN
  },
  "tr": {
    common: commonTR,
    auth: authEN,
    pricing: pricingTR,
    blog: blogTR,
    cms: cmsEN
  },
  "hu": {
    common: commonHU,
    auth: authEN,
    pricing: pricingEN,
    blog: blogHU,
    cms: cmsEN
  },
  "pl": {
    common: commonPL,
    auth: authEN,
    pricing: pricingEN,
    blog: blogPL,
    cms: cmsEN
  },
  "no": {
    common: commonNO,
    auth: authEN,
    pricing: pricingEN,
    blog: blogNO,
    cms: cmsEN
  },
  "el": {
    common: commonEL,
    auth: authEN,
    pricing: pricingEL,
    blog: blogEL,
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
    ns: ['common', 'auth', 'pricing', 'blog', 'cms', 'dashboard', 'editor', 'home'],
    
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

// Helper function to determine if a language is RTL
export const isRTL = (languageCode) => {
  // Only Arabic is RTL in our supported languages
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode);
};

// Helper function to change language with proper RTL handling
export const changeLanguage = async (lng) => {
  if (!lng) return false;
  
  try {
    // Store the selected language in localStorage for persistence
    localStorage.setItem('i18nextLng', lng);
    
    // Force refresh all i18next instances
    await i18n.changeLanguage(lng);
    
    // Update document attributes
    document.documentElement.lang = lng;
    const rtl = isRTL(lng);
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    
    // Update body classes for styling
    if (rtl) {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    } else {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    }
    
    // Create a custom event for other components to listen to
    const languageEvent = new CustomEvent('languageChanged', { 
      detail: { language: lng, isRTL: rtl } 
    });
    document.dispatchEvent(languageEvent);
    
    console.log(`Language successfully changed to: ${lng}`);
    
    // For empty translations, reload to ensure all namespaces are properly loaded
    // This helps when a language doesn't have all translation files
    if (Object.keys(i18n.getDataByLanguage(lng) || {}).length < 3) {
      console.log(`Limited translations available for ${lng}, reloading page`);
      window.location.reload();
      return true;
    }
    
    return true;
  } catch (error) {
    console.error('Error changing language:', error);
    
    // As a fallback, force a reload to make sure language changes properly
    window.location.reload();
    return false;
  }
};

// Export i18n instance
export default i18n;