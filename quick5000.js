// Simple port 3000 HTTP server that forwards requests to port 5000
// Compatible with both ESM and CommonJS

// Check environment
const isESM = typeof require === 'undefined';

// Import modules based on environment
let http;
if (isESM) {
  const module = await import('http');
  http = module.default;
} else {
  http = require('http');
}

const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const PORT = process.env.PORT || 3000;
const TARGET_PORT = process.env.TARGET_PORT || 5000;

// Create server
const server = http.createServer((req, res) => {
  // Set up proxy options
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
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
server.listen(PORT, '0.0.0.0', () => {
  console.log('Proxy server running on port ' + PORT);
  console.log('Forwarding requests to port ' + TARGET_PORT);
});

// Export for potential module usage
if (!isESM) {
  module.exports = server;
}