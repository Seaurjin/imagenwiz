// Simple port 3000 HTTP server that forwards requests to port 5000
import http from 'http';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const PORT = process.env.PORT || 3000;
const TARGET_PORT = process.env.TARGET_PORT || 5000;

const server = http.createServer((req, res) => {
  const options = {
    hostname: 'localhost',
    port: TARGET_PORT,
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

server.listen(PORT, '0.0.0.0', () => {
  console.log('Proxy server running on port ' + PORT);
  console.log('Forwarding requests to port ' + TARGET_PORT);
});