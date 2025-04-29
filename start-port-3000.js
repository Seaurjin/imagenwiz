/**
 * Custom server startup script for port 3000
 * This script starts the Express server with the frontend on port 3000
 */

const { spawn } = require('child_process');
const process = require('process');

console.log('🚀 Starting Express server on port 3000...');

// Set environment variables
process.env.PORT = '3000';

// Start the server process
const server = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env, PORT: '3000' },
  stdio: 'inherit'
});

// Handle server exit
server.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server...');
  server.kill();
  process.exit(0);
});