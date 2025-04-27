/**
 * Special debugging file to ensure navbar language selector visibility
 * This file specifically focuses on ensuring the language selector in the navbar
 * remains visible while still removing it from the footer
 */

// Function to log all language selectors and their visibility status
function debugLanguageSelectors() {
  console.log('=== LANGUAGE SELECTOR DEBUG ===');
  
  // Check for potential language selectors
  const languageSelectors = [
    'button[aria-label*="language"]',
    'button[aria-label*="Language"]',
    '.relative:has(button[aria-label*="language"])',
    'div:has(> span[role="img"] + span)'
  ];
  
  languageSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`Selector "${selector}" matched ${elements.length} elements`);
    
    elements.forEach((el, index) => {
      // Get computed style
      const style = window.getComputedStyle(el);
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
      
      // Check if it's in navbar
      const inNavbar = !!el.closest('nav');
      const inFooter = !!el.closest('footer');
      
      console.log(`  [${index}] ${inNavbar ? '✅ NAVBAR' : inFooter ? '❌ FOOTER' : '⚠️ OTHER'}: ${isVisible ? 'VISIBLE' : 'HIDDEN'}`);
    });
  });
  
  // Check specifically for the navbar language selector
  const navbar = document.querySelector('nav');
  if (navbar) {
    console.log('Navbar found, checking for language selectors inside...');
    
    // Look for buttons with language-related attributes inside the navbar
    const navbarLanguageButtons = navbar.querySelectorAll('button[aria-label*="language"], button[aria-label*="Language"]');
    console.log(`Found ${navbarLanguageButtons.length} language buttons directly in navbar`);
    
    navbarLanguageButtons.forEach((button, index) => {
      const style = window.getComputedStyle(button);
      console.log(`  Navbar button [${index}]: ${style.display !== 'none' ? 'VISIBLE' : 'HIDDEN'}, Text: ${button.textContent.substring(0, 20)}`);
    });
  } else {
    console.log('❌ Navbar not found in the document!');
  }

  // Look for hidden language selectors in the navbar that might need to be shown
  const hiddenSelectors = document.querySelectorAll('nav .relative[style*="display: none"], nav button[style*="display: none"][aria-label*="language"]');
  if (hiddenSelectors.length > 0) {
    console.log(`⚠️ Found ${hiddenSelectors.length} HIDDEN language elements in navbar that need to be made visible!`);
    
    // Make them visible
    hiddenSelectors.forEach(el => {
      el.style.display = '';
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      console.log('  Fixed visibility for:', el);
    });
  }
}

// Function to force navbar language selector to be visible
function forceNavbarLanguageSelectorVisible() {
  // More specific selectors to target only navbar language selectors
  const navSelectors = [
    // Direct selectors in navbar
    'nav .relative:has(button[aria-label*="language"])',
    'nav button[aria-label*="language"]',
    'nav .relative:has(span[role="img"])',
    
    // Specific structure from navbar component
    '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative',
    '.sm\\:flex.sm\\:items-center .space-x-4 > .relative',
    '.space-x-4 > div > button:has(span[role="img"])',
    
    // Very specific selectors based on the component structure
    '.flex.justify-between .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative'
  ];
  
  let foundAndFixed = false;
  
  navSelectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Only apply to elements that are actually in the navbar
        if (el.closest('nav') || el.closest('.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center')) {
          el.style.display = 'flex';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          
          // Also ensure its immediate parent is visible
          if (el.parentElement) {
            el.parentElement.style.display = '';
            el.parentElement.style.visibility = 'visible';
            el.parentElement.style.opacity = '1';
          }
          
          console.log('✅ Fixed navbar language selector visibility:', selector);
          foundAndFixed = true;
        }
      });
    } catch (e) {
      console.error('Error with selector:', selector, e);
    }
  });
  
  // If we haven't found any, try more aggressive approach
  if (!foundAndFixed) {
    console.log('⚠️ No navbar language selectors found with standard selectors, trying deeper search...');
    
    // Look through all elements in the navbar for potential language selectors
    const navbar = document.querySelector('nav');
    if (navbar) {
      const allNavbarElements = navbar.querySelectorAll('*');
      
      allNavbarElements.forEach(el => {
        const text = el.textContent || '';
        const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
        
        // Check if it's likely a language selector
        if ((text.includes('🇬🇧') || text.includes('🇨🇳') || text.includes('🇯🇵') || 
             ariaLabel.includes('language')) && 
            el.tagName && (el.tagName.toLowerCase() === 'button' || el.tagName.toLowerCase() === 'div')) {
          
          // Force it to be visible
          el.style.display = el.tagName.toLowerCase() === 'button' ? 'flex' : '';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
          console.log('🔍 Found and fixed hidden language element in navbar:', el);
          
          // Also ensure parent containers are visible
          let parent = el.parentElement;
          for (let i = 0; i < 3 && parent; i++) { // Check up to 3 parent levels
            parent.style.display = '';
            parent.style.visibility = 'visible';
            parent.style.opacity = '1';
            parent = parent.parentElement;
          }
        }
      });
    }
  }
}

// Run debugging and fixes
function initNavbarLanguageDebug() {
  console.log('🔍 Running navbar language selector debug and fix script...');
  
  // First ensure navbar language selectors are visible
  forceNavbarLanguageSelectorVisible();
  
  // Then run diagnostics
  debugLanguageSelectors();
  
  // Schedule repeated checks for dynamic content
  setTimeout(forceNavbarLanguageSelectorVisible, 500);
  setTimeout(forceNavbarLanguageSelectorVisible, 1000);
  setTimeout(forceNavbarLanguageSelectorVisible, 2000);
  
  // Create a button that users can click to force the language selector visible
  const debugButton = document.createElement('button');
  debugButton.textContent = '🌐 Fix Language Selector';
  debugButton.style.position = 'fixed';
  debugButton.style.bottom = '10px';
  debugButton.style.right = '10px';
  debugButton.style.zIndex = '9999';
  debugButton.style.background = '#4ade80';
  debugButton.style.color = 'white';
  debugButton.style.padding = '8px 12px';
  debugButton.style.borderRadius = '4px';
  debugButton.style.border = 'none';
  debugButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  debugButton.style.cursor = 'pointer';
  
  debugButton.addEventListener('click', () => {
    forceNavbarLanguageSelectorVisible();
    debugLanguageSelectors();
    alert('Language selector fix attempted. Check console for details.');
  });
  
  // Add to body after a delay to ensure the DOM is ready
  setTimeout(() => {
    document.body.appendChild(debugButton);
  }, 3000);
  
  // Set up an observer to detect changes to the navbar
  const navbarObserver = new MutationObserver(() => {
    forceNavbarLanguageSelectorVisible();
  });
  
  // Start observing the navbar when it becomes available
  setTimeout(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbarObserver.observe(navbar, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      console.log('✅ Navbar observer active');
    }
  }, 1000);
}

// Run initialization on DOM content loaded
document.addEventListener('DOMContentLoaded', initNavbarLanguageDebug);

// Also run after full page load
window.addEventListener('load', forceNavbarLanguageSelectorVisible);

// Export the functions for possible direct usage
export { forceNavbarLanguageSelectorVisible, debugLanguageSelectors };