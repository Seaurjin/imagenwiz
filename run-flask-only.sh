#!/bin/bash

# Script to run just the Flask backend with the correct MySQL settings

# Set MySQL environment variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Skip migrations for faster startup
export SKIP_MIGRATIONS=true

# Print environment summary
echo "======================================================"
echo "🚀 Starting Flask backend ONLY with MySQL configuration"
echo "📊 MySQL: $DB_HOST:$DB_PORT/$DB_NAME as $DB_USER"
echo "⚠️ Database migrations: DISABLED"
echo "======================================================"

# Run Flask directly
cd backend
python run.py