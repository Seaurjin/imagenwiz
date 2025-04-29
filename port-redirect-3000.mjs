/**
 * Port Redirection Server for iMagenWiz
 * 
 * This script creates a simple Express server on port 3000 that redirects
 * all requests to the main application running on port 5000.
 * 
 * Usage: node port-redirect-3000.mjs
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import http from 'http';

// Function to check if main server is running
async function checkMainServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000', (res) => {
      // Server is running
      console.log(`✅ Main server is running on port 5000 (status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.error(`❌ Main server is not running on port 5000: ${err.message}`);
      resolve(false);
    });
    
    // Set a timeout in case the server doesn't respond
    req.setTimeout(5000, () => {
      console.error('❌ Connection to main server timed out');
      req.destroy();
      resolve(false);
    });
  });
}

// Main function to start the redirect server
async function startRedirectServer() {
  console.log('🚀 Setting up port redirection from 3000 to 5000...');
  
  // Check if main server is running
  console.log('Checking if main server is running on port 5000...');
  const mainServerRunning = await checkMainServer();
  
  if (!mainServerRunning) {
    console.error('❌ Main server is not running on port 5000. Please start it first.');
    process.exit(1);
  }
  
  // Create Express app
  const app = express();
  
  // Configure proxy middleware
  const proxyOptions = {
    target: 'http://localhost:5000',
    changeOrigin: true,
    // Reduce log level in production
    logLevel: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Proxy error occurred. Please try again later.');
      }
    }
  };
  
  // Add CORS headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    next();
  });
  
  // Set up proxy for all requests
  app.use('/', createProxyMiddleware(proxyOptions));
  
  // Start the server
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`🔄 Port redirect server running on port ${PORT}`);
    console.log(`🔄 Redirecting all requests to port 5000`);
    console.log(`🔄 Access the app at: http://localhost:${PORT}`);
  });
}

// Start the redirect server
startRedirectServer().catch(err => {
  console.error('Error starting redirect server:', err);
  process.exit(1);
});