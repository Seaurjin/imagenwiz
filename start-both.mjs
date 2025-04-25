// Script to start both Express and Flask
import { spawn } from 'child_process';
import http from 'http';

// Create a dummy server on port 5000 (for Replit)
const dummyServer = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz placeholder server');
});

// Start the placeholder server on port 5000
dummyServer.listen(5000, '0.0.0.0', () => {
  console.log('✅ Placeholder server started on port 5000 to satisfy Replit');
  
  // Now start the Flask backend
  console.log('🐍 Starting Flask backend...');
  
  const flaskBackend = spawn('python3', ['backend/app.py'], {
    env: {
      ...process.env,
      FLASK_ENV: 'development',
      FLASK_DEBUG: '1',
      PORT: '5000'
    },
    stdio: 'inherit'
  });
  
  flaskBackend.on('error', (err) => {
    console.error('Failed to start Flask backend:', err);
  });
  
  // Wait a moment for Flask to initialize
  setTimeout(() => {
    // Then start the Express application
    console.log('🚀 Starting Express frontend...');
    
    const expressApp = spawn('npm', ['run', 'dev'], {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        PORT: '3000',
        FLASK_AVAILABLE: 'true'
      },
      stdio: 'inherit'
    });
    
    expressApp.on('error', (err) => {
      console.error('Failed to start Express application:', err);
      process.exit(1);
    });
    
    expressApp.on('exit', (code) => {
      console.log(`Express application exited with code ${code}`);
      flaskBackend.kill();
      process.exit(code || 0);
    });
  }, 5000); // Give Flask 5 seconds to start up
  
  flaskBackend.on('exit', (code) => {
    console.log(`Flask backend exited with code ${code}`);
    process.exit(code || 0);
  });
});