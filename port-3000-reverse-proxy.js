/**
 * Simple reverse proxy server for port 3000 to 5000
 * 
 * This script creates a basic HTTP server that forwards all
 * requests from port 3000 to the main application on port 5000
 * and relays the responses back to the client.
 */

// Import required modules
const http = require('http');

// Default target configuration
const TARGET = {
  host: 'localhost',
  port: 5000
};

// Utility to check if the target server is running
function checkTargetServer() {
  return new Promise((resolve) => {
    console.log(`Checking if target server is running at http://${TARGET.host}:${TARGET.port}...`);

    const req = http.request({
      hostname: TARGET.host,
      port: TARGET.port,
      path: '/',
      method: 'HEAD'
    }, (res) => {
      console.log(`✅ Target server is running (status: ${res.statusCode})`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.error(`❌ Target server check failed: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(3000, () => {
      console.error('❌ Target server check timed out');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Create the server
const server = http.createServer((clientReq, clientRes) => {
  // Get the original URL and path
  const originalUrl = clientReq.url;
  
  // Log the request
  console.log(`Proxying: ${clientReq.method} ${originalUrl} -> http://${TARGET.host}:${TARGET.port}${originalUrl}`);

  // Configure options for the proxied request
  const options = {
    hostname: TARGET.host,
    port: TARGET.port,
    path: originalUrl,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: `${TARGET.host}:${TARGET.port}`
    }
  };

  // Create the proxied request
  const proxyReq = http.request(options, (proxyRes) => {
    // Copy the response status and headers
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Pipe the response data from the proxied server to the client
    proxyRes.pipe(clientRes, { end: true });
  });

  // Handle errors
  proxyReq.on('error', (error) => {
    console.error('Proxy request error:', error);
    
    // Send an error response to the client
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
      clientRes.end(`Proxy error: Unable to forward request to the main server.\nError: ${error.message}`);
    }
  });

  // Handle client request errors
  clientReq.on('error', (error) => {
    console.error('Client request error:', error);
    
    // Abort the proxy request if it's still in progress
    if (proxyReq && !proxyReq.destroyed) {
      proxyReq.destroy();
    }
  });

  // Set a timeout on the proxy request
  proxyReq.setTimeout(30000, () => {
    console.error('Proxy request timed out');
    
    if (!clientRes.headersSent) {
      clientRes.writeHead(504, { 'Content-Type': 'text/plain' });
      clientRes.end('Proxy error: Request timed out while connecting to the main server.');
    }
    
    proxyReq.destroy();
  });

  // Pipe the client request data to the proxied request
  clientReq.pipe(proxyReq, { end: true });
});

// Start the proxy server with error handling
async function startProxyServer() {
  // Check if target server is running
  const targetRunning = await checkTargetServer();
  
  if (!targetRunning) {
    console.error(`❌ Target server at http://${TARGET.host}:${TARGET.port} is not running.`);
    console.error('Please make sure the main application is running first.');
    process.exit(1);
  }
  
  // Define the port to use
  const PORT = 3000;
  
  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Please close any other applications using this port.`);
    } else {
      console.error('Server error:', error);
    }
    process.exit(1);
  });
  server.listen(PORT, () => {
    console.log('');
    console.log('🚀 Reverse proxy server running');
    console.log(`🔄 Forwarding all requests from port ${PORT} to http://${TARGET.host}:${TARGET.port}`);
    console.log(`🔄 Access your app at: http://localhost:${PORT}`);
    console.log('🔄 Press Ctrl+C to stop the server');
    console.log('');
  });
}

// Start the proxy server
startProxyServer().catch(error => {
  console.error('Failed to start proxy server:', error);
  process.exit(1);
});