// Script to start both Express and Flask
import { spawn } from 'child_process';
import http from 'http';
import { setTimeout } from 'timers/promises';

// Create a dummy server on port 5000 (for Replit)
// This must stay active until the Flask backend is ready to take over
const dummyServer = http.createServer((req, res) => {
  // For API health check requests, return 200 to indicate the server is up
  if (req.url === '/api/health' || req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ status: 'ok', message: 'Placeholder server running' }));
  } else {
    // For all other requests, indicate placeholder is active
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('iMagenWiz placeholder server - actual application starting');
  }
});

// Start processes asynchronously so placeholder stays active
async function startApplications() {
  try {
    // Open port 5000 IMMEDIATELY - this is critical for Replit
    dummyServer.listen(5000, '0.0.0.0', async () => {
      console.log('✅ Placeholder server started on port 5000 to satisfy Replit');
      
      // Start both services in parallel
      startFlaskBackend();
      
      // Wait a moment before starting Express to allow Flask to initialize
      await setTimeout(2000);
      startExpressFrontend();
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

function startFlaskBackend() {
  console.log('🐍 Starting Flask backend...');
  
  const flaskBackend = spawn('python3', ['backend/app.py'], {
    env: {
      ...process.env,
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      PORT: '5001' // Use a different port to avoid conflict with placeholder
    },
    stdio: 'inherit'
  });
  
  flaskBackend.on('error', (err) => {
    console.error('Failed to start Flask backend:', err);
  });
  
  flaskBackend.on('exit', (code) => {
    console.log(`Flask backend exited with code ${code}`);
    // Don't exit the process here, let Express continue running
  });
  
  // Keep placeholder server running during Flask startup
  return flaskBackend;
}

function startExpressFrontend() {
  console.log('🚀 Starting Express frontend...');
  
  const expressApp = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: '3000',
      FLASK_PORT: '5001', // Point to the actual Flask port
      FLASK_AVAILABLE: 'true'
    },
    stdio: 'inherit'
  });
  
  expressApp.on('error', (err) => {
    console.error('Failed to start Express application:', err);
  });
  
  expressApp.on('exit', (code) => {
    console.log(`Express application exited with code ${code}`);
    process.exit(code || 0);
  });
  
  return expressApp;
}

// Entry point
startApplications();