// Simple placeholder server for port 5000 to satisfy Replit
import http from 'http';
import { spawn } from 'child_process';

// Create a minimal HTTP server to handle port 5000
const server = http.createServer((req, res) => {
  // For API health check requests, return 200
  if (req.url === '/api/health-check' || req.url === '/api/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ status: 'ok', message: 'Placeholder server running' }));
  } else {
    // For all other requests, redirect to port 3000 where the real app runs
    res.writeHead(302, {
      'Location': `http://localhost:3000${req.url}`
    });
    res.end();
  }
});

// Start the server on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Placeholder server started on port 5000 to satisfy Replit');
  
  // Start the real services in the background
  setTimeout(() => {
    console.log('🚀 Starting real services via start-both.mjs...');
    const services = spawn('node', ['start-both.mjs'], {
      detached: true,
      stdio: 'inherit'
    });
    
    services.unref(); // Allow this process to exit independently
  }, 1000);
});

// Keep the main process running
process.on('SIGINT', () => {
  console.log('Received SIGINT. Placeholder server shutting down...');
  server.close(() => {
    console.log('Placeholder server closed.');
    process.exit(0);
  });
});