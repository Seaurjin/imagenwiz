#!/bin/bash

# Script to properly start the application with the correct database credentials

# Set MySQL environment variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Set Postgres environment variables for migration purposes
export PGHOST=ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech
export PGPORT=5432
export PGDATABASE=neondb
export PGUSER=neondb_owner
export PGPASSWORD=npg_lxsVTN71pZgG

# Skip migrations in development mode to avoid potential issues
export SKIP_MIGRATIONS=true

# Add a visual separator for output
echo -e "\n============================================="
echo "🚀 Starting iMagenWiz with fixed database credentials"
echo "⚠️ Database migrations disabled for initial startup"
echo "============================================="

# Start the workflow
node run-fullstack.js