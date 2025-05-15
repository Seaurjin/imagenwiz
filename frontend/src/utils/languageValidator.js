/**
 * Language Validator
 * 
 * This utility script runs on page load to validate that the language
 * selector is functioning properly and provides debug information.
 */

export const validateLanguageSelector = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runValidation);
  } else {
    runValidation();
  }
};

function runValidation() {
  console.log('🌐 Running language selector validation...');
  
  // Check if language selector exists in navbar
  const navbarSelector = document.querySelector('nav button[aria-label*="language"]');
  if (!navbarSelector) {
    console.warn('❌ Language selector not found in navbar');
  } else {
    console.log('✅ Language selector found in navbar');
    
    // Verify it's visible
    const style = window.getComputedStyle(navbarSelector);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      console.warn('❌ Language selector is hidden');
    } else {
      console.log('✅ Language selector is visible');
    }
    
    // Verify it's clickable
    if (style.pointerEvents === 'none') {
      console.warn('❌ Language selector is not clickable (pointer-events: none)');
    } else {
      console.log('✅ Language selector is clickable');
    }
  }
  
  // Check for language selector in footer (should be hidden)
  const footerSelector = document.querySelector('footer button[aria-label*="language"]');
  if (footerSelector) {
    const style = window.getComputedStyle(footerSelector);
    if (style.display === 'none') {
      console.log('✅ Footer language selector is correctly hidden');
    } else {
      console.warn('❌ Footer language selector is incorrectly visible');
    }
  }
  
  // Check current language
  const html = document.documentElement;
  console.log(`📊 Current language: ${html.lang}, direction: ${html.dir}`);
  
  // Check localStorage
  const storedLang = localStorage.getItem('i18nextLng');
  if (storedLang !== html.lang) {
    console.warn(`❗ Language mismatch - HTML: ${html.lang}, localStorage: ${storedLang}`);
  } else {
    console.log(`✅ Language consistency - HTML and localStorage both set to: ${storedLang}`);
  }
}

// Run validation when imported
validateLanguageSelector();

export default validateLanguageSelector; 