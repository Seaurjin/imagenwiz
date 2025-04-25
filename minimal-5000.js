// Ultra minimal placeholder server for port 5000 - ES Module version
import http from 'http';
import { spawn } from 'child_process';

// Create a simple server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

// Start server immediately on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Placeholder server running on port 5000');
  
  // Start the application in a separate process
  spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    env: process.env
  });
});