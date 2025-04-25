// Express-only entry point for iMagenWiz
// This sets up environment variables to force Express to start without waiting for Flask

// Set environment variables for Express-only mode
process.env.FLASK_AVAILABLE = 'false';
process.env.EXPRESS_FALLBACK = 'true';
process.env.FLASK_PORT = '5000';  // Still needed for configuration
process.env.SKIP_FLASK_CHECK = 'true';

// Import the main server file to start Express
import './index.js';