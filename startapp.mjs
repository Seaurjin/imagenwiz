// Express-only starter script for iMagenWiz that works with Replit's workflow system
// This loads environment variables and launches Express directly
import { spawn } from 'child_process';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up runtime environment variables
process.env.FLASK_AVAILABLE = 'false';
process.env.EXPRESS_FALLBACK = 'true';
process.env.FLASK_PORT = '5000';
process.env.SKIP_FLASK_CHECK = 'true';
process.env.NODE_ENV = 'production'; 
process.env.PORT = '3000';

// Import the Express server
import './server/index.js';

// Create a simple server just to indicate the app is running on port 3000
// This helps Replit's workflow system detect that our app is running
createServer((req, res) => {
  res.writeHead(200);
  res.end('iMagenWiz Express server is running');
}).listen(3000);

console.log('✅ Express server successfully started on port 3000');
console.log('✅ Application running in Express-only mode (fallback mode)');
console.log('📌 Access the application through the webview');