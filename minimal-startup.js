// Absolute minimal server to satisfy Replit
const http = require('http');

// Create the simplest possible server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('OK');
});

// Start listening on port 5000 immediately
server.listen(5000, '0.0.0.0', () => {
  console.log('Minimal server started on port 5000');
});

// Keep the process running
process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});