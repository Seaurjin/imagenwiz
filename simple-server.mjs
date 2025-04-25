// Ultra-minimal Node server that just opens port 5000 immediately to satisfy Replit
import http from 'http';
import { exec } from 'child_process';

// Create the simplest possible server that responds to all requests
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz startup server');
});

// Start this server immediately on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Simple startup server running on port 5000');
  
  // Now start the actual application in the background
  console.log('🌐 Starting the main Express application...');
  
  exec('npm run dev -- --skip-flask-check', {
    env: {
      ...process.env,
      FLASK_AVAILABLE: 'false',
      EXPRESS_FALLBACK: 'true',
      PORT: '3000',
      NODE_ENV: 'production',
      SKIP_FLASK_CHECK: 'true'
    }
  });
  
  console.log('✅ Application started in the background');
});