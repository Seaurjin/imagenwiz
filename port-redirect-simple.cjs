// Extremely simple port 3000 -> 5000 redirector - CJS version
const http = require('http');

// Color constants for console output
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

// For debugging
console.log(`${YELLOW}Starting proxy server - port 3000 → 5000${RESET}`);
console.log(`${YELLOW}Process ID: ${process.pid}${RESET}`);

// Create the most basic proxy server possible
const server = http.createServer((req, res) => {
  const proxyReq = http.request(
    {
      host: 'localhost',
      port: 5000,
      path: req.url,
      method: req.method,
      headers: req.headers
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    }
  );
  
  proxyReq.on('error', (err) => {
    console.error(`${RED}Proxy request error:${RESET}`, err);
    try {
      if (!res.headersSent) {
        res.writeHead(502);
        res.end('Proxy error: ' + err.message);
      }
    } catch (responseErr) {
      console.error(`${RED}Failed to send error response:${RESET}`, responseErr);
    }
  });
  
  // Add timeout handling
  proxyReq.setTimeout(10000, () => {
    console.error(`${RED}Proxy request timed out${RESET}`);
    try {
      if (!res.headersSent) {
        res.writeHead(504);
        res.end('Proxy timeout: Server at port 5000 took too long to respond');
      }
    } catch (responseErr) {
      console.error(`${RED}Failed to send timeout response:${RESET}`, responseErr);
    }
  });
  
  req.pipe(proxyReq);
});

// Start the server on port 3000
server.listen(3000, '0.0.0.0', () => {
  console.log(`${GREEN}Port 3000 → 5000 redirection active${RESET}`);
  console.log(`${GREEN}App available at: http://localhost:3000/${RESET}`);
});

// Error handler
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`${RED}Port 3000 is already in use${RESET}`);
    console.log(`${YELLOW}Attempting to close existing server...${RESET}`);
    // Try again in 3 seconds
    setTimeout(() => {
      console.log(`${YELLOW}Retrying to bind to port 3000...${RESET}`);
      server.close();
      server.listen(3000, '0.0.0.0');
    }, 3000);
  } else {
    console.error(`${RED}Proxy server error:${RESET}`, err);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log(`${YELLOW}Shutting down proxy server...${RESET}`);
  server.close(() => {
    console.log(`${GREEN}Proxy server shut down gracefully${RESET}`);
    process.exit(0);
  });
});

// Keep alive
console.log(`${YELLOW}Proxy server process running with PID ${process.pid}${RESET}`);