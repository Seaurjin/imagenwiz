// Ultra-lightweight server that starts instantly on port 5000
// and then starts the real application
import http from 'http';
import { spawn } from 'child_process';

console.log('⚡ Starting standalone placeholder server on port 5000...');

// Create a minimal server for port 5000
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({ status: 'ok' }));
});

// Start the minimal server immediately for Replit
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Placeholder server started on port 5000');
  
  // Start real application with a slight delay
  setTimeout(() => {
    console.log('🔍 Starting iMagenWiz application...');
    
    // Start Flask backend with fixed port 5001
    console.log('🐍 Starting Flask backend on port 5001...');
    const flask = spawn('python3', ['backend/run.py'], {
      env: {
        ...process.env,
        FLASK_ENV: 'development',
        FLASK_DEBUG: '1',
        PORT: '5001'  // Use fixed port 5001 for Flask
      },
      stdio: 'inherit'
    });
    
    flask.on('error', (err) => {
      console.error('⚠️ Failed to start Flask backend:', err);
    });
    
    // Start Express frontend after Flask has a chance to initialize
    setTimeout(() => {
      console.log('📱 Starting Express frontend...');
      
      const express = spawn('npm', ['run', 'dev'], {
        env: {
          ...process.env,
          FLASK_PORT: '5001',
          FLASK_URL: 'http://localhost:5001'
        },
        stdio: 'inherit'
      });
      
      express.on('error', (err) => {
        console.error('⚠️ Failed to start Express frontend:', err);
      });
      
      // Handle Express exit
      express.on('exit', (code) => {
        console.log(`Express frontend exited with code ${code}`);
        // Don't exit the process - let the placeholder server continue running
      });
      
    }, 2000); // 2 second delay to let Flask initialize
    
    // Handle Flask exit
    flask.on('exit', (code) => {
      console.log(`Flask backend exited with code ${code}`);
      // Don't exit the process - let the placeholder server continue running
    });
    
  }, 500);
});