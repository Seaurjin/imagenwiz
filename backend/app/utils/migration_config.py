"""
Migration Configuration Module

This module controls which database migrations should run
at application startup. It provides functions to check if a
specific migration should be executed based on environment
variables.
"""

import os

# Global flag to skip all migrations
def should_skip_all_migrations():
    """Check if all migrations should be skipped"""
    return os.environ.get('SKIP_MIGRATIONS', '').lower() == 'true'

# Function to check if a specific migration should run
def should_run_migration(migration_name=None):
    """
    Check if a specific migration should run
    
    Args:
        migration_name: The name of the migration to check
    
    Returns:
        bool: True if the migration should run, False otherwise
    """
    # Always check global flag first
    if should_skip_all_migrations():
        print(f"⏩ SKIPPED migration '{migration_name}' (all migrations disabled)")
        return False
        
    # If no specific migration is specified, default to running
    if not migration_name:
        return True
        
    # Check for specific migration override
    env_var = f"SKIP_{migration_name.upper()}_MIGRATION"
    should_skip = os.environ.get(env_var, '').lower() == 'true'
    
    if should_skip:
        print(f"⏩ SKIPPED migration '{migration_name}' (disabled by {env_var})")
        
    return not should_skip

# Flag to track if the DB has been migrated from PostgreSQL to MySQL
is_db_migrated = None

def mark_db_migrated():
    """Mark the database as migrated from PostgreSQL to MySQL"""
    global is_db_migrated
    is_db_migrated = True
    
def is_postgres_to_mysql_migrated():
    """Check if the database has been migrated from PostgreSQL to MySQL"""
    global is_db_migrated
    
    # If we already know it's migrated, return True
    if is_db_migrated is True:
        return True
    
    # Otherwise, let's try to check
    # By checking if a specific MySQL-only table exists
    from flask import current_app
    from sqlalchemy import text
    
    with current_app.app_context():
        from .. import db
        try:
            # Try to run a MySQL-specific query
            result = db.session.execute(text("SHOW TABLES LIKE 'cms_posts'"))
            table_exists = result.rowcount > 0
            
            # If the table exists, we consider it migrated
            if table_exists:
                is_db_migrated = True
                return True
                
            return False
        except Exception as e:
            print(f"Error checking migration status: {e}")
            return False