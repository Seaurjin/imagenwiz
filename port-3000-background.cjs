/**
 * Minimal port 3000 redirector that forks itself to run in the background
 */

const http = require('http');
const { fork } = require('child_process');

// Configuration
const PROXY_PORT = 3000;
const TARGET_PORT = 5000;
const TARGET_HOST = 'localhost';

// Check if we're running in background mode
const isBackgroundWorker = process.argv.includes('--worker');

// Background worker mode
if (isBackgroundWorker) {
  // Create proxy server
  const server = http.createServer((clientReq, clientRes) => {
    // Proxy settings
    const options = {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers
    };
    
    // Forward the request
    const proxyReq = http.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes, { end: true });
    });
    
    // Handle errors
    proxyReq.on('error', (error) => {
      if (!clientRes.headersSent) {
        clientRes.writeHead(502, { 'Content-Type': 'text/plain' });
        clientRes.end(`Proxy Error: ${error.message}`);
      }
    });
    
    // Forward client request data
    clientReq.pipe(proxyReq, { end: true });
  });
  
  // Handle server errors
  server.on('error', (error) => {
    process.exit(1); // Exit on error
  });
  
  // Start listening
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log(`Proxy listening on port ${PROXY_PORT}`);
  });
}
// Parent/launcher mode
else {
  console.log('Starting port 3000 redirector...');
  
  // Fork a worker process
  const worker = fork(__filename, ['--worker'], {
    detached: true,
    stdio: 'ignore'
  });
  
  // Unref the worker to allow this process to exit
  worker.unref();
  
  console.log(`Started background proxy with PID: ${worker.pid}`);
  console.log('The proxy will continue running in the background.');
  console.log('To stop it, use: pkill -f "node port-3000-background.cjs --worker"');
  
  // Exit the parent process
  process.exit(0);
}