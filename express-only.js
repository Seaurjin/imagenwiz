// Start Express server only with fallbacks for missing Flask
const { spawn } = require('child_process');

// Run Express frontend with environment set to enable fallbacks
console.log('Starting Express frontend with fallbacks...');
const express = spawn('npm', ['run', 'dev'], {
  env: {
    ...process.env,
    FLASK_IGNORE_UNAVAILABLE: 'true',
    FLASK_PORT: '5000',
    FLASK_URL: 'http://localhost:5000',
    ENABLE_FALLBACKS: 'true'
  },
  stdio: 'inherit'
});

express.on('error', (err) => {
  console.error('Failed to start Express:', err.message);
});

express.on('exit', (code) => {
  console.log('Express exited with code:', code);
});

// Keep process running
setInterval(() => {}, 1000);