// Ultra-lightweight server that starts instantly on port 5000
// and then starts the real application
const http = require('http');
const { spawn } = require('child_process');

// Create a minimal server for port 5000
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ status: 'ok' }));
});

// Start the minimal server immediately for Replit
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Placeholder server started on port 5000');
  
  // Start real application with a slight delay
  setTimeout(() => {
    console.log('🔍 Starting iMagenWiz application...');
    
    // Start Flask backend
    console.log('🐍 Starting Flask backend...');
    const flask = spawn('python3', ['backend/run.py'], {
      env: {
        ...process.env,
        FLASK_ENV: 'development',
        FLASK_DEBUG: '1',
        PORT: '5001'  // Use port 5001 for Flask (not 5000)
      },
      stdio: 'inherit'
    });
    
    // Start Express frontend after Flask has a chance to initialize
    setTimeout(() => {
      console.log('📱 Starting Express frontend...');
      const express = spawn('npm', ['run', 'dev'], {
        env: {
          ...process.env,
          FLASK_PORT: '5001',
          FLASK_URL: 'http://localhost:5001'
        },
        stdio: 'inherit'
      });
    }, 2000);
  }, 500);
});