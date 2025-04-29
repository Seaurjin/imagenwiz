/**
 * Simple port redirect module for iMagenWiz
 * Redirects traffic from port 3000 to port 5000
 * Compatible with both ESM and CommonJS
 */

const http = require('http');

// Configuration
const PROXY_PORT = 3000;
const TARGET_PORT = 5000;
const TARGET_HOST = 'localhost';

// Create the proxy server
function createProxyServer() {
  const server = http.createServer((clientReq, clientRes) => {
    // Proxy configuration
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers
    };
    
    // Log the request (if not favicon or other common resources)
    if (!clientReq.url.includes('favicon.ico')) {
      console.log(`Proxy: ${clientReq.method} ${clientReq.url} -> ${TARGET_HOST}:${TARGET_PORT}`);
    }
    
    // Create proxied request
    const proxyReq = http.request(options, (proxyRes) => {
      // Copy headers and status code
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      
      // Stream response data back to client
      proxyRes.pipe(clientRes, { end: true });
    });
    
    // Handle proxy errors
    proxyReq.on('error', (error) => {
      console.error(`Proxy error: ${error.message}`);
      
      if (!clientRes.headersSent) {
        clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
        clientRes.end(`Proxy Error: ${error.message}`);
      }
    });
    
    // Stream client request to proxy
    clientReq.pipe(proxyReq, { end: true });
  });
  
  return server;
}

// Start the server
function startProxyServer() {
  const server = createProxyServer();
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Error: Port ${PROXY_PORT} is already in use`);
    } else {
      console.error(`Server error: ${error.message}`);
    }
    process.exit(1);
  });
  
  // Start listening
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log(`
🔄 Port Redirector
🚀 Listening on port ${PROXY_PORT}
🌐 Forwarding requests to ${TARGET_HOST}:${TARGET_PORT}
    `);
  });
  
  return server;
}

// Export functions for module usage
exports.createProxyServer = createProxyServer;
exports.startProxyServer = startProxyServer;

// Auto-start if this is the main module
if (require.main === module) {
  console.log('Starting port redirector from direct execution');
  startProxyServer();
}