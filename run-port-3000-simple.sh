#!/bin/bash

# Simple script to run the port 3000 proxy in the background

echo "🚀 Starting port 3000 proxy..."

# Kill any existing processes running the proxy
pkill -f "node pure-5000.cjs" 2>/dev/null

# Start the proxy in the background
nohup node pure-5000.cjs > proxy-port-3000.log 2>&1 &

# Store the PID
PROXY_PID=$!
echo $PROXY_PID > proxy-port-3000.pid

# Check if the process is running
if ps -p $PROXY_PID > /dev/null; then
  echo "✅ Proxy started with PID: $PROXY_PID"
  echo "✅ Access your app at: http://localhost:3000"
  echo "✅ Log file: proxy-port-3000.log"
else
  echo "❌ Failed to start proxy"
  exit 1
fi

echo ""
echo "To stop the proxy, run: ./stop-port-3000-simple.sh"