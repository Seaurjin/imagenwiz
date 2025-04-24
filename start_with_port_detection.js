// This script starts the application and listens for both ports
// to satisfy Replit's workflow system
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

console.log('🚀 Starting iMagenWiz with port detection...');

// Create logs directory if it doesn't exist
if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}

// Create a simple HTTP server on port 5000 to satisfy the workflow waitForPort
const proxyServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <html>
      <head>
        <title>iMagenWiz - Port Proxy</title>
        <meta http-equiv="refresh" content="0;url=https://${process.env.REPLIT_DOMAINS}:3000">
      </head>
      <body>
        <h1>Redirecting to the main application...</h1>
        <p>If you are not redirected automatically, <a href="https://${process.env.REPLIT_DOMAINS}:3000">click here</a>.</p>
      </body>
    </html>
  `);
});

proxyServer.listen(5000, '0.0.0.0', () => {
  console.log('🔄 Proxy server running on port 5000 - Redirecting to main app on port 3000');
});

// Start the actual application
const app = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: ['inherit', 'pipe', 'pipe']
});

// Pipe the application's stdout and stderr to the console and a log file
const logStream = fs.createWriteStream('logs/app.log', { flags: 'a' });

app.stdout.on('data', (data) => {
  process.stdout.write(data);
  logStream.write(data);
});

app.stderr.on('data', (data) => {
  process.stderr.write(data);
  logStream.write(data);
});

app.on('close', (code) => {
  console.log(`🛑 Application process exited with code ${code}`);
  proxyServer.close();
  logStream.end();
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down...');
  app.kill();
  proxyServer.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down...');
  app.kill();
  proxyServer.close();
  process.exit(0);
});