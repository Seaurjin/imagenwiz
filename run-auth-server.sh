#!/bin/bash
# Script to start the authentication proxy server

echo "Starting authentication proxy server on port 5000..."

# Export the DeepSeek API key to the environment
export DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24

# Make the script executable
chmod +x "$0"

# Start the auth server
node auth-proxy.js > auth-server.log 2>&1 &

# Save the PID
echo $! > auth-server.pid

echo "Auth server started with PID: $!"
echo "Auth server is running in the background."
echo "Log file: auth-server.log"
echo "Available users: admin/admin123, testuser2/password123"
echo "To stop the server, run: kill \$(cat auth-server.pid)" 