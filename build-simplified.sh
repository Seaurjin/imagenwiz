#!/bin/bash

echo "========== Building Simplified React App =========="
cd frontend

# Create temp build directory
mkdir -p temp_build
mkdir -p dist/assets
mkdir -p dist/images/comparison

# Create SVG files for comparison slider
cat > dist/images/comparison/original-dog-final-v2.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="#f3f4f6"/>
  <rect x="100" y="100" width="600" height="400" fill="#d1d5db"/>
  <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="#6b7280">Original Image</text>
  <text x="400" y="340" font-family="Arial" font-size="18" text-anchor="middle" fill="#6b7280">With Background</text>
</svg>
EOF

cat > dist/images/comparison/dog-no-background.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <rect width="800" height="600" fill="transparent"/>
  <circle cx="400" cy="300" r="200" fill="#0ea5e9"/>
  <text x="400" y="300" font-family="Arial" font-size="24" text-anchor="middle" fill="white">Processed Image</text>
  <text x="400" y="340" font-family="Arial" font-size="18" text-anchor="middle" fill="white">Background Removed</text>
</svg>
EOF

# Copy the simplified app to build dir
cp src/simplified-home.jsx temp_build/
cp src/simplified-index.html temp_build/index.html

# Use esbuild to transform JSX
if command -v npx &> /dev/null && npm list -g esbuild &> /dev/null; then
  echo "Using npm-installed esbuild"
  npx esbuild --bundle temp_build/simplified-home.jsx --outfile=dist/assets/home.js --format=esm
else
  echo "Installing esbuild..."
  npm install -g esbuild
  npx esbuild --bundle temp_build/simplified-home.jsx --outfile=dist/assets/home.js --format=esm
fi

# Update the index.html to use the bundled JS
cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iMagenWiz - AI Background Removal</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Custom tailwind theme */
    :root {
      --primary: #14b8a6;
      --primary-dark: #0d9488;
      --primary-light: #99f6e4;
    }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            teal: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              200: '#99f6e4',
              300: '#5eead4',
              400: '#2dd4bf',
              500: '#14b8a6',
              600: '#0d9488',
              700: '#0f766e',
              800: '#115e59',
              900: '#134e4a',
            }
          }
        }
      }
    }
  </script>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from 'https://esm.sh/react@18.2.0';
    import ReactDOM from 'https://esm.sh/react-dom@18.2.0/client';
    
    // Pre-bundled component
    import { default as HomePage } from './assets/home.js';
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(HomePage)
    );
  </script>
</body>
</html>
EOF

echo "Simplified React app build complete!"
echo "Files are in frontend/dist"

cd ..
echo "Done!"