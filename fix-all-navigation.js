/**
 * Enhanced script to fix ALL navigation links in the production build
 * This adds script to the head that patches all a href links to use React Router
 */

import fs from 'fs';
import path from 'path';

const indexHtmlPath = './frontend/dist/index.html';

// Read the index.html file
try {
  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

  // Create a script to fix navigation links
  const fixNavigationScript = `
  <script>
    // This script fixes navigation links by intercepting click events on <a> tags
    // and using React Router navigation instead of full page reloads
    document.addEventListener('DOMContentLoaded', function() {
      // Function to handle navigation clicks
      function handleNavigationClick(event) {
        // Get all anchor tags in the document
        const navLinks = document.querySelectorAll('a[href^="/"], .footer-links a, .footer-legal-links a, .nav-links a, nav a');
        
        // Add click event listeners to all internal links
        navLinks.forEach(link => {
          if (!link.getAttribute('data-router-fixed')) {
            link.setAttribute('data-router-fixed', 'true');
            link.addEventListener('click', function(e) {
              const href = this.getAttribute('href');
              
              // Only handle internal links (not external or anchor links)
              if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/#')) {
                e.preventDefault();
                
                // Use window history to navigate without a full page reload
                window.history.pushState({}, '', href);
                
                // Dispatch a popstate event to trigger React Router navigation
                const navEvent = new PopStateEvent('popstate');
                window.dispatchEvent(navEvent);
                
                console.log('✅ Navigation intercepted for:', href);
              }
            });
          }
        });
      }
      
      // Run the handler immediately
      handleNavigationClick();
      
      // Also run after a short delay to catch dynamically rendered elements
      setTimeout(handleNavigationClick, 500);
      setTimeout(handleNavigationClick, 1000);
      setTimeout(handleNavigationClick, 2000);
      
      // Set up a mutation observer to handle dynamically added links
      const observer = new MutationObserver(function(mutations) {
        handleNavigationClick();
      });
      
      // Start observing the document body for DOM changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('✅ Enhanced navigation link fixer initialized');
    });
  </script>
  `;

  // Insert the script right before the closing head tag
  htmlContent = htmlContent.replace('</head>', fixNavigationScript + '</head>');

  // Write the modified HTML back to the file
  fs.writeFileSync(indexHtmlPath, htmlContent);
  console.log('Successfully added enhanced navigation fix script to index.html');
} catch (error) {
  console.error('Error updating index.html:', error);
}