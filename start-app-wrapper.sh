#!/bin/bash

# This script provides a more reliable way to start the iMagenWiz application
# by breaking up the startup sequence into smaller steps that can complete
# within Replit's timeout constraints.

echo "🚀 Starting iMagenWiz Application..."
echo "📝 Step 1: Checking environment..."

# Ensure necessary directories exist
mkdir -p logs
mkdir -p temp

# Check for NODE_ENV and set to development if not present
if [ -z "$NODE_ENV" ]; then
  export NODE_ENV=development
  echo "📝 Set NODE_ENV to development"
fi

# Check if PORT is set, if not set to 3000
if [ -z "$PORT" ]; then
  export PORT=3000
  echo "📝 Set PORT to 3000"
fi

echo "📝 Step 2: Starting server..."
echo "📝 Current directory: $(pwd)"

# Start the application
npx tsx server/index.ts | tee logs/app.log