#!/bin/bash

echo "=================================================="
echo "🖌️ iMagenWiz - AI Background Removal 🖌️"
echo "=================================================="

# Default environment variables
export PORT=5000
export NODE_ENV=development
export EXPRESS_FALLBACK=true
export SKIP_FLASK_CHECK=true
export DATABASE_URL=${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/postgres}

# Load environment variables from .env files
if [ -f ".env" ]; then
  echo "✅ Found .env file, loading environment variables"
  source .env
fi

if [ -f ".env.local" ]; then
  echo "✅ Found .env.local file, loading local environment variables"
  source .env.local
fi

# Override specific variables for this application
export NODE_ENV=development
export PORT=5000  # Ensure Express uses port 5000

# Check the status of the database
echo "🔍 Checking database connection..."
if [ -n "$DATABASE_URL" ]; then
  echo "✅ Database URL is set"
else
  echo "⚠️ DATABASE_URL is not set! Using default connection."
  export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
fi

# Check if frontend build directory exists
if [ ! -d "./frontend/dist" ]; then
  echo "❌ Frontend build directory not found!"
  echo "📦 Checking for available frontend..."
  
  if [ -d "./frontend/src" ]; then
    echo "✅ Found frontend source directory"
  else
    echo "❌ Could not find frontend source directory!"
    exit 1
  fi
fi

# Start the application
echo "🚀 Starting Express server with React frontend..."
echo "📱 Application will be available at: http://localhost:5000"
if [ -n "$REPL_SLUG" ] && [ -n "$REPL_OWNER" ]; then
  echo "🔗 Access your app at: ${REPL_SLUG}.${REPL_OWNER}.repl.co"
fi
echo "=================================================="

# Run the application through npm script
npm run dev