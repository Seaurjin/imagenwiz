// Port redirection module for iMagenWiz
// Can be imported into the main server or run as a standalone service

// Import HTTP library using ESM (works with type: "module" in package.json)
import http from 'http';
import { fork } from 'child_process';

// Configuration
const PORT = 3000;
const TARGET_PORT = 5000;
const TARGET_HOST = 'localhost';

/**
 * Create a proxy server that forwards requests from port 3000 to port 5000
 * @returns {http.Server} The HTTP server instance
 */
export function createProxyServer() {
  const server = http.createServer((req, res) => {
    // Configure target
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    
    // Create proxy request
    const proxyReq = http.request(options, function(proxyRes) {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });
    
    // Handle errors
    proxyReq.on('error', (e) => {
      console.error('Proxy error:', e.message);
      if (!res.headersSent) {
        res.writeHead(502);
        res.end('Proxy error');
      }
    });
    
    // Forward request body
    req.pipe(proxyReq);
  });
  
  return server;
}

/**
 * Start the proxy server in the current process
 * @returns {Promise<http.Server>} The started server
 */
export function startProxyServer() {
  return new Promise((resolve, reject) => {
    const server = createProxyServer();
    
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Error: Port ${PORT} is already in use`);
      } else {
        console.error('Server error:', error);
      }
      reject(error);
    });
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Port redirector running on ${PORT} -> ${TARGET_PORT}`);
      resolve(server);
    });
  });
}

/**
 * Start the proxy server in a background process
 * @returns {Promise<number>} The PID of the background process
 */
export function startProxyInBackground() {
  return new Promise((resolve) => {
    // Path to CommonJS version of the script
    const scriptPath = './pure-5000.cjs';
    
    // Fork a new process
    const child = fork(scriptPath, [], {
      detached: true,
      stdio: 'ignore'
    });
    
    // Unref to allow parent to exit independently
    child.unref();
    
    // Return the process ID
    resolve(child.pid);
  });
}

// Direct execution handler
if (import.meta.url === import.meta.main) {
  console.log('Starting port redirector directly...');
  startProxyServer().catch(err => {
    console.error('Failed to start proxy:', err);
    process.exit(1);
  });
}