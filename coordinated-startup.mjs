// Coordinated startup script for iMagenWiz
// This script ensures both Flask and Express start correctly
// and handles Replit's requirement for port 5000 to be available quickly

import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  flaskPort: 5001,
  expressPort: 3000,
  placeholderPort: 5000,
  flaskStartTimeout: 10000, // 10 seconds
  maxRetries: 5,
  // Use Replit domain if available
  backendUrl: process.env.REPLIT_DOMAIN ? 
    `https://${process.env.REPLIT_DOMAIN}` : 
    'http://localhost:5001'
};

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create log streams
const flaskLogStream = fs.createWriteStream(path.join(logsDir, 'flask.log'), { flags: 'a' });
const expressLogStream = fs.createWriteStream(path.join(logsDir, 'express.log'), { flags: 'a' });

// Add timestamp to log entries
function timestamp() {
  return `[${new Date().toISOString()}] `;
}

// Log to console and file
function log(message, stream = null) {
  const logMessage = timestamp() + message;
  console.log(logMessage);
  if (stream) {
    stream.write(logMessage + '\n');
  }
}

// 1. Start a simple placeholder server on port 5000 immediately
// This satisfies Replit's requirement for a fast startup
function startPlaceholderServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('iMagenWiz is starting, please wait...');
    });
    
    server.listen(config.placeholderPort, '0.0.0.0', () => {
      log(`✅ Placeholder server started on port ${config.placeholderPort}`);
      resolve(server);
    });
  });
}

// 2. Start the Flask backend on port 5001
function startFlaskBackend() {
  log('🐍 Starting Flask backend...', flaskLogStream);
  
  // Check if backend directory exists - this is optional now
  const backendDir = path.join(__dirname, 'backend');
  if (fs.existsSync(backendDir)) {
    log(`✅ Found backend directory: ${backendDir}`, flaskLogStream);
  } else {
    log(`⚠️ WARNING: backend directory not found at ${backendDir}, will try alternative locations`, flaskLogStream);
  }
  
  // Check for multiple possible Python entry points
  let flaskEntrypoint = '';
  const possibleEntrypoints = [
    path.join(__dirname, 'backend', 'run.py'),
    path.join(__dirname, 'run.py'),
    path.join(__dirname, 'backend', 'app.py')
  ];
  
  for (const entrypoint of possibleEntrypoints) {
    log(`Checking for Flask entrypoint: ${entrypoint}`, flaskLogStream);
    if (fs.existsSync(entrypoint)) {
      flaskEntrypoint = entrypoint;
      log(`✅ Found Flask entrypoint: ${flaskEntrypoint}`, flaskLogStream);
      break;
    }
  }
  
  if (!flaskEntrypoint) {
    log(`❌ ERROR: No Flask entrypoint found! Checked: ${possibleEntrypoints.join(', ')}`, flaskLogStream);
    process.exit(1);
  }
  
  // Set environment variables for Flask
  const flaskEnv = {
    ...process.env,
    FLASK_ENV: 'development',
    FLASK_DEBUG: '1',
    PORT: config.flaskPort.toString()
  };
  
  // Start Flask process
  const flask = spawn('python3', [flaskEntrypoint], {
    env: flaskEnv,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Log Flask output
  flask.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`🐍 [Flask] ${message}`, flaskLogStream);
  });
  
  flask.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`🐍 [Flask Error] ${message}`, flaskLogStream);
  });
  
  // Handle Flask exit
  flask.on('exit', (code) => {
    log(`❌ Flask backend exited with code ${code}`, flaskLogStream);
  });
  
  return flask;
}

// 3. Check if Flask is responding to health checks
async function checkFlaskHealth(retries = 0, pathIndex = 0) {
  if (retries >= config.maxRetries) {
    log('⚠️ Maximum retries reached waiting for Flask to start');
    log('⚠️ Continuing anyway, as Express can run in fallback mode');
    return false;
  }
  
  // List of endpoints to try in order
  const healthCheckPaths = ['/api/health-check', '/api/health', '/health-check', '/health'];
  
  // If we've tried all paths, increment the retry counter and start over with the first path
  if (pathIndex >= healthCheckPaths.length) {
    // Wait between full cycles of paths
    await new Promise(resolve => setTimeout(resolve, 5000));
    return checkFlaskHealth(retries + 1, 0);
  }
  
  try {
    log(`🔍 Checking Flask health (attempt ${retries + 1}/${config.maxRetries}, path ${pathIndex + 1}/${healthCheckPaths.length})...`);
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    // If running locally, use localhost; otherwise use the Replit domain
    const baseUrl = process.env.REPLIT_DOMAIN 
      ? `https://${process.env.REPLIT_DOMAIN}`
      : `http://localhost:${config.flaskPort}`;
    
    const currentPath = healthCheckPaths[pathIndex];
    const healthCheckUrl = `${baseUrl}${currentPath}`;
      
    log(`Checking health at: ${healthCheckUrl}`);
    
    const response = await fetch(healthCheckUrl, {
      signal: controller.signal
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      log(`✅ Flask backend is healthy and responding at ${currentPath}`);
      return true;
    } else {
      log(`⚠️ Health check failed at ${currentPath} with status ${response.status}`);
      // Try the next path in the list
      return checkFlaskHealth(retries, pathIndex + 1);
    }
  } catch (error) {
    log(`⚠️ Flask not responding at ${healthCheckPaths[pathIndex]}: ${error.message}`);
    
    // Try the next path in the list
    return checkFlaskHealth(retries, pathIndex + 1);
  }
}

// 4. Start Express frontend on port 3000
function startExpressFrontend() {
  log('🚀 Starting Express frontend...', expressLogStream);
  
  // Set environment variables for Express
  const expressEnv = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: config.expressPort.toString(),
    FLASK_PORT: config.flaskPort.toString(),
    FLASK_AVAILABLE: 'true',
    // For Replit, use the full domain name instead of localhost
    FLASK_URL: process.env.REPLIT_DOMAIN ? 
      `https://${process.env.REPLIT_DOMAIN}` : 
      `http://localhost:${config.flaskPort}`,
    // Provide the Replit domain for Express to use in proxying
    REPLIT_DOMAIN: process.env.REPLIT_DOMAIN || ''
  };
  
  // Start Express process
  const express = spawn('npx', ['tsx', 'server/index.ts'], {
    env: expressEnv,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  // Log Express output
  express.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`🚀 [Express] ${message}`, expressLogStream);
  });
  
  express.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`🚀 [Express Error] ${message}`, expressLogStream);
  });
  
  // Handle Express exit
  express.on('exit', (code) => {
    log(`❌ Express frontend exited with code ${code}`, expressLogStream);
    process.exit(code || 0);
  });
  
  return express;
}

// Main orchestration function
async function startApplication() {
  try {
    log('🔥 Starting iMagenWiz application...');
    
    // Check if placeholder server is already running (from placeholder-server-only.mjs)
    let placeholder = null;
    if (process.env.PLACEHOLDER_RUNNING === 'true') {
      log('Placeholder server is already running, skipping initialization');
    } else {
      // 1. Start placeholder server immediately to satisfy Replit
      placeholder = await startPlaceholderServer();
    }
    
    // 2. Start Flask backend
    const flask = startFlaskBackend();
    
    // 3. Wait for Flask to initialize (but don't block Express startup)
    setTimeout(async () => {
      await checkFlaskHealth();
    }, config.flaskStartTimeout);
    
    // 4. Start Express frontend after a short delay
    setTimeout(() => {
      const express = startExpressFrontend();
      
      // When the process is terminated, clean up
      process.on('SIGINT', () => {
        log('Received SIGINT. Shutting down...');
        if (placeholder) {
          placeholder.close();
        }
        flask.kill();
        express.kill();
        process.exit(0);
      });
    }, 2000);
  } catch (error) {
    log(`❌ Error starting application: ${error.message}`);
    process.exit(1);
  }
}

// Start the application
startApplication();