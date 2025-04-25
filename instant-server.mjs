// The absolute simplest server that starts instantly on port 5000
const http = require('http');
const { exec } = require('child_process');

// Create an HTTP server that responds immediately
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('OK');
});

// Start listening on port 5000 right away
server.listen(5000, '0.0.0.0', () => {
  console.log('Instant server running on port 5000');
  
  // Start the real application in the background
  exec('node simple-start.mjs', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
});