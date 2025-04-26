// Simple script to start Flask backend only
const { spawn } = require('child_process');

console.log('Starting Flask backend...');
const flask = spawn('python3', ['backend/run.py'], {
  env: {
    ...process.env,
    FLASK_APP: 'backend/run.py',
    FLASK_ENV: 'development',
    FLASK_DEBUG: '1',
    FLASK_PORT: '5000'
  },
  stdio: 'inherit'
});

flask.on('error', (err) => {
  console.error('Failed to start Flask backend:', err.message);
});

flask.on('exit', (code) => {
  console.log('Flask backend exited with code:', code);
});

// Keep process running
setInterval(() => {}, 1000);