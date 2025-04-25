#!/bin/bash

# Create a log directory if it doesn't exist
mkdir -p logs

# Kill any existing Python or Node processes to ensure clean start
pkill -f "python run.py" || true
pkill -f "node" || true
pkill -f "npx tsx" || true

echo "🚀 Starting the full stack application (Flask + Express)..."

# Terminal 1: Start Flask backend
cd backend && python run.py > ../logs/flask.log 2>&1 &
FLASK_PID=$!
echo "🔷 Flask backend started with PID: $FLASK_PID"

# Wait for Flask to start up
echo "⏳ Waiting for Flask to initialize..."
sleep 5
echo "✅ Flask initialization period complete"

# Return to root directory
cd ..

# Terminal 2: Start Node.js server
echo "🔶 Starting Express server..."
npx tsx server/index.ts > logs/express.log 2>&1 &
EXPRESS_PID=$!
echo "🔶 Express server started with PID: $EXPRESS_PID"

# Function to kill both processes on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $FLASK_PID || true
    kill $EXPRESS_PID || true
    exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup INT TERM

# Keep the script running
echo "✨ Both servers are now running! Press Ctrl+C to stop both."
echo "🌐 Flask Backend: http://localhost:5000"
echo "🌐 Express Frontend: http://localhost:3000"
echo "📋 Logs are available in the logs directory"

wait