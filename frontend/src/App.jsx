import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DynamicHead from './components/DynamicHead';
import LangQuickSwitcher from './components/LangQuickSwitcher';
import DebugPanel from './components/DebugPanel';
import { Suspense, useEffect, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import ReactGA from 'react-ga4';

// Initialize i18n with helper functions
import './i18n/i18n';
import { isRTL } from './i18n/i18n';

const TRACKING_ID = "G-MRT4F2CSF1"; // Moved TRACKING_ID to module scope

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import HistoryDetailPage from './pages/HistoryDetailPage';
import Pricing from './pages/Pricing';
import PricingNew from './pages/PricingNew';
import PricingDirect from './pages/PricingDirect';
import PricingMultilingual from './pages/PricingMultilingual';
import CheckoutPage from './pages/CheckoutPage';
// Use PaymentVerifyPage as the primary page for payment verification
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentVerifyPage from './pages/PaymentVerifyPage';
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import CreditHistoryPage from './pages/CreditHistoryPage';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// CMS and Blog Pages
import CMSDashboardPage from './pages/cms/CMSDashboardPage';
import BlogHomePage from './pages/blog/BlogHomePage';
import BlogPostPage from './pages/blog/BlogPostPage';
import AdminSettings from './pages/AdminSettings';
import TranslationTool from './pages/admin/TranslationTool';

// Legal Pages
import TermsOfService from './pages/legal/TermsOfService';
import GeneralTerms from './pages/legal/GeneralTerms';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import RefundPolicy from './pages/legal/RefundPolicy';
import Contact from './pages/Contact';
import ApiComingSoon from './pages/ApiComingSoon';

// Info Pages (Footer Links)
import MagicBrush from './pages/info/MagicBrush';
import Individuals from './pages/info/Individuals';
import Photographers from './pages/info/Photographers';
import Help from './pages/info/Help';
import Marketing from './pages/info/Marketing';
import Developers from './pages/info/Developers';
import Ecommerce from './pages/info/Ecommerce';
import Media from './pages/info/Media';
import Enterprise from './pages/info/Enterprise';
import CarDealerships from './pages/info/CarDealerships';
import SuccessStories from './pages/info/SuccessStories';
import About from './pages/info/About';
import Press from './pages/info/Press';
import AutomaticDesigns from './pages/info/AutomaticDesigns';
import VideoBackgroundRemoval from './pages/info/VideoBackgroundRemoval';

// Admin Tools

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

// Component to handle scrolling to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Component to track page views
function TrackPageViews() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
  return null;
}

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
    
    // If we need to change language
    if (targetLang && targetLang !== i18n.language) {
      // Update localStorage if needed
      if (targetLang !== storedLang) {
        localStorage.setItem('i18nextLng', targetLang);
      }
      
      // Apply language change
      i18n.changeLanguage(targetLang)
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
  
  useEffect(() => {
    if (TRACKING_ID) {
      ReactGA.initialize(TRACKING_ID);
      // Send initial pageview - this might be redundant if TrackPageViews catches the initial load,
      // but safe to have for the very first load.
      ReactGA.send({ hitType: "pageview", page: window.location.pathname + window.location.search });
    }
  }, []);
  
  return (
    <Router>
      {/* Use the language code as a key to force remount when language changes */}
      <div className="flex flex-col min-h-screen" key={i18n.language}>
        {/* DynamicHead component to update favicon dynamically - outside Suspense for immediate loading */}
        <DynamicHead />
        <ScrollToTop />
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<Loader />}>
            <TrackPageViews />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<PricingMultilingual />} />
              <Route path="/pricing-direct" element={<PricingDirect />} />
              <Route path="/pricing-old" element={<PricingNew />} />
              <Route path="/pricing-legacy" element={<Pricing />} />
              
              {/* Legal pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/general-terms" element={<GeneralTerms />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              {/* Payment verification page is accessible without authentication 
                  to handle redirects from Stripe after checkout */}
              <Route path="/payment-verify" element={<PaymentVerifyPage />} />
              
              {/* Legacy route for backward compatibility - redirects to the new path */}
              <Route path="/order-confirmation" element={<Navigate to="/payment-verify" replace state={{ fromLegacyRoute: true }} />} />
              
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
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-history"
                element={
                  <ProtectedRoute>
                    <PaymentHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/credit-history"
                element={
                  <ProtectedRoute>
                    <CreditHistoryPage />
                  </ProtectedRoute>
                }
              />
              
              {/* CMS routes */}
              <Route path="/cms/*" element={
                <ProtectedRoute>
                  <CMSDashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              <Route path="/admin/translations" element={
                <ProtectedRoute>
                  <TranslationTool />
                </ProtectedRoute>
              } />
              
              {/* Blog routes */}
              <Route path="/blog" element={<BlogHomePage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/blog/tag/:tag" element={<BlogHomePage />} />
              
              {/* API Coming Soon page */}
              <Route path="/api" element={<ApiComingSoon />} />
              
              {/* Footer info pages */}
              <Route path="/magic-brush" element={<MagicBrush />} />
              <Route path="/individuals" element={<Individuals />} />
              <Route path="/photographers" element={<Photographers />} />
              <Route path="/help" element={<Help />} />
              <Route path="/marketing" element={<Marketing />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/ecommerce" element={<Ecommerce />} />
              <Route path="/media" element={<Media />} />
              <Route path="/enterprise" element={<Enterprise />} />
              <Route path="/car-dealerships" element={<CarDealerships />} />
              <Route path="/success-stories" element={<SuccessStories />} />
              <Route path="/about" element={<About />} />
              <Route path="/press" element={<Press />} />
              <Route path="/automatic-designs" element={<AutomaticDesigns />} />
              <Route path="/video-background-removal" element={<VideoBackgroundRemoval />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        {/* Debug panel only visible in development mode */}
        <DebugPanel />
      </div>
    </Router>
  );
};

// Wrap the app with auth provider, user provider, and site settings provider
const App = () => {
  return (
    <AuthProvider>
      <UserProvider>
        <SiteSettingsProvider>
          <AppContent />
        </SiteSettingsProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;