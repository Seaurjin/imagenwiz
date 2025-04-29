#!/bin/bash

echo "========== Minimal Frontend Build Script =========="
echo "Building minimalistic React frontend..."
cd frontend

# Clean up the dist directory first to ensure a fresh build
echo "Cleaning up dist directory..."
rm -rf dist
mkdir -p dist
mkdir -p dist/assets

# Create a temporary build directory
mkdir -p temp_build

# Create a minimized entry point for our React app
echo "Creating minimal React app..."
cat > temp_build/main.jsx <<EOL
import React from 'react';
import ReactDOM from 'react-dom/client';

function ImageComparisonSlider() {
  const [position, setPosition] = React.useState(50);
  const sliderRef = React.useRef(null);
  const beforeImageRef = React.useRef(null);
  const afterImageRef = React.useRef(null);
  
  const handleMouseMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setPosition(percent);
  };
  
  React.useEffect(() => {
    if (afterImageRef.current) {
      afterImageRef.current.style.clipPath = \`polygon(\${position}% 0, 100% 0, 100% 100%, \${position}% 100%)\`;
    }
  }, [position]);
  
  return (
    <div 
      className="comparison-slider"
      ref={sliderRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        maxWidth: '800px',
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
      onMouseMove={handleMouseMove}
    >
      <img 
        ref={beforeImageRef}
        src="/images/comparison/original-dog-final-v2.jpg" 
        alt="Original" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      <img 
        ref={afterImageRef}
        src="/images/comparison/dog-no-background.png" 
        alt="Processed" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          clipPath: \`polygon(\${position}% 0, 100% 0, 100% 100%, \${position}% 100%)\`
        }}
      />
      <div 
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'white',
          left: \`\${position}%\`,
          transform: 'translateX(-50%)',
          cursor: 'ew-resize',
          zIndex: 10
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#14b8a6',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <svg 
            style={{ color: 'white' }}
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', fontSize: '2rem', fontWeight: 'bold', color: '#14b8a6', marginBottom: '1rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          iMagenWiz
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#111827', marginBottom: '1rem' }}>AI-Powered Background Removal</h1>
        <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: '800px', margin: '0 auto 2rem' }}>
          Remove backgrounds from images in seconds with our state-of-the-art AI technology.
        </p>
      </header>
      
      <section style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '0.5rem' }}>See the Difference</h2>
          <p style={{ color: '#4b5563' }}>Drag the slider to compare before and after</p>
        </div>
        <ImageComparisonSlider />
        <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '1rem auto 0' }}>
          <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', fontSize: '0.875rem', color: '#334155' }}>Original</span>
          <span style={{ padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '9999px', fontSize: '0.875rem', color: '#334155' }}>Background Removed</span>
        </div>
      </section>
      
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2rem', color: '#111827', marginBottom: '1.5rem' }}>Ready to try it yourself?</h2>
        <a 
          href="/demo" 
          style={{
            display: 'inline-block',
            backgroundColor: '#14b8a6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Try Our Full Demo
        </a>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create an index.html for the test build
cat > temp_build/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>iMagenWiz - AI Background Removal</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="./main.jsx"></script>
</body>
</html>
EOL

# Create a simple Vite config for the test build
cat > temp_build/vite.config.js <<EOL
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html')
    }
  }
});
EOL

# Try to build the React app
echo "Building minimal React app..."
cd temp_build
VITE_TEST_BUILD=1 ../node_modules/.bin/vite build --config vite.config.js
BUILD_RESULT=$?
cd ..

# Check if build succeeded
if [ $BUILD_RESULT -ne 0 ]; then
  echo "ERROR: React build failed."
  # Create a standalone HTML file that doesn't rely on React
  echo "Creating fallback HTML page..."
  cat > dist/index.html <<EOL
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iMagenWiz - AI Background Removal</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    .header {
      margin-bottom: 3rem;
    }
    .logo {
      font-size: 2rem;
      font-weight: bold;
      color: #14b8a6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .logo svg {
      margin-right: 0.5rem;
    }
    h1 {
      font-size: 2.5rem;
      color: #111827;
      margin-bottom: 1rem;
    }
    p {
      color: #4b5563;
      font-size: 1.1rem;
      margin-bottom: 2rem;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }
    .btn {
      display: inline-block;
      background-color: #14b8a6;
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #0d9488;
    }
  </style>
</head>
<body>
  <div class="app-container">
    <div class="header">
      <div class="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        iMagenWiz
      </div>
      <h1>AI-Powered Background Removal</h1>
      <p>Remove backgrounds from images in seconds with our state-of-the-art AI technology.</p>
      <a href="/demo" class="btn">Try Our Demo Version</a>
    </div>
  </div>
</body>
</html>
EOL
  echo "Created fallback HTML page at dist/index.html"
  exit 1
fi

echo "React build successful!"
echo "Frontend bundle is in frontend/dist"

# Copy favicon if not already present
if [ -f "favicon.svg" ] && [ ! -f "dist/favicon.svg" ]; then
  cp favicon.svg dist/favicon.svg
fi

# Create a directory for comparison images if needed
mkdir -p dist/images/comparison

# Check if we have the comparison images and provide defaults if not
if [ ! -f "dist/images/comparison/original-dog-final-v2.jpg" ]; then
  mkdir -p dist/images/comparison
  
  # Create a simple placeholder for the original image
  cat > dist/images/comparison/original-dog-final-v2.jpg <<EOL
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f0f9ff"/>
  <rect x="100" y="100" width="600" height="400" fill="#e0f2fe"/>
  <text x="400" y="350" font-family="Arial" font-size="24" text-anchor="middle">Original Image</text>
</svg>
EOL

  # Create a simple placeholder for the processed image
  cat > dist/images/comparison/dog-no-background.png <<EOL
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="transparent"/>
  <rect x="100" y="100" width="600" height="400" fill="#f0fdfa"/>
  <text x="400" y="350" font-family="Arial" font-size="24" text-anchor="middle">Processed Image</text>
</svg>
EOL
fi

cd ..
echo "Done!"