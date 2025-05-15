/**
 * Direct Auth Proxy
 * 
 * This script directly handles auth endpoints with manual request forwarding
 */

const express = require('express');
const axios = require('axios');

// Create an Express app
const app = express();

// Add body parsing middleware
app.use(express.json());

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

// Direct manual proxy for /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  console.log('[Auth Proxy] Received login request:', req.body);
  
  try {
    // Forward the request to Flask with EXACTLY the same URL path
    const targetUrl = `${FLASK_BACKEND_URL}/api/auth/login`;
    console.log(`[Auth Proxy] Forwarding to: ${targetUrl}`);
    
    const response = await axios.post(targetUrl, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`[Auth Proxy] Login response status: ${response.status}`);
    
    // Forward the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Auth Proxy] Error:', error.message);
    // If we have an axios response error, forward the status and error data
    if (error.response) {
      console.log(`[Auth Proxy] Error response:`, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Proxy Error',
        message: error.message
      });
    }
  }
});

// Direct manual proxy for /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  console.log('[Auth Proxy] Received register request');
  
  try {
    // Forward the request to Flask
    const targetUrl = `${FLASK_BACKEND_URL}/api/auth/register`;
    console.log(`[Auth Proxy] Forwarding to: ${targetUrl}`);
    
    const response = await axios.post(targetUrl, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`[Auth Proxy] Register response status: ${response.status}`);
    
    // Forward the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Auth Proxy] Error:', error.message);
    // If we have an axios response error, forward the status and error data
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Proxy Error',
        message: error.message
      });
    }
  }
});

// Direct manual proxy for /api/auth/user
app.get('/api/auth/user', async (req, res) => {
  console.log('[Auth Proxy] Received user profile request');
  
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    
    // Forward the request to Flask
    const targetUrl = `${FLASK_BACKEND_URL}/api/auth/user`;
    console.log(`[Auth Proxy] Forwarding to: ${targetUrl}`);
    
    const response = await axios.get(targetUrl, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`[Auth Proxy] User profile response status: ${response.status}`);
    
    // Forward the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('[Auth Proxy] Error:', error.message);
    // If we have an axios response error, forward the status and error data
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: 'Proxy Error',
        message: error.message
      });
    }
  }
});

// Start the server
const PORT = 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Direct Auth Proxy running at http://0.0.0.0:${PORT}/`);
  console.log(`Forwarding auth requests to ${FLASK_BACKEND_URL}`);
}); 