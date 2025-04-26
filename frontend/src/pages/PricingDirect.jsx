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
  const baseLanguage = currentLanguage.split('-')[0]; // Handle cases like 'en-US'
  
  // Create a translation helper bound to the current language and pricing namespace
  const getText = createTranslationHelper(baseLanguage, 'pricing');
  
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
  console.log('Current language:', baseLanguage);
  console.log('Translation data available:', directTranslations[baseLanguage]?.pricing ? 'Yes' : 'No');
  console.log('Available translation languages:', Object.keys(directTranslations));
  
  // Check for all our targeted language translations
  console.log('Arabic pricing translation exists:', directTranslations.ar?.pricing ? 'Yes' : 'No');
  console.log('Korean pricing translation exists:', directTranslations.ko?.pricing ? 'Yes' : 'No');
  console.log('Vietnamese pricing translation exists:', directTranslations.vi?.pricing ? 'Yes' : 'No');
  console.log('Thai pricing translation exists:', directTranslations.th?.pricing ? 'Yes' : 'No');
  console.log('Portuguese pricing translation exists:', directTranslations.pt?.pricing ? 'Yes' : 'No');
  
  // Debug the pricing title for each language
  const languagesToCheck = ['ar', 'ko', 'vi', 'th', 'pt'];
  languagesToCheck.forEach(lang => {
    if (directTranslations[lang]?.pricing) {
      console.log(`${lang} pricing title:`, directTranslations[lang].pricing.title);
      console.log(`${lang} pricing plans:`, Object.keys(directTranslations[lang].pricing.plans || {}));
    }
  });
  
  // Debug the current language's title
  if (directTranslations[baseLanguage]?.pricing) {
    console.log(`Current language (${baseLanguage}) pricing title:`, directTranslations[baseLanguage].pricing.title);
  }
  
  console.log('Plans with translations:', pricingPlans);
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight lg:text-5xl">
            {getText('title', 'Choose Your Plan')}
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            {getText('subtitle', 'Simple pricing for everyone')}
          </p>
          
          {/* Billing toggle */}
          <div className="mt-8 flex justify-center">
            <div className="relative flex items-center space-x-3">
              <span className={`text-sm font-medium ${!yearlyBilling ? 'text-gray-900' : 'text-gray-500'}`}>
                {getText('monthly', 'Monthly')}
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
                {getText('yearly', 'Yearly')}
              </span>
              {yearlyBilling && (
                <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  {getText('yearlyDiscount', 'Save with annual billing')}
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
                <h2 className="text-2xl font-medium text-gray-900">{plan.name}</h2>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
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
                    {loading ? 'Processing...' : plan.id === 'free' 
                      ? getText('signUp', 'Sign Up') 
                      : getText('subscribe', 'Subscribe')}
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