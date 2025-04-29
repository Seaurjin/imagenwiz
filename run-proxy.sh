#!/bin/bash

# Simple script to run the port 3000 proxy
# Kill any existing proxy processes
pkill -f "node port-redirect-simple.cjs" || true

# Start the proxy in the background
node port-redirect-simple.cjs > proxy.log 2>&1 &
PROXY_PID=$!

# Save the PID for later
echo $PROXY_PID > proxy.pid

echo "Proxy started with PID: $PROXY_PID"
echo "Logs available in: proxy.log"

# Wait a moment for startup
sleep 1

# Check if the proxy is running
if ps -p $PROXY_PID > /dev/null; then
  echo "Proxy is running successfully"
  echo "You can now access the app at http://localhost:3000/"
else
  echo "Failed to start proxy. Check proxy.log for details."
  exit 1
fi