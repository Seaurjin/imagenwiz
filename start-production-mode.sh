#!/bin/bash

# Environment variables for database connection
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Make sure migrations are not skipped
export SKIP_MIGRATIONS=false

# Print a message
echo "🚀 Starting iMagenWiz in PRODUCTION MODE"
echo "✅ Database migrations will be executed for full functionality"
echo ""

# Start the application using run-fullstack.js
node run-fullstack.js
