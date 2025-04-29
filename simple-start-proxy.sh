#!/bin/bash

# Simple script to start the port 3000 proxy in the background

echo "🚀 Starting mini proxy server on port 3000..."

# Kill any existing processes first
pkill -f "node port-redirect-simple.cjs" 2>/dev/null

# Start the proxy in the background
nohup node port-redirect-simple.cjs > proxy.log 2>&1 &

# Store the process ID
PROXY_PID=$!

# Verify the process started
if ps -p $PROXY_PID > /dev/null; then
  echo "✅ Proxy server started with PID: $PROXY_PID"
  echo "✅ Access your app at: http://localhost:3000"
  echo "✅ Log file: proxy.log"
else
  echo "❌ Failed to start proxy server"
  exit 1
fi

# Save the PID for later
echo $PROXY_PID > proxy.pid

echo ""
echo "To stop the proxy server, run: ./simple-stop-proxy.sh"