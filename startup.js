// Absolute minimal TCP server with no dependencies just to open port 5000
const net = require('net');
const { spawn } = require('child_process');

// Create a super simple TCP server
const server = net.createServer();

// Start listening immediately
server.listen(5000, '0.0.0.0', () => {
  console.log('✅ Minimal TCP server opened on port 5000');
  console.log('Starting Express application in the background...');
  
  // Start the real application with proper environment
  const app = spawn('npm', ['run', 'dev'], {
    env: {
      ...process.env,
      FLASK_AVAILABLE: 'false',
      EXPRESS_FALLBACK: 'true',
      SKIP_FLASK_CHECK: 'true',
      NODE_ENV: 'production',
      PORT: '3000'
    },
    stdio: 'inherit'
  });
  
  // Handle process events
  app.on('exit', (code) => {
    console.log(`Express application exited with code ${code}`);
    server.close();
    process.exit(code || 0);
  });
  
  app.on('error', (err) => {
    console.error('Error starting Express:', err);
    server.close();
    process.exit(1);
  });
});

server.on('connection', (socket) => {
  // Send a simple response and close the connection
  socket.end('iMagenWiz Startup Server\r\n');
});

server.on('error', (err) => {
  console.error('Error opening TCP port:', err);
  process.exit(1);
});