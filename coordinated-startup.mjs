// Coordinated startup script for iMagenWiz application
// This script manages both the Express frontend and Flask backend

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Environment variables for both components
const ENV_VARS = {
  DB_HOST: '8.130.113.102',
  DB_PORT: '3306',
  DB_NAME: 'mat_db',
  DB_USER: 'root',
  DB_PASSWORD: 'Ir%86241992',
  SKIP_MIGRATIONS: 'true', // Skip migrations for faster startup
  FLASK_ENV: 'development',
  FLASK_DEBUG: '1',
  PORT: '3000', // Express port
  FLASK_PORT: '5000', // Flask port
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

// Function to start the Flask backend
function startFlaskBackend() {
  log('Starting Flask backend...');
  
  // Create a log file for Flask output
  const flaskLogStream = fs.createWriteStream(path.join('logs', 'flask.log'), { flags: 'a' });
  
  // Spawn the Flask process
  const flaskProcess = spawn('python', ['backend/run.py'], {
    env: { ...process.env, ...ENV_VARS },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  
  // Handle Flask process stdout
  flaskProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Flask] ${message}`);
    flaskLogStream.write(`${message}\n`);
  });
  
  // Handle Flask process stderr
  flaskProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Flask ERROR] ${message}`);
    flaskLogStream.write(`ERROR: ${message}\n`);
  });
  
  // Handle Flask process exit
  flaskProcess.on('close', (code) => {
    log(`Flask process exited with code ${code}`);
    flaskLogStream.end();
  });
  
  return flaskProcess;
}

// Function to start the Express frontend
function startExpressFrontend() {
  log('Starting Express frontend...');
  
  // Create a log file for Express output
  const expressLogStream = fs.createWriteStream(path.join('logs', 'express.log'), { flags: 'a' });
  
  // Spawn the Express process
  const expressProcess = spawn('node', ['server/index.js'], {
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
  });
  
  return expressProcess;
}

// Function to check if Flask is running
function checkFlaskHealth(retries = 10, delay = 2000) {
  return new Promise((resolve, reject) => {
    let retryCount = 0;
    
    function tryConnect() {
      log(`Checking Flask health (attempt ${retryCount + 1}/${retries})...`);
      
      const req = http.request({
        hostname: 'localhost',
        port: ENV_VARS.FLASK_PORT,
        path: '/api/health',
        method: 'GET',
        timeout: 1000
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode === 200) {
            log('✅ Flask backend is healthy and responding');
            resolve(true);
          } else {
            retryCount++;
            if (retryCount < retries) {
              setTimeout(tryConnect, delay);
            } else {
              log('❌ Flask backend health check failed after maximum retries');
              resolve(false); // Resolve with false rather than rejecting
            }
          }
        });
      });
      
      req.on('error', (error) => {
        log(`❌ Flask health check error: ${error.message}`);
        retryCount++;
        if (retryCount < retries) {
          setTimeout(tryConnect, delay);
        } else {
          log('❌ Flask backend health check failed after maximum retries');
          resolve(false);
        }
      });
      
      req.on('timeout', () => {
        log('❌ Flask health check timed out');
        req.abort();
      });
      
      req.end();
    }
    
    tryConnect();
  });
}

// Main function to start everything
async function startup() {
  log('='.repeat(70));
  log('Starting iMagenWiz Application');
  log('='.repeat(70));
  log(`Environment: Development`);
  log(`MySQL Database: ${ENV_VARS.DB_HOST}:${ENV_VARS.DB_PORT}/${ENV_VARS.DB_NAME}`);
  log(`Migrations: ${ENV_VARS.SKIP_MIGRATIONS === 'true' ? 'DISABLED' : 'ENABLED'}`);
  log('='.repeat(70));
  
  // Start the Flask backend
  const flaskProcess = startFlaskBackend();
  
  // Wait a bit for Flask to initialize
  log('Waiting for Flask backend to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Check if Flask is healthy
  const flaskHealthy = await checkFlaskHealth();
  
  // Start Express frontend even if Flask isn't healthy (fallback mode)
  log(`Starting Express frontend ${flaskHealthy ? 'with' : 'without'} Flask backend...`);
  const expressProcess = startExpressFrontend();
  
  // Set up process exit handlers
  process.on('SIGINT', () => {
    log('Received SIGINT signal, shutting down...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Received SIGTERM signal, shutting down...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
  
  // Log startup completion
  log('Both components have been started. Processes are now running...');
  log('Press Ctrl+C to stop all components.');
}

// Start the application
startup().catch((error) => {
  log(`Error during startup: ${error}`);
  process.exit(1);
});