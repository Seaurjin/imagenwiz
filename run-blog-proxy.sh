#!/bin/bash
# Script to set up and run the blog-enabled proxy server

echo "==== Setting up Blog API Proxy with Database Support ===="

# Install required packages
echo "Installing required packages..."
npm install express http-proxy-middleware axios mysql2

# Check if the proxy is already running
if pgrep -f "node blog-api-proxy-with-db.cjs" > /dev/null; then
  echo "Proxy is already running. Stopping it first..."
  pkill -f "node blog-api-proxy-with-db.cjs"
  sleep 2
fi

# Export MySQL database settings
export DB_HOST=8.130.113.102
export DB_USER=root
export DB_PASSWORD="Ir%86241992"
export DB_NAME=mat_db
export USE_REMOTE_DB=true
export PORT=3002

# Start the proxy server
echo "Starting proxy server with database support..."
node blog-api-proxy-with-db.cjs > proxy-blog.log 2>&1 &
PROXY_PID=$!
echo $PROXY_PID > proxy-blog.pid

echo "Proxy server started with PID: $PROXY_PID"
echo "Log file: proxy-blog.log"
echo ""
echo "Access the application at http://localhost:3002"
echo "Blog will be available at http://localhost:3002/blog"
echo ""
echo "To stop the proxy server: ./stop-blog-proxy.sh" 