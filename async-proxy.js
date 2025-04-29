// Async-based HTTP proxy for port redirection (3000 -> 5000)
// Using Fetch API for simplicity

const http = require('http');
const { createReadStream } = require('fs');
const { stat } = require('fs/promises');
const { pipeline } = require('stream/promises');

// Helper function to check if target server is available
async function isServerReachable() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('http://localhost:5000/', { 
      signal: controller.signal 
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (err) {
    console.error('Error checking server:', err.message);
    return false;
  }
}

// Create server
const server = http.createServer(async (req, res) => {
  try {
    // Construct target URL
    const targetUrl = new URL(req.url, 'http://localhost:5000');
    
    console.log(`Proxying: ${req.method} ${targetUrl.href}`);
    
    // Build request options
    const options = {
      method: req.method,
      headers: req.headers
    };
    
    // Handle request body for POST/PUT requests
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      // Collect request body chunks
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      options.body = Buffer.concat(chunks);
    }
    
    // Make the request to the target server
    const response = await fetch(targetUrl.href, options);
    
    // Send response headers
    res.writeHead(response.status, Object.fromEntries(response.headers));
    
    // Send response body
    const responseBody = await response.arrayBuffer();
    res.end(Buffer.from(responseBody));
    
  } catch (err) {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) {
      res.writeHead(502);
      res.end(`Proxy error: ${err.message}`);
    }
  }
});

// Check server availability and start proxy
async function startProxy() {
  const isAvailable = await isServerReachable();
  
  if (!isAvailable) {
    console.error('Target server is not reachable at http://localhost:5000/');
    console.log('Will start anyway and retry connections as needed');
  }
  
  server.listen(3000, '0.0.0.0', () => {
    console.log('Proxy server running at http://0.0.0.0:3000/');
    console.log('Forwarding to http://localhost:5000/');
  });
  
  server.on('error', (err) => {
    console.error('Server error:', err.message);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down proxy...');
  server.close(() => {
    console.log('Proxy shut down');
    process.exit(0);
  });
});

// Start the proxy
startProxy().catch(err => {
  console.error('Failed to start proxy:', err.message);
});