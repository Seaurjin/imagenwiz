#!/bin/bash
# Script to stop the blog service

echo "Stopping blog service..."

# Make the script executable
chmod +x "$0"

# Check if PID file exists
if [ -f "blog-service.pid" ]; then
  PID=$(cat blog-service.pid)
  
  # Check if process exists
  if ps -p $PID > /dev/null; then
    echo "Killing blog service with PID: $PID"
    kill $PID
    rm blog-service.pid
    echo "Blog service stopped"
  else
    echo "No running blog service found with PID: $PID"
    rm blog-service.pid
  fi
else
  # Try to find by process name
  PID=$(pgrep -f "node blog-service.cjs")
  if [ -n "$PID" ]; then
    echo "Found blog service running with PID: $PID"
    kill $PID
    echo "Blog service stopped"
  else
    echo "No running blog service found"
  fi
fi 