/**
 * Script to forcibly remove the language selector component from the footer
 * This runs after the page loads to ensure the component is removed even if it's 
 * dynamically added later in the rendering process
 */

// Function to find and remove the language selector
function removeLanguageSelector() {
  // Create a marker to prevent multiple runs
  if (document.getElementById('language-selector-hidden')) {
    return;
  }
  
  const marker = document.createElement('div');
  marker.id = 'language-selector-hidden';
  marker.style.display = 'none';
  document.body.appendChild(marker);
  
  // Find the footer element
  const footer = document.querySelector('footer');
  if (!footer) return;
  
  // Common classes and attributes for language selectors
  const selectors = [
    // Button with aria-label containing "language"
    'button[aria-label*="language"]',
    'button[aria-label*="Language"]',
    
    // Elements with flag emoji in footer
    'footer span:not([class])',
    
    // Elements with specific class structures common in language selectors
    'footer .relative button',
    'footer div.flex.items-center.gap-2',
    
    // Any element with globe icon and "English" text
    'footer *:has(svg + span:contains("English"))'
  ];
  
  // Try each selector
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Additional check to confirm it's a language selector
        const text = el.textContent || '';
        if (
          text.includes('🇬🇧') || 
          text.includes('English') ||
          (el.getAttribute('aria-label') || '').toLowerCase().includes('language')
        ) {
          // Remove just the button, not its parent container
          el.style.display = 'none';
          console.log('Removed language selector element:', el);
        }
      });
    } catch (e) {
      // Ignore errors for unsupported selectors
    }
  });
  
  // Last resort - find any button in the footer with a flag emoji
  const footerButtons = footer.querySelectorAll('button');
  footerButtons.forEach(button => {
    const text = button.textContent || '';
    if (text.includes('🇬🇧') || text.includes('🇫🇷') || text.includes('🇪🇸') || text.includes('🇩🇪')) {
      button.style.display = 'none';
      console.log('Removed language button with flag emoji');
    }
  });
}

// Initial run
window.addEventListener('DOMContentLoaded', () => {
  // Run immediately
  removeLanguageSelector();
  
  // Run again after a delay to catch dynamically added elements
  setTimeout(removeLanguageSelector, 1000);
  
  // And again after the page is fully loaded
  window.addEventListener('load', () => {
    removeLanguageSelector();
    // Run one more time after everything is settled
    setTimeout(removeLanguageSelector, 2000);
  });
  
  // Also set up a mutation observer to detect if the language selector is added later
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        removeLanguageSelector();
      }
    }
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });
});

// Export the function for possible direct usage
export default removeLanguageSelector;