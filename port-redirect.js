/**
 * Port Redirection Server for iMagenWiz
 * 
 * This script creates a simple Express server on port 3000 that redirects
 * all requests to the main application running on port 5000.
 * 
 * Usage: node port-redirect.js
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create Express app
const app = express();

// Configure proxy middleware
const proxyOptions = {
  target: 'http://localhost:5000',
  changeOrigin: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Proxy error occurred. Please try again later.');
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