// Express-only startup script for iMagenWiz
// This script starts only the Express frontend in fallback mode
// Useful when Flask is unavailable or taking too long to initialize

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment variables for Express
const ENV_VARS = {
  PORT: '3000',                  // Express port
  FLASK_PORT: '5000',            // Flask port (for proxy config)
  FLASK_AVAILABLE: 'false',      // Flag to indicate Flask is not available
  EXPRESS_FALLBACK: 'true',      // Flag to enable Express fallback mode
  NODE_ENV: 'production',        // Run in production mode for better performance
};

// Make sure logs directory exists
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Function to log messages with timestamps
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Function to start the Express frontend
function startExpressFrontend() {
  log('Starting Express frontend in fallback mode...');
  
  // Create a log file for Express output
  const expressLogStream = fs.createWriteStream(path.join('logs', 'express.log'), { flags: 'a' });
  
  // Spawn the Express process
  const expressProcess = spawn('tsx', ['server/index.ts'], {
    env: { ...process.env, ...ENV_VARS },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  
  // Handle Express process stdout
  expressProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Express] ${message}`);
    expressLogStream.write(`${message}\n`);
  });
  
  // Handle Express process stderr
  expressProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Express ERROR] ${message}`);
    expressLogStream.write(`ERROR: ${message}\n`);
  });
  
  // Handle Express process exit
  expressProcess.on('close', (code) => {
    log(`Express process exited with code ${code}`);
    expressLogStream.end();
    
    // Restart Express if it crashes
    if (code !== 0) {
      log('Restarting Express process in 5 seconds...');
      setTimeout(startExpressFrontend, 5000);
    }
  });
  
  return expressProcess;
}

// Main function to start everything
async function startup() {
  log('='.repeat(70));
  log('Starting iMagenWiz Express Frontend');
  log('='.repeat(70));
  log(`Environment: Production (Fallback Mode)`);
  log(`Express Port: ${ENV_VARS.PORT}`);
  log(`Flask Status: Unavailable (Express will run in fallback mode)`);
  log('='.repeat(70));
  
  // Start Express frontend
  const expressProcess = startExpressFrontend();
  
  // Set up process exit handlers
  process.on('SIGINT', () => {
    log('Received SIGINT signal, shutting down...');
    expressProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Received SIGTERM signal, shutting down...');
    expressProcess.kill();
    process.exit(0);
  });
  
  // Log startup completion
  log('Express frontend has been started in fallback mode');
  log('Press Ctrl+C to stop the server.');
}

// Start the application
startup().catch((error) => {
  log(`Error during startup: ${error}`);
  process.exit(1);
});