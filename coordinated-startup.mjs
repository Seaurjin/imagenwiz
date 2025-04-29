#!/usr/bin/env node

// Coordinated startup script for iMagenWiz
// Starts both Express server on port 5000 and the port 3000 proxy

import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

// ANSI color codes for pretty console output
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

function log(message, color = RESET) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`${color}[${timestamp}] ${message}${RESET}`);
}

// Start a placeholder server to handle early requests
function startPlaceholderServer() {
  return new Promise((resolve) => {
    log('Starting placeholder server on port 3000...', YELLOW);
    
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>iMagenWiz - Starting Up</title>
            <meta http-equiv="refresh" content="5">
            <style>
              body { font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem; line-height: 1.5; }
              h1 { color: #0070f3; }
              .loader { border: 5px solid #f3f3f3; border-top: 5px solid #0070f3; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 2rem 0; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            </style>
          </head>
          <body>
            <h1>iMagenWiz</h1>
            <p>The application is starting up. This page will automatically refresh when ready.</p>
            <div class="loader"></div>
            <p>Starting server components...</p>
          </body>
        </html>
      `);
    });
    
    server.listen(3000, () => {
      log('Placeholder server running on port 3000', GREEN);
      resolve(server);
    });
  });
}

// Start the Flask backend
function startFlaskBackend() {
  return new Promise((resolve) => {
    log('Starting Express backend...', YELLOW);
    
    const expressProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let expressReady = false;
    
    expressProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Express] ${output}`, BLUE);
        
        // Check for server ready message
        if (!expressReady && (
            output.includes('Server running at') ||
            output.includes('ready to accept connections')
        )) {
          expressReady = true;
          log('Express backend is ready!', GREEN);
          resolve(expressProcess);
        }
      }
    });
    
    expressProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Express ERROR] ${output}`, RED);
      }
    });
    
    expressProcess.on('error', (error) => {
      log(`Express backend startup error: ${error.message}`, RED);
    });
    
    // Resolve after timeout if we haven't already detected the ready message
    setTimeout(() => {
      if (!expressReady) {
        log('Express backend timeout - assuming ready', YELLOW);
        resolve(expressProcess);
      }
    }, 30000);
  });
}

// Start the port redirection proxy
function startPortRedirectionProxy() {
  return new Promise((resolve) => {
    log('Starting port 3000 redirection proxy...', YELLOW);
    
    // Look for the script file
    const scriptPaths = [
      './pure-5000.cjs',
      './port-redirect-simple.cjs',
      './port-3000-proxy.cjs',
      './mini.cjs'
    ];
    
    let scriptPath = null;
    for (const path of scriptPaths) {
      if (fs.existsSync(path)) {
        scriptPath = path;
        break;
      }
    }
    
    if (!scriptPath) {
      log('No proxy script found, using built-in proxy', RED);
      
      // Create a simple proxy server
      const server = http.createServer((req, res) => {
        const options = {
          hostname: 'localhost',
          port: 5000,
          path: req.url,
          method: req.method,
          headers: req.headers
        };
        
        const proxyReq = http.request(options, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        });
        
        proxyReq.on('error', (e) => {
          console.error('Proxy error:', e.message);
          if (!res.headersSent) {
            res.writeHead(502);
            res.end('Proxy error');
          }
        });
        
        req.pipe(proxyReq);
      });
      
      server.listen(3000, '0.0.0.0', () => {
        log('Built-in proxy running on port 3000 -> 5000', GREEN);
        resolve(server);
      });
      
      return;
    }
    
    log(`Using proxy script: ${scriptPath}`, BLUE);
    
    // Start the proxy in a child process
    const proxyProcess = spawn('node', [scriptPath], {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    proxyProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Proxy] ${output}`, CYAN);
      }
    });
    
    proxyProcess.stderr.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        log(`[Proxy ERROR] ${output}`, RED);
      }
    });
    
    proxyProcess.on('error', (error) => {
      log(`Proxy startup error: ${error.message}`, RED);
    });
    
    // Assume the proxy is ready after a short delay
    setTimeout(() => {
      log('Port redirection proxy is ready!', GREEN);
      resolve(proxyProcess);
    }, 2000);
  });
}

// Main function to start everything
async function startApplication() {
  log('=== Starting iMagenWiz Application ===', GREEN);
  
  // Start a placeholder server to handle requests during startup
  const placeholderServer = await startPlaceholderServer();
  
  // Start the Flask backend
  const expressBackend = await startFlaskBackend();
  
  // Close the placeholder server
  log('Closing placeholder server...', YELLOW);
  placeholderServer.close();
  
  // Start the port redirection proxy
  const proxy = await startPortRedirectionProxy();
  
  // Get Replit domain if available
  const replitDomain = process.env.REPL_SLUG ? 
    `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 
    'http://localhost:3000';
  
  log('=== iMagenWiz Application Started ===', GREEN);
  log(`Access your app at: ${replitDomain}`, GREEN);
  
  // Handle process termination
  process.on('SIGINT', () => {
    log('Shutting down application...', YELLOW);
    
    // Clean up processes
    if (expressBackend && expressBackend.kill) {
      expressBackend.kill();
    }
    
    if (proxy && proxy.kill) {
      proxy.kill();
    }
    
    process.exit(0);
  });
}

// Start the application
startApplication().catch((error) => {
  log(`Application startup error: ${error.message}`, RED);
  process.exit(1);
});