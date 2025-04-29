#!/bin/bash

# Script to keep the proxy alive even if the process dies
# This runs in a loop, restarting the proxy if it dies

# Set exit handler
trap 'echo "Exiting keep-proxy-alive script..."; pkill -f "node port-redirect-simple.cjs" || true; exit 0' SIGINT SIGTERM

echo "Starting proxy monitoring service..."
echo "Press Ctrl+C to stop."

# Function to check if proxy is running
check_proxy() {
  if [ -f proxy.pid ]; then
    PID=$(cat proxy.pid)
    if ps -p $PID > /dev/null; then
      return 0  # Proxy is running
    fi
  fi
  return 1  # Proxy is not running
}

# Loop to keep proxy alive
while true; do
  if ! check_proxy; then
    echo "$(date): Proxy not running. Starting..."
    # First clean up any zombie processes
    pkill -f "node port-redirect-simple.cjs" || true
    
    # Start the proxy
    node port-redirect-simple.cjs > proxy.log 2>&1 &
    NEW_PID=$!
    echo $NEW_PID > proxy.pid
    echo "$(date): Started proxy with PID: $NEW_PID"
    
    # Give it a moment to start up
    sleep 2
    
    # Check if it started successfully
    if ! check_proxy; then
      echo "$(date): Failed to start proxy. Will retry..."
    else
      echo "$(date): Proxy started successfully"
    fi
  fi
  
  # Wait before checking again
  sleep 10
done