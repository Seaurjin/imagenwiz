#!/bin/bash

# Script to launch the Express frontend and Flask backend with MySQL configuration

# Set MySQL environment variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Skip migrations in development mode to avoid potential issues
export SKIP_MIGRATIONS=true

echo "======================================================"
echo "🚀 Starting iMagenWiz Full-Stack Application"
echo "📊 MySQL backend: $DB_HOST:$DB_PORT/$DB_NAME"
echo "⚠️ Migrations: DISABLED for stability"
echo "======================================================"

# Add MySQL host to /etc/hosts if needed
grep -q "$DB_HOST" /etc/hosts || echo "# Added MySQL host for iMagenWiz" | sudo tee -a /etc/hosts > /dev/null

# Start the application through the workflow system
echo "🔄 Restarting 'Start application' workflow..."
echo "⏳ Please wait while the application initializes..."

# Restart the application workflow
node server/index.js