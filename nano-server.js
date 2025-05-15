const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const PORT = process.env.PLACEHOLDER_PORT || 5000;
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
}).listen(PORT);