#!/bin/bash
# Simple wrapper to start Express in fallback mode

# Set environment variables for Express-only mode
export FLASK_AVAILABLE=false
export EXPRESS_FALLBACK=true
export FLASK_PORT=5000
export SKIP_FLASK_CHECK=true

# Start the Express server
echo "Starting Express server in fallback mode..."
exec npm run dev