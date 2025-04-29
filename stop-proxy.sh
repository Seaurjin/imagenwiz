#!/bin/bash

# Simple script to stop the port 3000 proxy

# Check if proxy.pid exists
if [ -f proxy.pid ]; then
  PROXY_PID=$(cat proxy.pid)
  
  # Check if the process is running
  if ps -p $PROXY_PID > /dev/null; then
    echo "Stopping proxy with PID: $PROXY_PID"
    kill $PROXY_PID
    
    # Wait for process to terminate
    sleep 1
    
    # Verify it's stopped
    if ! ps -p $PROXY_PID > /dev/null; then
      echo "Proxy stopped successfully"
    else
      echo "Failed to stop proxy, trying stronger termination"
      kill -9 $PROXY_PID
      sleep 1
      if ! ps -p $PROXY_PID > /dev/null; then
        echo "Proxy forcefully terminated"
      else
        echo "Failed to terminate proxy"
      fi
    fi
  else
    echo "No proxy running with PID: $PROXY_PID"
  fi
  
  # Clean up PID file
  rm proxy.pid
else
  # PID file not found, try to kill any running instances
  pkill -f "node port-redirect-simple.cjs" || true
  echo "Attempted to kill any running proxy instances"
fi