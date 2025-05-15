#!/bin/bash
# Script to start the blog service

echo "Starting blog service on port 3002..."

# Make the script executable
chmod +x "$0"

# Kill any existing blog services
pkill -f "node blog-service.cjs" || true
sleep 1

# Start the blog service in the background
node blog-service.cjs > blog-service.log 2>&1 &

# Save the PID
echo $! > blog-service.pid

echo "Blog service started with PID: $!"
echo "Blog service is running in the background"
echo "Log file: blog-service.log"
echo "To stop the service, run: kill \$(cat blog-service.pid)"
echo ""
echo "Blog API is available at:"
echo "  - http://localhost:3002/api/cms/blog"
echo "  - http://localhost:3002/api/cms/blog/:slug"
echo "  - http://localhost:3002/api/cms/tags"
echo "  - http://localhost:3002/api/health" 