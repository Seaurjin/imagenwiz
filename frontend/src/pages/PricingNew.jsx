import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import from mock module
import { PRICE_IDS } from '../lib/stripe-mock.js';

// Import direct translations for easier debugging
import enPricing from '../i18n/locales/en/pricing.json';
import dePricing from '../i18n/locales/de/pricing.json';
import esPricing from '../i18n/locales/es/pricing.json';
import frPricing from '../i18n/locales/fr/pricing.json';
import jaPricing from '../i18n/locales/ja/pricing.json';
import ruPricing from '../i18n/locales/ru/pricing.json';

// Static translations map for direct access (fallback mechanism)
const directTranslations = {
  en: enPricing,
  de: dePricing,
  es: esPricing,
  fr: frPricing,
  ja: jaPricing,
  ru: ruPricing
};

// Pricing plan base structure - display values come from translation files
const pricingPlansBase = [
  {
    id: 'free',
    key: 'free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: 3,
    yearlyCredits: 3,
    mostPopular: false,
  },
  {
    id: 'lite_monthly',
    idYearly: 'lite_yearly',
    key: 'lite',
    monthlyPrice: 9.9,
    yearlyPrice: 106.8,
    monthlyCredits: 50,
    yearlyCredits: 600,
    monthlyPriceId: PRICE_IDS.LITE_MONTHLY,
    yearlyPriceId: PRICE_IDS.LITE_YEARLY,
    mostPopular: true,
  },
  {
    id: 'pro_monthly',
    idYearly: 'pro_yearly',
    key: 'pro',
    monthlyPrice: 24.9,
    yearlyPrice: 262.8,
    monthlyCredits: 250,
    yearlyCredits: 3000,
    monthlyPriceId: PRICE_IDS.PRO_MONTHLY,
    yearlyPriceId: PRICE_IDS.PRO_YEARLY,
    mostPopular: false,
  },
];

const PricingNew = () => {
  const { t, i18n } = useTranslation('pricing');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translationData, setTranslationData] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get current language for currency formatting
  const currentLanguage = i18n.language || 'en';
  const baseLanguage = currentLanguage.split('-')[0]; // Handle cases like 'en-US' by getting the base language
  
  // Effect to get the appropriate translation data when language changes
  useEffect(() => {
    // First try to get the translations from i18n system
    try {
      // Force i18n to load the new translations
      i18n.loadNamespaces('pricing').then(() => {
        console.log(`Loaded pricing namespace for language: ${i18n.language}`);
      });
      
      // Check if we have direct access to the translations
      const directLanguage = baseLanguage in directTranslations ? baseLanguage : 'en';
      const translations = directTranslations[directLanguage];
      
      console.log(`Loading direct translations for ${directLanguage}:`, 
        translations ? "Found" : "Not found");
      console.log(`Current i18n language: ${i18n.language}, base language: ${baseLanguage}`);
      
      // Show available translation keys for debugging
      if (translations) {
        console.log("Available translation keys:", Object.keys(translations).join(", "));
        if (translations.plans) {
          console.log("Plans translation keys:", Object.keys(translations.plans).join(", "));
          
          // Debug for free plan
          if (translations.plans.free) {
            console.log("Free plan translations available:", Object.keys(translations.plans.free).join(", "));
            console.log("Free plan name:", translations.plans.free.name);
            console.log("Free plan description:", translations.plans.free.description);
          } else {
            console.log("Free plan translations NOT available");
          }
        }
        
        setTranslationData(translations);
      } else {
        // Fallback to English if the language is not available
        console.log("No direct translations found, using English as fallback");
        setTranslationData(directTranslations.en);
      }
    } catch (error) {
      console.error("Error loading translations:", error);
      // Always have a fallback
      setTranslationData(directTranslations.en);
    }
  }, [currentLanguage, baseLanguage]);
  
  // Debug: Log current language and check if pricing translations exist
  console.log("PricingNew - Current language:", currentLanguage);
  console.log("PricingNew - Using direct translations:", translationData ? "Yes" : "No");
  
  // Helper function to get a value from translation data
  const getTrans = (path, defaultValue = '') => {
    if (!translationData) return defaultValue;
    
    // For debugging purposes
    console.log(`Trying to get translation for path: ${path}`);
    
    // Split the path into parts
    const parts = path.split('.');
    let current = translationData;
    
    // Navigate through the object
    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        console.log(`Path part "${part}" not found in current object:`, current);
        return defaultValue;
      }
    }
    
    if (current === undefined || current === null) {
      console.log(`Translation for ${path} is undefined or null`);
      return defaultValue;
    }
    
    console.log(`Found translation for ${path}:`, current);
    return current;
  };

  // Create translated pricing plans by combining the base structure with translations
  const pricingPlans = pricingPlansBase.map(plan => {
    // Get the translated content from both i18n system and direct translations
    const translatedPlan = {
      ...plan,
      // Try direct translations first, then fall back to i18n
      name: getTrans(`plans.${plan.key}.name`, t(`plans.${plan.key}.name`)),
      description: getTrans(`plans.${plan.key}.description`, t(`plans.${plan.key}.description`)),
    };
    
    try {
      // Get features using direct translations object access
      if (translationData && 
          translationData.plans && 
          translationData.plans[plan.key] && 
          Array.isArray(translationData.plans[plan.key].features)) {
        // Use direct access
        translatedPlan.features = translationData.plans[plan.key].features;
        console.log(`Using direct translations for ${plan.key} features:`, translatedPlan.features);
      } else {
        // Fall back to i18n
        const featuresKey = `plans.${plan.key}.features`;
        const featuresObj = t(featuresKey, { returnObjects: true }) || [];
        
        // Debug log the features object
        console.log(`Fallback: Features for ${plan.key} in ${currentLanguage}:`, featuresObj);
        
        // Check if we got an array or an object with indices
        if (typeof featuresObj === 'object' && !Array.isArray(featuresObj)) {
          // Handle case where i18next returns object with numeric keys instead of array
          const featuresArray = Object.keys(featuresObj)
            .sort()
            .map(key => featuresObj[key])
            .filter(Boolean);
          translatedPlan.features = featuresArray;
        } else {
          translatedPlan.features = Array.isArray(featuresObj) ? featuresObj : [];
        }
      }
      
      // Add not included features based on plan type
      if (plan.key === 'free' || plan.key === 'lite') {
        // Check direct translations first
        if (translationData && 
            translationData.plans && 
            translationData.plans[plan.key] && 
            Array.isArray(translationData.plans[plan.key].notIncluded)) {
          // Use direct access
          translatedPlan.notIncluded = translationData.plans[plan.key].notIncluded;
          console.log(`Using direct translations for ${plan.key} notIncluded:`, translatedPlan.notIncluded);
        } else {
          // Fall back to i18n
          const notIncludedKey = `plans.${plan.key}.notIncluded`;
          const notIncludedTranslation = t(notIncludedKey, { returnObjects: true });
          
          console.log(`Fallback: NotIncluded for ${plan.key} in ${currentLanguage}:`, notIncludedTranslation);
          
          if (typeof notIncludedTranslation === 'object' && !Array.isArray(notIncludedTranslation)) {
            // Handle case where i18next returns object with numeric keys instead of array
            const notIncludedArray = Object.keys(notIncludedTranslation)
              .sort()
              .map(key => notIncludedTranslation[key])
              .filter(Boolean);
            translatedPlan.notIncluded = notIncludedArray;
          }
          else if (Array.isArray(notIncludedTranslation) && notIncludedTranslation.length > 0) {
            translatedPlan.notIncluded = notIncludedTranslation;
          } else {
            // Fallback text
            const notIncludedText = getTrans('notIncluded', t('notIncluded'));
            // Fallback for plans without explicit notIncluded in translation
            translatedPlan.notIncluded = plan.key === 'free' ? 
              [notIncludedText, notIncludedText, notIncludedText, notIncludedText] : 
              [notIncludedText, notIncludedText];
          }
        }
      } else {
        translatedPlan.notIncluded = [];
      }
    } catch (error) {
      console.error(`Error translating plan ${plan.key}:`, error);
      // Fallback to empty arrays if translation fails
      translatedPlan.features = [];
      translatedPlan.notIncluded = [];
    }
    
    return translatedPlan;
  });

  const handleBillingToggle = () => {
    setYearlyBilling(!yearlyBilling);
  };

  const handlePurchase = (planId) => {
    if (planId === 'free') {
      if (!isAuthenticated) {
        navigate('/register');
        return;
      } else {
        navigate('/dashboard');
        return;
      }
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simplified success message
    alert('In this version, payment processing has been simplified. In the production version, you would be redirected to Stripe Checkout.');
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            {getTrans('title', t('title'))}
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-3xl mx-auto">
            {getTrans('subtitle', t('subtitle'))}
          </p>
          
          {/* Billing toggle */}
          <div className="mt-12 flex justify-center">
            <div className="relative bg-gray-100 rounded-full p-1.5 flex shadow-md">
              <button
                type="button"
                className={`${
                  !yearlyBilling ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-500'
                } relative py-2.5 px-8 border-transparent rounded-full text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-all`}
                onClick={handleBillingToggle}
              >
                {getTrans('monthly', t('monthly'))}
              </button>
              <button
                type="button"
                className={`${
                  yearlyBilling ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-500'
                } ml-0.5 relative py-2.5 px-8 border-transparent rounded-full text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-all`}
                onClick={handleBillingToggle}
              >
                <span className="flex items-center gap-2">
                  {getTrans('yearly', t('yearly'))} 
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-gray-800">
                    {getTrans('yearlyDiscount', t('yearlyDiscount'))}
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 lg:max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.mostPopular ? 'ring-2 ring-amber-500' : ''
              } transition-all hover:shadow-xl`}
            >
              {plan.mostPopular && (
                <div className="bg-amber-500 rounded-t-lg py-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white text-center">
                    {getTrans('popular', t('popular'))}
                  </p>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl leading-6 font-bold text-gray-900">
                  {getTrans(`plans.${plan.key}.name`, t(`plans.${plan.key}.name`, { defaultValue: plan.name }))}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {getTrans(`plans.${plan.key}.description`, t(`plans.${plan.key}.description`, { defaultValue: plan.description }))}
                </p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {yearlyBilling 
                      ? getTrans(`plans.${plan.key}.priceYearly`, t(`plans.${plan.key}.priceYearly`, { defaultValue: plan.yearlyPrice.toString() })) 
                      : getTrans(`plans.${plan.key}.priceMonthly`, t(`plans.${plan.key}.priceMonthly`, { defaultValue: plan.monthlyPrice.toString() }))
                    }
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {yearlyBilling ? getTrans('perYear', t('perYear')) : getTrans('perMonth', t('perMonth'))}
                  </span>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-800">
                    {yearlyBilling 
                      ? getTrans(`plans.${plan.key}.creditsYearly`, t(`plans.${plan.key}.creditsYearly`, { defaultValue: plan.yearlyCredits.toString() })) 
                      : getTrans(`plans.${plan.key}.creditsMonthly`, t(`plans.${plan.key}.creditsMonthly`, { defaultValue: plan.monthlyCredits.toString() }))
                    }
                  </span> {getTrans('credits', t('credits'))}
                </p>
              </div>

              <div className="pt-6 pb-8 px-6">
                <ul className="space-y-4">
                  {(() => {
                    // Debug log to see what's in the features array
                    console.log(`FEATURE DEBUG: plan.key = ${plan.key}, features =`, plan.features);
                    if (translationData && translationData.plans && translationData.plans[plan.key]) {
                      console.log(`FEATURE DEBUG: Translation for ${plan.key} features =`, 
                          translationData.plans[plan.key].features);
                    }
                    
                    // Directly get the features from translations
                    let displayFeatures = [];
                    if (translationData && 
                        translationData.plans && 
                        translationData.plans[plan.key] && 
                        Array.isArray(translationData.plans[plan.key].features)) {
                      displayFeatures = translationData.plans[plan.key].features;
                      console.log(`FEATURE DEBUG: Using direct translations for features: ${displayFeatures}`);
                    } else {
                      // Fallback to plan.features with translation attempt
                      displayFeatures = plan.features || [];
                      console.log(`FEATURE DEBUG: Falling back to plan.features: ${displayFeatures}`);
                    }
                    
                    return displayFeatures.map((feature, index) => {
                      // Try to get the feature from translation files as fallback
                      const featureKey = `plans.${plan.key}.features.${index}`;
                      const translatedFeature = getTrans(featureKey, t(featureKey, { defaultValue: feature }));
                      console.log(`FEATURE DEBUG: For feature ${index}, using: ${translatedFeature}`);
                      
                      return (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0">
                            <CheckIcon className={`h-5 w-5 ${plan.mostPopular ? 'text-amber-500' : 'text-teal-500'}`} />
                          </div>
                          <p className="ml-3 text-sm text-gray-500">{translatedFeature}</p>
                        </li>
                      );
                    });
                  })()}
                  {(() => {
                    // Debug log for notIncluded features
                    console.log(`NOT INCLUDED DEBUG: plan.key = ${plan.key}, notIncluded =`, plan.notIncluded);
                    if (translationData && translationData.plans && translationData.plans[plan.key]) {
                      console.log(`NOT INCLUDED DEBUG: Translation for ${plan.key} notIncluded =`, 
                          translationData.plans[plan.key].notIncluded);
                    }
                    
                    // Directly get the notIncluded from translations
                    let displayNotIncluded = [];
                    if (translationData && 
                        translationData.plans && 
                        translationData.plans[plan.key] && 
                        Array.isArray(translationData.plans[plan.key].notIncluded)) {
                      displayNotIncluded = translationData.plans[plan.key].notIncluded;
                      console.log(`NOT INCLUDED DEBUG: Using direct translations for notIncluded: ${displayNotIncluded}`);
                    } else {
                      // Fallback to plan.notIncluded with translation attempt
                      displayNotIncluded = plan.notIncluded || [];
                      console.log(`NOT INCLUDED DEBUG: Falling back to plan.notIncluded: ${displayNotIncluded}`);
                    }
                    
                    return displayNotIncluded.map((feature, index) => {
                      // Try to get the feature from translation files as fallback
                      const featureKey = `plans.${plan.key}.notIncluded.${index}`;
                      const translatedFeature = getTrans(featureKey, t(featureKey, { defaultValue: feature }));
                      console.log(`NOT INCLUDED DEBUG: For feature ${index}, using: ${translatedFeature}`);
                      
                      return (
                        <li key={index} className="flex items-start opacity-50">
                          <div className="flex-shrink-0">
                            <XIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <p className="ml-3 text-sm text-gray-400">{translatedFeature}</p>
                        </li>
                      );
                    });
                  })()}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handlePurchase(plan.id)}
                    disabled={loading}
                    className={`w-full ${
                      plan.mostPopular 
                        ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500' 
                        : 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500'
                    } text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Processing...' : plan.id === 'free' ? getTrans('signUp', t('signUp')) : getTrans('subscribe', t('subscribe'))}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900">{getTrans('moreInfoNeeded', t('moreInfoNeeded'))}</h3>
          <p className="mt-2 text-gray-500">
            {getTrans('enterpriseText', t('enterpriseText'))}
          </p>
          <a
            href="mailto:enterprise@imagenwiz.com"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
          >
            {getTrans('contactSales', t('contactSales'))}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingNew;
