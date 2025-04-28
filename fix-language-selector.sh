#!/bin/bash

# Script to fix the language selector duplication issue

echo "🔄 Starting language selector fix process..."

# Step 1: Create our fix script
mkdir -p frontend/public
cat > frontend/public/removeSecondLanguageSelector.js << 'EOL'
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
EOL

echo "✅ Created fix script in frontend/public/"

# Step 2: Create CSS rules file for language selector
cat > frontend/public/fix-language-selector.css << 'EOL'
/* Fix for duplicate language selectors in navbar */

/* Always make THE FIRST navbar language selector visible */
nav .relative:has(button[aria-label*="language"]):first-of-type,
.hidden.sm\:ml-6.sm\:flex.sm\:items-center .relative:has(button):first-of-type,
.hidden.sm\:ml-6.sm\:flex.sm\:items-center button:has(span[role="img"]):first-of-type {
  display: flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  pointer-events: auto !important;
}

/* Hide any duplicate language selectors - including the "Language" text button */
nav button.flex.items-center:has(span:only-child:contains("Language")),
.hidden.sm\:ml-6.sm\:flex.sm\:items-center .space-x-4 button:has(span:contains("Language")),
nav .space-x-4 .relative:has(button span:contains("Language")),
.space-x-4 > div:nth-child(3):has(button:contains("Language")) {
  display: none !important;
}

/* Hide the standalone floating language selector */
div[style*="position: fixed"][style*="bottom"][style*="right"],
button.flex.items-center:has(span:contains("Language")):not(nav *),
div[style*="fixed"] div:has(h3:contains("Language")) {
  display: none !important;
}

/* Hide duplicate language selectors by position in navbar (rightmost one) */
.hidden.sm\:ml-6.sm\:flex.sm\:items-center > .space-x-4 > *:last-child:has(button),
.sm\:flex.sm\:items-center button[aria-haspopup="true"]:last-of-type {
  display: none !important;
}
EOL

echo "✅ Created CSS rules file in frontend/public/"

# Step 3: Edit the index.html in frontend/src to include our script
cd frontend
indexFile=$(find src -name "index.html")

if [ -n "$indexFile" ]; then
  echo "📝 Adding our fix script to $indexFile..."
  
  # Add fix script after head
  sed -i '/<\/head>/i \    <link rel="stylesheet" href="\/fix-language-selector.css">' "$indexFile"
  
  # Add fix script after body
  sed -i '/<body>/a \    <script src="\/removeSecondLanguageSelector.js"><\/script>' "$indexFile"
  
  echo "✅ Updated $indexFile with our fixes"
else
  echo "⚠️ Could not find index.html in frontend/src"
  
  # Create a simple index.html in public folder as backup
  mkdir -p public
  cat > public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="iMagenWiz - AI-powered image background removal and processing for professionals" />
    <title>iMagenWiz - AI Background Removal</title>
    <link rel="stylesheet" href="/fix-language-selector.css">
  </head>
  <body>
    <script src="/removeSecondLanguageSelector.js"></script>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOL
  echo "✅ Created backup index.html in frontend/public/"
fi

cd ..

# Step 4: Also edit main.jsx to inject our script (if present)
mainFile=$(find frontend -name "main.jsx" -o -name "main.tsx" | head -1)

if [ -n "$mainFile" ]; then
  echo "📝 Adding additional fix to $mainFile..."
  
  # Create a backup of the main file
  cp "$mainFile" "${mainFile}.backup"
  
  # Add fix script at the top of the file
  sed -i '/^import/i // Fix for duplicate language selectors\ndocument.addEventListener("DOMContentLoaded", function() {\n  const script = document.createElement("script");\n  script.src = "/removeSecondLanguageSelector.js";\n  document.body.appendChild(script);\n});\n' "$mainFile"
  
  echo "✅ Updated $mainFile with additional fix"
else
  echo "⚠️ Could not find main.jsx or main.tsx in frontend/"
fi

echo "🎉 Language selector fix applied successfully!"
echo "👉 Now rebuild the frontend with: cd frontend && npm run build"