/**
 * Simple script to start the Express server only
 * This bypasses the usual npm run dev which tries to start both Express and Flask
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory (equivalent to __dirname in CommonJS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('📝 Starting Express server only (without Flask backend)');

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('⚠️ node_modules not found, running npm install first');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ npm install exited with code ${code}`);
      process.exit(code);
    }
    
    startExpressServer();
  });
} else {
  startExpressServer();
}

function startExpressServer() {
  console.log('🚀 Starting Express server...');
  
  // Use node directly to run the server
  const server = spawn('node', ['server/index.js'], { 
    stdio: 'inherit',
    env: {
      ...process.env,
      SKIP_FLASK_WAIT: 'true',  // Custom env var to signal we're skipping Flask
      PORT: '3000'
    }
  });
  
  server.on('close', (code) => {
    console.log(`Express server exited with code ${code}`);
    process.exit(code);
  });
  
  // Handle termination signals
  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down Express server');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down Express server');
    server.kill('SIGTERM');
  });
}