"""
Migration script to add description column to the Tag model
for MySQL database
"""
import logging
import pymysql
import os

logger = logging.getLogger('flask.app')

def run_migration():
    """
    Adds description column to the cms_tags table for MySQL database
    """
    try:
        logger.info("Running MySQL migration to add description field to Tag model")
        
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
            # Check if column exists
            cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s
            AND TABLE_NAME = 'cms_tags' 
            AND COLUMN_NAME = 'description';
            """, (mysql_db,))
            
            existing_columns = [col[0] for col in cursor.fetchall()]
            
            # Add description column if it doesn't exist
            if 'description' not in existing_columns:
                logger.info("Adding description column to cms_tags table")
                cursor.execute("ALTER TABLE cms_tags ADD COLUMN description VARCHAR(255);")
                conn.commit()
                logger.info("description column added successfully")
            else:
                logger.info("description column already exists in cms_tags table")
            
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