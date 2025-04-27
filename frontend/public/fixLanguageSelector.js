/**
 * Emergency language selector fix script 
 * This is loaded directly in the frontend/public folder so it's available
 * without needing to rebuild the entire application
 */

(function() {
  // Function to ensure the language selector in the navbar is visible and clickable
  function fixNavbarLanguageSelector() {
    console.log('🔧 Running emergency language selector fix...');
    
    // Find the navbar and language selectors
    const navbar = document.querySelector('nav');
    if (!navbar) {
      console.log('⚠️ Navbar not found, waiting...');
      return;
    }
    
    // Try to find any language-related elements in the navbar
    const languageElements = navbar.querySelectorAll('[aria-label*="language"], button:has(span[role="img"])');
    const languageContainers = navbar.querySelectorAll('.relative:has(button)');
    
    // Fix any found language elements
    if (languageElements.length > 0) {
      console.log(`✅ Found ${languageElements.length} language elements in navbar`);
      languageElements.forEach(el => {
        // Make sure it's visible and clickable
        el.style.display = '';
        el.style.visibility = 'visible';
        el.style.opacity = '1';
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.removeAttribute('disabled');
        
        // Add emergency click handler
        el.addEventListener('click', function(e) {
          console.log('📣 Language selector clicked via emergency handler');
          
          // Try to find a dropdown to toggle
          const dropdown = el.closest('.relative')?.querySelector('.absolute');
          if (dropdown) {
            if (window.getComputedStyle(dropdown).display === 'none') {
              dropdown.style.display = 'block';
            } else {
              dropdown.style.display = 'none';
            }
          }
        });
      });
    }
    
    // Fix any language containers
    if (languageContainers.length > 0) {
      console.log(`✅ Found ${languageContainers.length} language containers in navbar`);
      languageContainers.forEach(container => {
        container.style.display = 'flex';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        container.style.pointerEvents = 'auto';
      });
    }
    
    // If we still can't find any language elements, try creating a fallback
    if (languageElements.length === 0 && languageContainers.length === 0) {
      createEmergencyLanguageSelector();
    }
  }
  
  // Create an emergency language selector if we can't find/fix the existing one
  function createEmergencyLanguageSelector() {
    // Only create once
    if (document.getElementById('emergency-language-selector')) {
      return;
    }
    
    console.log('⚠️ Creating emergency language selector');
    
    // Create the container
    const container = document.createElement('div');
    container.id = 'emergency-language-selector';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.marginLeft = '10px';
    
    // Current language (default to English)
    const currentLang = localStorage.getItem('i18nextLng') || 'en';
    
    // Language flag mapping
    const flags = {
      'en': '🇬🇧',
      'zh-TW': '🇨🇳',
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'ja': '🇯🇵',
      'ko': '🇰🇷',
      'it': '🇮🇹',
      'pt': '🇵🇹'
    };
    
    // Create toggle button
    const button = document.createElement('button');
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.padding = '8px 12px';
    button.style.border = '1px solid #e2e8f0';
    button.style.borderRadius = '4px';
    button.style.background = 'white';
    button.style.cursor = 'pointer';
    button.innerHTML = `
      <span style="margin-right:4px;font-size:16px;">${flags[currentLang] || '🌐'}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    `;
    
    // Dropdown menu
    const dropdown = document.createElement('div');
    dropdown.style.position = 'absolute';
    dropdown.style.top = '100%';
    dropdown.style.right = '0';
    dropdown.style.width = '180px';
    dropdown.style.background = 'white';
    dropdown.style.border = '1px solid #e2e8f0';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    dropdown.style.zIndex = '50';
    dropdown.style.display = 'none';
    
    // Languages to show
    const languages = [
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'zh-TW', name: '繁體中文', flag: '🇨🇳' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' }
    ];
    
    // Build language options
    languages.forEach(lang => {
      const option = document.createElement('div');
      option.style.padding = '8px 12px';
      option.style.cursor = 'pointer';
      option.style.display = 'flex';
      option.style.alignItems = 'center';
      
      if (lang.code === currentLang) {
        option.style.background = '#f7fafc';
      }
      
      option.innerHTML = `
        <span style="margin-right:8px;font-size:18px;">${lang.flag}</span>
        <span>${lang.name}</span>
      `;
      
      option.addEventListener('mouseover', () => {
        option.style.background = '#f7fafc';
      });
      
      option.addEventListener('mouseout', () => {
        if (lang.code !== currentLang) {
          option.style.background = '';
        }
      });
      
      option.addEventListener('click', () => {
        localStorage.setItem('i18nextLng', lang.code);
        window.location.reload();
      });
      
      dropdown.appendChild(option);
    });
    
    // Toggle dropdown on button click
    button.addEventListener('click', () => {
      if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target) && dropdown.style.display === 'block') {
        dropdown.style.display = 'none';
      }
    });
    
    // Add elements to the container
    container.appendChild(button);
    container.appendChild(dropdown);
    
    // Find navbar right section to add the selector
    const navbarItems = document.querySelector('nav .hidden.sm\\:ml-6.sm\\:flex.sm\\:items-center');
    
    if (navbarItems) {
      navbarItems.appendChild(container);
      console.log('✅ Added emergency language selector to navbar');
    } else {
      // Fallback if we can't find the navbar items
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.appendChild(container);
        console.log('⚠️ Added emergency language selector directly to navbar');
      } else {
        // Last resort - add to body
        document.body.appendChild(container);
        
        // Position it in the top-right corner
        container.style.position = 'fixed';
        container.style.top = '16px';
        container.style.right = '16px';
        container.style.zIndex = '9999';
        
        console.log('⚠️ Added emergency language selector to body as fixed element');
      }
    }
  }
  
  // Run fixes on page load
  window.addEventListener('DOMContentLoaded', () => {
    // First run after a small delay
    setTimeout(fixNavbarLanguageSelector, 500);
    
    // Run again after the page has had time to fully render
    setTimeout(fixNavbarLanguageSelector, 1500);
    setTimeout(fixNavbarLanguageSelector, 3000);
    
    // Add a debug button for manual triggering
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
      fixNavbarLanguageSelector();
      alert('Language selector fix attempted. Check if it\'s working now.');
    });
    
    // Add to body after a delay
    setTimeout(() => {
      document.body.appendChild(debugButton);
    }, 2000);
    
    // Set up a mutation observer to look for new elements
    const observer = new MutationObserver((mutations) => {
      let shouldRun = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldRun = true;
          break;
        }
      }
      
      if (shouldRun) {
        fixNavbarLanguageSelector();
      }
    });
    
    // Start observing once the navbar is available
    setTimeout(() => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        observer.observe(navbar, { 
          childList: true, 
          subtree: true,
          attributes: true 
        });
      }
    }, 1000);
  });
})();