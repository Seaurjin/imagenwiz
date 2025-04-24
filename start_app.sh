#!/bin/bash

# Kill any running Flask processes
pkill -f "python -m flask run" || true
pkill -f "python app.py" || true

# Start Flask backend
cd backend
export FLASK_APP=app
export FLASK_DEBUG=1
python app.py &

# Wait a bit for Flask to start
sleep 3

echo "Application should be running now"
echo "Testing language API..."
cd ..
python test_languages_api.py