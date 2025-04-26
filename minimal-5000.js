// Absolute minimal server
const net = require('net');

// Create a raw TCP server for absolute minimum overhead
console.log('Creating TCP server on port 5000');
const server = net.createServer((socket) => {
  socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello');
  socket.end();
});

// Add error handling
server.on('error', (err) => {
  console.error('ERROR:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('Port 5000 is already in use. Trying to close the existing server...');
    // Try to close any existing server
    const client = new net.Socket();
    client.on('error', () => {
      console.error('Could not connect to existing server');
      process.exit(1);
    });
    client.connect(5000, '127.0.0.1', () => {
      console.error('Connected to existing server, closing');
      client.end();
      process.exit(1);
    });
  }
});

// Listen on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('Server is now listening on port 5000');
  // Verify that the server is really listening
  const client = new net.Socket();
  client.on('error', (err) => {
    console.error('Self-test failed:', err.message);
  });
  client.connect(5000, '127.0.0.1', () => {
    console.log('Self-test successful: server is accessible');
    client.end();
  });
});

// Keep the process running
console.log('Keeping process alive...');
setInterval(() => {
  try {
    console.log('Server still running on port 5000:', server.listening);
  } catch (e) {
    console.error('Error in status check:', e.message);
  }
}, 5000);