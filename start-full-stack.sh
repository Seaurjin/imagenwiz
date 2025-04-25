#!/bin/bash

# Create a log directory if it doesn't exist
mkdir -p logs

# Kill any existing Python or Node processes to ensure clean start
pkill -f "python run.py" || true
pkill -f "node" || true
pkill -f "npx tsx" || true

echo "🚀 Starting the full stack application (Flask + Express)..."

# Start Flask backend
cd backend
echo "🔷 Starting Flask backend..."
python run.py > ../logs/flask.log 2>&1 &
FLASK_PID=$!
echo "🔷 Flask backend started with PID: $FLASK_PID"

# Return to root directory
cd ..

# Give the Flask server some time to start up
echo "⏳ Waiting for Flask to initialize..."
sleep 5
echo "✅ Flask initialization period complete"

# Check if the Flask server is actually running
if ! ps -p $FLASK_PID > /dev/null; then
    echo "❌ Flask server failed to start! Check logs/flask.log for details."
    tail -n 20 logs/flask.log
    exit 1
fi

# Start the React app server
echo "🔶 Starting Express server..."
exec npx tsx server/index.ts