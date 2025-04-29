/**
 * Start script for running both the main application and port proxy
 * This provides access on both port 5000 (original) and port 3000 (proxied)
 */

const { spawn } = require('child_process');
const path = require('path');

// Constants
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

// Logging helper
function log(message, color = GREEN) {
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Process management
let appProcess = null;
let proxyProcess = null;
let shuttingDown = false;

// Start main application
function startApp() {
  log('Starting main application...', CYAN);
  
  // Use npm run dev for main application
  appProcess = spawn('npm', ['run', 'dev'], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {...process.env}
  });
  
  // Log output from main application
  appProcess.stdout.on('data', (data) => {
    process.stdout.write(`${CYAN}[App] ${data}${RESET}`);
  });
  
  appProcess.stderr.on('data', (data) => {
    process.stderr.write(`${RED}[App Error] ${data}${RESET}`);
  });
  
  // Handle process exit
  appProcess.on('exit', (code, signal) => {
    log(`Main application exited with code ${code} (signal: ${signal})`, 
        code === 0 || !code ? YELLOW : RED);
    
    if (!shuttingDown) {
      log('Shutting down proxy since main application exited...', YELLOW);
      shutdown();
    }
  });
  
  return new Promise((resolve) => {
    // Allow some time for the app to start up
    setTimeout(() => {
      log('Main application started, waiting for it to initialize...', GREEN);
      resolve();
    }, 2000);
  });
}

// Start proxy server
function startProxy() {
  log('Starting port proxy (3000 → 5000)...', CYAN);
  
  // Start the proxy process
  proxyProcess = spawn('node', ['replit-port-proxy.js'], {
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Log output from proxy
  proxyProcess.stdout.on('data', (data) => {
    process.stdout.write(`${GREEN}[Proxy] ${data}${RESET}`);
  });
  
  proxyProcess.stderr.on('data', (data) => {
    process.stderr.write(`${RED}[Proxy Error] ${data}${RESET}`);
  });
  
  // Handle process exit
  proxyProcess.on('exit', (code, signal) => {
    log(`Proxy exited with code ${code} (signal: ${signal})`, 
        code === 0 || !code ? YELLOW : RED);
    
    if (!shuttingDown && appProcess) {
      // We could restart the proxy here if needed
      log('Proxy stopped unexpectedly. Will not restart automatically.', YELLOW);
    }
  });
  
  return new Promise((resolve) => {
    // Allow some time for the proxy to start up
    setTimeout(() => {
      log('Proxy started and listening on port 3000', GREEN);
      resolve();
    }, 1000);
  });
}

// Graceful shutdown
function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  
  log('Shutting down all processes...', YELLOW);
  
  // Kill proxy first
  if (proxyProcess) {
    proxyProcess.kill();
  }
  
  // Kill main app
  if (appProcess) {
    appProcess.kill();
  }
  
  // Exit process after a timeout
  setTimeout(() => {
    log('Clean shutdown complete', GREEN);
    process.exit(0);
  }, 1000);
}

// Handle process signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start everything
async function start() {
  try {
    log('Starting iMagenWiz with port redirection (port 5000 with proxy on port 3000)', CYAN);
    
    // Start the main application first
    await startApp();
    
    // Then start the proxy
    await startProxy();
    
    log('✅ iMagenWiz started successfully with port proxy!', GREEN);
    log('✅ Application available at:');
    log('   - Original port: http://localhost:5000/', GREEN);
    log('   - Proxied port: http://localhost:3000/', GREEN);
    
  } catch (err) {
    log(`Failed to start: ${err.message}`, RED);
    shutdown();
  }
}

// Start the application
start();