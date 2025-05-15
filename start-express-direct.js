/**
 * Direct Express server starter for iMagenWiz
 * 
 * This script:
 * 1. Starts the Express server directly
 * 2. Focuses only on the Express part without Flask
 * 3. Uses local directory paths
 */

// Import required modules
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

// Get the current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const PORT = process.env.EXPRESS_PORT || 3000;

// Create Express app
const app = express();

// Set up middleware and routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files if they exist
const frontendPath = path.join(__dirname, 'frontend/dist');
console.log(`Checking for frontend at: ${frontendPath}`);

app.use(express.static(frontendPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Express server is running' });
});

// Setup a simple API endpoint
app.get('/api/express-status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Express server is running in standalone mode',
    time: new Date().toISOString()
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║           iMagenWiz Express Server                 ║
║      Running Express frontend ONLY                 ║
╚════════════════════════════════════════════════════╝
`);
  console.log(`🚀 Express server running on http://0.0.0.0:${PORT}`);
  console.log(`📂 Serving frontend from: ${frontendPath}`);
  console.log(`⚠️ This is Express-only mode. Flask backend is NOT running.`);
});