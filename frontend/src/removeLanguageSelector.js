/**
 * Script to forcibly remove the language selector component from the footer ONLY
 * This script is specifically designed to target and remove language selectors
 * from the footer while preserving the language selector in the main navigation
 * This runs after the page loads to ensure the component is removed even if it's 
 * dynamically added later in the rendering process
 */

// Helper function to explicitly make navbar language selector visible
function ensureNavbarLanguageSelectorVisible() {
  // First try to find the language selector in the navbar
  const navbar = document.querySelector('nav');
  if (!navbar) return;
  
  // Find language selectors in the navbar by various selectors
  const navbarSelectors = [
    '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative',
    '.sm\\:flex.sm\\:items-center .relative:has(button[aria-label*="language"])',
    '.sm\\:flex.sm\\:items-center .space-x-4 .relative',
    'button[aria-label*="language"]',
    'button[aria-label*="Language"]'
  ];
  
  // Try each selector to find and make visible the language selector
  navbarSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (el.closest('nav')) {
        // Found navbar language selector - ensure it's visible
        el.style.display = 'flex';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        
        // Also ensure parent containers are visible
        let parent = el.parentElement;
        while (parent && parent !== document.body) {
          parent.style.display = '';
          parent.style.visibility = 'visible';
          parent.style.opacity = '1';
          parent = parent.parentElement;
        }
        
        console.log('✅ Explicitly made navbar language selector visible:', el);
      }
    });
  });
}

// Function to find and remove only the footer language selector
function removeLanguageSelector() {
  // Create a marker to prevent multiple runs in quick succession
  if (document.getElementById('language-selector-hidden')) {
    const lastRun = parseInt(document.getElementById('language-selector-hidden').getAttribute('data-last-run') || '0');
    const now = Date.now();
    if (now - lastRun < 1000) return; // Don't run if less than 1 second since last run
    
    document.getElementById('language-selector-hidden').setAttribute('data-last-run', now.toString());
  } else {
    const marker = document.createElement('div');
    marker.id = 'language-selector-hidden';
    marker.setAttribute('data-last-run', Date.now().toString());
    marker.style.display = 'none';
    document.body.appendChild(marker);
  }
  
  // First make sure navbar language selector is visible
  ensureNavbarLanguageSelectorVisible();
  
  // Target ONLY the LangQuickSwitcher component (with h3 heading)
  const fixedElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"]');
  fixedElements.forEach(el => {
    const text = el.textContent || '';
    const hasHeader = el.querySelector('h3');
    
    // Only hide if it has both language-related content AND a header (LangQuickSwitcher has an h3)
    if (hasHeader && (text.includes('Language') || text.includes('English') || 
        text.includes('🇬🇧') || text.includes('🇫🇷') || text.includes('🇪🇸') || 
        text.includes('🇩🇪') || text.includes('🇮🇹'))) {
      el.style.display = 'none';
      console.log('Removed LangQuickSwitcher');
    }
  });
  
  // Find the footer element
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Remove any language buttons ONLY from the footer (not from navbar)
  const footerElements = footer.querySelectorAll('*');
  footerElements.forEach(el => {
    // Skip everything if it's inside a nav element
    if (el.closest('nav')) {
      return;
    }
    
    const elType = el.tagName.toLowerCase();
    const text = el.textContent || '';
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    
    // Check if it has language-related content
    if ((elType === 'button' || elType === 'a' || elType === 'div') && 
        (text.includes('🇬🇧') || text.includes('🇫🇷') || text.includes('🇪🇸') || 
         text.includes('🇩🇪') || text.includes('🇮🇹') || text.includes('English') ||
         ariaLabel.includes('language'))) {
      
      // Skip if it's in the main navigation area (determined by class proximity)
      const isInNavigation = 
        el.closest('.sm\\:flex.sm\\:items-center') || 
        el.closest('.sm\\:ml-6') || 
        el.closest('.hidden.sm\\:ml-6.sm\\:flex');
      
      if (isInNavigation) {
        console.log('Preserved navigation language selector:', el);
        // Actually ensure navbar language selectors are visible
        if (el.style) {
          el.style.display = '';
          el.style.visibility = 'visible';
          el.style.opacity = '1';
        }
        
        // Also ensure its parent container is visible
        let parent = el.parentNode;
        if (parent && parent.style) {
          parent.style.display = '';
          parent.style.visibility = 'visible';
          parent.style.opacity = '1';
        }
        
        return;
      }
      
      // If it's a button or link directly in the footer, hide it
      el.style.display = 'none';
      console.log('Removed language-related element from footer:', el);
      
      // Try to find and hide its parent container if it's a language-specific container
      let parent = el.parentNode;
      if (parent && parent !== footer) {
        const parentClasses = parent.className || '';
        // If parent has a typical dropdown/selector class, hide it too
        if (parentClasses.includes('relative') || 
            parentClasses.includes('dropdown') || 
            parentClasses.includes('selector') ||
            parentClasses.includes('language')) {
          parent.style.display = 'none';
          console.log('Removed parent container of language element:', parent);
        }
      }
    }
  });
  
  // Specifically target the known structure from screenshots - ONLY in footer
  const footerRow = footer.querySelector('.py-6.flex.flex-col.md\\:flex-row.justify-between.items-center');
  if (footerRow) {
    const children = footerRow.children;
    // The language selector is usually the last or second-to-last child
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const text = child.textContent || '';
      
      // Check if it's in the navbar - if so, skip it entirely
      if (child.closest('nav') || child.closest('.sm\\:flex.sm\\:items-center') || 
          child.closest('.hidden.sm\\:ml-6.sm\\:flex')) {
        console.log('Found navbar element, preserving:', child);
        continue;
      }
      
      // Skip the logo container - identified by the presence of an image
      if (child.querySelector('img')) {
        console.log('Found logo container, skipping:', child);
        continue;
      }
      
      // Skip the social media links container
      if (child.classList.contains('flex') && child.classList.contains('space-x-4')) {
        console.log('Found social links container, skipping:', child);
        continue;
      }
      
      // Look for flag emoji or language text to identify language selectors
      if (text.includes('🇬🇧') || text.includes('English') || 
          text.includes('Language') || 
          (child.querySelector && child.querySelector('[aria-label*="language"]'))) {
        child.style.display = 'none';
        console.log('Removed language element in footer row:', child);
      }
    }
  }
  
  // Inject a style element to hide specific language selectors ONLY IN FOOTER
  if (!document.getElementById('language-selector-style')) {
    const style = document.createElement('style');
    style.id = 'language-selector-style';
    style.textContent = `
      /* Only target language selectors in the footer */
      footer button[aria-label*="language"],
      footer button[aria-label*="Language"],
      footer .relative button,
      footer div.flex.items-center.gap-2.px-4.py-3.rounded-md,
      div[style*="position: fixed"][style*="bottom"][style*="right"] {
        display: none !important;
      }
      
      /* Only hide language components in the footer */
      footer [class*="MobileLanguageSelector"],
      footer [class*="SimpleLanguageSelector"],
      footer [class*="LanguageSelector"] {
        display: none !important;
      }
      
      /* Make sure navbar language selectors remain visible */
      nav [class*="LanguageSelector"],
      nav button[aria-label*="language"],
      nav button[aria-label*="Language"],
      .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center [class*="LanguageSelector"] {
        display: flex !important;
      }
    `;
    document.head.appendChild(style);
    console.log('Injected footer-specific language selector hiding styles');
  }
}

// Create and inject a fallback HTML style tag for immediate hiding before JS loads
function injectImmediateStyles() {
  const style = document.createElement('style');
  style.id = 'immediate-language-selector-style';
  style.textContent = `
    /* Ensure logo is always visible */
    footer div:has(> img),
    footer div.mb-4.md\\:mb-0.flex.items-center,
    footer div.mb-4.md\\:mb-0.flex.items-center img {
      display: block !important;
    }
    
    /* Hide ONLY footer language selectors immediately */
    footer button[aria-label*="language"],
    footer button[aria-label*="Language"],
    footer .relative:has(button[aria-label*="language"]),
    footer .relative:has(button[aria-label*="Language"]) {
      display: none !important;
    }
    
    /* Make sure navbar language selectors remain visible with higher specificity */
    nav button[aria-label*="language"],
    nav button[aria-label*="Language"],
    nav .relative:has(button[aria-label*="language"]),
    nav .relative:has(button[aria-label*="Language"]),
    .hidden.sm\\:ml-6.sm\\:flex button[aria-label*="language"],
    .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative {
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Explicitly target the navbar language selector structure */
    .flex.justify-between .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative,
    .flex.justify-between .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center button[aria-label*="language"],
    .sm\\:flex.sm\\:items-center .space-x-4 > .relative {
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Fixed position language quick switcher */
    div[style*="position: fixed"][style*="bottom"]:has(h3:contains("Language")) {
      display: none !important;
    }
    
    /* Only hide buttons with flag emojis - but not in the social media container */
    footer button:has(span:first-child[role="img"]):not(:has(span[class*="text-gray-"])),
    footer a:has(span:first-child[role="img"]):not(:has(span[class*="text-gray-"])) {
      display: none !important;
    }
    
    /* Target the exact language selector seen in the screenshot */
    footer .py-6.flex.flex-col.md\\:flex-row.justify-between.items-center > div:nth-child(3):not(.flex.space-x-4) {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
}

// Run immediately on script load
injectImmediateStyles();

// Set up event listeners for DOM loading stages
document.addEventListener('DOMContentLoaded', () => {
  // Run immediately when DOM is ready
  removeLanguageSelector();
  
  // Run again after a short delay to catch elements added during initial render
  setTimeout(removeLanguageSelector, 500);
  
  // And again after a longer delay for dynamically loaded content
  setTimeout(removeLanguageSelector, 2000);
});

// Also run when the page is fully loaded
window.addEventListener('load', () => {
  // First explicitly ensure navbar language selector is visible
  ensureNavbarLanguageSelectorVisible();
  
  // Then run the removal function for footer
  removeLanguageSelector();
  
  // Run one final time after everything has settled
  setTimeout(() => {
    ensureNavbarLanguageSelectorVisible();
    removeLanguageSelector();
  }, 1000);
  
  // Set up a mutation observer to detect if language selectors are added dynamically
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    
    // Only run if relevant elements are added
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) { // Element node
            // Check if it might be a language selector
            if ((node.tagName === 'BUTTON' || node.tagName === 'DIV' || node.tagName === 'A') &&
                ((node.textContent || '').includes('🇬🇧') || 
                (node.getAttribute('aria-label') || '').toLowerCase().includes('language'))) {
              shouldRun = true;
              break;
            }
          }
        }
      }
      if (shouldRun) break;
    }
    
    if (shouldRun) {
      // Always ensure navbar language selector is visible first
      ensureNavbarLanguageSelectorVisible();
      // Then remove footer language selectors
      removeLanguageSelector();
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  // Final cleanup - ONLY remove LangQuickSwitcher component (with h3 heading)
  const langSwitchers = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"]');
  langSwitchers.forEach(el => {
    const hasHeader = el.querySelector('h3');
    if (hasHeader && (el.textContent || '').includes('Language')) {
      el.remove();
      console.log('Removed LangQuickSwitcher component');
    }
  });
});

// Export the function for possible direct usage
export default removeLanguageSelector;