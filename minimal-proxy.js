// Ultra-minimal proxy with no dependencies
const http = require('http');

// Create proxy server
const server = http.createServer((req, res) => {
  // Forward request to target server
  const proxyReq = http.request({
    host: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  }, (proxyRes) => {
    // Forward response from target server
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  // Handle errors
  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Proxy error: ' + e.message);
    }
  });
  
  // Forward request body
  req.pipe(proxyReq);
});

// Start server
server.listen(3000, '0.0.0.0', () => {
  console.log('Proxy running on http://0.0.0.0:3000');
  console.log('Forwarding to http://localhost:5000');
});

// Handle errors
server.on('error', (e) => {
  console.error('Server error:', e.message);
});