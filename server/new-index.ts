// This is a proxy server that forwards API requests to the Flask backend
// and serves the React frontend for all other routes
import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';
import http from 'http';
import multer from 'multer';
import paymentHandler from './payment-handler-es';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
// Use environment variable for Flask port or default to 5000
const FLASK_PORT: number = process.env.FLASK_PORT ? parseInt(process.env.FLASK_PORT, 10) : 5000;

// Log Flask backend URL for debugging
console.log('Using Flask backend URL:', `http://localhost:${FLASK_PORT}`);

// Define the frontend dist path - check all potential locations

console.log('Starting Express server with frontend static files');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Try multiple possible frontend dist paths
const possiblePaths = [
  path.join(__dirname, '../frontend/dist'),
  path.join(__dirname, '../client/dist'),
  path.join(process.cwd(), 'frontend/dist'),
  path.join(process.cwd(), 'client/dist')
];

console.log('Checking for frontend build directories:');
let FRONTEND_DIST_PATH = possiblePaths[0]; // Default
let foundValidPath = false;

for (const pathToCheck of possiblePaths) {
  console.log(`- Checking: ${pathToCheck}`);
  if (fs.existsSync(pathToCheck)) {
    try {
      // Also verify index.html exists in this folder
      if (fs.existsSync(path.join(pathToCheck, 'index.html'))) {
        console.log(`✅ Found valid frontend path with index.html: ${pathToCheck}`);
        FRONTEND_DIST_PATH = pathToCheck;
        foundValidPath = true;
        break;
      } else {
        console.log(`❌ Directory exists but no index.html found in: ${pathToCheck}`);
      }
    } catch (err) {
      console.error(`Error checking path ${pathToCheck}:`, err);
    }
  } else {
    console.log(`❌ Directory not found: ${pathToCheck}`);
  }
}

if (!foundValidPath) {
  console.error('⚠️ WARNING: No valid frontend build directory found!');
  console.error('The frontend will not be served correctly.');
} else {
  console.log(`Using frontend path: ${FRONTEND_DIST_PATH}`);
  // List files in the chosen directory
  try {
    const files = fs.readdirSync(FRONTEND_DIST_PATH);
    console.log(`Files in ${FRONTEND_DIST_PATH}:`, files);
  } catch (err) {
    console.error(`Error listing files in ${FRONTEND_DIST_PATH}:`, err);
  }
}

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the frontend build directory FIRST (before any API routes)
// This ensures that static files like HTML, CSS, JS, and images are served directly
console.log('🌐 Setting up static file serving from:', FRONTEND_DIST_PATH);
app.use(express.static(FRONTEND_DIST_PATH, {
  index: false // Don't automatically serve index.html for / to allow our custom handlers
}));

// Special URL decoding middleware for handling encoded query parameters
app.use((req, res, next) => {
  // Enhanced request logging for payment-related paths
  if (req.url.includes('payment')) {
    console.log('⚡ Payment-related URL detected:', req.originalUrl);
    console.log('⚡ Method:', req.method);
    console.log('⚡ Path:', req.path);
    console.log('⚡ Query:', req.query);
  }
  
  // Special handling for Stripe redirect to payment-verify or order-confirmation
  // Stripe will encode the ? as %3F in the URL when redirecting back
  if (req.originalUrl.includes('/payment-verify%3Fsession_id=')) {
    // Extract the session ID from the encoded URL
    const match = req.originalUrl.match(/payment-verify%3Fsession_id=([^&]+)/);
    if (match && match[1]) {
      const sessionId = match[1];
      console.log('🔄 REDIRECTING: Found encoded payment verification URL with session ID:', sessionId);
      
      // Redirect to the properly formatted URL
      const redirectUrl = `/order-confirmation?session_id=${sessionId}&use_html=true`; // Redirect to new route
      console.log('🔄 Redirecting to order confirmation page with session ID:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  }
  
  // Also handle direct encoded order-confirmation URLs
  if (req.originalUrl.includes('/order-confirmation%3Fsession_id=')) {
    // Extract the session ID from the encoded URL
    const match = req.originalUrl.match(/order-confirmation%3Fsession_id=([^&]+)/);
    if (match && match[1]) {
      const sessionId = match[1];
      console.log('🔄 REDIRECTING: Found encoded order confirmation URL with session ID:', sessionId);
      
      // Redirect to the properly formatted URL
      const redirectUrl = `/order-confirmation?session_id=${sessionId}&use_html=true`;
      console.log('🔄 Redirecting to properly formatted URL:', redirectUrl);
      return res.redirect(redirectUrl);
    }
  }
  
  // Look for common encoding issues in URLs, especially for payment routes
  if (req.url.includes('%3F') || req.url.includes('%3D') || 
      req.url.includes('/payment-verify%3F')) {
    console.log('🔍 Detected URL encoding issues in:', req.url);
    
    try {
      // Try to decode the URL (safely)
      let decodedUrl = req.url;
      try {
        decodedUrl = decodeURIComponent(req.url);
        console.log('🔄 Decoded URL once:', decodedUrl);
        
        // Check if it still has encoded parts
        if (decodedUrl.includes('%')) {
          const doubleDecoded = decodeURIComponent(decodedUrl);
          console.log('🔄 Decoded URL twice:', doubleDecoded);
          decodedUrl = doubleDecoded;
        }
      } catch (e) {
        console.warn('⚠️ Error decoding URL:', e);
      }
      
      // Only replace if different
      if (decodedUrl !== req.url) {
        console.log('✅ Rewrote URL from:', req.url);
        console.log('✅ Rewrote URL to:', decodedUrl);
        req.url = decodedUrl;
      }
    } catch (error) {
      console.error('❌ Error in URL decoding middleware:', error);
    }
  }
  next();
});

// Create a special handler for .html files before any API routes
app.get('/*.html', (req, res, next) => {
  const htmlFile = path.join(FRONTEND_DIST_PATH, req.path);
  console.log(`🌐 Handling HTML file request directly: ${req.path}`);
  console.log(`Checking for file: ${htmlFile}`);
  
  if (fs.existsSync(htmlFile)) {
    console.log(`✅ Found HTML file, serving: ${htmlFile}`);
    return res.sendFile(htmlFile);
  } else {
    // Continue to other handlers if file not found
    console.log(`❌ HTML file not found: ${htmlFile}`);
    next();
  }
});

// Add a manual proxy endpoint for auth login
app.post('/api/auth/login', async (req, res) => {
  console.log('Manual proxy: Received login request');
  try {
    const response = await fetch(`http://localhost:${FLASK_PORT}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    console.log('Manual proxy: Login response received');
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Manual proxy: Error forwarding login request', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a manual proxy endpoint for auth register
app.post('/api/auth/register', async (req, res) => {
  console.log('Manual proxy: Received register request');
  try {
    const response = await fetch(`http://localhost:${FLASK_PORT}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    console.log('Manual proxy: Register response received');
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Manual proxy: Error forwarding register request', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a manual proxy endpoint for auth user
app.get('/api/auth/user', async (req, res) => {
  console.log('Manual proxy: Received user request');
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }
    
    console.log('Manual proxy: Forwarding user request with auth header:', authHeader);
    
    const response = await fetch(`http://localhost:${FLASK_PORT}/api/auth/user`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
      },
    });
    
    const data = await response.json();
    console.log('Manual proxy: User response received');
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Manual proxy: Error forwarding user request', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Capture any direct requests to payment endpoints (which should go through the proxy)
app.all('/payment/*', (req, res) => {
  console.log('⚠️ DIRECT ACCESS ATTEMPT: Client tried to access backend directly at:', req.url);
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers));
  console.log('This request should go through the /api proxy instead');
  
  // For POST to /payment/create-checkout-session, we'll proxy it properly
  if (req.method === 'POST' && (req.url === '/payment/create-checkout-session' || req.url === '/payment/create-checkout')) {
    console.log('⚠️ WARNING: Direct access to create-checkout-session endpoint - will forward anyway');
    // Forward to the /api/payment/create-checkout-session endpoint handler
    return app._router.handle(Object.assign({}, req, {
      url: '/api/payment/create-checkout-session',
      originalUrl: '/api/payment/create-checkout-session',
      baseUrl: '/api'
    }), res, () => {});
  }
  
  // Return a helpful error message for other endpoints
  return res.status(404).json({
    error: 'Incorrect URL path',
    message: 'Please use the /api prefix for all API requests',
    correctPath: `/api${req.url}`
  });
});

// Add a manual proxy endpoint for payment checkout
app.post('/api/payment/create-checkout-session', async (req, res) => {
  console.log('✅ Manual proxy: Received create-checkout-session request');
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('❌ Error: No authorization header provided');
      return res.status(401).json({ error: 'No authorization header provided' });
    }
    
    console.log('Manual proxy: Forwarding checkout request with auth header:', authHeader.substring(0, 20) + '...');
    
    // IMPORTANT: Ensure success_url uses order-confirmation instead of older paths
    // This ensures our modern polling-based approach is used and prevents redirect loops
    if (req.body && req.body.success_url) {
      // No longer redirect payment-verify URLs to order-confirmation
      // We want to use payment-verify as the main payment verification route now
      if (req.body.success_url.includes('/payment-success')) {
        const originalUrl = req.body.success_url;
        // Replace payment-success with payment-verify
        req.body.success_url = req.body.success_url
          .replace('/payment-success', '/payment-verify');
        console.log(`⚠️ Updated success_url to use payment verification page: ${originalUrl} → ${req.body.success_url}`);
      }
    }
    
    console.log('Request body:', JSON.stringify(req.body));
    
    // This is the correct URL to forward to the Flask backend
    // Make sure to use /payment/create-checkout-session (no /api prefix)
    const url = `http://localhost:${FLASK_PORT}/payment/create-checkout-session`;
    console.log('Forwarding to real checkout endpoint:', url);
    
    // Make the request to the Flask backend
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      // Log the raw response status
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        console.error('Failed to create checkout session:', response.statusText);
        return res.status(response.status).json({ 
          error: 'Failed to create checkout session', 
          details: response.statusText 
        });
      }
      
      const data = await response.json();
      console.log('Stripe checkout session created successfully');
      res.status(200).json(data);
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  } catch (error) {
    console.error('Error in payment checkout proxy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Set up a manual proxy configuration for all other API requests
// This proxy will forward requests to the Flask backend
app.use('/api', (req, res, next) => {
  // Skip auth endpoints as they have dedicated handlers
  if (req.path.startsWith('/auth/') || req.path.startsWith('/payment/create-checkout-session')) {
    return next();
  }
  
  // Log all API requests for debugging
  console.log(`📡 Proxying to Flask: ${req.method} ${req.originalUrl}`);
  
  // Check for specific health check endpoints
  if (req.path === '/health' || req.path === '/ping') {
    console.log('🔍 Checking if Flask backend is running...');
    
    // Try to forward to Flask health endpoint
    fetch(`http://localhost:${FLASK_PORT}/ping`)
      .then(response => {
        if (response.ok) {
          console.log('✅ Flask backend is running');
          return response.text();
        } else {
          throw new Error(`Flask returned status ${response.status}`);
        }
      })
      .then(data => {
        res.status(200).send(data);
      })
      .catch(error => {
        console.warn(`⚠️ Health check failed: ${error.message}`);
        res.status(503).json({
          status: 'error',
          message: 'Flask backend unavailable',
          error: error.message
        });
      });
    return;
  }
  
  // Create and use the proxy middleware
  createProxyMiddleware({
    target: `http://localhost:${FLASK_PORT}`,
    changeOrigin: true,
    pathRewrite: {
      // Don't remove the /api prefix as Flask expects it
    },
    logLevel: 'warn',
    onError: (err, req, res) => {
      console.error(`❌ Proxy error: ${err.message}`);
      res.writeHead(503, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({
        status: 'error',
        message: 'Flask backend unavailable',
        error: err.message
      }));
    }
  })(req, res, next);
});

// Special endpoint to get logo settings (fallback if Flask API is down)
app.get('/api/settings/logo', (req, res) => {
  console.log('📸 Express fallback: Serving logo settings directly');
  // Return hardcoded logo settings
  res.json({
    navbar: '/attached_assets/iMagenWiz Logo small_1745119547734.jpg',
    footer: '/attached_assets/iMagenWiz Logo reverse_1745075588661.jpg',
    favicon: '/attached_assets/iMagenWiz Logo Icon_1745075613327.jpg'
  });
});

// Root route handler to serve the React app
app.get('/', (req, res) => {
  console.log('🌟 Serving React app root route');
  res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'));
});

// Catch-all route handler for all other routes (Single Page Application)
app.get('*', (req, res) => {
  console.log('🌐 Serving SPA route:', req.path, '(Catch-All Route Handler)');
  console.log('  Full URL:', req.url);
  console.log('  Original URL:', req.originalUrl);
  console.log('  Query params:', req.query);
  console.log('  Headers:', req.headers);
  console.log('  Method:', req.method);
  console.log('  Remote IP:', req.ip);
  console.log('  Is Express Route: YES');
  
  // Special case for files that should be sent directly, not as the SPA
  if (req.path.endsWith('.js') || req.path.endsWith('.css') || req.path.endsWith('.png') || 
      req.path.endsWith('.jpg') || req.path.endsWith('.ico') || req.path.endsWith('.svg') ||
      req.path.endsWith('.woff') || req.path.endsWith('.ttf')) {
    console.log('⚠️ WARNING: Static file not found:', req.path);
    return res.status(404).send('File not found');
  }
  
  // Serve the React app for all other routes (enables client-side routing)
  res.sendFile(path.join(FRONTEND_DIST_PATH, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  // Access URL for Replit
  const replitDomain = process.env.REPL_SLUG ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : null;
  if (replitDomain) {
    console.log(`Access your app at: ${replitDomain}`);
  }
  console.log('🚀 Application startup complete - ready to accept connections');
  // Time how long it took to start
  console.log(`⏱️ Server startup completed in ${process.uptime().toFixed(2)} seconds`);
  
  // Periodically check if the Flask backend is running
  let isFlaskRunning = false;
  const checkFlask = () => {
    fetch(`http://localhost:${FLASK_PORT}/ping`)
      .then(response => {
        if (response.ok) {
          if (!isFlaskRunning) {
            console.log('🎉 Flask backend is now running!');
            isFlaskRunning = true;
          }
        } else {
          throw new Error(`Flask returned status ${response.status}`);
        }
      })
      .catch(error => {
        if (isFlaskRunning) {
          console.warn(`⚠️ Flask backend is no longer responding: ${error.message}`);
          isFlaskRunning = false;
        } else {
          console.warn(`⚠️ Flask backend not detected or not responding to health checks yet`);
          console.warn(`⚠️ This is normal during initialization as migrations may be running`);
          console.warn(`⚠️ Temporarily starting in Express-only mode with limited functionality`);
          
          // Additional messages for clarity
          console.warn(`⚠️ Express will start in fallback mode while waiting for Flask backend`);
          console.log(`Express will provide fallbacks for critical API endpoints`);
          console.log(`Some advanced features may be limited until Flask is fully initialized`);
        }
      });
  };
  
  // Check immediately and then every 30 seconds
  checkFlask();
  setInterval(checkFlask, 30000);
  
  // Also try alternative health check endpoints
  const endpoints = ['/ping', '/api/ping', '/api/health', '/health'];
  endpoints.forEach(endpoint => {
    fetch(`http://localhost:${FLASK_PORT}${endpoint}`)
      .then(response => {
        if (response.ok) {
          console.log(`✅ Flask is responding to ${endpoint}`);
          isFlaskRunning = true;
        }
      })
      .catch(error => {
        console.warn(`⚠️ Health check failed for endpoint ${endpoint}`);
      });
  });
  
  // Advanced health check with retries
  const checkWithRetries = (attempt = 1) => {
    if (isFlaskRunning) return; // Skip if already running
    
    console.log(`🔄 Performing Flask health check retry #${attempt} (after ${10 * attempt}s)`);
    
    // Try each endpoint
    Promise.all(
      endpoints.map(endpoint => 
        fetch(`http://localhost:${FLASK_PORT}${endpoint}`)
          .then(response => response.ok)
          .catch(() => false)
      )
    ).then(results => {
      if (results.some(result => result)) {
        console.log('✅ Flask backend detected after retry!');
        isFlaskRunning = true;
      } else {
        console.warn(`⚠️ Flask backend still not detected after retry #${attempt}`);
        
        // Schedule another retry with exponential backoff
        if (attempt < 3) {
          console.warn(`⚠️ Will try again in ${20 * attempt}s`);
          setTimeout(() => checkWithRetries(attempt + 1), 20000 * attempt);
        } else {
          console.warn('⚠️ Flask backend detection attempts exhausted');
          console.warn('⚠️ Express will continue running in fallback mode');
          console.warn('⚠️ Some advanced features will remain unavailable');
        }
      }
    });
  };
  
  // Schedule health check retries
  setTimeout(() => {
    if (!isFlaskRunning) {
      checkWithRetries();
    }
  }, 10000);
});