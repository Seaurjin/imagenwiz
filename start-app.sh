#!/bin/bash

# Set error handling
set -e

# Function to clean up child processes on exit
cleanup() {
  echo "Cleaning up processes..."
  if [ ! -z "$FLASK_PID" ]; then
    kill $FLASK_PID 2>/dev/null || true
  fi
  if [ ! -z "$EXPRESS_PID" ]; then
    kill $EXPRESS_PID 2>/dev/null || true
  fi
  exit 0
}

# Register cleanup function for program exit
trap cleanup EXIT INT TERM

# Start Flask backend in the background
echo "🚀 Starting Flask backend..."
cd backend && python run.py &
FLASK_PID=$!
cd ..

echo "⏳ Waiting for Flask to initialize (this may take a minute)..."
sleep 5

# Check if Flask process is still running
if ps -p $FLASK_PID > /dev/null; then
  echo "✅ Flask backend started with PID: $FLASK_PID"
else
  echo "⚠️ Flask backend failed to start. Starting Express in fallback mode..."
fi

# Start Express frontend
echo "🚀 Starting Express frontend..."
npm run dev &
EXPRESS_PID=$!

# Wait for any process to exit
wait $EXPRESS_PID

# The cleanup function will handle termination