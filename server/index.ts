import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import session from 'express-session';
import router from './routes';
import { db } from './db';
import fs from 'fs';
import { sql } from 'drizzle-orm';
import * as http from 'http';

// ES Module replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
// Server port - always use port 5000 as configured in the workflow
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(2, 8);
  
  // Log when the request is received
  console.log(`📥 ${req.method} ${req.url} - ${new Date().toISOString()} [${requestId}]`);
  
  // Set headers for performance debugging
  res.setHeader('X-Request-ID', requestId);
  res.setHeader('Server-Timing', 'total;dur=0');
  
  // Log when the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Add detailed logging for slow requests
    if (duration > 500) {
      console.log(`⚠️ SLOW REQUEST: ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms [${requestId}]`);
    } else {
      console.log(`📤 ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms [${requestId}]`);
    }
    
    // Update Server-Timing header with actual duration
    res.setHeader('Server-Timing', `total;dur=${duration}`);
  });
  
  next();
});

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'imagenwiz-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Check database connection
app.get('/api/ping', async (req, res) => {
  try {
    // Simple query to verify database connection
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', message: 'Database connection failed' });
  }
});

// Mount API routes
app.use('/api', router);

// Serve frontend static files
console.log('Starting Express server with frontend static files');
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);

// Frontend build paths to check
const potentialPaths = [
  path.join(process.cwd(), 'frontend/dist'),   // Compiled frontend build with proper MIME types
  path.join(process.cwd(), 'frontend'),        // Main frontend path with index.html
  path.join(process.cwd(), 'build')
];

console.log('Checking for frontend build directories:');
let frontendPath = null;

for (const pathToCheck of potentialPaths) {
  console.log(`- Checking: ${pathToCheck}`);
  const indexPath = path.join(pathToCheck, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    console.log(`✅ Found valid frontend path with index.html: ${pathToCheck}`);
    frontendPath = pathToCheck;
    break;
  }
}

if (frontendPath) {
  console.log(`Using frontend path: ${frontendPath}`);
  const files = fs.readdirSync(frontendPath);
  console.log(`Files in ${frontendPath}: ${JSON.stringify(files, null, 2)}`);
  
  console.log(`🌐 Setting up static file serving from: ${frontendPath}`);
  
  // Improved static file serving with caching and compression
  app.use(express.static(frontendPath, {
    etag: true,
    lastModified: true,
    maxAge: 60 * 60 * 1000, // Cache for 1 hour for better performance
    setHeaders: (res, path) => {
      // Add additional performance headers
      if (path.endsWith('.js')) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      } else if (path.endsWith('.css')) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      } else if (path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
        res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours for images
      }
    }
  }));
  
  // Handle SPA routing
  app.get('/', (req, res) => {
    // For main app route, serve the main index.html
    console.log(`🌟 Serving main page`);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
  
  // Route for test page
  app.get('/test-language', (req, res) => {
    console.log(`📄 Serving language selector test page`);
    const testHtmlPath = path.join(frontendPath, 'test-selector.html');
    if (fs.existsSync(testHtmlPath)) {
      res.sendFile(testHtmlPath);
    } else {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
  
  // Special route for demo page
  app.get('/demo', (req, res) => {
    console.log('📄 Serving demo page');
    const demoPath = path.join(frontendPath, 'demo.html');
    if (fs.existsSync(demoPath)) {
      res.sendFile(demoPath);
    } else {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
  
  // Route for simple test page
  app.get('/test', (req, res) => {
    console.log('📄 Serving test page');
    const testPath = path.join(frontendPath, 'test.html');
    if (fs.existsSync(testPath)) {
      res.sendFile(testPath);
    } else {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });

  // Route for detailed test page
  app.get('/test-simple', (req, res) => {
    console.log('📄 Serving simple test page');
    const testPath = path.join(frontendPath, 'test-simple.html');
    if (fs.existsSync(testPath)) {
      res.sendFile(testPath);
    } else {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
  
  // Route for router test page
  app.get('/test-router', (req, res) => {
    console.log('📄 Serving router test page');
    const testPath = path.join(frontendPath, 'test-router.html');
    if (fs.existsSync(testPath)) {
      res.sendFile(testPath);
    } else {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
  
  // Handle all other routes
  app.get('*', (req, res) => {
    // API routes are handled by the router
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    
    // For all other routes in SPA, always serve the main index.html
    console.log(`🌟 Serving main SPA for route: ${req.path}`);
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('⚠️ No frontend build directory found. API server only.');
  
  // Simple welcome page for API-only mode
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>iMagenWiz API</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { color: #2563eb; }
            code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
          </style>
        </head>
        <body>
          <h1>iMagenWiz API Server</h1>
          <p>API is running. Use <code>/api</code> endpoints to interact with the server.</p>
          <p>Example: <a href="/api/health">/api/health</a></p>
        </body>
      </html>
    `);
  });
}

// Start a proxy server for port 3000
const startProxyServer = () => {
  try {
    // Create proxy server with proper typing
    const proxyServer = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      // Set up proxy options
      const options = {
        hostname: 'localhost',
        port: PORT,
        path: req.url,
        method: req.method,
        headers: req.headers
      };
      
      // Create proxied request
      const proxyReq = http.request(options, (proxyRes: http.IncomingMessage) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      });
      
      // Handle proxy errors
      proxyReq.on('error', (err: Error) => {
        console.error('Proxy error:', err.message);
        res.writeHead(502);
        res.end('Proxy error: Could not connect to application server.');
      });
      
      // Forward request body if any
      req.pipe(proxyReq);
    });
    
    proxyServer.listen(3000, '0.0.0.0', () => {
      console.log('🔄 Proxy server running at http://0.0.0.0:3000 → redirecting to port 5000');
    });
    
    proxyServer.on('error', (err: Error) => {
      console.error('Failed to start proxy server:', err.message);
    });
  } catch (err: unknown) {
    console.error('Error setting up proxy server:', err instanceof Error ? err.message : String(err));
  }
};

// Start server
const startServer = async () => {
  try {
    // Skip migrations for now
    console.log('Starting server without migrations...');
    
    // Start the server - make sure port is properly typed
    const serverPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
    const server = app.listen(serverPort, '0.0.0.0', () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
      
      // Start proxy server on port 3000
      startProxyServer();
      
      const domainName = process.env.REPL_SLUG && process.env.REPL_OWNER
        ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
        : 'localhost';
      console.log(`Access your app at: ${domainName}`);
      console.log('🚀 Application startup complete - ready to accept connections');
      console.log(`⏱️ Server startup completed in ${process.uptime().toFixed(2)} seconds`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();