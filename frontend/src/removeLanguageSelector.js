/**
 * Script to forcibly remove the language selector component from the footer
 * This runs after the page loads to ensure the component is removed even if it's 
 * dynamically added later in the rendering process
 */

// Function to find and remove the language selector
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
  
  // Target any fixed positioned elements at the bottom of the screen (like LangQuickSwitcher)
  const fixedElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"]');
  fixedElements.forEach(el => {
    const text = el.textContent || '';
    // Check if it has language-related content
    if (text.includes('Language') || text.includes('English') || 
        text.includes('🇬🇧') || text.includes('🇫🇷') || text.includes('🇪🇸') || 
        text.includes('🇩🇪') || text.includes('🇮🇹')) {
      el.style.display = 'none';
      console.log('Removed fixed language selector');
    }
  });
  
  // Find the footer element
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Remove any language buttons from the footer
  const footerElements = footer.querySelectorAll('*');
  footerElements.forEach(el => {
    const elType = el.tagName.toLowerCase();
    const text = el.textContent || '';
    const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
    
    // Check if it has language-related content
    if ((elType === 'button' || elType === 'a' || elType === 'div') && 
        (text.includes('🇬🇧') || text.includes('🇫🇷') || text.includes('🇪🇸') || 
         text.includes('🇩🇪') || text.includes('🇮🇹') || text.includes('English') ||
         ariaLabel.includes('language'))) {
      
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
  
  // Specifically target the known structure from screenshots
  const footerRow = footer.querySelector('.py-6.flex.flex-col.md\\:flex-row.justify-between.items-center');
  if (footerRow) {
    const children = footerRow.children;
    // The language selector is usually the last or second-to-last child
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      const text = child.textContent || '';
      
      // Look for flag emoji or language text
      if (text.includes('🇬🇧') || text.includes('English') || 
          text.includes('Language') || 
          (child.querySelector && child.querySelector('[aria-label*="language"]'))) {
        child.style.display = 'none';
        console.log('Removed language element in footer row:', child);
      }
    }
  }
  
  // Inject a style element to hide specific language selectors
  if (!document.getElementById('language-selector-style')) {
    const style = document.createElement('style');
    style.id = 'language-selector-style';
    style.textContent = `
      footer button[aria-label*="language"],
      footer button[aria-label*="Language"],
      footer .relative button,
      footer div.flex.items-center.gap-2.px-4.py-3.rounded-md,
      div[style*="position: fixed"][style*="bottom"][style*="right"] {
        display: none !important;
      }
      
      /* Hide MobileLanguageSelector and SimpleLanguageSelector */
      [class*="MobileLanguageSelector"],
      [class*="SimpleLanguageSelector"],
      [class*="LanguageSelector"] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    console.log('Injected language selector hiding styles');
  }
}

// Create and inject a fallback HTML style tag for immediate hiding before JS loads
function injectImmediateStyles() {
  const style = document.createElement('style');
  style.id = 'immediate-language-selector-style';
  style.textContent = `
    /* Hide language selectors immediately */
    footer button:has(span:first-child[role="img"]),
    footer a:has(span:first-child[role="img"]),
    div[style*="position: fixed"][style*="bottom"]:has(h3:contains("Language")),
    button[aria-label*="language"],
    button[aria-label*="Language"],
    .relative:has(button[aria-label*="language"]),
    .relative:has(button[aria-label*="Language"]) {
      display: none !important;
    }
    
    /* Target the exact structure seen in the screenshot */
    footer .py-6.flex.flex-col.md\\:flex-row.justify-between.items-center > :last-child:not(.flex.space-x-4) {
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
  removeLanguageSelector();
  
  // Run one final time after everything has settled
  setTimeout(removeLanguageSelector, 1000);
  
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
  
  // Final cleanup - look for any LangQuickSwitcher component
  const langSwitchers = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"]');
  langSwitchers.forEach(el => {
    if ((el.textContent || '').includes('Language')) {
      el.remove();
      console.log('Removed LangQuickSwitcher component');
    }
  });
});

// Export the function for possible direct usage
export default removeLanguageSelector;