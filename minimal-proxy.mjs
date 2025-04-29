// Ultra-minimal proxy for port 3000 -> 5000
// ES Module version
import http from 'http';

// Create proxy server on port 3000
http.createServer((req, res) => {
  // Forward to port 5000
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  // Create proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    // Copy response headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    // Pipe response data
    proxyRes.pipe(res);
  });
  
  // Handle proxy errors
  proxyReq.on('error', (e) => {
    console.error('Proxy error:', e.message);
    res.writeHead(502);
    res.end('Proxy error');
  });
  
  // Pipe original request to proxy request
  req.pipe(proxyReq);
}).listen(3000, () => {
  console.log('Proxy server running at http://localhost:3000/');
  console.log('Forwarding to http://localhost:5000/');
});