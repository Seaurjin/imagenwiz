// Ultraminimal server for Replit to detect port 5000 immediately

import http from 'http';

// Create server that opens immediately with absolute minimum code
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Starting iMagenWiz...');
}).listen(5000, '0.0.0.0', () => {
  console.log('✅ Port 5000 is now open');
});