#!/bin/bash
# Script to stop the blog proxy server

echo "Stopping blog proxy server..."

if [ -f proxy-blog.pid ]; then
  PROXY_PID=$(cat proxy-blog.pid)
  
  # Check if process exists
  if ps -p $PROXY_PID > /dev/null; then
    echo "Killing proxy process with PID: $PROXY_PID"
    kill $PROXY_PID
    rm proxy-blog.pid
    echo "Proxy server stopped"
  else
    echo "No running proxy found with PID: $PROXY_PID"
    rm proxy-blog.pid
  fi
else
  # Try to find by process name
  PID=$(pgrep -f "node blog-api-proxy-with-db.cjs")
  if [ -n "$PID" ]; then
    echo "Found proxy process running with PID: $PID"
    kill $PID
    echo "Proxy server stopped"
  else
    echo "No running proxy found"
  fi
fi 