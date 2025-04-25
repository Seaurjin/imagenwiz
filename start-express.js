// Express server startup with Flask health check
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

console.log(`${colors.info}Starting iMagenWiz Express Frontend Server...${colors.reset}`);

// Check Flask health before starting Express
function checkFlaskHealth() {
  return new Promise((resolve) => {
    console.log(`${colors.info}Checking Flask health...${colors.reset}`);
    
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

// This function tries to check Flask health several times
async function tryFlaskHealthChecks(attempts = 3, interval = 2000) {
  for (let i = 0; i < attempts; i++) {
    console.log(`${colors.info}Flask health check attempt ${i+1}/${attempts}...${colors.reset}`);
    const isHealthy = await checkFlaskHealth();
    if (isHealthy) {
      return true;
    }
    
    if (i < attempts - 1) {
      console.log(`${colors.info}Waiting ${interval/1000}s before next attempt...${colors.reset}`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  
  return false;
}

// Main startup function
async function startServer() {
  const flaskAvailable = await tryFlaskHealthChecks(5);
  
  if (flaskAvailable) {
    console.log(`${colors.success}✓ Flask backend is available and healthy${colors.reset}`);
  } else {
    console.log(`${colors.error}✗ Flask backend is not available or not responding${colors.reset}`);
    console.log(`${colors.error}✗ Some features requiring the Flask backend will be limited${colors.reset}`);
    console.log(`${colors.info}ℹ Make sure the "Start Flask Backend" workflow is running${colors.reset}`);
  }
  
  // Import and start the Express server
  console.log(`${colors.express}Starting Express server...${colors.reset}`);
  
  // Use execa to start the server as a child process
  try {
    // Start the server directly using npx tsx to handle TypeScript
    // The server/index.ts file is already configured to run even without Flask
    const { execSync } = await import('child_process');
    execSync('npx tsx server/index.ts', { stdio: 'inherit' });
  } catch (error) {
    console.error(`${colors.error}Error starting Express server:${colors.reset}`, error);
    process.exit(1);
  }
}

// Start the server
startServer().catch(err => {
  console.error(`${colors.error}Startup error:${colors.reset}`, err);
  process.exit(1);
});