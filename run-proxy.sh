#!/bin/bash

# Kill any existing proxy processes
pkill -f "node port-3000" || true

# Start the proxy server
node port-3000-standalone.js > proxy-log.txt 2>&1 &
PROXY_PID=$!

# Print info
echo "Started proxy server with PID: $PROXY_PID"
echo "Logs are being written to proxy-log.txt"
echo "To stop the proxy, run: bash stop-proxy.sh"

# Create the stop script
cat > stop-proxy.sh << 'EOF'
#!/bin/bash
echo "Stopping proxy server..."
pkill -f "node port-3000" || echo "No proxy server was running"
echo "Proxy server stopped"
EOF

chmod +x stop-proxy.sh

# Verify the proxy is running
sleep 2
if ps -p $PROXY_PID > /dev/null; then
    echo "✅ Proxy server is running successfully"
else
    echo "❌ Failed to start proxy server"
    cat proxy-log.txt
fi