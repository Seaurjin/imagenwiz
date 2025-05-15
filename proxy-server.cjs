const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const app = express();
const PORT = 3001; // This is the port our proxy will run on

// Enable CORS for all requests with more open options
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Proxy middleware for API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5001', // Target the Gunicorn backend port
  changeOrigin: true,
  pathRewrite: {
    '^': '/api'  // Prepend /api to the path that http-proxy-middleware is about to send to the target
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error occurred');
  }
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding API requests from /api on port ${PORT} to ${'http://localhost:5001'} (with path rewrite)`);
}); 