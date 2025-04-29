// Simple port 3000 HTTP server that forwards requests to port 5000
import http from 'http';

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxy = http.request(options, function(proxyRes) {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });
  
  req.pipe(proxy);

  proxy.on('error', (e) => {
    console.error('Proxy error:', e.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end('Proxy error');
    }
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Proxy server running on port 3000');
  console.log('Forwarding requests to port 5000');
});