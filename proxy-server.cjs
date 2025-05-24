const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 3000; // Frontend port

// Enable CORS for all requests with more open options
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Proxy middleware for API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000', // Backend port
  changeOrigin: true,
  // Remove the pathRewrite to prevent double /api prefix
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error occurred');
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log the request for debugging
    console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`);
  }
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding API requests from /api on port ${PORT} to http://localhost:5000`);
}); 