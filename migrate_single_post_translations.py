"""
Script to migrate translations for a single blog post

This script takes a blog post slug and migrates all translations
from PostgreSQL to MySQL for that specific post.

Usage:
    python migrate_single_post_translations.py <post_slug>
    
Example:
    python migrate_single_post_translations.py product-photography-tips
"""

import os
import sys
import logging
from datetime import datetime
import psycopg2
import pymysql

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# PostgreSQL connection details
PG_HOST = 'ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech'
PG_USER = 'neondb_owner'
PG_PASSWORD = 'npg_lxsVTN71pZgG'
PG_DATABASE = 'neondb'
PG_PORT = 5432

# MySQL connection details
MY_HOST = '8.130.113.102'
MY_USER = 'root'
MY_PASSWORD = 'Ir%86241992'
MY_DATABASE = 'mat_db'
MY_PORT = 3306

def migrate_post_translations(slug):
    """Migrate translations for a specific blog post"""
    pg_conn = None
    my_conn = None
    
    try:
        # Connect to PostgreSQL
        pg_conn = psycopg2.connect(
            host=PG_HOST,
            user=PG_USER,
            password=PG_PASSWORD,
            dbname=PG_DATABASE,
            port=PG_PORT
        )
        logger.info("Connected to PostgreSQL database")
        
        # Connect to MySQL
        my_conn = pymysql.connect(
            host=MY_HOST,
            user=MY_USER,
            password=MY_PASSWORD,
            database=MY_DATABASE,
            port=MY_PORT,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False
        )
        logger.info("Connected to MySQL database")
        
        # Get MySQL post ID by slug
        with my_conn.cursor() as my_cursor:
            my_cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
            mysql_post = my_cursor.fetchone()
            
            if not mysql_post:
                logger.error(f"Post '{slug}' not found in MySQL, exiting")
                return
            
            mysql_id = mysql_post['id']
            logger.info(f"Found post '{slug}' in MySQL with ID {mysql_id}")
            
            # Get PostgreSQL post ID by slug
            with pg_conn.cursor() as pg_cursor:
                pg_cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
                pg_post = pg_cursor.fetchone()
                
                if not pg_post:
                    logger.error(f"Post '{slug}' not found in PostgreSQL, exiting")
                    return
                
                pg_id = pg_post[0]
                logger.info(f"Found post '{slug}' in PostgreSQL with ID {pg_id}")
                
                # Get all translations from PostgreSQL
                pg_cursor.execute("""
                    SELECT language_code, title, content, meta_title, 
                           meta_description, meta_keywords, is_auto_translated
                    FROM cms_post_translations 
                    WHERE post_id = %s
                """, (pg_id,))
                translations = pg_cursor.fetchall()
                
                logger.info(f"Found {len(translations)} translations in PostgreSQL for post '{slug}'")
                
                # Add each translation to MySQL
                for translation in translations:
                    lang_code, title, content, meta_title, meta_desc, meta_keywords, is_auto = translation
                    
                    # Check if translation already exists
                    my_cursor.execute("""
                        SELECT id FROM cms_post_translations 
                        WHERE post_id = %s AND language_code = %s
                    """, (mysql_id, lang_code))
                    
                    existing = my_cursor.fetchone()
                    
                    if existing:
                        logger.info(f"Translation for '{slug}' in language '{lang_code}' already exists, updating")
                        
                        # Update existing translation
                        my_cursor.execute("""
                            UPDATE cms_post_translations 
                            SET title = %s, content = %s, meta_title = %s,
                                meta_description = %s, meta_keywords = %s,
                                is_auto_translated = %s
                            WHERE id = %s
                        """, (
                            title, content, meta_title,
                            meta_desc, meta_keywords,
                            1 if is_auto else 0,
                            existing['id']
                        ))
                    else:
                        logger.info(f"Adding translation for '{slug}' in language '{lang_code}'")
                        
                        # Insert new translation
                        my_cursor.execute("""
                            INSERT INTO cms_post_translations 
                            (post_id, language_code, title, content, meta_title,
                             meta_description, meta_keywords, is_auto_translated)
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                        """, (
                            mysql_id, lang_code, title, content, meta_title,
                            meta_desc, meta_keywords, 1 if is_auto else 0
                        ))
            
            # Commit all changes
            my_conn.commit()
            logger.info(f"All translations for post '{slug}' migrated successfully")
    
    except Exception as e:
        logger.error(f"Error during translation migration: {e}")
        if my_conn:
            my_conn.rollback()
    finally:
        # Close connections
        if pg_conn:
            pg_conn.close()
        if my_conn:
            my_conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <post_slug>")
        sys.exit(1)
    
    post_slug = sys.argv[1]
    migrate_post_translations(post_slug)