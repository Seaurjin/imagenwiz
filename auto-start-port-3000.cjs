// Auto-start proxy script for iMagenWiz (CommonJS version)
// This script automatically starts the port 3000 proxy when required

// Import modules
const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const proxyConfig = {
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
    
    return child.pid;
  } catch (error) {
    console.error('❌ Failed to start port redirection:', error.message);
    return null;
  }
}

// Export for module usage
module.exports = {
  startProxy
};

// Auto-start if this is the main module
if (require.main === module) {
  startProxy().catch(error => {
    console.error('❌ Error in auto-start script:', error);
  });
}