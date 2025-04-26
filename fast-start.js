// Fast-start minimal HTTP server for port 5000 with component launching
const http = require('http');
const { spawn } = require('child_process');

// Create a minimal HTTP server on port 5000
console.log('Starting minimalist HTTP server on port 5000');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

// Listen on port 5000 with a callback that starts the applications
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ HTTP server running on port 5000');
  
  console.log('Starting application components...');
  
  // First start the Express server (3000)
  console.log('Starting Express frontend...');
  const express = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      FLASK_PORT: '5000',
      FLASK_URL: 'http://localhost:5000'
    },
    stdio: 'inherit'
  });
  
  // Then start Flask backend (5001)
  setTimeout(() => {
    console.log('Starting Flask backend...');
    const flask = spawn('python3', ['backend/run.py'], {
      env: {
        ...process.env,
        FLASK_PORT: '5000',
        PORT: '5000'
      },
      stdio: 'inherit'
    });
  }, 5000);  // Give Express 5 seconds to start first
});

// Keep process running
setInterval(() => {}, 1000);