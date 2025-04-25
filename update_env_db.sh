#!/bin/bash

# Script to update environment variables for database connection
# and create a development mode shortcut script

# Set MySQL environment variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

# Set PostgreSQL environment variables
export PGHOST=ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech
export PGPORT=5432
export PGDATABASE=neondb
export PGUSER=neondb_owner
export PGPASSWORD=npg_lxsVTN71pZgG

# Create a development mode script
cat > start-dev-mode.sh << 'EOF'
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
EOF

# Make the script executable
chmod +x start-dev-mode.sh

# Create a production mode script
cat > start-production-mode.sh << 'EOF'
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
EOF

# Make the script executable
chmod +x start-production-mode.sh

# Attempt to run the migration
echo "🔄 Attempting to run the PostgreSQL to MySQL migration..."
python flask_migrate_postgres_to_mysql.py

echo "✅ Database environment variables and startup scripts have been set up"
echo "You can now use:"
echo "  - ./start-dev-mode.sh      (Fast startup, migrations skipped)"
echo "  - ./start-production-mode.sh (Full functionality, includes migrations)"