#!/bin/bash

# iMagenWiz Services Shutdown Script
echo "Stopping iMagenWiz services..."

# Kill all services
echo "Stopping auth proxy..."
pkill -f "node auth-proxy.cjs" 2>/dev/null && echo "Auth proxy stopped" || echo "Auth proxy was not running"

echo "Stopping API server..."
pkill -f "node fix-api-server.cjs" 2>/dev/null && echo "API server stopped" || echo "API server was not running"

echo "Stopping blog proxy..."
pkill -f "node blog-api-proxy-with-db.cjs" 2>/dev/null && echo "Blog proxy stopped" || echo "Blog proxy was not running"

echo "Stopping frontend..."
pkill -f "node frontend/node_modules/.bin/vite" 2>/dev/null && echo "Frontend stopped" || echo "Frontend was not running"

echo ""
echo "All services stopped" 