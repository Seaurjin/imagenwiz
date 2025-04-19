import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Our components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import NotFound from './pages/NotFound';
import TermsOfService from './pages/legal/TermsOfService';
import GeneralTerms from './pages/legal/GeneralTerms';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import Contact from './pages/Contact';
import ApiComingSoon from './pages/ApiComingSoon';
import CMSDashboardPage from './pages/cms/CMSDashboardPage';
import BlogHomePage from './pages/blog/BlogHomePage';
import BlogPostPage from './pages/blog/BlogPostPage';

// Authentication context - simplified version
const AuthContext = React.createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
});

// Auth provider with simplified implementation
const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        return { success: true };
      } else {
        const error = await res.json();
        return { success: false, message: error.message };
      }
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Simplified pricing page
const PricingPage = () => {
  const { t } = useTranslation('pricing');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Simplified pricing plans
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

    alert('Payment processing is currently under maintenance. Please try again later.');
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
                        <svg className={`h-5 w-5 ${plan.mostPopular ? 'text-amber-500' : 'text-teal-500'}`} 
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-500">{feature}</p>
                    </li>
                  ))}
                  {plan.notIncluded.map((feature, index) => (
                    <li key={index} className="flex items-start opacity-50">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-gray-400" 
                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-400">{feature}</p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button
                    onClick={() => handlePurchase(plan.id)}
                    className={`w-full ${
                      plan.mostPopular 
                        ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500' 
                        : 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500'
                    } text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
                  >
                    {plan.id === 'free' ? t('signUp') : t('subscribe')}
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
const NoStripeApp = () => {
  const { i18n } = useTranslation();
  
  // Initialize i18n
  useEffect(() => {
    import('./i18n/i18n');
  }, []);
  
  // Set document language and direction on language change
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' || i18n.language === 'he' ? 'rtl' : 'ltr';
  }, [i18n.language]);
  
  // Force axios to use relative URLs to ensure proxy works correctly
  axios.defaults.baseURL = '';
  
  // Loading component for suspense fallback
  const Loader = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Suspense fallback={<Loader />}>
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<PricingPage />} />
              
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

// Import useState since we use it in PricingPage
const { useState, useNavigate } = window.React;

// Wrap the app with auth provider
const App = () => {
  return (
    <AuthProvider>
      <NoStripeApp />
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
