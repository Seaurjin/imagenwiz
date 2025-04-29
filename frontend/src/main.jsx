import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import './index.css';
import './languageSelector.css';
import './removeLanguageSelector';
import './navbarLanguageDebug';
import './fixLanguageSelectorClick';

// Add specific script to ensure navbar language selector visibility
document.addEventListener('DOMContentLoaded', function() {
  // Force navbar language selector to be visible
  const forceNavbarLanguageSelectorVisible = () => {
    const navSelectors = [
      'nav .sm\\:flex.sm\\:items-center .relative',
      'nav .relative:has(button[aria-label*="language"])',
      '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative',
      '.space-x-4 > .relative'
    ];
    
    navSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        if (el && el.style) {
          el.style.display = 'flex';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          console.log('🌐 Enforced navbar language selector visibility:', el);
        }
      });
    });
  };
  
  // Run immediately and after delays to catch all render stages
  forceNavbarLanguageSelectorVisible();
  setTimeout(forceNavbarLanguageSelectorVisible, 500);
  setTimeout(forceNavbarLanguageSelectorVisible, 1000);
  setTimeout(forceNavbarLanguageSelectorVisible, 2000);
});

// Global variables with real Stripe keys
window.ENV = window.ENV || {};
window.ENV.VITE_STRIPE_PUBLISHABLE_KEY = "pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz";
window.import = window.import || {};
window.import.meta = window.import.meta || {};
window.import.meta.env = window.import.meta.env || {};
window.import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY = "pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz";

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

console.log('🔒 Using real Stripe implementation with VITE_STRIPE_PUBLIC_KEY');

// Add global error handler for Stripe errors
window.addEventListener('error', function(event) {
  if (event.message && event.message.includes('Stripe')) {
    console.warn('Intercepted Stripe error, preventing app crash:', event.message);
    event.preventDefault();
    return false;
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
