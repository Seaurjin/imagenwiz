// Tiniest possible CommonJS server for port 5000
const http = require('http');
http.createServer((_, res) => res.end()).listen(5000, () => {
  console.log('Port 5000 is open');
});