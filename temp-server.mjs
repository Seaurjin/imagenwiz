import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5050;

// Check for frontend directories
const possibleFrontendPaths = [
  path.join(__dirname, 'frontend', 'dist'),
  path.join(__dirname, 'dist', 'public'),
  path.join(__dirname, 'frontend', 'build'),
  path.join(__dirname, 'client', 'build'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, 'build')
];

let frontendPath = null;

for (const pathToCheck of possibleFrontendPaths) {
  if (fs.existsSync(pathToCheck)) {
    console.log(`Found frontend path: ${pathToCheck}`);
    frontendPath = pathToCheck;
    break;
  }
}

if (frontendPath) {
  console.log(`Serving static files from: ${frontendPath}`);
  app.use(express.static(frontendPath));
  
  // Serve index.html for any route (SPA)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  console.log('No frontend build directory found');
  app.get('*', (req, res) => {
    res.send('Frontend not found');
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});