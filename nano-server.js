// Absolute minimal server for port 5000
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
}).listen(5000);