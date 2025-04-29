// Minimal proxy server from 3000 to 5000
const http = require('http');

// Target server config
const TARGET = {
  host: 'localhost',
  port: 5000
};

// Create proxy server
const server = http.createServer((clientReq, clientRes) => {
  console.log(`Proxy: ${clientReq.method} ${clientReq.url}`);
  
  const options = {
    hostname: TARGET.host,
    port: TARGET.port,
    path: clientReq.url,
    method: clientReq.method,
    headers: { ...clientReq.headers }
  };
  
  const proxyReq = http.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes, { end: true });
  });
  
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end('Proxy Error');
    }
  });
  
  clientReq.pipe(proxyReq, { end: true });
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding to ${TARGET.host}:${TARGET.port}`);
});