"""
Migration configuration utility for Flask app

This module provides configuration options for database migrations,
allowing them to be enabled/disabled based on environment variables.
"""

import os

# Check if migrations should be skipped (faster startup in development)
SKIP_MIGRATIONS = os.environ.get('SKIP_MIGRATIONS', '').lower() in ('true', '1', 'yes')

# Check if migrations should run in background (faster response time but still run)
ASYNC_MIGRATIONS = os.environ.get('ASYNC_MIGRATIONS', '').lower() in ('true', '1', 'yes')

# Function to determine if a specific migration should run
def should_run_migration(migration_name=None):
    """
    Determine if a specific migration should run based on environment configuration.
    
    Args:
        migration_name (str, optional): Name of the migration. Can be used for targeted migration skipping.
    
    Returns:
        bool: True if the migration should run, False otherwise
    """
    # If all migrations are disabled, return False
    if SKIP_MIGRATIONS:
        return False
    
    # Check if specific migrations are disabled
    if migration_name:
        skip_specific = os.environ.get(f'SKIP_{migration_name.upper()}_MIGRATION', '').lower()
        if skip_specific in ('true', '1', 'yes'):
            return False
    
    # Default is to run the migration
    return True