"""
Asynchronous database migrations utility for Flask

This module provides functions to run database migrations in a background thread,
allowing the main Flask application to start up quickly and become responsive
while potentially time-consuming migrations run in the background.
"""

import threading
import time
import logging
from flask import current_app

# Set up logger
logger = logging.getLogger(__name__)

# Global state to track if migrations are already running
_migrations_running = False
_migrations_complete = False
_migration_results = {}

def run_migrations_in_background(app):
    """
    Start a background thread to run all database migrations asynchronously.
    This allows the Flask application to become responsive immediately while
    migrations happen in the background.
    
    Args:
        app: The Flask application instance
    """
    global _migrations_running, _migrations_complete
    
    if _migrations_running:
        logger.info("Migrations are already running in the background")
        return
    
    _migrations_running = True
    _migrations_complete = False
    
    # Create and start the background thread
    migration_thread = threading.Thread(
        target=_run_all_migrations,
        args=(app,),
        daemon=True  # Make the thread a daemon so it won't prevent app shutdown
    )
    migration_thread.start()
    
    logger.info("Database migrations started in background thread")
    return migration_thread

def _run_all_migrations(app):
    """
    Run all database migrations sequentially in a background thread.
    
    Args:
        app: The Flask application instance
    """
    global _migrations_running, _migrations_complete, _migration_results
    
    with app.app_context():
        logger.info("Starting background database migrations")
        
        try:
            # Small delay to ensure app has fully started
            time.sleep(2)
            
            # Import migration functions
            try:
                # Migrate recharge_history table first
                from .migrate_recharge_history import run_migration as migrate_recharge_history
                
                # Execute the migration to add required columns
                logger.info("Running recharge_history migration...")
                recharge_migration_result = migrate_recharge_history()
                _migration_results['recharge_history'] = recharge_migration_result
                if recharge_migration_result:
                    logger.info("Database migration for recharge_history columns completed successfully")
                else:
                    logger.warning("Database migration for recharge_history failed, payments may have limited functionality")
                    
                # Run user credits migration
                from .migrate_user_credits import run_migration as migrate_user_credits
                
                logger.info("Running user credits migration...")
                # Execute the migration to add credits column to users table
                user_migration_result = migrate_user_credits()
                _migration_results['user_credits'] = user_migration_result
                if user_migration_result:
                    logger.info("Database migration for users table credits column completed successfully")
                else:
                    logger.warning("Database migration for users table credits column failed, payment verification may fail")
                
                # Run auto-translation fields migration for CMS
                try:
                    # Try MySQL migration first (since we're using MySQL)
                    from .migrate_mysql_auto_translation import run_migration as migrate_mysql_auto_translation
                    
                    logger.info("Running MySQL auto-translation migration...")
                    # Execute the migration to add auto-translation fields
                    auto_translation_result = migrate_mysql_auto_translation()
                    _migration_results['auto_translation'] = auto_translation_result
                    if auto_translation_result:
                        logger.info("Database migration for CMS auto-translation fields completed successfully")
                    else:
                        logger.warning("Database migration for CMS auto-translation fields failed, auto-translation may not work properly")
                        
                    # Run tags description migration
                    from .migrate_mysql_tags_description import run_migration as migrate_mysql_tags_description
                    
                    logger.info("Running MySQL tags description migration...")
                    # Execute the migration to add description field to tags
                    tags_description_result = migrate_mysql_tags_description()
                    _migration_results['tags_description'] = tags_description_result
                    if tags_description_result:
                        logger.info("Database migration for CMS tags description field completed successfully")
                    else:
                        logger.warning("Database migration for CMS tags description field failed, tags may not display correctly")
                        
                    # Run language flags migration
                    from .migrate_mysql_language_flags import run_migration as migrate_mysql_language_flags
                    
                    logger.info("Running MySQL language flags migration...")
                    # Execute the migration to add flag field to languages
                    language_flags_result = migrate_mysql_language_flags()
                    _migration_results['language_flags'] = language_flags_result
                    if language_flags_result:
                        logger.info("Database migration for CMS language flags completed successfully")
                    else:
                        logger.warning("Database migration for CMS language flags failed, language flags may not display correctly")
                except ImportError:
                    # Fallback to PostgreSQL migration if MySQL migration fails
                    from .migrate_auto_translation import run_migration as migrate_auto_translation
                    
                    logger.info("Running PostgreSQL auto-translation migration (fallback)...")
                    # Execute the migration to add auto-translation fields
                    auto_translation_result = migrate_auto_translation()
                    _migration_results['auto_translation'] = auto_translation_result
                    if auto_translation_result:
                        logger.info("Database migration for CMS auto-translation fields completed successfully (PostgreSQL)")
                    else:
                        logger.warning("Database migration for CMS auto-translation fields failed, auto-translation may not work properly")
                    
            except Exception as e:
                logger.error(f"Error running database migrations: {e}")
                # Log error details for troubleshooting
                import traceback
                logger.error(traceback.format_exc())
                _migration_results['error'] = str(e)
            
            logger.info("Background database migrations completed")
            _migrations_complete = True
            
        finally:
            _migrations_running = False

def get_migrations_status():
    """
    Get the current status of background migrations.
    
    Returns:
        dict: A dictionary containing migration status information
    """
    return {
        'running': _migrations_running,
        'complete': _migrations_complete,
        'results': _migration_results
    }