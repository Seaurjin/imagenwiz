name = "Port 5000"
command = "node -e \"require('http').createServer((req, res) => { res.writeHead(200); res.end('OK'); }).listen(5000, '0.0.0.0');\""
waitForPort = 5000