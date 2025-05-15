#!/bin/bash

echo "🚀 Starting iMagenWiz application..."

# Check if the .env file exists
if [ ! -f .env ]; then
  echo "❌ Error: .env file is missing. Creating a default one..."
  cat > .env << EOL
# Database configuration
DATABASE_URL=postgresql://mock:mock@localhost:5432/mockdb

# Application settings
FLASK_AVAILABLE=false
EXPRESS_FALLBACK=true
FLASK_PORT=5000
SKIP_FLASK_CHECK=true
NODE_ENV=development
PORT=3000

# Stripe keys
STRIPE_SECRET_KEY=sk_test_51Q38qCAGgrMJnivhY2kRf3qYDlzfCQACMXg2A431cKit7KRgqtDxiC5jYJPrbe4aFbkaVzamc33QY8woZmKBINVP008lLQooRN
STRIPE_PUBLISHABLE_KEY=pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz

# JWT Secret
JWT_SECRET_KEY=e8f9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8
SESSION_SECRET=imagenwiz-secret-session-key
EOL

  echo "✅ Created default .env file with mock database settings."
  echo "⚠️ Note: For full functionality, you should set up a real PostgreSQL database."
  echo "   Run ./setup-postgres.sh to set up a local database."
else
  echo "✅ Found .env file."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing npm dependencies..."
  npm install
else
  echo "✅ Found node_modules."
fi

# Check if frontend/node_modules exists
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  cd frontend && npm install && cd ..
else
  echo "✅ Found frontend/node_modules."
fi

# Build the frontend if it hasn't been built yet
if [ ! -d "frontend/dist" ]; then
  echo "🔨 Building frontend..."
  cd frontend && npm run build && cd ..
else
  echo "✅ Found frontend build."
fi

# Start the application
echo "🌐 Starting application in development mode..."
npm run dev