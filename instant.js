// Just bind to port 5000 immediately
require('http').createServer((req, res) => {
  res.end('OK');
}).listen(5000, '0.0.0.0', () => {
  console.log('Listening on port 5000');
});