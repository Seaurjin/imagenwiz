// Ultra-minimal HTTP server that just opens port 5000 immediately
const http = require('http');
const { spawn } = require('child_process');

// Create the simplest possible HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz startup server');
});

// Immediately listen on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('Simple startup server running on port 5000');
  
  // Start Express in the background with all necessary environment variables
  const env = {
    ...process.env,
    FLASK_AVAILABLE: 'false',
    EXPRESS_FALLBACK: 'true',
    SKIP_FLASK_CHECK: 'true',
    NODE_ENV: 'production',
    PORT: '3000'
  };
  
  // Use spawn to keep the main process running
  const expressApp = spawn('npm', ['run', 'dev'], {
    env,
    stdio: 'inherit'
  });
  
  // Handle errors and exit events
  expressApp.on('error', (err) => {
    console.error('Failed to start Express:', err);
  });
  
  expressApp.on('exit', (code) => {
    console.log(`Express exited with code ${code}`);
    process.exit(code);
  });
});