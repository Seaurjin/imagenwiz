// Express server startup with Flask health check
import { spawn } from 'child_process';
import http from 'http';

// Colors for console output
const colors = {
  express: '\x1b[36m', // Cyan
  flask: '\x1b[35m',   // Purple
  success: '\x1b[32m', // Green
  error: '\x1b[31m',   // Red
  info: '\x1b[33m',    // Yellow
  reset: '\x1b[0m'     // Reset
};

console.log(`${colors.info}Starting iMagenWiz Full Stack Application...${colors.reset}`);

// Start Flask backend in a separate process
console.log(`${colors.flask}Starting Flask backend...${colors.reset}`);
const flaskProcess = spawn('python', ['start-flask.py'], { 
  stdio: ['inherit', 'pipe', 'pipe'],
  detached: false
});

flaskProcess.stdout.on('data', (data) => {
  console.log(`${colors.flask}[Flask] ${data.toString().trim()}${colors.reset}`);
});

flaskProcess.stderr.on('data', (data) => {
  console.log(`${colors.flask}[Flask] ${data.toString().trim()}${colors.reset}`);
});

// Check Flask health periodically
function checkFlaskHealth() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health-check', (res) => {
      if (res.statusCode === 200) {
        console.log(`${colors.success}✓ Flask health check succeeded${colors.reset}`);
        resolve(true);
      } else {
        console.log(`${colors.error}✗ Flask health check failed with status: ${res.statusCode}${colors.reset}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log(`${colors.error}✗ Flask health check error: ${err.message}${colors.reset}`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.abort();
      console.log(`${colors.error}✗ Flask health check timed out${colors.reset}`);
      resolve(false);
    });
  });
}

// Start Express server after waiting for Flask
let flaskCheckAttempts = 0;
const maxAttempts = 10;

// Function to check Flask health and start Express
async function checkAndStartExpress() {
  flaskCheckAttempts++;
  console.log(`${colors.info}Checking Flask health (attempt ${flaskCheckAttempts}/${maxAttempts})...${colors.reset}`);
  
  const isFlaskHealthy = await checkFlaskHealth();
  
  if (isFlaskHealthy) {
    // Start Express with the knowledge that Flask is ready
    startExpress(true);
  } else if (flaskCheckAttempts < maxAttempts) {
    // Try again after a delay
    console.log(`${colors.info}Flask not ready yet, will retry in 2 seconds...${colors.reset}`);
    setTimeout(checkAndStartExpress, 2000);
  } else {
    // Give up and start Express in fallback mode
    console.log(`${colors.error}Flask failed to start after ${maxAttempts} attempts.${colors.reset}`);
    console.log(`${colors.error}Starting Express in fallback mode without Flask.${colors.reset}`);
    startExpress(false);
  }
}

// Function to start Express
function startExpress(withFlask) {
  console.log(`${colors.express}Starting Express server${withFlask ? ' with Flask backend' : ' in fallback mode'}...${colors.reset}`);
  
  // Here we need to start Express with the correct parameters
  const expressProcess = spawn('npx', ['tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      FLASK_AVAILABLE: withFlask ? 'true' : 'false',
      PORT: '3000'
    }
  });
  
  // Handle process exit
  expressProcess.on('close', (code) => {
    console.log(`${colors.error}Express exited with code ${code}${colors.reset}`);
    // Kill Flask when Express exits
    if (flaskProcess && !flaskProcess.killed) {
      console.log(`${colors.flask}Shutting down Flask backend...${colors.reset}`);
      flaskProcess.kill();
    }
    process.exit(code || 0);
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`${colors.info}Received SIGINT. Shutting down...${colors.reset}`);
  if (flaskProcess && !flaskProcess.killed) {
    flaskProcess.kill();
  }
  process.exit(0);
});

// Start the Express check after a delay to give Flask time to begin startup
setTimeout(checkAndStartExpress, 3000);