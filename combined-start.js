// Combined server starter - runs both npm run dev and the port redirection proxy

const { spawn } = require('child_process');

console.log('Starting iMagenWiz with port redirection (5000 → 3000)...');

// Start the main server using npm run dev
const serverProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});

// Give the server a moment to start up
setTimeout(() => {
  // Start the redirect proxy
  console.log('Starting port redirection proxy...');
  const proxyProcess = spawn('node', ['port-redirect-simple.cjs'], {
    stdio: 'inherit'
  });
  
  // Handle proxy process exit
  proxyProcess.on('exit', (code) => {
    console.log(`Proxy process exited with code ${code}`);
    // If proxy exits with error, kill the server too
    if (code !== 0 && code !== null) {
      serverProcess.kill();
      process.exit(code);
    }
  });
  
  // Handle errors
  proxyProcess.on('error', (err) => {
    console.error('Error starting proxy:', err);
    serverProcess.kill();
    process.exit(1);
  });
  
  // Handle main process signals for cleanup
  process.on('SIGINT', () => {
    console.log('Shutting down...');
    proxyProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('Terminating...');
    proxyProcess.kill();
    serverProcess.kill();
    process.exit(0);
  });
  
}, 5000); // Wait 5 seconds for server to start

// Handle server process exit
serverProcess.on('exit', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle errors
serverProcess.on('error', (err) => {
  console.error('Error starting server:', err);
  process.exit(1);
});