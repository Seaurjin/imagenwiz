#!/bin/bash

# Script to start the port redirection server on port 3000
echo "🚀 Setting up port redirection from 3000 to 5000..."

# Check if the main server is running on port 5000
echo "Checking if main server is running on port 5000..."
curl -s -I http://localhost:5000 > /dev/null
if [ $? -ne 0 ]; then
  echo "❌ Main server is not running on port 5000. Please start it first."
  exit 1
fi
echo "✅ Main server is running on port 5000."

# Run the port redirection server
echo "🔄 Starting port redirection server on port 3000..."
node port-redirect.js