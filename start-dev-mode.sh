#!/bin/bash

# Environment variables for database connection
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Skip migrations in development mode
export SKIP_MIGRATIONS=true

# Print a message
echo "🚀 Starting iMagenWiz in DEVELOPMENT MODE"
echo "⚠️ Database migrations will be SKIPPED for faster startup"
echo "⚠️ This mode is not recommended for production use"
echo ""

# Start the application using run-fullstack.js
node run-fullstack.js
