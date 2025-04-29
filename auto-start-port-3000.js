// Auto-start proxy script for iMagenWiz
// This script automatically starts the port 3000 proxy when imported

// Import configuration - use require.resolve to ensure file exists before trying to load it
let proxyConfig = {
  enabled: true,
  port: 3000,
  targetPort: 5000
};

// Log startup info
console.log('🔄 Auto port redirection module loaded');

// Start function
async function startProxy() {
  if (!proxyConfig.enabled) {
    console.log('ℹ️ Port redirection disabled in configuration');
    return;
  }
  
  try {
    // Use CommonJS for compatibility
    const childProcess = require('child_process');
    const fs = require('fs');
    
    console.log(`🚀 Starting port ${proxyConfig.port} → ${proxyConfig.targetPort} redirection...`);
    
    // Check if the script file exists
    const scriptPath = './pure-5000.cjs';
    if (!fs.existsSync(scriptPath)) {
      console.error(`❌ Proxy script not found: ${scriptPath}`);
      return;
    }
    
    // Start in detached mode
    const child = childProcess.spawn('node', [scriptPath], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Unref to allow parent to exit independently
    child.unref();
    
    // Log success
    console.log(`✅ Port redirection started (PID: ${child.pid})`);
    console.log(`✅ App is now accessible at: http://localhost:${proxyConfig.port}`);
  } catch (error) {
    console.error('❌ Failed to start port redirection:', error.message);
  }
}

// Start proxy automatically
startProxy().catch(error => {
  console.error('❌ Error in auto-start script:', error);
});

// Export for potential module usage
module.exports = {
  startProxy
};