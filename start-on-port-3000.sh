#!/bin/bash

# Script to start the Express server on port 3000
echo "🚀 Starting Express server on port 3000..."

# Set environment variable for port
export PORT=3000

# Start the server using the npm script
npx tsx server/index.ts