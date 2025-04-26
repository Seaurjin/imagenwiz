import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Import from mock module
import { PRICE_IDS } from '../lib/stripe-mock.js';

// Import the direct translation helper
import { directTranslations, createTranslationHelper } from '../utils/directTranslation';

// Pricing plan base structure
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

const PricingDirect = () => {
  const { t, i18n } = useTranslation('pricing');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get current language for translations
  const currentLanguage = i18n.language || 'en';
  // We'll use the full language code (including region like zh-TW) instead of just the base language
  
  // Create a custom translation function that prioritizes specific languages
  const getText = (key, fallback = '') => {
    // Handle problematic languages directly
    if (currentLanguage === 'el') {
      const translation = directTranslations.el?.pricing?.[key];
      if (translation) return translation;
    } 
    else if (currentLanguage === 'tr') {
      const translation = directTranslations.tr?.pricing?.[key];
      if (translation) return translation;
    }
    else if (currentLanguage === 'sv') {
      const translation = directTranslations.sv?.pricing?.[key];
      if (translation) return translation;
    }
    else if (currentLanguage === 'zh-TW') {
      const translation = directTranslations['zh-TW']?.pricing?.[key];
      if (translation) return translation;
    }
    
    // For nested paths like "plans.free.name"
    if (key.includes('.')) {
      const segments = key.split('.');
      let current;
      
      // Handle problematic languages directly for nested paths
      if (currentLanguage === 'el') {
        current = directTranslations.el?.pricing;
      } 
      else if (currentLanguage === 'tr') {
        current = directTranslations.tr?.pricing;
      }
      else if (currentLanguage === 'sv') {
        current = directTranslations.sv?.pricing;
      }
      else if (currentLanguage === 'zh-TW') {
        current = directTranslations['zh-TW']?.pricing;
      }
      else {
        // Use standard helper for other languages
        return createTranslationHelper(currentLanguage, 'pricing')(key, fallback);
      }
      
      // Navigate through the path
      if (current) {
        for (const segment of segments) {
          if (!current || typeof current !== 'object') return fallback;
          current = current[segment];
          if (current === undefined) return fallback;
        }
        return current !== undefined ? current : fallback;
      }
    }
    
    // Fall back to standard helper for other languages/cases
    return createTranslationHelper(currentLanguage, 'pricing')(key, fallback);
  };
  
  // Also keep the base language for debugging
  const baseLanguage = currentLanguage.split('-')[0]; // Handle cases like 'en-US'
  
  // Enhanced debugging
  console.debug('===== TRANSLATION DEBUG START =====');
  console.debug('Current language (full):', currentLanguage);
  console.debug('Base language:', baseLanguage);
  
  // Direct title access with hardcoded translation fixes
  if (currentLanguage === 'el') {
    console.debug('DIRECT Greek title:', directTranslations.el?.pricing?.title);
    console.debug('DIRECT Greek subtitle:', directTranslations.el?.pricing?.subtitle);
    
    // HARDCODED FIX: Override the title and subtitle with known translations
    document.title = "Επιλέξτε το Πρόγραμμά Σας - iMagenWiz";
  } else if (currentLanguage === 'tr') {
    console.debug('DIRECT Turkish title:', directTranslations.tr?.pricing?.title);
    console.debug('DIRECT Turkish subtitle:', directTranslations.tr?.pricing?.subtitle);
    
    // HARDCODED FIX: Override the title and subtitle with known translations
    document.title = "Planınızı Seçin - iMagenWiz";
  } else if (currentLanguage === 'sv') {
    console.debug('DIRECT Swedish title:', directTranslations.sv?.pricing?.title);
    console.debug('DIRECT Swedish subtitle:', directTranslations.sv?.pricing?.subtitle);
    
    // HARDCODED FIX: Override the title and subtitle with known translations
    document.title = "Välj din plan - iMagenWiz";
  } else if (currentLanguage === 'zh-TW') {
    console.debug('DIRECT Chinese (Traditional) title:', directTranslations['zh-TW']?.pricing?.title);
    console.debug('DIRECT Chinese (Traditional) subtitle:', directTranslations['zh-TW']?.pricing?.subtitle);
    
    // HARDCODED FIX: Override the title and subtitle with known translations
    document.title = "選擇您的計劃 - iMagenWiz";
  }
  
  // Verify our custom getText function works
  console.debug('Custom getText for title:', getText('title', 'Default title'));
  console.debug('Custom getText for subtitle:', getText('subtitle', 'Default subtitle'));
  console.debug('===== TRANSLATION DEBUG END =====')
  
  // Function to handle purchase
  const handlePurchase = (planId) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/pricing', plan: planId } });
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      console.log('Purchase initiated for plan:', planId);
      setLoading(false);
      navigate('/checkout', { state: { plan: planId } });
    }, 1000);
  };
  
  // Create pricing plans with proper translations
  const pricingPlans = pricingPlansBase.map(plan => {
    const isYearly = yearlyBilling && plan.key !== 'free';
    
    // Get plan-specific translations
    const name = getText(`plans.${plan.key}.name`, plan.key);
    const description = getText(`plans.${plan.key}.description`, '');
    const features = getText(`plans.${plan.key}.features`, []);
    const notIncluded = getText(`plans.${plan.key}.notIncluded`, []);
    
    // Calculate price and credits based on billing cycle
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;
    const priceId = isYearly ? plan.yearlyPriceId : plan.monthlyPriceId;
    
    return {
      ...plan,
      name,
      description,
      price,
      credits,
      priceId,
      features: Array.isArray(features) ? features : [],
      notIncluded: Array.isArray(notIncluded) ? notIncluded : [],
      isYearly
    };
  });
  
  // Enhanced debugging logs
  console.log('Full current language:', currentLanguage);
  console.log('Base current language:', baseLanguage);
  console.log('Full language translation available:', directTranslations[currentLanguage]?.pricing ? 'Yes' : 'No');
  console.log('Base language translation available:', directTranslations[baseLanguage]?.pricing ? 'Yes' : 'No');
  console.log('Available translation languages:', Object.keys(directTranslations));
  
  // Check for all our targeted language translations
  console.log('Arabic pricing translation exists:', directTranslations.ar?.pricing ? 'Yes' : 'No');
  console.log('Korean pricing translation exists:', directTranslations.ko?.pricing ? 'Yes' : 'No');
  console.log('Vietnamese pricing translation exists:', directTranslations.vi?.pricing ? 'Yes' : 'No');
  console.log('Thai pricing translation exists:', directTranslations.th?.pricing ? 'Yes' : 'No');
  console.log('Portuguese pricing translation exists:', directTranslations.pt?.pricing ? 'Yes' : 'No');
  console.log('Greek pricing translation exists:', directTranslations.el?.pricing ? 'Yes' : 'No');
  console.log('Turkish pricing translation exists:', directTranslations.tr?.pricing ? 'Yes' : 'No');
  console.log('Swedish pricing translation exists:', directTranslations.sv?.pricing ? 'Yes' : 'No');
  console.log('Traditional Chinese pricing translation exists:', directTranslations['zh-TW']?.pricing ? 'Yes' : 'No');
  
  // Debug the pricing title for each language
  const languagesToCheck = ['ar', 'ko', 'vi', 'th', 'pt', 'el', 'tr', 'sv', 'zh-TW'];
  languagesToCheck.forEach(lang => {
    if (directTranslations[lang]?.pricing) {
      console.log(`${lang} pricing title:`, directTranslations[lang].pricing.title);
      console.log(`${lang} pricing plans:`, Object.keys(directTranslations[lang].pricing.plans || {}));
    } else {
      console.log(`${lang} pricing translation NOT FOUND`);
    }
  });
  
  // Debug the current language's title
  if (currentLanguage.includes('-') && directTranslations[currentLanguage]?.pricing) {
    console.log(`Full language (${currentLanguage}) pricing title:`, directTranslations[currentLanguage].pricing.title);
  } else if (directTranslations[baseLanguage]?.pricing) {
    console.log(`Base language (${baseLanguage}) pricing title:`, directTranslations[baseLanguage].pricing.title);
  }
  
  console.log('Plans with translations:', pricingPlans);
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            {currentLanguage === 'el' ? 'Επιλέξτε το Πρόγραμμά Σας' : 
             currentLanguage === 'tr' ? 'Planınızı Seçin' :
             currentLanguage === 'sv' ? 'Välj din plan' :
             currentLanguage === 'zh-TW' ? '選擇您的計劃' :
             getText('title', 'Choose Your Plan')}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {currentLanguage === 'el' ? 'Απλή τιμολόγηση για όλους' : 
             currentLanguage === 'tr' ? 'Herkes için basit fiyatlandırma' :
             currentLanguage === 'sv' ? 'Enkla priser för alla' :
             currentLanguage === 'zh-TW' ? '簡單的價格適合每個人' :
             getText('subtitle', 'Simple pricing for everyone')}
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex items-center space-x-3">
              <span className={`text-sm font-medium ${!yearlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                {currentLanguage === 'el' ? 'Μηνιαίο' : 
                 currentLanguage === 'tr' ? 'Aylık' :
                 currentLanguage === 'sv' ? 'Månadsvis' :
                 currentLanguage === 'zh-TW' ? '每月' :
                 getText('monthly', 'Monthly')}
              </span>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  yearlyBilling ? 'bg-amber-500' : 'bg-gray-200'
                }`}
                onClick={() => setYearlyBilling(!yearlyBilling)}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    yearlyBilling ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${yearlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                {currentLanguage === 'el' ? 'Ετήσιο' : 
                 currentLanguage === 'tr' ? 'Yıllık' :
                 currentLanguage === 'sv' ? 'Årsvis' :
                 currentLanguage === 'zh-TW' ? '每年' :
                 getText('yearly', 'Yearly')}
              </span>
              {yearlyBilling && (
                <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  {currentLanguage === 'el' ? 'Εξοικονομήστε 10%' : 
                   currentLanguage === 'tr' ? 'Yıllık faturalandırma ile %10 tasarruf edin' :
                   currentLanguage === 'sv' ? 'Spara 10% med årlig fakturering' :
                   currentLanguage === 'zh-TW' ? '年度帳單省 10%' :
                   getText('yearlyDiscount', 'Save with annual billing')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg shadow-lg divide-y divide-gray-200 ${
                plan.mostPopular ? 'border-2 border-amber-500' : 'border border-gray-200'
              }`}
            >
              {plan.mostPopular && (
                <div className="bg-amber-500 text-white text-center py-2 font-medium uppercase tracking-wide">
                  {getText('popular', 'Most Popular')}
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-medium text-gray-900">
                  {currentLanguage === 'el' && plan.key === 'free' ? 'Δωρεάν' :
                   currentLanguage === 'el' && plan.key === 'lite' ? 'Lite' :
                   currentLanguage === 'el' && plan.key === 'pro' ? 'Pro' :
                   currentLanguage === 'tr' && plan.key === 'free' ? 'Ücretsiz' :
                   currentLanguage === 'tr' && plan.key === 'lite' ? 'Lite' :
                   currentLanguage === 'tr' && plan.key === 'pro' ? 'Pro' :
                   currentLanguage === 'sv' && plan.key === 'free' ? 'Gratis' :
                   currentLanguage === 'sv' && plan.key === 'lite' ? 'Lite' :
                   currentLanguage === 'sv' && plan.key === 'pro' ? 'Pro' :
                   currentLanguage === 'zh-TW' && plan.key === 'free' ? '免費' :
                   currentLanguage === 'zh-TW' && plan.key === 'lite' ? '精簡版' :
                   currentLanguage === 'zh-TW' && plan.key === 'pro' ? '專業版' :
                   plan.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  {currentLanguage === 'el' && plan.key === 'free' ? 'Για άτομα που θέλουν να δοκιμάσουν την υπηρεσία μας' :
                   currentLanguage === 'el' && plan.key === 'lite' ? 'Για άτομα και μικρές ομάδες με τακτικές ανάγκες' :
                   currentLanguage === 'el' && plan.key === 'pro' ? 'Για επαγγελματίες και επιχειρήσεις με ανάγκες μεγάλου όγκου' :
                   currentLanguage === 'tr' && plan.key === 'free' ? 'Servisimizi denemek isteyen kişiler için' :
                   currentLanguage === 'tr' && plan.key === 'lite' ? 'Düzenli ihtiyaçları olan kişiler ve küçük ekipler için' :
                   currentLanguage === 'tr' && plan.key === 'pro' ? 'Yüksek hacimli ihtiyaçları olan profesyoneller ve işletmeler için' :
                   currentLanguage === 'sv' && plan.key === 'free' ? 'För privatpersoner som vill prova vår tjänst' :
                   currentLanguage === 'sv' && plan.key === 'lite' ? 'För privatpersoner och små team med regelbundna behov' :
                   currentLanguage === 'sv' && plan.key === 'pro' ? 'För proffs och företag med högvolymsbehov' :
                   currentLanguage === 'zh-TW' && plan.key === 'free' ? '適合想要試用我們服務的個人' :
                   currentLanguage === 'zh-TW' && plan.key === 'lite' ? '適合有定期需求的個人和小型團隊' :
                   currentLanguage === 'zh-TW' && plan.key === 'pro' ? '適合需要大量處理的專業人士和企業' :
                   plan.description}
                </p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                  <span className="text-base font-medium text-gray-500">
                    {plan.id === 'free' 
                      ? getText('forever', ' forever') 
                      : yearlyBilling 
                        ? getText('perYear', '/year') 
                        : getText('perMonth', '/month')}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {plan.credits} {getText('credits', 'credits')}
                </p>
              </div>

              <div className="pt-6 pb-8 px-6">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className={`h-5 w-5 ${plan.mostPopular ? 'text-amber-500' : 'text-teal-500'}`} />
                      </div>
                      <p className="ml-3 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                  {plan.notIncluded && plan.notIncluded.map((feature, index) => (
                    <li key={`not-${index}`} className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <XIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="ml-3 text-sm text-gray-400">{feature}</p>
                    </li>
                  ))}
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
                    {loading ? 'Processing...' : 
                     plan.id === 'free' && currentLanguage === 'el' ? 'Εγγραφή' :
                     plan.id === 'free' && currentLanguage === 'tr' ? 'Kaydol' : 
                     plan.id === 'free' && currentLanguage === 'sv' ? 'Registrera dig' :
                     plan.id === 'free' && currentLanguage === 'zh-TW' ? '註冊' :
                     plan.id !== 'free' && currentLanguage === 'el' ? 'Εγγραφή' :
                     plan.id !== 'free' && currentLanguage === 'tr' ? 'Abone Ol' :
                     plan.id !== 'free' && currentLanguage === 'sv' ? 'Prenumerera' :
                     plan.id !== 'free' && currentLanguage === 'zh-TW' ? '訂閱' :
                     plan.id === 'free' ? getText('signUp', 'Sign Up') : 
                     getText('subscribe', 'Subscribe')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900">{getText('moreInfoNeeded', 'Need more info?')}</h3>
          <p className="mt-2 text-gray-500">
            {getText('enterpriseText', 'Contact us for enterprise plans with higher volumes and additional features.')}
          </p>
          <a
            href="mailto:enterprise@imagenwiz.com"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
          >
            {getText('contactSales', 'Contact Sales')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PricingDirect;