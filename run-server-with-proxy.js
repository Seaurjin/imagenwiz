/**
 * Combined server and proxy runner for iMagenWiz
 * Runs both the Express server on port 5000 and a simple proxy on port 3000
 */

const { spawn } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const EXPRESS_PORT = process.env.EXPRESS_PORT || 3000;
const FLASK_PORT = process.env.FLASK_PORT || 5000;

console.log('=== Starting iMagenWiz Application ===');

// Start the Express server
const expressProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: FLASK_PORT
  }
});

console.log('Express server started on port ' + FLASK_PORT);

// Start the proxy server
const proxyProcess = spawn('node', ['simple-proxy.js'], {
  stdio: 'inherit'
});

console.log('Proxy server started on port ' + EXPRESS_PORT + ' -> ' + FLASK_PORT);

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down application...');
  
  // Kill both processes
  expressProcess.kill();
  proxyProcess.kill();
  
  process.exit(0);
});

// Handle process exits
expressProcess.on('exit', (code) => {
  console.log(`Express process exited with code ${code}`);
  proxyProcess.kill();
  process.exit(code);
});

proxyProcess.on('exit', (code) => {
  console.log(`Proxy process exited with code ${code}`);
  if (code !== 0 && code !== null) {
    expressProcess.kill();
    process.exit(code);
  }
});