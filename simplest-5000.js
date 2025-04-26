// Ultra minimal server on port 5000 for Replit that also proxies to the real Flask app
const http = require('http');
const { spawn } = require('child_process');
const net = require('net');

// ANSI color codes for prettier console output
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';

console.log(`${YELLOW}⚡ Starting iMagenWiz startup system...${RESET}`);

// Flag to track if the Flask backend is running
let flaskRunning = false;
let expressRunning = false;
let flaskProcess = null;
let expressProcess = null;

// First, create a server that responds immediately on port 5000 for Replit
console.log(`${YELLOW}⚡ Creating placeholder server on port 5000...${RESET}`);
const placeholderServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

// Start the placeholder server
placeholderServer.listen(5000, '0.0.0.0', () => {
  console.log(`${GREEN}✅ Placeholder server running on port 5000${RESET}`);
  
  // Start both processes after a slight delay
  setTimeout(startApplications, 500);
});

function startApplications() {
  console.log(`${CYAN}🚀 Starting application components...${RESET}`);
  
  // Start the Flask backend
  startFlaskBackend();
  
  // Start Express after a short delay
  setTimeout(() => {
    startExpressFrontend();
  }, 3000);
}

function startFlaskBackend() {
  console.log(`${CYAN}🐍 Starting Flask backend...${RESET}`);
  
  // Start Flask backend with direct Python command (not relying on port forwarding)
  flaskProcess = spawn('python3', ['backend/run.py'], {
    env: {
      ...process.env,
      FLASK_APP: 'backend/run.py',
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      PORT: '5000'
    },
    stdio: 'inherit'
  });
  
  flaskProcess.on('error', (err) => {
    console.error(`${RED}❌ Failed to start Flask backend: ${err.message}${RESET}`);
  });
  
  flaskProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log(`${YELLOW}⚠️ Flask backend exited with code ${code}${RESET}`);
      flaskRunning = false;
      
      // If Flask crashes, try to restart it after a delay
      setTimeout(() => {
        if (!flaskRunning) {
          console.log(`${YELLOW}⚠️ Attempting to restart Flask backend...${RESET}`);
          startFlaskBackend();
        }
      }, 5000);
    }
  });
  
  // Periodically check if Flask is responding
  checkFlaskStatus();
}

function checkFlaskStatus() {
  setTimeout(() => {
    const testSocket = new net.Socket();
    
    testSocket.setTimeout(1000);
    
    testSocket.on('error', (err) => {
      console.log(`${YELLOW}⚠️ Flask backend not responding yet: ${err.message}${RESET}`);
      flaskRunning = false;
      testSocket.destroy();
      
      // Check again after a delay
      checkFlaskStatus();
    });
    
    testSocket.on('timeout', () => {
      console.log(`${YELLOW}⚠️ Flask connection timeout${RESET}`);
      flaskRunning = false;
      testSocket.destroy();
      
      // Check again after a delay
      checkFlaskStatus();
    });
    
    testSocket.connect(5000, '127.0.0.1', () => {
      if (!flaskRunning) {
        console.log(`${GREEN}✅ Flask backend is now responding${RESET}`);
        flaskRunning = true;
      }
      testSocket.destroy();
      
      // Check again periodically
      setTimeout(checkFlaskStatus, 30000);
    });
  }, 5000);
}

function startExpressFrontend() {
  console.log(`${BLUE}📱 Starting Express frontend...${RESET}`);
  
  expressProcess = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      FLASK_PORT: '5000',
      FLASK_URL: 'http://localhost:5000'
    },
    stdio: 'inherit'
  });
  
  expressProcess.on('error', (err) => {
    console.error(`${RED}❌ Failed to start Express frontend: ${err.message}${RESET}`);
  });
  
  expressProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log(`${YELLOW}⚠️ Express frontend exited with code ${code}${RESET}`);
      expressRunning = false;
      
      // If Express crashes, try to restart it
      setTimeout(() => {
        if (!expressRunning) {
          console.log(`${YELLOW}⚠️ Attempting to restart Express frontend...${RESET}`);
          startExpressFrontend();
        }
      }, 5000);
    }
  });
  
  expressRunning = true;
}

// Keep process running and handle Ctrl+C
process.on('SIGINT', () => {
  console.log(`${RED}🛑 Shutting down all services...${RESET}`);
  
  // Clean shutdown for all components
  if (placeholderServer) placeholderServer.close();
  if (flaskProcess) flaskProcess.kill();
  if (expressProcess) expressProcess.kill();
  
  process.exit(0);
});

// Prevent Node from exiting
setInterval(() => {}, 1000);

console.log(`${CYAN}✨ Startup script initialization complete${RESET}`);