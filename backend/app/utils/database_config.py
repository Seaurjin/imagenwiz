"""
Database Configuration Utility

This module provides standardized database connection parameters
for use across migration scripts and other utilities.
"""

import os
from urllib.parse import quote_plus

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

# MySQL connection details from environment
MYSQL_HOST = os.environ.get('DB_HOST', '8.130.113.102')  # Default to known host
MYSQL_PORT = int(os.environ.get('DB_PORT', 3306))
MYSQL_DATABASE = os.environ.get('DB_NAME', 'mat_db')
MYSQL_USER = os.environ.get('DB_USER', 'root')
MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')  # Use environment or fallback

def get_pg_connection_params():
    """Get PostgreSQL connection parameters as a dictionary"""
    return {
        'host': PG_HOST,
        'port': PG_PORT,
        'database': PG_DATABASE,
        'user': PG_USER,
        'password': PG_PASSWORD
    }

def get_mysql_connection_params():
    """Get MySQL connection parameters as a dictionary"""
    return {
        'host': MYSQL_HOST,
        'port': MYSQL_PORT,
        'database': MYSQL_DATABASE,
        'user': MYSQL_USER,
        'password': MYSQL_PASSWORD
    }

def get_mysql_connection_string():
    """Get MySQL connection string in SQLAlchemy format"""
    password = quote_plus(MYSQL_PASSWORD) if MYSQL_PASSWORD else ''
    return f'mysql+pymysql://{MYSQL_USER}:{password}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}'

def get_pg_connection_string():
    """Get PostgreSQL connection string"""
    return f'postgresql://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}'

def print_connection_info(include_passwords=False):
    """Print connection information for debugging"""
    print("\nConnection Parameters:")
    print("-" * 40)
    
    print("PostgreSQL:")
    print(f"  Host: {PG_HOST}")
    print(f"  Port: {PG_PORT}")
    print(f"  Database: {PG_DATABASE}")
    print(f"  User: {PG_USER}")
    if include_passwords:
        print(f"  Password: {PG_PASSWORD}")
    else:
        print(f"  Password: {'*' * (len(PG_PASSWORD or '') if PG_PASSWORD else 0)}")
    
    print("\nMySQL:")
    print(f"  Host: {MYSQL_HOST}")
    print(f"  Port: {MYSQL_PORT}")
    print(f"  Database: {MYSQL_DATABASE}")
    print(f"  User: {MYSQL_USER}")
    if include_passwords:
        print(f"  Password: {MYSQL_PASSWORD}")
    else:
        print(f"  Password: {'*' * (len(MYSQL_PASSWORD or '') if MYSQL_PASSWORD else 0)}")
    
    print("-" * 40)