/**
 * Fixed Auth Proxy
 * 
 * This script properly forwards /api/auth/login to the Flask backend
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

// Create an Express app
const app = express();

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
  next();
});

// Configure Flask backend URL
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// Add CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Configure proxy for auth endpoints - fixes the missing /api prefix issue
const authProxyConfig = {
  target: FLASK_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '/api/auth' }, // Keep /api prefix for Flask
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('[Auth Proxy] Error:', err);
    res.status(500).json({ error: 'Auth proxy error', message: err.message });
  }
};

// Apply proxy to auth routes
app.use('/api/auth', createProxyMiddleware(authProxyConfig));

// Start server
const PORT = 3003;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fixed Auth Proxy running at http://0.0.0.0:${PORT}/`);
  console.log(`Forwarding authentication requests to ${FLASK_BACKEND_URL}`);
}); 