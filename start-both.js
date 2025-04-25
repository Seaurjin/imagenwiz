// Start both Express frontend and Flask backend
import { spawn } from 'child_process';

// Start Flask backend as a separate process
console.log('Starting Flask backend...');
const flaskProcess = spawn('cd', ['backend', '&&', 'python', 'run.py'], {
  shell: true,
  stdio: 'inherit'
});

flaskProcess.on('error', (err) => {
  console.error('Failed to start Flask backend:', err);
});

// Give Flask a moment to start up
setTimeout(() => {
  // Start Express frontend
  console.log('Starting Express frontend...');
  const expressProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit'
  });

  expressProcess.on('error', (err) => {
    console.error('Failed to start Express frontend:', err);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('Shutting down services...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
}, 1000); // 1 second delay before starting Express