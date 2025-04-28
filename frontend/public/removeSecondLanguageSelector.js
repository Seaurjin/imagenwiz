/**
 * Script to remove the second language selector from the navbar
 * This script specifically targets the duplication problem
 */
(function() {
  // Run as soon as possible with progressive retries
  removeDuplicateLanguageSelector();
  setTimeout(removeDuplicateLanguageSelector, 100);
  setTimeout(removeDuplicateLanguageSelector, 500);
  setTimeout(removeDuplicateLanguageSelector, 1000);
  
  // Also run when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    removeDuplicateLanguageSelector();
    // Run again to catch any components added during React hydration
    setTimeout(removeDuplicateLanguageSelector, 100);
    setTimeout(removeDuplicateLanguageSelector, 500);
  });
  
  // Run again when page is fully loaded
  window.addEventListener('load', function() {
    removeDuplicateLanguageSelector();
    // Set up observer to detect changes
    setupMutationObserver();
  });
  
  /**
   * Main function to find and remove duplicate language selectors
   */
  function removeDuplicateLanguageSelector() {
    console.log('🔍 Searching for duplicate language selectors in navbar...');
    
    // If we found both types of language selectors, remove the "Language" text one
    // First find all language selectors in the navbar area
    const navbarArea = document.querySelector('nav') || 
                       document.querySelector('.flex.justify-between');
    
    if (!navbarArea) {
      console.log('⚠️ Navbar not found yet, will retry later');
      return;
    }
    
    // Find all potential language selectors
    const languageButtons = [];
    const allButtons = navbarArea.querySelectorAll('button');
    
    allButtons.forEach(button => {
      const text = button.textContent || '';
      if (text.includes('English') || 
          text.includes('Language') ||
          text.includes('🇬🇧') ||
          text.includes('Español') ||
          text.includes('Français')) {
        languageButtons.push(button);
        console.log('👀 Found potential language selector:', text.trim());
      }
    });
    
    // If we have 2 or more language buttons, we need to remove extras
    if (languageButtons.length >= 2) {
      console.log(`✂️ Found ${languageButtons.length} language selectors, removing duplicates`);
      
      // Keep track of which ones to remove (indices in the languageButtons array)
      const toRemove = [];
      
      // First pass: identify the language text selector (with "Language" text)
      // This is the one we want to remove
      languageButtons.forEach((button, index) => {
        const text = button.textContent || '';
        if (text.trim() === 'Language' || 
            text.includes('Language') && !text.includes('🇬🇧')) {
          console.log('🎯 Found "Language" text selector - marked for removal');
          toRemove.push(index);
        }
      });
      
      // If we didn't find any to remove based on text, use position
      if (toRemove.length === 0 && languageButtons.length >= 2) {
        // Keep the first language button and remove the second one (rightmost)
        toRemove.push(1); // Remove the second button
        console.log('🎯 Using position-based removal, removing second language selector');
      }
      
      // Remove the marked selectors (starting from the end to avoid index shifts)
      toRemove.sort((a, b) => b - a); // Sort in descending order
      
      toRemove.forEach(index => {
        const buttonToRemove = languageButtons[index];
        // Find the closest container (like a div.relative or similar)
        const container = buttonToRemove.closest('.relative') || 
                         buttonToRemove.closest('.space-x-4 > *') ||
                         buttonToRemove.parentElement;
        
        if (container) {
          container.style.display = 'none';
          console.log('✅ Removed language selector container');
        } else {
          buttonToRemove.style.display = 'none';
          console.log('✅ Removed language selector button');
        }
      });
    } else {
      console.log(`👍 Found ${languageButtons.length} language selector, no duplicates to remove`);
    }
    
    // Add CSS rules to prevent the second language selector from showing
    addCssRules();
  }
  
  /**
   * Add CSS rules to hide the second language selector
   */
  function addCssRules() {
    if (!document.getElementById('remove-duplicate-lang-style')) {
      const style = document.createElement('style');
      style.id = 'remove-duplicate-lang-style';
      style.textContent = `
        /* Hide the "Language" text button in navbar */
        nav .space-x-4 > div:has(button:contains("Language")),
        .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center > .space-x-4 > div:nth-child(3),
        .space-x-4 button:contains("Language") {
          display: none !important;
        }
        
        /* If we have multiple language selectors, hide the second one */
        .sm\\:flex.sm\\:items-center .relative:nth-of-type(2):has(button:has(span[role="img"])) {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
      console.log('📝 Added CSS rules to hide duplicate language selectors');
    }
  }
  
  /**
   * Set up a mutation observer to detect DOM changes
   */
  function setupMutationObserver() {
    const observer = new MutationObserver(function(mutations) {
      let shouldCheck = false;
      
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              // Check for potential language-related content
              if ((node.textContent || '').includes('Language') || 
                  (node.textContent || '').includes('English') ||
                  (node.textContent || '').includes('🇬🇧')) {
                shouldCheck = true;
                break;
              }
            }
          }
        }
      });
      
      if (shouldCheck) {
        removeDuplicateLanguageSelector();
      }
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('👁️ Mutation observer active to remove duplicate language selectors');
  }
})();
