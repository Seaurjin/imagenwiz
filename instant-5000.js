// Ultra minimal placeholder server for port 5000 that responds immediately
const http = require('http');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').resolve(__dirname, '.env') });
const PORT = process.env.PLACEHOLDER_PORT || 5000;
console.log(`Starting placeholder server on port ${PORT}`);
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('iMagenWiz is starting...');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Placeholder server running on port ${PORT}`);
  
  // Start the real app after a very short delay
  setTimeout(() => {
    const { spawn } = require('child_process');
    console.log('Starting Express with npm run dev');
    
    spawn('npm', ['run', 'dev'], {
      stdio: 'inherit'
    });
  }, 500);
});

// Keep process running
setInterval(() => {}, 1000);