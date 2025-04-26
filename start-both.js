// Start both Express and Flask with proper configuration
const http = require('http');
const { spawn } = require('child_process');

// Constants for better readability
const EXPRESS_PORT = 3000;
const FLASK_PORT = 5000;
const PLACEHOLDER_PORT = 5000;

// ANSI color codes for prettier console output
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const CYAN = '\x1b[36m';

// Create a minimal HTTP server on port 5000 to satisfy Replit
console.log(`${YELLOW}Starting temporary placeholder on port ${PLACEHOLDER_PORT}...${RESET}`);
const placeholderServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

placeholderServer.listen(PLACEHOLDER_PORT, '0.0.0.0', () => {
  console.log(`${GREEN}✅ Placeholder running on port ${PLACEHOLDER_PORT}${RESET}`);
  
  // Start the main application components with delay
  setTimeout(startComponents, 1000);
});

// Function to start both Flask and Express
function startComponents() {
  // Log startup
  console.log(`${CYAN}🚀 Starting application components...${RESET}`);
  
  // Start Express first
  startExpress();
  
  // Then start Flask
  setTimeout(startFlask, 5000);
}

// Function to start Express
function startExpress() {
  console.log(`${BLUE}📱 Starting Express frontend...${RESET}`);
  
  const express = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      FLASK_PORT: FLASK_PORT.toString(),
      FLASK_URL: `http://localhost:${FLASK_PORT}`,
      ENABLE_FALLBACKS: 'true'
    },
    stdio: 'inherit'
  });
  
  express.on('error', (err) => {
    console.error(`Failed to start Express: ${err.message}`);
  });
}

// Function to start Flask
function startFlask() {
  console.log(`${CYAN}🐍 Starting Flask backend...${RESET}`);
  
  const flask = spawn('python3', ['backend/run.py'], {
    env: {
      ...process.env,
      FLASK_APP: 'backend/run.py',
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      FLASK_PORT: FLASK_PORT.toString(),
      PORT: FLASK_PORT.toString()
    },
    stdio: 'inherit'
  });
  
  flask.on('error', (err) => {
    console.error(`Failed to start Flask: ${err.message}`);
  });
  
  flask.on('exit', (code) => {
    if (code !== 0) {
      console.log(`Flask exited with code ${code}, restarting...`);
      setTimeout(startFlask, 5000);
    }
  });
  
  // After Flask starts, close the placeholder server
  setTimeout(() => {
    console.log(`${YELLOW}Shutting down placeholder server...${RESET}`);
    placeholderServer.close(() => {
      console.log(`${GREEN}✅ Placeholder server closed, Flask should now serve port ${FLASK_PORT}${RESET}`);
    });
  }, 10000);
}

// Keep process running
setInterval(() => {}, 1000);