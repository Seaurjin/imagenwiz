// Start full stack application
// This script sets REPLIT_DOMAIN in environment variable and runs our coordinated-startup.mjs

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get the Replit domain from environment or set it hardcoded if needed
const REPLIT_DOMAIN = process.env.REPLIT_DOMAIN || 'e3d010d3-10b7-4398-916c-9569531b7cb9-00-nzrxz81n08w.kirk.replit.dev';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

console.log(`Starting full stack application with REPLIT_DOMAIN=${REPLIT_DOMAIN}`);

// Create placeholder server.js if it doesn't exist
const placeholderPath = path.join(__dirname, 'placeholder-server.mjs');
if (!fs.existsSync(placeholderPath)) {
  console.log('Creating placeholder server script...');
  const placeholderContent = `
// Simple placeholder server for Replit
import http from 'http';

const server = http.createServer((req, res) => {
  console.log(\`Received request: \${req.method} \${req.url}\`);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    message: 'Placeholder server running. The main application is starting...'
  }));
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(\`Placeholder server running on port \${PORT}\`);
});

// Export server for external use
export default server;
`;
  fs.writeFileSync(placeholderPath, placeholderContent);
}

// Configure important environment variables
const env = {
  ...process.env,
  REPLIT_DOMAIN,
  // MySQL database configuration
  DB_USER: 'root',
  DB_PASSWORD: 'Ir%86241992',
  DB_HOST: '8.130.113.102',
  DB_NAME: 'mat_db',
  DB_PORT: '3306',
  // Flask configuration
  FLASK_ENV: 'development',
  FLASK_DEBUG: '1',
  // Skip migrations for faster startup (optional)
  SKIP_MIGRATIONS: 'true',
  // Express ports configuration
  EXPRESS_PORT: '3000',
  FLASK_PORT: '5001',
  // Explicitly set the workflow_id for logging
  WORKFLOW_ID: 'coordinated-startup'
};

console.log('Starting coordinated startup with environment:');
Object.keys(env).filter(key => !key.includes('PASSWORD')).forEach(key => {
  console.log(`- ${key}: ${key.includes('SECRET') ? '****' : env[key]}`);
});

// Start the coordinated startup script with environment variables
const startup = spawn('node', ['coordinated-startup.mjs'], {
  env,
  stdio: 'inherit'
});

startup.on('exit', (code) => {
  console.log(`Startup process exited with code ${code}`);
  process.exit(code || 0);
});

// Handle process signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down...');
  startup.kill();
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down...');
  startup.kill();
});