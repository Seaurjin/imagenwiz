/**
 * Full-stack application runner for iMagenWiz
 * 
 * This script starts both the Express frontend and Flask backend with proper coordination.
 * It gives Flask additional time to complete database migrations before starting
 * health checks and reporting readiness.
 */

import { spawn } from 'child_process';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log(`
╔════════════════════════════════════════════════════╗
║           iMagenWiz Full-Stack Launcher            ║
║      Running Express frontend + Flask backend      ║
╚════════════════════════════════════════════════════╝
`);

// Configuration
const EXPRESS_PORT = process.env.PORT || 3000;
const FLASK_PORT = 5000;
const MAX_STARTUP_TIME = 120000; // 2 minutes max wait for Flask

// Paths may need adjustment based on your project structure
const EXPRESS_START_CMD = 'node';
const EXPRESS_START_ARGS = ['server/index.js'];
const FLASK_START_CMD = 'python';
const FLASK_START_ARGS = ['backend/run.py'];

// Check if migrations should be skipped (development mode)
const skipMigrations = process.env.SKIP_MIGRATIONS === 'true';
if (skipMigrations) {
  console.log('🚀 Starting in DEVELOPMENT MODE with migrations DISABLED');
  console.log('⚠️ This mode is faster but some features may not work correctly');
  console.log('⚠️ Not recommended for production use');
}

// State tracking
let expressReady = false;
let flaskReady = false;
let expressProcess = null;
let flaskProcess = null;
let startTime = Date.now();

// Helper to check if a port is in use
function checkPort(port) {
  return new Promise((resolve) => {
    const socket = new http.Socket();
    
    socket.setTimeout(1000); // 1 second timeout
    
    socket.on('connect', () => {
      socket.destroy();
      resolve(true); // Port is in use
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false); // Port not in use
    });
    
    socket.on('error', () => {
      socket.destroy();
      resolve(false); // Port not in use
    });
    
    socket.connect(port, 'localhost');
  });
}

// Start Flask backend first
console.log('🚀 Starting Flask backend...');

// Add SKIP_MIGRATIONS env var if needed
const flaskEnv = { 
  ...process.env, 
  PORT: FLASK_PORT.toString(),
};

// Set environment variables for Flask
if (skipMigrations) {
  flaskEnv.SKIP_MIGRATIONS = 'true';
}

// Set MySQL environment variables
flaskEnv.DB_HOST = '8.130.113.102';
flaskEnv.DB_PORT = '3306';
flaskEnv.DB_NAME = 'mat_db';
flaskEnv.DB_USER = 'root';
flaskEnv.DB_PASSWORD = 'Ir%86241992';

flaskProcess = spawn(FLASK_START_CMD, FLASK_START_ARGS, {
  stdio: 'pipe',
  env: flaskEnv
});

// Set up Flask process event handlers
flaskProcess.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Flask] ${output}`);
  
  // Check for key indicators in Flask logs
  if (output.includes('Running on') && output.includes('http://')) {
    console.log('✅ Flask backend started and listening for requests');
    
    if (!skipMigrations) {
      console.log('⚠️ Backend may still be initializing database migrations');
    }
    
    // Start Express after Flask is running
    if (!expressProcess) {
      startExpressServer();
    }
  }
  
  // Detect MySQL connection success
  if (output.includes('connecting to MySQL')) {
    console.log('🔌 Flask is connecting to the MySQL database');
  }
  
  // Detect successful migrations
  if (output.includes('migration') && output.includes('successfully')) {
    console.log('🔄 A database migration completed successfully');
  }
  
  // Detect skipped migrations
  if (output.includes('SKIPPED') && output.includes('migration')) {
    console.log('⏩ Database migrations skipped (development mode)');
  }
});

flaskProcess.stderr.on('data', (data) => {
  console.error(`[Flask ERROR] ${data.toString().trim()}`);
});

flaskProcess.on('close', (code) => {
  console.log(`⚠️ Flask backend process exited with code ${code}`);
  flaskReady = false;
  
  // Attempt to restart Flask if it crashes
  if (expressProcess) {
    console.log('🔄 Attempting to restart Flask backend...');
    flaskProcess = spawn(FLASK_START_CMD, FLASK_START_ARGS, {
      stdio: 'pipe',
      env: flaskEnv
    });
  }
});

// Function to start Express server
function startExpressServer() {
  console.log('🚀 Starting Express frontend server...');
  
  expressProcess = spawn(EXPRESS_START_CMD, EXPRESS_START_ARGS, {
    stdio: 'pipe',
    env: { ...process.env, PORT: EXPRESS_PORT.toString() }
  });
  
  expressProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`[Express] ${output}`);
    
    // Check for key indicators in Express logs
    if (output.includes('listening on port') || output.includes(`Server running on`)) {
      console.log(`✅ Express server started on port ${EXPRESS_PORT}`);
      expressReady = true;
      checkApplicationStatus();
    }
    
    // Look for successful Flask connection indicators
    if (output.includes('Flask backend is running') || output.includes('Full stack application is running')) {
      console.log('✅ Express successfully connected to Flask backend');
      flaskReady = true;
      checkApplicationStatus();
    }
  });
  
  expressProcess.stderr.on('data', (data) => {
    console.error(`[Express ERROR] ${data.toString().trim()}`);
  });
  
  expressProcess.on('close', (code) => {
    console.log(`⚠️ Express frontend process exited with code ${code}`);
    expressReady = false;
    
    // If Express exits, shut down Flask as well
    if (flaskProcess) {
      console.log('⚠️ Shutting down Flask backend due to Express exit');
      flaskProcess.kill('SIGINT');
    }
    
    process.exit(code);
  });
}

// Check and log application status
function checkApplicationStatus() {
  if (expressReady && flaskReady) {
    const startupTime = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`
╔════════════════════════════════════════════════════╗
║        🎉 Full-stack application is ready!         ║
║                                                    ║
║  🌐 Frontend: http://localhost:${EXPRESS_PORT}          ║
║  🔄 Backend API: http://localhost:${EXPRESS_PORT}/api   ║
║  ⏱️  Startup time: ${startupTime}s                       ║
╚════════════════════════════════════════════════════╝
`);
  } else if (expressReady) {
    console.log('⚠️ Express is ready but waiting for Flask backend to complete initialization');
    
    // Set a timeout to check Flask health
    setTimeout(async () => {
      try {
        const isFlaskRunning = await checkPort(FLASK_PORT);
        if (isFlaskRunning) {
          console.log('✅ Flask port is now active, application should be fully functional soon');
          flaskReady = true;
          checkApplicationStatus();
        } else if (Date.now() - startTime > MAX_STARTUP_TIME) {
          console.log('⚠️ Flask backend initialization timeout exceeded');
          console.log('⚠️ Application will run in limited functionality mode');
        }
      } catch (error) {
        console.error('Error checking Flask status:', error);
      }
    }, 5000);
  }
}

// Handle process termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down servers gracefully...');
  if (expressProcess) expressProcess.kill('SIGINT');
  if (flaskProcess) flaskProcess.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down servers gracefully...');
  if (expressProcess) expressProcess.kill('SIGTERM');
  if (flaskProcess) flaskProcess.kill('SIGTERM');
  process.exit(0);
});

// Initial status check after a delay
setTimeout(checkApplicationStatus, 5000);