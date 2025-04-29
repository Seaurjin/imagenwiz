#!/bin/bash

# Script to stop the port 3000 proxy server
echo "🛑 Stopping port 3000 proxy server..."

# Find the process running on port 3000
PID=$(ps aux | grep 'node port-3000-proxy.cjs' | grep -v grep | awk '{print $2}' 2>/dev/null)

if [ -z "$PID" ]; then
  echo "ℹ️ No process found running on port 3000."
  exit 0
fi

echo "Found process with PID: $PID"

# Try to kill the process gracefully
echo "Attempting to stop the process gracefully..."
kill -15 $PID 2>/dev/null

# Check if the process was killed
sleep 1
if ps -p $PID > /dev/null 2>&1; then
  echo "Process still running, trying force kill..."
  kill -9 $PID 2>/dev/null
  
  # Check again
  sleep 1
  if ps -p $PID > /dev/null 2>&1; then
    echo "❌ Failed to kill process $PID."
    exit 1
  fi
fi

echo "✅ Port 3000 proxy server stopped."