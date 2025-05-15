import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';

// Import from safe module instead of Stripe
import { PRICE_IDS } from '../lib/safe-stripe-ids';

// Simplified plans without Stripe dependencies
const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'For individuals wanting to try out our service',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyCredits: 3,
    yearlyCredits: 3,
    features: [
      '3 free credits per month',
      'Standard quality processing',
      'Web-based editor',
      'JPG and PNG downloads',
    ],
    notIncluded: [
      'Priority processing',
      'Bulk processing',
      'Advanced editing tools',
      'API access',
    ],
    mostPopular: false,
  },
  {
    id: 'lite_monthly',
    idYearly: 'lite_yearly',
    name: 'Lite',
    description: 'For individuals and small teams with regular needs',
    monthlyPrice: 9.9,
    yearlyPrice: 106.8,
    monthlyCredits: 50,
    yearlyCredits: 600,
    monthlyPriceId: PRICE_IDS.LITE_MONTHLY,
    yearlyPriceId: PRICE_IDS.LITE_YEARLY,
    features: [
      '50 credits per month',
      'High quality processing',
      'Web-based editor',
      'Support for all common formats',
      'Bulk processing up to 10 images',
      'Prioritized processing',
    ],
    notIncluded: [
      'Full batch processing',
      'API access',
    ],
    mostPopular: true,
  },
  {
    id: 'pro_monthly',
    idYearly: 'pro_yearly',
    name: 'Pro',
    description: 'For professionals and businesses with high-volume needs',
    monthlyPrice: 24.9,
    yearlyPrice: 262.8,
    monthlyCredits: 250,
    yearlyCredits: 3000,
    monthlyPriceId: PRICE_IDS.PRO_MONTHLY,
    yearlyPriceId: PRICE_IDS.PRO_YEARLY,
    features: [
      '250 credits per month',
      'Premium quality processing',
      'Advanced editing tools',
      'All format support, including TIFF',
      'Bulk processing up to 50 images',
      'API access',
      'Top-tier prioritized processing',
    ],
    notIncluded: [],
    mostPopular: false,
  },
];

const SimplePricingPage = () => {
  const { t } = useTranslation('pricing');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Track viewing of pricing plans
  useEffect(() => {
    ReactGA.event({
      category: 'ecommerce',
      action: 'view_item_list',
      label: 'Pricing Page Displayed',
      // GA4 E-commerce parameters for view_item_list
      items: pricingPlans.map(plan => ({
        item_id: plan.id,
        item_name: plan.name,
        price: yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice,
        item_category: 'Subscription Plan'
      }))
    });
  }, [yearlyBilling]); // Re-send if billing period changes, as prices change

  const handleBillingToggle = () => {
    setYearlyBilling(!yearlyBilling);
  };

  const handlePurchase = (planId) => {
    const plan = pricingPlans.find(p => p.id === planId);
    if (!plan) return;

    const itemDetails = {
      item_id: plan.id,
      item_name: plan.name,
      price: yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice,
      currency: 'USD', // Assuming USD, make dynamic if needed
      quantity: 1
    };

    // Track add_to_cart event
    ReactGA.event({
      category: 'ecommerce',
      action: 'add_to_cart',
      label: `Add to Cart - ${plan.name}`,
      // GA4 E-commerce parameters
      currency: 'USD',
      value: itemDetails.price,
      items: [itemDetails]
    });

    // For non-free plans, also track begin_checkout before the alert/redirect
    if (plan.id !== 'free') {
      ReactGA.event({
        category: 'ecommerce',
        action: 'begin_checkout',
        label: `Begin Checkout - ${plan.name}`,
        // GA4 E-commerce parameters
        currency: 'USD',
        value: itemDetails.price,
        items: [itemDetails]
      });
    }

    // Existing logic from SimplePricingPage
    if (plan.id === 'free') {
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

    alert('Checkout functionality is not available in this simplified version.');
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-5 text-xl text-gray-500 max-w-3xl mx-auto">
            {t('subtitle')}
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
                {t('monthly')}
              </button>
              <button
                type="button"
                className={`${
                  yearlyBilling ? 'bg-white text-gray-800 shadow-sm' : 'bg-transparent text-gray-500'
                } ml-0.5 relative py-2.5 px-8 border-transparent rounded-full text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 transition-all`}
                onClick={handleBillingToggle}
              >
                <span className="flex items-center gap-2">
                  {t('yearly')} 
                  <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-gray-800">
                    {t('yearlyDiscount')}
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

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 lg:max-w-7xl mx-auto items-stretch">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg ${
                plan.mostPopular ? 'ring-2 ring-amber-500' : ''
              } transition-all hover:shadow-xl flex flex-col h-full relative`}
            >
              {plan.mostPopular ? (
                <div className="bg-amber-500 rounded-t-lg py-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white text-center">
                    {t('popular')}
                  </p>
                </div>
              ) : (
                <div className="h-7 rounded-t-lg">
                  {/* This div now has an explicit height matching the calculated height of the popular banner */}
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl leading-6 font-bold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500 h-12">
                  {plan.description}
                </p>
                <p className="mt-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${yearlyBilling ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-base font-medium text-gray-500">
                    {yearlyBilling ? t('perYear') : t('perMonth')}
                  </span>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  <span className="font-medium text-gray-800">
                    {yearlyBilling ? plan.yearlyCredits : plan.monthlyCredits} 
                  </span> {t('credits')}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6 px-6 pb-24">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">{t('whatsIncluded', "What's included:")}</h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <CheckIcon className="h-5 w-5 text-green-500" />
                      </div>
                      <p className="ml-3 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <XIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="ml-3 text-sm text-gray-400">{feature}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Absolute positioned button container at the bottom of the card */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={loading}
                  className={`w-full ${
                    plan.mostPopular 
                      ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500' 
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
                  } text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Processing...' : plan.id === 'free' ? t('getStarted') : t('subscribe')}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium text-gray-900">{t('moreInfoNeeded')}</h3>
          <p className="mt-2 text-gray-500">
            {t('enterpriseText')}
          </p>
          <a
            href="mailto:enterprise@imagenwiz.com"
            className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-teal-600 bg-white hover:bg-teal-50"
          >
            {t('contactSales')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default SimplePricingPage;
