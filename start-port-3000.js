#!/usr/bin/env node

/**
 * Port 3000 Proxy Starter Script
 * 
 * This script starts the port 3000 proxy that redirects to port 5000.
 * It can be run directly with Node.js.
 */

// Try to handle both ESM and CommonJS environments
(async function() {
  try {
    console.log('🚀 Starting port 3000 proxy...');
    
    let startMethod;
    
    // Check if we're in ESM or CommonJS environment
    if (typeof require !== 'undefined') {
      // CommonJS environment
      console.log('Using CommonJS mode');
      const child_process = require('child_process');
      
      // Start the proxy in a detached process
      const child = child_process.spawn('node', ['pure-5000.cjs'], {
        detached: true,
        stdio: 'ignore'
      });
      
      // Unref child to allow this process to exit independently
      child.unref();
      
      console.log(`✅ Proxy started in background process (PID: ${child.pid})`);
      console.log('✅ Redirecting port 3000 to 5000');
    } else {
      // ESM environment
      console.log('Using ESM mode');
      const { startProxyInBackground } = await import('./port-redirect.js');
      
      // Start the proxy
      const pid = await startProxyInBackground();
      
      console.log(`✅ Proxy started in background process (PID: ${pid})`);
      console.log('✅ Redirecting port 3000 to 5000');
    }
    
    console.log('✅ You can now access the app at: http://localhost:3000');
    console.log('To stop the proxy, run: ./stop-port-3000.sh');
  } catch (error) {
    console.error('❌ Failed to start proxy:', error.message);
    process.exit(1);
  }
})();