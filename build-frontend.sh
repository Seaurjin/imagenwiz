#!/bin/bash

echo "Building frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Build the frontend
echo "Running Vite build..."
npm run build

echo "Frontend build complete!"

# Copy the bundled files to the root dist directory
echo "Frontend bundle is in frontend/dist"

echo "Done!"