#!/bin/bash

# Kill any existing processes on port 5000
echo "Checking for processes on port 5000..."
PID=$(lsof -t -i:5000 2>/dev/null)
if [ ! -z "$PID" ]; then
  echo "Killing process $PID on port 5000"
  kill -9 $PID
fi

# Navigate to frontend directory
cd frontend

# Start Vite development server on port 5000
echo "Starting Vite development server on port 5000..."
npx vite --port 5000 --host 0.0.0.0

# Return to root directory
cd ..