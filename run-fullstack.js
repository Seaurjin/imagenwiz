// Start both Express frontend and Flask backend
import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🔄 Starting iMagenWiz Full Stack Application');
console.log('====================================================');

// Start Flask backend as a separate process
console.log('🚀 Starting Flask backend (this may take a minute)...');
const flaskProcess = spawn('cd', ['backend', '&&', 'python', 'run.py'], {
  shell: true,
  stdio: 'inherit'
});

flaskProcess.on('error', (err) => {
  console.error('❌ Failed to start Flask backend:', err);
});

// Give Flask a longer window to initialize
console.log('⏳ Waiting for Flask to initialize...');

// Start Express frontend after a delay
setTimeout(5000).then(() => {
  console.log('🚀 Starting Express frontend...');
  const expressProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit'
  });

  expressProcess.on('error', (err) => {
    console.error('❌ Failed to start Express frontend:', err);
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down services...');
    expressProcess.kill();
    flaskProcess.kill();
    process.exit(0);
  });
});

console.log('✅ Startup script complete - services should be starting...');