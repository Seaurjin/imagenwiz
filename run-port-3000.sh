#!/bin/bash

# Script to run the reverse proxy server on port 3000 in the background
echo "🚀 Starting port 3000 reverse proxy server..."

# Check if port 3000 is available by trying to connect to it
(echo > /dev/tcp/localhost/3000) 2>/dev/null
if [ $? -eq 0 ]; then
  echo "❌ Port 3000 is already in use. Please free up the port first."
  exit 1
fi

# Run the reverse proxy server in the background with nohup
echo "🔄 Starting reverse proxy from port 3000 to port 5000 in the background..."
nohup node port-3000-proxy.cjs > port-3000-proxy.log 2>&1 &

# Store the process ID
PROXY_PID=$!
echo "✅ Proxy server started with PID: $PROXY_PID"
echo "✅ Log file: port-3000-proxy.log"
echo ""
echo "To stop the proxy server, run: kill $PROXY_PID"