#!/bin/bash

# Simple script to start the port 3000 -> 5000 proxy
# To use: ./run-proxy.sh

echo "🚀 Starting port 3000 proxy..."

# Kill any existing proxies first
pkill -f 'node pure-5000.cjs' 2>/dev/null
sleep 1

# Start the pure-5000.cjs proxy in the background
nohup node pure-5000.cjs > /dev/null 2>&1 &
PROXY_PID=$!

# Check if process started
if ps -p $PROXY_PID > /dev/null; then
  echo "✅ Proxy started with PID: $PROXY_PID"
  echo "✅ App available at: http://localhost:3000"
else
  echo "❌ Failed to start proxy process"
  exit 1
fi