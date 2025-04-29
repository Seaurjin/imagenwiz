#!/bin/bash

# Simple script to stop the port 3000 proxy

echo "🛑 Stopping port 3000 proxy..."

# Check if we have a saved PID
if [ -f "proxy-port-3000.pid" ]; then
  PID=$(cat proxy-port-3000.pid)
  echo "Found saved PID: $PID"
  
  # Try to kill the process
  kill -15 $PID 2>/dev/null
  
  # Check if it was killed
  sleep 1
  if ps -p $PID > /dev/null 2>&1; then
    echo "Process still running, using force kill..."
    kill -9 $PID 2>/dev/null
    sleep 1
  fi
  
  # Final check
  if ps -p $PID > /dev/null 2>&1; then
    echo "❌ Failed to kill process $PID"
  else
    echo "✅ Process $PID stopped successfully"
    rm proxy-port-3000.pid
  fi
else
  # If no PID file, look for any processes by name
  echo "No PID file found, searching for processes..."
  PIDS=$(ps aux | grep "node pure-5000.cjs" | grep -v grep | awk '{print $2}')
  
  if [ -z "$PIDS" ]; then
    echo "ℹ️ No proxy processes found running"
    exit 0
  fi
  
  # Kill any found processes
  for PID in $PIDS; do
    echo "Killing process $PID..."
    kill -15 $PID 2>/dev/null
    sleep 1
    if ps -p $PID > /dev/null 2>&1; then
      kill -9 $PID 2>/dev/null
    fi
  done
  
  echo "✅ All proxy processes stopped"
fi

echo ""
echo "To start the proxy again, run: ./run-port-3000-simple.sh"