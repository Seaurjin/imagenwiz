/**
 * Standalone proxy server for port 3000
 * This redirects all requests to the main application on port 5000
 */

import * as http from 'http';

// Colors for console
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';  
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Log with timestamp
function log(message, color = GREEN) {
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Create the proxy server
const server = http.createServer((req, res) => {
  // Log incoming request (except for assets to reduce noise)
  if (!req.url.startsWith('/assets/')) {
    log(`Proxying: ${req.method} ${req.url}`, YELLOW);
  }
  
  // Forward options
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: {...req.headers, host: 'localhost:5000'}
  };
  
  // Create proxied request
  const proxyReq = http.request(options, (proxyRes) => {
    // Copy response headers and status
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Pipe response data
    proxyRes.pipe(res);
  });
  
  // Handle errors
  proxyReq.on('error', (err) => {
    log(`Proxy error: ${err.message}`, RED);
    
    if (!res.headersSent) {
      res.writeHead(502);
      res.end(`Proxy Error: Could not connect to server on port 5000`);
    }
  });
  
  // Forward request body
  req.pipe(proxyReq);
});

// Start listening
server.listen(3000, '0.0.0.0', () => {
  log(`Standalone proxy started - redirecting requests from port 3000 → 5000`);
  log(`Access your application at: http://localhost:3000/`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`Port 3000 is already in use. Proxy not started.`, RED);
  } else {
    log(`Server error: ${err.message}`, RED);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  log(`Shutting down proxy...`, YELLOW);
  server.close(() => {
    log(`Proxy server shutdown complete`, GREEN);
    process.exit(0);
  });
});

log(`Proxy server process started with PID: ${process.pid}`);