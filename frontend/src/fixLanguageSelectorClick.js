/**
 * Special script to ensure language selector in navbar is clickable
 * 
 * This addresses the issue where the language selector is visible
 * but not interactive due to event handlers being disabled
 */

// Function to make navbar language selector fully interactive
function makeLanguageSelectorClickable() {
  // Target all potential language selector buttons in the navbar
  const selectors = [
    'nav button[aria-label*="language"]',
    'nav button[aria-label*="Language"]',
    '.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center button',
    '.space-x-4 > .relative button'
  ];
  
  // Find and ensure each potential selector is clickable
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      
      elements.forEach(el => {
        if (el.closest('nav') || el.closest('.hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center')) {
          // Remove any pointer-events: none styling
          el.style.pointerEvents = 'auto';
          
          // Remove any disabled attribute
          el.removeAttribute('disabled');
          
          // Fix parent containers
          let parent = el.parentElement;
          while (parent && parent !== document.body) {
            parent.style.pointerEvents = 'auto';
            parent = parent.parentElement;
          }
          
          // Clone and replace to remove any event listeners that might be blocking
          const newEl = el.cloneNode(true);
          
          // Restore original click event by manually adding it back
          newEl.addEventListener('click', (e) => {
            console.log('Language selector clicked!');
            
            // Try to find any original event handlers by looking for onClick props in React
            const reactKey = Object.keys(el).find(key => key.startsWith('__reactProps$'));
            if (reactKey && el[reactKey] && el[reactKey].onClick) {
              console.log('Found original React click handler, executing it');
              el[reactKey].onClick(e);
            } else {
              // If we can't find the original handler, try to simulate dropdown toggle
              const dropdown = document.querySelector('nav .relative .absolute');
              if (dropdown) {
                if (dropdown.style.display === 'none') {
                  dropdown.style.display = 'block';
                } else {
                  dropdown.style.display = 'none';
                }
              }
            }
          });
          
          // Replace the element
          if (el.parentNode) {
            el.parentNode.replaceChild(newEl, el);
            console.log('✅ Fixed clickability for language selector button');
          }
        }
      });
    } catch (e) {
      console.error('Error with selector:', selector, e);
    }
  });
  
  // Add explicit click handler to language selector dropdown
  const dropdownContainer = document.querySelector('nav .relative, .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center .relative');
  if (dropdownContainer) {
    // First ensure the container itself is clickable
    dropdownContainer.style.pointerEvents = 'auto';
    
    // Find the language selector button within this container
    const button = dropdownContainer.querySelector('button');
    if (button) {
      console.log('Adding explicit click handler to language selector button');
      
      // Use direct DOM manipulation to forcibly make it clickable
      button.style.pointerEvents = 'auto';
      button.style.cursor = 'pointer';
      button.style.zIndex = '1000'; // Ensure it's on top
      
      // Backup solution: create an overlaid transparent button if needed
      const overlayButton = document.createElement('button');
      overlayButton.style.position = 'absolute';
      overlayButton.style.top = '0';
      overlayButton.style.left = '0';
      overlayButton.style.width = '100%';
      overlayButton.style.height = '100%';
      overlayButton.style.background = 'transparent';
      overlayButton.style.border = 'none';
      overlayButton.style.cursor = 'pointer';
      overlayButton.style.zIndex = '999';
      
      overlayButton.addEventListener('click', (e) => {
        console.log('Overlay button clicked, simulating click on actual button');
        e.stopPropagation();
        
        // Try to trigger the actual button's click handlers
        button.click();
        
        // If that doesn't work, try to manually toggle the dropdown
        const dropdown = dropdownContainer.querySelector('.absolute');
        if (dropdown) {
          if (window.getComputedStyle(dropdown).display === 'none') {
            dropdown.style.display = 'block';
          } else {
            dropdown.style.display = 'none';
          }
        }
      });
      
      // Add the overlay button as a last resort
      dropdownContainer.style.position = 'relative';
      dropdownContainer.appendChild(overlayButton);
    }
  }
  
  // Another strategy: create a brand new language selector from scratch if needed
  if (!document.querySelector('#emergency-language-selector')) {
    const currentLangDisplay = document.querySelector('nav button span[role="img"]');
    if (currentLangDisplay) {
      const currentLang = currentLangDisplay.textContent; // e.g., 🇨🇳 or other flag
      
      const emergencySelector = document.createElement('div');
      emergencySelector.id = 'emergency-language-selector';
      emergencySelector.className = 'relative';
      emergencySelector.style.display = 'flex';
      emergencySelector.style.marginLeft = '8px';
      emergencySelector.style.zIndex = '1000';
      
      // Create button that shows current language
      const langButton = document.createElement('button');
      langButton.className = 'flex items-center gap-2 px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50';
      langButton.innerHTML = `
        <span class="text-lg" role="img">${currentLang}</span>
        <span class="hidden md:inline">Language</span>
        <svg class="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      `;
      
      // Create the dropdown menu
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden';
      dropdownMenu.style.top = '100%';
      
      // Add some common languages
      const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'zh-TW', name: '繁體中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'es', name: 'Español', flag: '🇪🇸' }
      ];
      
      languages.forEach(lang => {
        const langOption = document.createElement('button');
        langOption.className = 'flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-50';
        langOption.innerHTML = `
          <span class="text-xl mr-3">${lang.flag}</span>
          <div>
            <div class="font-medium">${lang.name}</div>
            <div class="text-gray-500 text-xs">${lang.code === 'en' ? 'English' : lang.name}</div>
          </div>
        `;
        
        langOption.addEventListener('click', () => {
          console.log(`Selected language: ${lang.code}`);
          // Set language in localStorage
          localStorage.setItem('i18nextLng', lang.code);
          // Reload the page to apply the language change
          window.location.reload();
        });
        
        dropdownMenu.appendChild(langOption);
      });
      
      // Toggle dropdown on button click
      langButton.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('hidden')) {
          dropdownMenu.classList.remove('hidden');
        } else {
          dropdownMenu.classList.add('hidden');
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!emergencySelector.contains(e.target)) {
          dropdownMenu.classList.add('hidden');
        }
      });
      
      // Add elements to the emergency selector
      emergencySelector.appendChild(langButton);
      emergencySelector.appendChild(dropdownMenu);
      
      // Find a good place to add the emergency selector
      const navbarRightSection = document.querySelector('nav .flex.justify-between .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center');
      if (navbarRightSection) {
        const existingSelector = navbarRightSection.querySelector('.relative:has(button[aria-label*="language"])');
        if (existingSelector) {
          console.log('Found existing language selector, replacing with emergency version');
          // Only add our emergency selector if the existing one isn't working
          existingSelector.style.display = 'none';
          navbarRightSection.appendChild(emergencySelector);
        } else {
          console.log('No existing language selector found, adding emergency version');
          navbarRightSection.appendChild(emergencySelector);
        }
      } else {
        // If we can't find the right section, add it directly to the navbar
        const navbar = document.querySelector('nav');
        if (navbar) {
          navbar.appendChild(emergencySelector);
        }
      }
    }
  }
}

// Run the fix immediately
document.addEventListener('DOMContentLoaded', () => {
  // Initial run
  setTimeout(makeLanguageSelectorClickable, 500);
  
  // Run again after a delay to catch any dynamically loaded content
  setTimeout(makeLanguageSelectorClickable, 1000);
  setTimeout(makeLanguageSelectorClickable, 2000);
});

// Also run when the page is fully loaded
window.addEventListener('load', () => {
  makeLanguageSelectorClickable();
  
  // Create a MutationObserver to watch for changes to the navbar
  const observer = new MutationObserver((mutations) => {
    makeLanguageSelectorClickable();
  });
  
  // Start observing the document with the configured parameters
  setTimeout(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      observer.observe(navbar, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      console.log('✅ Set up observer for navbar changes');
    }
  }, 1000);
});

// Export the function for possible direct usage
export default makeLanguageSelectorClickable;