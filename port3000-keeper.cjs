/**
 * Port 3000 Keeper - Keeps a proxy running on port 3000
 * This script monitors and restarts the proxy if it crashes
 */

const { spawn } = require('child_process');
const fs = require('fs');

// Configuration
const PROXY_SCRIPT = 'port-redirect-simple.cjs';
const LOG_FILE = 'port3000-keeper.log';
const MAX_RESTARTS = 10;
const RESTART_DELAY_MS = 2000;

// Initialize 
let proxyProcess = null;
let restartCount = 0;
let isShuttingDown = false;

// Logging utility
function log(message) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}\n`;
  
  // Log to console
  console.log(message);
  
  // Also log to file
  fs.appendFileSync(LOG_FILE, entry);
}

// Start the proxy process
function startProxy() {
  if (isShuttingDown) return;
  
  log(`Starting proxy process (attempt ${restartCount + 1}/${MAX_RESTARTS})`);
  
  // Spawn the proxy as a child process
  proxyProcess = spawn('node', [PROXY_SCRIPT], {
    stdio: 'pipe',
    detached: false
  });
  
  // ID for logging
  const pid = proxyProcess.pid;
  log(`Proxy process started with PID: ${pid}`);
  
  // Handle proxy process output
  proxyProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) log(`[proxy:${pid}] ${output}`);
  });
  
  proxyProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    if (output) log(`[proxy:${pid}:error] ${output}`);
  });
  
  // Handle proxy process exit
  proxyProcess.on('exit', (code, signal) => {
    log(`Proxy process exited with code ${code} and signal ${signal}`);
    
    // Clean up
    proxyProcess = null;
    
    // Restart if not shutting down and under max restart limit
    if (!isShuttingDown && restartCount < MAX_RESTARTS) {
      restartCount++;
      log(`Restarting proxy in ${RESTART_DELAY_MS}ms...`);
      setTimeout(startProxy, RESTART_DELAY_MS);
    } else if (restartCount >= MAX_RESTARTS) {
      log('Maximum restart attempts reached. Giving up.');
      process.exit(1);
    }
  });
}

// Handle keeper process signals
function cleanup() {
  isShuttingDown = true;
  log('Shutting down keeper and proxy...');
  
  if (proxyProcess) {
    log(`Terminating proxy process (PID: ${proxyProcess.pid})`);
    proxyProcess.kill('SIGTERM');
    
    // Force kill after a timeout
    setTimeout(() => {
      if (proxyProcess) {
        log('Forcing proxy termination');
        proxyProcess.kill('SIGKILL');
      }
    }, 5000);
  }
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', () => {
  log('Keeper process exiting');
});

// Initialize log file
log('==== Port 3000 Keeper Started ====');

// Start the keeper
startProxy();

// Output help
log('\nTo stop the keeper and proxy, press Ctrl+C\n');