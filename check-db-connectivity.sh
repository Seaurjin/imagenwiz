#!/bin/bash

# Script to check database connectivity for both PostgreSQL and MySQL

# Set database environment variables
export DB_HOST=8.130.113.102
export DB_PORT=3306
export DB_NAME=mat_db
export DB_USER=root
export DB_PASSWORD="Ir%86241992"

export PGHOST=ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech
export PGPORT=5432
export PGDATABASE=neondb
export PGUSER=neondb_owner
export PGPASSWORD=npg_lxsVTN71pZgG

echo -e "\n============================================="
echo "🔍 Checking database connectivity"
echo "============================================="

# Create a simple Python script to test MySQL connectivity
cat > check_mysql.py << 'EOF'
import pymysql
import os

# Get environment variables
host = os.environ.get('DB_HOST', '8.130.113.102')
port = int(os.environ.get('DB_PORT', 3306))
database = os.environ.get('DB_NAME', 'mat_db')
user = os.environ.get('DB_USER', 'root')
password = os.environ.get('DB_PASSWORD', 'Ir%86241992')

print(f"Attempting to connect to MySQL at {host}:{port}/{database} as {user}")

try:
    # Connect to MySQL
    conn = pymysql.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        database=database
    )
    
    print("✅ MySQL connection successful!")
    
    # Get table list
    with conn.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        
        if tables:
            print(f"Found {len(tables)} tables in the database:")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("No tables found in the database")
    
    conn.close()
except Exception as e:
    print(f"❌ MySQL connection failed: {str(e)}")
EOF

# Create a simple Python script to test PostgreSQL connectivity
cat > check_postgres.py << 'EOF'
import psycopg2
import os

# Get environment variables
host = os.environ.get('PGHOST')
port = os.environ.get('PGPORT')
database = os.environ.get('PGDATABASE')
user = os.environ.get('PGUSER')
password = os.environ.get('PGPASSWORD')

print(f"Attempting to connect to PostgreSQL at {host}:{port}/{database} as {user}")

try:
    # Connect to PostgreSQL
    conn = psycopg2.connect(
        host=host,
        port=port,
        dbname=database,
        user=user,
        password=password
    )
    
    print("✅ PostgreSQL connection successful!")
    
    # Get table list
    with conn.cursor() as cursor:
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        tables = cursor.fetchall()
        
        if tables:
            print(f"Found {len(tables)} tables in the database:")
            for table in tables:
                print(f"  - {table[0]}")
        else:
            print("No tables found in the database")
    
    conn.close()
except Exception as e:
    print(f"❌ PostgreSQL connection failed: {str(e)}")
EOF

# Execute the Python scripts
echo -e "\n===== MySQL Connectivity Check ====="
python check_mysql.py

echo -e "\n===== PostgreSQL Connectivity Check ====="
python check_postgres.py

echo -e "\n============================================="
echo "Database check complete"
echo "============================================="

# Clean up temporary files
rm check_mysql.py check_postgres.py