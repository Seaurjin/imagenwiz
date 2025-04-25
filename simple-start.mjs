// Ultra-simplified server that starts quickly on port 5000
// and then launches both the Flask backend and Express frontend
import http from 'http';
import { spawn } from 'child_process';

// Create a minimal server for port 5000 (to satisfy Replit)
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ status: 'ok', message: 'Replit workflow startup server' }));
});

// Start the server on port 5000 immediately
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Started minimal server on port 5000 for Replit workflow');
  
  // Start Flask backend first
  console.log('🐍 Starting Flask backend on port 5001...');
  const flask = spawn('python3', ['backend/run.py'], {
    env: {
      ...process.env,
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      PORT: '5001' // Use port 5001 to avoid conflict
    },
    stdio: 'inherit'
  });
  
  flask.on('error', (err) => {
    console.error('⚠️ Failed to start Flask backend:', err);
  });
  
  // Start the Express frontend with a delay to allow Flask to initialize
  setTimeout(() => {
    console.log('🚀 Starting Express frontend...');
    const express = spawn('npm', ['run', 'dev'], {
      env: {
        ...process.env,
        FLASK_PORT: '5001', // Tell Express where Flask is running
        FLASK_URL: 'http://localhost:5001'
      },
      stdio: 'inherit'
    });
    
    express.on('error', (err) => {
      console.error('⚠️ Failed to start Express application:', err);
    });
    
    express.on('exit', (code) => {
      console.log(`Express exited with code ${code}`);
      flask.kill(); // Kill Flask when Express exits
      process.exit(code || 0);
    });
  }, 1000); // Give Flask a head start
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});