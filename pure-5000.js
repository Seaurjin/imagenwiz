// Super simple HTTP server that binds to port 5000 immediately
// This is designed to satisfy Replit's port requirement
const http = require('http');

// Create and start the server immediately
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

// Bind to port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
});

// Keep the process alive
process.stdin.resume();