/**
 * Replit-specific port proxy (3000 → 5000)
 * Designed to work reliably in the Replit environment
 */

const http = require('http');

// Colors for console output
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';

// Log with timestamp and color
function log(message, color = GREEN) {
  const timestamp = new Date().toISOString().replace('T', ' ').substr(0, 19);
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Create proxy server
const server = http.createServer((req, res) => {
  // Log each request (but not too much)
  if (req.url === '/' || !req.url.startsWith('/assets/')) {
    log(`Proxying: ${req.method} ${req.url}`, YELLOW);
  }

  // Create options for the proxied request
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: {...req.headers, host: 'localhost:5000'}
  };

  // Create proxied request
  const proxyReq = http.request(options, (proxyRes) => {
    // Copy status code and headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Stream response data
    proxyRes.pipe(res);
  });

  // Handle target server errors
  proxyReq.on('error', (err) => {
    log(`Proxy error: ${err.message}`, RED);
    
    // Only send response if headers not sent yet
    if (!res.headersSent) {
      res.writeHead(502);
      res.end(`Proxy Error: Could not connect to server on port 5000. Please ensure the server is running.`);
    }
  });

  // Send request body (if any)
  req.pipe(proxyReq);
});

// Start listening on port 3000
server.listen(3000, '0.0.0.0', () => {
  log(`Port Proxy started - redirecting requests from 3000 → 5000`);
  log(`Application is now available at http://localhost:3000/`);
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    log(`Port 3000 is already in use. Cannot start proxy.`, RED);
  } else {
    log(`Server error: ${err.message}`, RED);
  }
});

// Handle process signals
process.on('SIGINT', () => {
  log(`Shutting down proxy...`, YELLOW);
  server.close(() => {
    log(`Proxy shut down successfully`, GREEN);
    process.exit(0);
  });
});

log(`Proxy server process started with PID: ${process.pid}`);