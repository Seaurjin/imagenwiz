// Simple port 3000 HTTP server that forwards requests to port 5000
// Pure CommonJS version

const http = require('http');

// Create server
const server = http.createServer((req, res) => {
  // Set up proxy options
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  // Create proxy request
  const proxy = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  // Handle proxy errors
  proxy.on('error', (e) => {
    console.error('Proxy error:', e.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Proxy error');
    }
  });
  
  // Pipe request data to proxy
  req.pipe(proxy);
});

// Start server
server.listen(3000, '0.0.0.0', () => {
  console.log('Proxy server running on port 3000');
  console.log('Forwarding requests to port 5000');
});

// Export for potential module usage
module.exports = server;