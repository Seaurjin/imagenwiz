#!/bin/bash

echo "=== Proxy Services Setup ==="
echo "This script ensures proxy services are correctly configured"

# Get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
echo "Project root: $PROJECT_ROOT"

# Check if proxy scripts exist
if [ ! -f "$PROJECT_ROOT/auth-proxy-fixed.cjs" ]; then
  echo "ERROR: auth-proxy-fixed.cjs not found"
  exit 1
fi

if [ ! -f "$PROJECT_ROOT/blog-api-proxy-with-db.cjs" ]; then
  echo "ERROR: blog-api-proxy-with-db.cjs not found"
  exit 1
fi

# First, check if backend is running
echo "Checking if backend is running..."
if ! curl -s "http://localhost:5000" > /dev/null; then
  echo "WARNING: Backend server does not appear to be running at http://localhost:5000"
  echo "Proxy services will connect to backend but may not function until backend is available"
else
  echo "Backend server appears to be running at http://localhost:5000"
fi

# Kill any existing proxy processes
echo "Stopping any existing proxy processes..."
pkill -f "node blog-api-proxy-with-db.cjs" || true
pkill -f "node auth-proxy-fixed.cjs" || true
sleep 1

# Set environment variables for proxies
export FLASK_BACKEND_URL="http://localhost:5000"
export PORT_AUTH=3003
export PORT_BLOG=3002

# Start auth proxy
echo "Starting auth proxy on port $PORT_AUTH..."
cd "$PROJECT_ROOT" || exit 1
PORT=$PORT_AUTH node auth-proxy-fixed.cjs &
AUTH_PROXY_PID=$!
echo "Auth proxy started with PID: $AUTH_PROXY_PID"

# Wait briefly to ensure auth proxy has started
sleep 2

# Start blog proxy
echo "Starting blog proxy on port $PORT_BLOG..."
cd "$PROJECT_ROOT" || exit 1
PORT=$PORT_BLOG node blog-api-proxy-with-db.cjs &
BLOG_PROXY_PID=$!
echo "Blog proxy started with PID: $BLOG_PROXY_PID"

# Wait briefly to ensure blog proxy has started
sleep 2

# Verify proxies are running
echo "Verifying proxy services..."
if ! curl -s "http://localhost:$PORT_AUTH" > /dev/null; then
  echo "WARNING: Auth proxy does not appear to be responding at http://localhost:$PORT_AUTH"
else
  echo "Auth proxy is responding at http://localhost:$PORT_AUTH"
fi

if ! curl -s "http://localhost:$PORT_BLOG" > /dev/null; then
  echo "WARNING: Blog proxy does not appear to be responding at http://localhost:$PORT_BLOG"
else
  echo "Blog proxy is responding at http://localhost:$PORT_BLOG"
fi

echo "Proxy services setup complete"
echo "Auth proxy PID: $AUTH_PROXY_PID"
echo "Blog proxy PID: $BLOG_PROXY_PID" 