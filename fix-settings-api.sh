#!/bin/bash

echo "=== Fixing Admin Settings API ==="

# Create necessary upload directories
echo "Creating upload directories..."
mkdir -p uploads/logos
chmod -R 755 uploads

# Make sure Python Flask app has proper environment variables
echo "Setting up environment variables..."
export FLASK_APP=app
export FLASK_ENV=development
export FLASK_DEBUG=1

# Make sure MySQL is configured properly
export DB_HOST=8.130.113.102
export DB_USER=root
export DB_PASSWORD="Ir%86241992"
export DB_NAME=mat_db
export DB_PORT=3306

# Fix API endpoints 
echo "Ensuring API routes are properly configured..."
python run_settings_migration.py

# Hard restart the application
echo "Restarting application..."
pkill -f "tsx server/index.ts" || true
sleep 1
npm run dev &

echo "=== Admin Settings API should now be functional ==="
echo "Check the Admin Settings page at /admin/settings"