// Ultra-simple HTTP proxy for port redirection (3000 -> 5000)
// Designed for maximum compatibility and simplicity

const http = require('http');

// Create the simplest possible proxy server
http.createServer((req, res) => {
  console.log(`Proxying: ${req.method} ${req.url}`);
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e.message);
    res.writeHead(502);
    res.end('Proxy error: ' + e.message);
  });
  
  req.pipe(proxyReq);
  
}).listen(3000, '0.0.0.0', () => {
  console.log('Proxy server running at http://0.0.0.0:3000/');
  console.log('Forwarding to http://localhost:5000/');
});