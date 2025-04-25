#!/bin/bash

# Database migration runner script
# This script sets necessary environment variables and runs the migration

# Set PostgreSQL variables from DATABASE_URL
export PGHOST=ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech
export PGPORT=5432
export PGDATABASE=neondb
export PGUSER=neondb_owner
export PGPASSWORD=npg_lxsVTN71pZgG

# Set MySQL variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%2586241992"

# Print configuration for debugging
echo "Migration Configuration:"
echo "PostgreSQL: $PGUSER@$PGHOST:$PGPORT/$PGDATABASE"
echo "MySQL: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""

# Run migration script
echo "Starting PostgreSQL to MySQL migration..."
python migrate_postgres_to_mysql.py

# Check if migration succeeded
if [ $? -eq 0 ]; then
    echo "✅ Migration completed successfully!"
else
    echo "❌ Migration failed! Check the error messages above."
fi