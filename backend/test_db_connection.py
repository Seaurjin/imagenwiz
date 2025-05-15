#!/usr/bin/env python3
"""
Test MySQL Database Connection

This script tests the connection to the MySQL database using the configuration
from database_config.py or environment variables.
"""

import os
import sys
import time
from urllib.parse import quote_plus
import pymysql

# Add the parent directory to the path so we can import from app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Try to load environment variables from .env if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("✅ Loaded environment variables from .env file")
except ImportError:
    print("⚠️ python-dotenv not installed, skipping .env file loading")

# Get database configuration
try:
    from app.utils.database_config import (
        MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD,
        REMOTE_MYSQL_HOST, REMOTE_MYSQL_PASSWORD,
        print_connection_info
    )
    print("✅ Successfully imported database configuration")
except ImportError as e:
    print(f"❌ Error importing database configuration: {e}")
    # Fallback to environment variables
    MYSQL_HOST = os.environ.get('DB_HOST', 'localhost')
    MYSQL_PORT = int(os.environ.get('DB_PORT', 3306))
    MYSQL_DATABASE = os.environ.get('DB_NAME', 'mat_db')
    MYSQL_USER = os.environ.get('DB_USER', 'root')
    MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', '')
    REMOTE_MYSQL_HOST = '8.130.113.102'
    REMOTE_MYSQL_PASSWORD = 'Ir%86241992'
    
    def print_connection_info(include_passwords=False):
        print("\nConnection Parameters:")
        print("-" * 40)
        print("MySQL:")
        print(f"  Host: {MYSQL_HOST}")
        print(f"  Port: {MYSQL_PORT}")
        print(f"  Database: {MYSQL_DATABASE}")
        print(f"  User: {MYSQL_USER}")
        if include_passwords:
            print(f"  Password: {MYSQL_PASSWORD}")
        else:
            print(f"  Password: {'*' * (len(MYSQL_PASSWORD) if MYSQL_PASSWORD else 0)}")
        print("-" * 40)

# Override with environment variables if provided
DB_HOST = os.environ.get('DB_HOST', MYSQL_HOST)
DB_PORT = int(os.environ.get('DB_PORT', MYSQL_PORT))
DB_NAME = os.environ.get('DB_NAME', MYSQL_DATABASE)
DB_USER = os.environ.get('DB_USER', MYSQL_USER)
DB_PASSWORD = os.environ.get('DB_PASSWORD', MYSQL_PASSWORD)

# Print database details
print_connection_info()

def test_connection(host, port, database, user, password, connection_name="Primary"):
    """Test connection to a MySQL database"""
    start_time = time.time()
    print(f"\n🔄 Testing {connection_name} connection to MySQL at {host}:{port}...")
    
    try:
        # Attempt connection with a short timeout
        connection = pymysql.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port,
            connect_timeout=5
        )
        
        # If we get here, connection successful
        with connection.cursor() as cursor:
            # Execute a simple query
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            
            # Check if the database is empty (no tables)
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            if not tables:
                print(f"⚠️ Database '{database}' exists but has no tables")
            else:
                print(f"✅ Database '{database}' has {len(tables)} tables:")
                for table in tables:
                    print(f"   - {table[0]}")
        
        connection.close()
        elapsed = time.time() - start_time
        print(f"✅ Successfully connected to MySQL at {host}:{port} ({elapsed:.2f}s)")
        return True
    
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ Failed to connect to MySQL at {host}:{port} ({elapsed:.2f}s)")
        print(f"   Error: {e}")
        return False

def main():
    """Main function"""
    # Test local connection first
    local_success = test_connection(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        connection_name="Local/Primary"
    )
    
    # Test remote connection if local fails and we're not already using remote
    if not local_success and DB_HOST != REMOTE_MYSQL_HOST:
        print("\n⚠️ Local database connection failed, trying remote connection...")
        remote_success = test_connection(
            host=REMOTE_MYSQL_HOST,
            port=DB_PORT,
            database=DB_NAME,
            user=DB_USER,
            password=REMOTE_MYSQL_PASSWORD,
            connection_name="Remote"
        )
        
        if remote_success:
            print("\n✅ Remote connection successful!")
            print("⚠️ To use the remote database, set these environment variables:")
            print(f"   export DB_HOST={REMOTE_MYSQL_HOST}")
            print(f"   export DB_PASSWORD={REMOTE_MYSQL_PASSWORD}")
            
            # Or update .env file
            print("\n   Or update your .env file with:")
            print(f"   DB_HOST={REMOTE_MYSQL_HOST}")
            print(f"   DB_PASSWORD={REMOTE_MYSQL_PASSWORD}")
        else:
            print("\n❌ Both local and remote database connections failed.")
            print("   Please check your MySQL configuration and ensure MySQL is running.")
    elif local_success:
        print("\n✅ Connection test successful! The database is properly configured.")

if __name__ == "__main__":
    main() 