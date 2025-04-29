#!/bin/bash
echo "Stopping proxy server..."
pkill -f "node port-3000" || echo "No proxy server was running"
echo "Proxy server stopped"
