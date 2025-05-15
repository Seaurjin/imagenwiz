// Coordinated startup script that manages both the placeholder server and the actual application
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const FLASK_PORT = process.env.FLASK_PORT || 5000;

// ANSI color codes for prettier console output
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

// Step 1: Start a minimal placeholder server on port 5000 (for Replit)
function startPlaceholderServer() {
  log('⚡ Starting minimal placeholder server on port 5000...', YELLOW);
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('iMagenWiz is starting...');
  });
  
  return new Promise((resolve, reject) => {
    server.listen(FLASK_PORT, '0.0.0.0', () => {
      log('✅ Placeholder server running on port 5000', GREEN);
      resolve(server);
    });
    
    server.on('error', (err) => {
      log(`❌ Failed to start placeholder server: ${err.message}`, RED);
      reject(err);
    });
  });
}

// Step 2: Start the Flask backend
function startFlaskBackend() {
  log('🐍 Starting Flask backend...', CYAN);
  
  // Check if the Flask backend exists
  if (!fs.existsSync(path.join(process.cwd(), 'backend', 'run.py'))) {
    log('⚠️ Flask backend not found at backend/run.py', YELLOW);
    return null;
  }
  
  const flask = spawn('python3', ['backend/run.py'], {
    env: {
      ...process.env,
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      PORT: FLASK_PORT  // Use port 5000 for Flask
    },
    stdio: 'inherit'
  });
  
  flask.on('error', (err) => {
    log(`❌ Failed to start Flask backend: ${err.message}`, RED);
  });
  
  flask.on('exit', (code) => {
    if (code !== 0) {
      log(`⚠️ Flask backend exited with code ${code}`, YELLOW);
    }
  });
  
  return flask;
}

// Step 3: Start the Express frontend
function startExpressFrontend(replitDomain) {
  log('📱 Starting Express frontend...', BLUE);
  
  // Use our new-index.ts file by copying it to index.ts first
  try {
    if (fs.existsSync(path.join(process.cwd(), 'server', 'new-index.ts'))) {
      log('📄 Using updated server code', GREEN);
      
      // Make a backup of the original index.ts if it exists
      if (fs.existsSync(path.join(process.cwd(), 'server', 'index.ts'))) {
        fs.copyFileSync(
          path.join(process.cwd(), 'server', 'index.ts'),
          path.join(process.cwd(), 'server', 'index.ts.bak')
        );
        log('📑 Created backup of original index.ts', GREEN);
      }
      
      // Copy the new index to the standard location
      fs.copyFileSync(
        path.join(process.cwd(), 'server', 'new-index.ts'),
        path.join(process.cwd(), 'server', 'index.ts')
      );
      log('📝 Updated server/index.ts with new code', GREEN);
    }
  } catch (err) {
    log(`⚠️ Error updating server code: ${err.message}`, YELLOW);
  }
  
  const express = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      FLASK_PORT: FLASK_PORT,  // Tell Express to connect to Flask on port 5000
      FLASK_URL: 'http://localhost:5000'
    },
    stdio: 'inherit'
  });
  
  express.on('error', (err) => {
    log(`❌ Failed to start Express frontend: ${err.message}`, RED);
  });
  
  express.on('exit', (code) => {
    if (code !== 0) {
      log(`⚠️ Express frontend exited with code ${code}`, YELLOW);
    }
  });
  
  return express;
}

// Main function to coordinate all startup steps
async function startApplication() {
  try {
    // Step 1: Start the placeholder server
    const placeholderServer = await startPlaceholderServer();
    
    // Step 2: Delay slightly to ensure the placeholder server is running
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Step 3: Start Flask backend
    const flaskBackend = startFlaskBackend();
    
    // Step 4: Delay to give Flask time to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 5: Start Express frontend
    const expressFrontend = startExpressFrontend();
    
    // Handle cleanup when the process exits
    process.on('SIGINT', () => {
      log('🛑 Shutting down all services...', RED);
      placeholderServer.close();
      if (flaskBackend) flaskBackend.kill();
      if (expressFrontend) expressFrontend.kill();
      process.exit(0);
    });
    
    log('🚀 All services started successfully!', GREEN);
    log(`📊 Services running:`, MAGENTA);
    log(`   - Placeholder server: port 5000`, MAGENTA);
    log(`   - Flask backend: port 5000`, MAGENTA);
    log(`   - Express frontend: port ${EXPRESS_PORT}`, MAGENTA);
    
    // Access URLs
    const replitDomain = process.env.REPL_SLUG ? 
      `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` :
      null;
    
    if (replitDomain) {
      log(`🌐 Access your app at: ${replitDomain}`, GREEN);
    } else {
      log(`🌐 Access your app at: http://localhost:${EXPRESS_PORT}`, GREEN);
    }
    
  } catch (error) {
    log(`❌ Error during application startup: ${error.message}`, RED);
    process.exit(1);
  }
}

// Start everything
startApplication();