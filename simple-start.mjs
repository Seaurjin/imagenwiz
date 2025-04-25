// Ultra-simplified server that starts quickly on port 5000
// and then launches the real application servers
import http from 'http';
import { spawn } from 'child_process';

// Create a minimal server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ status: 'ok', message: 'Replit workflow startup server' }));
});

// Start the server on port 5000 immediately
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Started minimal server on port 5000 for Replit workflow');
  
  // Start the real Express application after a slight delay
  setTimeout(() => {
    const express = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit'
    });
    
    express.on('error', (err) => {
      console.error('Failed to start application:', err);
    });
    
    express.on('exit', (code) => {
      console.log(`Express exited with code ${code}`);
      process.exit(code || 0);
    });
  }, 100);
});

// Keep the process running
process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});