// Coordinated startup script for iMagenWiz application
// This script starts both the Flask backend and the Express frontend

import { spawn } from 'child_process';
import http from 'http';

// Terminal colors
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Logger function
function log(message, color = RESET) {
  const timestamp = new Date().toISOString();
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Create minimal placeholder server for port 5000
function startPlaceholderServer() {
  return new Promise((resolve) => {
    log('Starting minimal placeholder server on port 5000...', BLUE);
    
    // Create a simple server
    const server = http.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('iMagenWiz is starting...');
    });
    
    // Start server on port 5000
    server.listen(5000, '0.0.0.0', () => {
      log('✅ Placeholder server running on port 5000', GREEN);
      resolve(server);
    });
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        log('⚠️ Port 5000 is already in use. This is OK if another instance is running.', YELLOW);
        resolve(null);
      } else {
        log(`❌ Error starting placeholder server: ${err.message}`, RED);
        resolve(null);
      }
    });
  });
}

// Start Flask backend
function startFlaskBackend() {
  log('Starting Flask backend...', BLUE);
  
  // Get the Replit domain
  const replitDomain = process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co';
  log(`Replit domain: ${replitDomain}`, GREEN);
  
  // Set environment variables for Flask
  const env = {
    ...process.env,
    FLASK_ENV: 'development',
    FLASK_DEBUG: '1',
    PORT: '5001',
    DB_USER: 'root',
    DB_PASSWORD: 'Ir%86241992',
    DB_HOST: '8.130.113.102',
    DB_NAME: 'mat_db',
    DB_PORT: '3306',
    SKIP_MIGRATIONS: 'true'
  };
  
  // Start Flask using python run.py
  const flaskProcess = spawn('python', ['backend/run.py'], {
    stdio: 'pipe',
    env
  });
  
  // Log Flask output
  flaskProcess.stdout.on('data', (data) => {
    log(`Flask: ${data}`, BLUE);
  });
  
  flaskProcess.stderr.on('data', (data) => {
    log(`Flask Error: ${data}`, RED);
  });
  
  flaskProcess.on('close', (code) => {
    log(`Flask process exited with code ${code}`, code === 0 ? GREEN : RED);
  });
  
  return flaskProcess;
}

// Start Express frontend
function startExpressFrontend(replitDomain) {
  log('Starting Express frontend...', BLUE);
  
  // Set environment variables for Express
  const env = {
    ...process.env,
    PORT: '3000',
    FLASK_PORT: '5001',
    FLASK_URL: `https://${replitDomain}`,
    REPLIT_DOMAIN: replitDomain
  };
  
  // Start Express using npm run dev
  const expressProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    env
  });
  
  // Log Express output
  expressProcess.stdout.on('data', (data) => {
    log(`Express: ${data}`, GREEN);
  });
  
  expressProcess.stderr.on('data', (data) => {
    log(`Express Error: ${data}`, RED);
  });
  
  expressProcess.on('close', (code) => {
    log(`Express process exited with code ${code}`, code === 0 ? GREEN : RED);
  });
  
  return expressProcess;
}

// Main function to start everything
async function startApplication() {
  try {
    log('Starting iMagenWiz application...', GREEN);
    
    // Get the Replit domain
    const replitDomain = process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co';
    log(`Replit domain: ${replitDomain}`, GREEN);
    
    // Start the placeholder server first to satisfy Replit's port requirement
    const placeholderServer = await startPlaceholderServer();
    
    // Start Flask backend
    const flaskProcess = startFlaskBackend();
    
    // Start Express frontend after a short delay
    setTimeout(() => {
      const expressProcess = startExpressFrontend(replitDomain);
      
      // Handle process termination
      process.on('SIGINT', () => {
        log('Shutting down all processes...', YELLOW);
        if (placeholderServer) placeholderServer.close();
        if (flaskProcess) flaskProcess.kill();
        if (expressProcess) expressProcess.kill();
        process.exit(0);
      });
    }, 2000);
    
    log('All processes started!', GREEN);
  } catch (error) {
    log(`Error starting application: ${error.message}`, RED);
    process.exit(1);
  }
}

// Start the application
startApplication();