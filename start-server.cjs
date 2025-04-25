// Minimal server that opens port 5000 immediately - CommonJS version
const http = require('http');
const { spawn } = require('child_process');

// Get start time
const startTime = Date.now();
console.log(`[${startTime}] Starting minimal server on port 5000...`);

// Create the simplest server possible
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...\n');
});

// Open port 5000 immediately
server.listen(5000, '0.0.0.0', () => {
  const elapsed = Date.now() - startTime;
  console.log(`[${Date.now()}] ✅ Port 5000 open after ${elapsed}ms`);
  
  // Start the actual application
  console.log(`[${Date.now()}] Starting main application (npm run dev)...`);
  const npmProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    detached: false
  });
  
  // Monitor application process
  npmProcess.on('error', (err) => {
    console.error(`[${Date.now()}] ❌ Failed to start application:`, err);
  });
});