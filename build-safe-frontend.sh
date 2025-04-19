#!/bin/bash

echo "Building frontend without Stripe dependencies..."

# Create a temporary stripped-down version of PricingNew.jsx
cat > ./frontend/src/pages/SimplePricingPage.jsx << 'EOF'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

    // Show informational message instead of proceeding to checkout
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
                    {t('popular')}
                  </p>
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl leading-6 font-bold text-gray-900">
                  {plan.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
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
                  {plan.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-start opacity-50">
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
                    {loading ? 'Processing...' : plan.id === 'free' ? t('signUp') : t('subscribe')}
                  </button>
                </div>
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
EOF

# Create modified no-stripe-app.jsx that uses SimplePricingPage
cat > ./frontend/src/no-stripe-app-temp.jsx << 'EOF'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Initialize i18n with helper functions
import './i18n/i18n';
import { isRTL } from './i18n/i18n';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import SimplePricingPage from './pages/SimplePricingPage';
import NotFound from './pages/NotFound';

// CMS and Blog Pages
import CMSDashboardPage from './pages/cms/CMSDashboardPage';
import BlogHomePage from './pages/blog/BlogHomePage';
import BlogPostPage from './pages/blog/BlogPostPage';

// Legal Pages
import TermsOfService from './pages/legal/TermsOfService';
import GeneralTerms from './pages/legal/GeneralTerms';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import Contact from './pages/Contact';
import ApiComingSoon from './pages/ApiComingSoon';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Main App component
const AppContent = () => {
  const { i18n } = useTranslation();
  
  // Check for language in localStorage and URL on mount
  useEffect(() => {
    // Read localStorage directly to avoid cached values
    const storedLang = localStorage.getItem('i18nextLng');
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    // URL parameter takes precedence over localStorage
    const targetLang = langParam || storedLang || 'en';
    
    console.log(`App initialization - storedLang: ${storedLang}, URL lang: ${langParam}, current i18n: ${i18n.language}`);
    
    // If we need to change language
    if (targetLang && targetLang !== i18n.language) {
      console.log(`Language mismatch detected, changing to: ${targetLang}`);
      
      // Update localStorage if needed
      if (targetLang !== storedLang) {
        localStorage.setItem('i18nextLng', targetLang);
      }
      
      // Apply language change
      i18n.changeLanguage(targetLang)
        .then(() => console.log(`Successfully changed language to ${targetLang}`))
        .catch(err => console.error(`Error changing language to ${targetLang}:`, err));
      
      // Clean up URL if it had a lang parameter
      if (langParam) {
        urlParams.delete('lang');
        const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, []);
  
  // Set document language and direction on language change
  useEffect(() => {
    // Set the document language attribute
    document.documentElement.lang = i18n.language;
    
    // Use the imported isRTL helper for consistent RTL detection
    const rtl = isRTL(i18n.language);
    
    // Set the document direction attribute
    document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    
    // Add a global CSS class to the body for easier RTL/LTR styling
    if (rtl) {
      document.body.classList.add('rtl-layout');
      document.body.classList.remove('ltr-layout');
    } else {
      document.body.classList.add('ltr-layout');
      document.body.classList.remove('rtl-layout');
    }
    
    console.log(`App.jsx: Set language to ${i18n.language}, direction: ${rtl ? 'rtl' : 'ltr'}`);
    
    // Add a global stylesheet for RTL/LTR fixes
    let styleEl = document.getElementById('direction-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'direction-style';
      document.head.appendChild(styleEl);
    }
    
    // Add important override styles for CMS editors
    styleEl.textContent = `
      /* Global direction styles */
      html[dir="ltr"] .force-ltr {
        direction: ltr !important;
        text-align: left !important;
      }
      html[dir="rtl"] .force-rtl {
        direction: rtl !important;
        text-align: right !important;
      }
      /* Override for CMS editor containers */
      .ltr-text {
        direction: ltr !important;
        text-align: left !important;
        unicode-bidi: isolate !important;
      }
      .rtl-text {
        direction: rtl !important;
        text-align: right !important;
        unicode-bidi: isolate !important;
      }
      /* Isolate CMS editor from global direction */
      .editor-content[contenteditable="true"] {
        unicode-bidi: isolate;
      }
    `;
    
    // Log language changes for debugging
    console.log(`Language changed to: ${i18n.language}, direction: ${document.documentElement.dir}`);
  }, [i18n.language]);
  
  // Loading component for suspense fallback
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  return (
    <Router>
      {/* Use the language code as a key to force remount when language changes */}
      <div className="flex flex-col min-h-screen" key={i18n.language}>
        <Suspense fallback={<Loader />}>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<SimplePricingPage />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/general-terms" element={<GeneralTerms />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history/:id"
                element={
                  <ProtectedRoute>
                    <HistoryDetailPage />
                  </ProtectedRoute>
                }
              />
              
              {/* CMS routes */}
              <Route path="/cms/*" element={
                <ProtectedRoute>
                  <CMSDashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Blog routes */}
              <Route path="/blog" element={<BlogHomePage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog/tag/:tag" element={<BlogHomePage />} />
              
              {/* API Coming Soon page */}
              <Route path="/api" element={<ApiComingSoon />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </Suspense>
      </div>
    </Router>
  );
};

// Wrap the app with auth provider
const NoStripeApp = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default NoStripeApp;
EOF

# Create a new main.jsx file that uses NoStripeApp
cat > ./frontend/src/main-safe.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import NoStripeApp from './no-stripe-app-temp';
import './index.css';

// Force axios to use relative URLs to ensure proxy works correctly
axios.defaults.baseURL = '';

// Add request interceptor to catch any direct backend access attempts
axios.interceptors.request.use(
  (config) => {
    console.log(`📡 DEBUG: Axios sending request to: ${config.url}`);
    
    // Catch direct attempts to use backend endpoints without /api prefix
    if (config.url) {
      // Important fix: Make sure /api/payment/create-checkout-session stays as is
      if (config.url === '/api/payment/create-checkout-session') {
        console.log(`✅ CORRECT URL: Using proper endpoint ${config.url}`);
      }
      // Handle direct /payment/create-checkout endpoint (without -session)
      else if (config.url === '/payment/create-checkout') {
        console.error(`⚠️ INTERCEPTED: Incorrect checkout endpoint ${config.url}`);
        // Fix the URL to use the proper endpoint name and API prefix
        config.url = `/api/payment/create-checkout-session`;
        console.log(`✅ FIXED: Automatically corrected URL to ${config.url}`);
      }
      // Handle direct /payment/... endpoints without /api prefix
      else if (config.url.startsWith('/payment/')) {
        console.error(`⚠️ INTERCEPTED: Attempted direct backend access to ${config.url}`);
        // Fix the URL to use the proper API prefix
        config.url = `/api${config.url}`;
        console.log(`✅ FIXED: Automatically corrected URL to ${config.url}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

console.log('🔒 Safe entry point: Using NoStripeApp to avoid Stripe-related errors');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NoStripeApp />
  </React.StrictMode>
);
EOF

# Replace the main.jsx with our safe version
cp ./frontend/src/main-safe.jsx ./frontend/src/main.jsx

# Build the frontend
echo "Running NPM build with modified files..."
npm run build

# Reset the original main.jsx if the build succeeds
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
  cp ./frontend/src/no-stripe-app-temp.jsx ./frontend/src/no-stripe-app.jsx
else
  echo "Build failed, check the error messages above."
  exit 1
fi

echo "Safe frontend build completed!"