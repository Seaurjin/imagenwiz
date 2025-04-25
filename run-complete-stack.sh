#!/bin/bash

# Script to run both Express and Flask backends separately but in a coordinated way

# Set environment variables for both components
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"
export SKIP_MIGRATIONS=true
export FLASK_DEBUG=1

# Print header
echo "======================================================"
echo "🚀 Starting iMagenWiz Full-Stack Application"
echo "📊 MySQL backend: $DB_HOST:$DB_PORT/$DB_NAME"
echo "⚠️ Migrations: DISABLED for stability"
echo "======================================================"

# Function to cleanup when script exits
cleanup() {
  echo "Shutting down components..."
  # Kill background processes
  if [ -n "$EXPRESS_PID" ]; then
    kill $EXPRESS_PID 2>/dev/null || true
  fi
  if [ -n "$FLASK_PID" ]; then
    kill $FLASK_PID 2>/dev/null || true
  fi
  echo "Cleanup complete."
  exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM EXIT

# Start Flask backend
echo "Starting Flask backend..."
cd backend
python run.py > ../flask.log 2>&1 &
FLASK_PID=$!
cd ..
echo "Flask started with PID: $FLASK_PID"

# Give Flask a moment to start
sleep 2

# Start Express frontend
echo "Starting Express frontend..."
node server/index.js > express.log 2>&1 &
EXPRESS_PID=$!
echo "Express started with PID: $EXPRESS_PID"

# Monitor both processes
echo "Both components started. Monitoring logs..."
echo "Press Ctrl+C to stop all components."

# Function to display new log entries
tail_logs() {
  tail -f flask.log express.log
}

# Start tailing logs
tail_logs

# Wait for processes
wait $FLASK_PID $EXPRESS_PID