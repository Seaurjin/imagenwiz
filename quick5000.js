// Absolute minimum server for port 5000 (no ES modules, no imports)
// Just vanilla JS that should run as fast as possible
(function() {
  console.log('Starting minimal port 5000 server...');
  const http = require('http');
  
  // Create the absolute simplest server possible
  const server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('OK\n');
  });
  
  // Open port 5000 as quickly as possible
  server.listen(5000, '0.0.0.0');
  
  // Log success
  console.log('Port 5000 is now open');
  
  // Start the real application separately after a small delay
  setTimeout(function() {
    console.log('Starting main application...');
    try {
      require('child_process').spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        detached: true
      });
    } catch (e) {
      console.error('Failed to start main app:', e);
    }
  }, 1000);
})();