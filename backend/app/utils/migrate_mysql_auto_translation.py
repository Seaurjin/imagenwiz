"""
Migration script to add auto-translation fields to the PostTranslation model
for MySQL database
"""
import logging
import pymysql
import os
from datetime import datetime

logger = logging.getLogger('flask.app')

def run_migration():
    """
    Adds is_auto_translated and last_updated_at columns to the cms_post_translations table
    for MySQL database
    """
    try:
        logger.info("Running MySQL migration to add auto-translation fields to PostTranslation model")
        
        # Get MySQL credentials from environment variables
        mysql_user = os.environ.get('DB_USER', 'root')
        mysql_password = os.environ.get('DB_PASSWORD', '')
        mysql_host = os.environ.get('DB_HOST', 'localhost')
        mysql_db = os.environ.get('DB_NAME', 'mat_db')
        mysql_port = int(os.environ.get('DB_PORT', '3306'))
        
        # Connect directly to the database
        conn = pymysql.connect(
            host=mysql_host,
            user=mysql_user,
            password=mysql_password,
            database=mysql_db,
            port=mysql_port
        )
        
        cursor = conn.cursor()
        
        try:
            # Check if columns exist
            cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s
            AND TABLE_NAME = 'cms_post_translations' 
            AND COLUMN_NAME IN ('is_auto_translated', 'last_updated_at');
            """, (mysql_db,))
            
            existing_columns = [col[0] for col in cursor.fetchall()]
            
            # Add is_auto_translated column if it doesn't exist
            if 'is_auto_translated' not in existing_columns:
                logger.info("Adding is_auto_translated column to cms_post_translations table")
                cursor.execute("ALTER TABLE cms_post_translations ADD COLUMN is_auto_translated BOOLEAN DEFAULT FALSE;")
                conn.commit()
                logger.info("is_auto_translated column added successfully")
            else:
                logger.info("is_auto_translated column already exists in cms_post_translations table")
            
            # Add last_updated_at column if it doesn't exist
            if 'last_updated_at' not in existing_columns:
                logger.info("Adding last_updated_at column to cms_post_translations table")
                cursor.execute("ALTER TABLE cms_post_translations ADD COLUMN last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;")
                conn.commit()
                logger.info("last_updated_at column added successfully")
            else:
                logger.info("last_updated_at column already exists in cms_post_translations table")
            
        except Exception as e:
            logger.error(f"Error executing MySQL migration SQL: {str(e)}")
            return False
        finally:
            cursor.close()
            conn.close()
            
        return True
    except Exception as e:
        logger.error(f"Error in MySQL migration: {str(e)}")
        return False

if __name__ == "__main__":
    # This allows the script to be run directly for testing
    from app import create_app
    app = create_app()
    with app.app_context():
        run_migration()