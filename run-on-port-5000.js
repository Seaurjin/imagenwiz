#!/usr/bin/env node

/**
 * Direct server startup script for port 5000
 * This script starts the Express server directly on port 5000 without any redirection.
 */

import { spawn } from 'child_process';
import path from 'path';

// ANSI color codes for console output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

function log(message, color = RESET) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Start the Express server
function startServer() {
  return new Promise((resolve) => {
    log('Starting Express server directly on port 5000...', YELLOW);
    
    const expressProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: {
        ...process.env,
        PORT: '5000'
      }
    });
    
    let expressReady = false;
    
    expressProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Express] ${output}`, BLUE);
        
        // Check for server ready message
        if (!expressReady && (
            output.includes('Server running at') ||
            output.includes('ready to accept connections')
        )) {
          expressReady = true;
          log('Express server is ready!', GREEN);
          resolve(expressProcess);
        }
      }
    });
    
    expressProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Express ERROR] ${output}`, RED);
      }
    });
    
    expressProcess.on('error', (error) => {
      log(`Express server startup error: ${error.message}`, RED);
    });
    
    // Resolve after timeout if we haven't already detected the ready message
    setTimeout(() => {
      if (!expressReady) {
        log('Express server timeout - assuming ready', YELLOW);
        resolve(expressProcess);
      }
    }, 30000);
  });
}

// Main function to start everything
async function startApplication() {
  log('=== Starting iMagenWiz Application on Port 5000 ===', GREEN);
  
  // Start the Express server
  const expressServer = await startServer();
  
  // Get Replit domain if available
  const replitDomain = process.env.REPL_SLUG ? 
    `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 
    'http://localhost:5000';
  
  log('=== iMagenWiz Application Started ===', GREEN);
  log(`Access your app at: ${replitDomain}`, GREEN);
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('Shutting down application...', YELLOW);
    
    // Clean up processes
    if (expressServer && expressServer.kill) {
      expressServer.kill();
    }
    
    process.exit(0);
  });
}

// Start the application
startApplication().catch((error) => {
  log(`Application startup error: ${error.message}`, RED);
  process.exit(1);
});