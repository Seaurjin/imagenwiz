// Ultra-fast startup script for Replit that handles both the port 5000 requirement
// and properly starts the iMagenWiz application
const http = require('http');
const { spawn } = require('child_process');
const { exec } = require('child_process');

// ANSI color codes for prettier console output
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';

console.log(`${YELLOW}⚡ Starting iMagenWiz...${RESET}`);

// First, ensure no competing processes are running
console.log(`${YELLOW}🧹 Cleaning up any existing processes...${RESET}`);
exec('pkill -f "node|tsx server/index.ts" || true', (error) => {
  if (error) {
    console.log(`${YELLOW}No competing processes found or couldn't kill them${RESET}`);
  } else {
    console.log(`${GREEN}✅ Cleaned up existing processes${RESET}`);
  }
  
  // Immediately create a minimalist server on port 5000 to satisfy Replit
  const placeholderServer = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('iMagenWiz is starting...');
  });
  
  placeholderServer.listen(5000, '0.0.0.0', () => {
    console.log(`${GREEN}✅ Placeholder server running on port 5000${RESET}`);
    
    // After a short delay, start the actual application components
    setTimeout(startApplications, 1000);
  });
  
  function startApplications() {
    console.log(`${CYAN}🚀 Starting Python Flask backend...${RESET}`);
    
    // Start the Flask app with Python directly
    const flask = spawn('python3', ['backend/run.py'], {
      env: {
        ...process.env,
        FLASK_APP: 'backend/run.py',
        FLASK_ENV: 'development',
        FLASK_DEBUG: '1',
        FLASK_PORT: '5001'  // Use port 5001 for the actual Flask service
      },
      stdio: 'inherit'
    });
    
    flask.on('error', (err) => {
      console.error(`${RED}❌ Failed to start Flask backend: ${err.message}${RESET}`);
    });
    
    // Start Express frontend after a delay to allow Flask to initialize
    setTimeout(() => {
      console.log(`${BLUE}📱 Starting Express frontend...${RESET}`);
      
      const express = spawn('npm', ['run', 'dev'], {
        env: {
          ...process.env,
          FLASK_PORT: '5001',
          FLASK_URL: 'http://localhost:5001'
        },
        stdio: 'inherit'
      });
      
      express.on('error', (err) => {
        console.error(`${RED}❌ Failed to start Express frontend: ${err.message}${RESET}`);
      });
    }, 5000);  // 5 second delay to allow Flask to start
  }
  
  // Keep process running
  setInterval(() => {}, 1000);
  
  // Handle clean shutdown
  process.on('SIGINT', () => {
    console.log(`${RED}🛑 Shutting down all services...${RESET}`);
    placeholderServer.close();
    process.exit(0);
  });
});