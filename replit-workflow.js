// This script is designed to run in Replit's workflow environment
// It starts both Express and Flask components with the necessary environment variables

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const EXPRESS_PORT = 3000;
const FLASK_PORT = 5000;
const ENV_VARS = {
  DB_HOST: '8.130.113.102',
  DB_PORT: '3306',
  DB_NAME: 'mat_db',
  DB_USER: 'root',
  DB_PASSWORD: 'Ir%86241992',
  SKIP_MIGRATIONS: 'true',
  FLASK_APP: 'backend/app',
  FLASK_ENV: 'development',
  PORT: EXPRESS_PORT.toString(),
  // Additional debugging flags
  DEBUG_EXPRESS: 'true',
  VERBOSE_LOGGING: 'true',
};

// Ensure logs directory exists
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Helper to create timestamped log files
const getLogFileName = (prefix) => {
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}`;
  return path.join('logs', `${prefix}_${timestamp}.log`);
};

// Helper to log with timestamp
const log = (message) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${message}`);
};

// Start Flask backend
const startFlaskBackend = () => {
  log('Starting Flask backend...');
  
  const flaskLogStream = fs.createWriteStream(getLogFileName('flask'));
  
  const flaskProcess = spawn('python', ['backend/run.py'], {
    env: { ...process.env, ...ENV_VARS },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  flaskProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Flask] ${message}`);
    flaskLogStream.write(`${message}\n`);
  });
  
  flaskProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Flask-ERR] ${message}`);
    flaskLogStream.write(`ERROR: ${message}\n`);
  });
  
  flaskProcess.on('close', (code) => {
    log(`Flask process exited with code ${code}`);
    flaskLogStream.end();
    // Don't restart automatically - let Replit handle restarts if needed
  });
  
  return flaskProcess;
};

// Start Express frontend
const startExpressFrontend = () => {
  log('Starting Express frontend...');
  
  const expressLogStream = fs.createWriteStream(getLogFileName('express'));
  
  const expressProcess = spawn('node', ['server/index.js'], {
    env: { ...process.env, ...ENV_VARS },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  
  expressProcess.stdout.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Express] ${message}`);
    expressLogStream.write(`${message}\n`);
  });
  
  expressProcess.stderr.on('data', (data) => {
    const message = data.toString().trim();
    log(`[Express-ERR] ${message}`);
    expressLogStream.write(`ERROR: ${message}\n`);
  });
  
  expressProcess.on('close', (code) => {
    log(`Express process exited with code ${code}`);
    expressLogStream.end();
    // Don't restart automatically - let Replit handle restarts if needed
  });
  
  return expressProcess;
};

// Main startup function
const startApplication = async () => {
  log('======================================================');
  log('🚀 Starting iMagenWiz Full-Stack Application');
  log(`📊 Database: ${ENV_VARS.DB_HOST}:${ENV_VARS.DB_PORT}/${ENV_VARS.DB_NAME}`);
  log(`📢 Express will run on port ${EXPRESS_PORT}`);
  log(`📢 Flask will run on port ${FLASK_PORT}`);
  log('======================================================');
  
  // Start Flask backend first
  const flaskProcess = startFlaskBackend();
  
  // Wait a bit to let Flask initialize
  log('Waiting 5 seconds for Flask to initialize...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Start Express frontend
  const expressProcess = startExpressFrontend();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('Shutting down...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('Shutting down...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
};

// Start the application
startApplication().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});