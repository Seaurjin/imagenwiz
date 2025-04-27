/**
 * Emergency language selector fix script
 * This script ensures the language selector in the navbar remains visible and clickable
 * while hiding it in the footer as requested.
 */
(function() {
  // Run when DOM is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Language selector emergency fix running...');
    
    // Apply fixes with progressive delays to ensure they catch all rendering states
    fixLanguageSelectors();
    setTimeout(fixLanguageSelectors, 500);
    setTimeout(fixLanguageSelectors, 1000);
    setTimeout(fixLanguageSelectors, 2000);
    
    // Set up mutation observer to watch for DOM changes
    setupMutationObserver();
    
    // Add debug button (only in development)
    if (window.location.hostname.includes('.repl.co') || window.location.hostname === 'localhost') {
      addDebugButton();
    }
  });
  
  // Also run on load to catch any late DOM changes
  window.addEventListener('load', fixLanguageSelectors);
  
  /**
   * Main function to fix language selectors
   */
  function fixLanguageSelectors() {
    // Find and ensure navbar language selectors are visible
    showNavbarLanguageSelectors();
    
    // Find and hide footer language selectors
    hideFooterLanguageSelectors();
    
    // Make all navbar language selectors clickable
    makeLanguageSelectorsClickable();
  }
  
  /**
   * Find and force navbar language selectors to be visible
   */
  function showNavbarLanguageSelectors() {
    console.log('🔍 Looking for navbar language selectors...');
    
    // Multiple selectors to target the language selector in navbar
    const navbarSelectors = [
      'nav .relative:has(button[aria-label*="language"])',
      'nav button[aria-label*="language"]',
      '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative:has(button)',
      '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center button:has(span[role="img"])',
      'nav .relative:has(span[role="img"])',
      '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center',
    ];
    
    // Apply each selector and make matching elements visible
    navbarSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`✅ Found ${elements.length} elements matching selector: ${selector}`);
          
          elements.forEach(el => {
            // Only apply to elements that are actually in the navbar
            if (el.closest('nav') || 
                el.closest('.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center') ||
                selector.includes('nav')) {
              // Force visibility
              forceElementVisibility(el);
              
              // Also ensure parent containers are visible
              let parent = el.parentElement;
              while (parent && parent !== document.body) {
                forceElementVisibility(parent);
                parent = parent.parentElement;
              }
            }
          });
        }
      } catch (err) {
        console.error(`Error with selector "${selector}":`, err);
      }
    });
    
    // Special case for the mobile language selector
    const mobileSelectors = document.querySelectorAll('.sm\\:hidden .relative:has(button)');
    mobileSelectors.forEach(el => {
      if (!el.closest('footer')) {
        forceElementVisibility(el);
      }
    });
  }
  
  /**
   * Hide language selectors in the footer
   */
  function hideFooterLanguageSelectors() {
    // Target language selectors specifically in the footer
    const footerSelectors = [
      'footer .relative:has(button[aria-label*="language"])',
      'footer button[aria-label*="language"]',
      'footer .relative:has(span[role="img"])'
    ];
    
    footerSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          console.log(`🚫 Hiding ${elements.length} footer language selectors`);
          
          elements.forEach(el => {
            if (el.closest('footer')) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
            }
          });
        }
      } catch (err) {
        console.error(`Error with footer selector "${selector}":`, err);
      }
    });
  }
  
  /**
   * Make language selectors clickable by ensuring proper pointer events
   */
  function makeLanguageSelectorsClickable() {
    // Target language selector buttons in navbar
    const languageButtons = document.querySelectorAll('nav button[aria-label*="language"], .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center button:has(span[role="img"])');
    
    languageButtons.forEach(button => {
      // Only target buttons in the navbar, not footer
      if (!button.closest('footer')) {
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.removeAttribute('disabled');
        
        // Ensure parent elements are also interactive
        let parent = button.parentElement;
        while (parent && parent !== document.body) {
          parent.style.pointerEvents = 'auto';
          parent = parent.parentElement;
        }
        
        // Add emergency click handler if not already present
        if (!button.hasAttribute('data-emergency-handler')) {
          button.setAttribute('data-emergency-handler', 'true');
          
          button.addEventListener('click', function(e) {
            console.log('📣 Language selector clicked via emergency handler');
            
            // Try to find and toggle dropdown visibility
            const dropdown = button.closest('.relative')?.querySelector('.absolute, [class*="w-64"]');
            if (dropdown) {
              const isVisible = dropdown.style.display === 'block' || 
                               getComputedStyle(dropdown).display !== 'none';
              
              dropdown.style.display = isVisible ? 'none' : 'block';
              dropdown.style.visibility = isVisible ? 'hidden' : 'visible';
              dropdown.style.opacity = isVisible ? '0' : '1';
              
              // Stop event propagation to prevent immediate closing
              e.stopPropagation();
            }
          }, true);
        }
      }
    });
  }
  
  /**
   * Force an element to be visible
   */
  function forceElementVisibility(element) {
    if (element && element.style) {
      element.style.display = '';
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    }
  }
  
  /**
   * Setup mutation observer to watch for DOM changes
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' || 
            mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || 
             mutation.attributeName === 'class')) {
          fixLanguageSelectors();
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('👁️ Mutation observer active to maintain language selector visibility');
  }
  
  /**
   * Add debug button for manual triggering (development only)
   */
  function addDebugButton() {
    // Check if button already exists
    if (document.getElementById('lang-selector-debug-btn')) return;
    
    const debugButton = document.createElement('button');
    debugButton.id = 'lang-selector-debug-btn';
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
    
    debugButton.addEventListener('click', function() {
      fixLanguageSelectors();
      alert('Language selector fix applied. Check if it\'s working now.');
    });
    
    document.body.appendChild(debugButton);
    console.log('🔧 Debug button added');
  }
})();