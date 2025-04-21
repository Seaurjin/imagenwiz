"""
Script to directly migrate blog posts from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to extract blog posts
2. Inserts the posts directly into MySQL
3. Skips translations for initial transfer
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

def migrate_posts():
    """Migrate core blog posts directly from PostgreSQL to MySQL"""
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
            autocommit=False
        )
        logger.info("Connected to MySQL database")
        
        # Get all published blog posts from PostgreSQL
        with pg_conn.cursor() as pg_cursor:
            pg_cursor.execute("""
                SELECT id, slug, status, author_id, featured_image, 
                       created_at, updated_at, published_at
                FROM cms_posts
                WHERE status = 'published'
            """)
            posts = pg_cursor.fetchall()
            logger.info(f"Found {len(posts)} published posts in PostgreSQL")
            
            # Get a default author ID from MySQL
            with my_conn.cursor() as my_cursor:
                my_cursor.execute("SELECT id FROM users WHERE is_admin = 1 LIMIT 1")
                admin_user = my_cursor.fetchone()
                
                if not admin_user:
                    my_cursor.execute("SELECT id FROM users LIMIT 1")
                    admin_user = my_cursor.fetchone()
                
                if not admin_user:
                    default_author_id = 1
                    logger.warning("No users found in MySQL, will use author_id=1")
                else:
                    default_author_id = admin_user[0]
                    logger.info(f"Using default author_id={default_author_id} from MySQL")
                
                # First, verify what author IDs actually exist in MySQL
                my_cursor.execute("SELECT id FROM users")
                valid_author_ids = [row[0] for row in my_cursor.fetchall()]
                logger.info(f"Valid author IDs in MySQL: {valid_author_ids}")
                
                # Migrate each post
                for post in posts:
                    post_id, slug, status, author_id, featured_image, created_at, updated_at, published_at = post
                    
                    # IMPORTANT: Use a valid author ID to satisfy foreign key constraint
                    if author_id is None or author_id not in valid_author_ids:
                        author_id = valid_author_ids[0]  # Use the first valid author ID
                    logger.info(f"Using author_id={author_id} for post '{slug}'")
                    
                    # Make sure the author_id is actually in the users table
                    if author_id not in valid_author_ids:
                        logger.error(f"CRITICAL: author_id={author_id} is not valid, defaulting to {default_author_id}")
                        author_id = default_author_id
                        
                    # Check if post already exists
                    my_cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
                    existing_post = my_cursor.fetchone()
                    
                    if existing_post:
                        logger.info(f"Post '{slug}' already exists in MySQL with ID {existing_post[0]}")
                        continue
                    
                    # Insert post into MySQL
                    logger.info(f"Inserting post '{slug}' into MySQL")
                    my_cursor.execute("""
                        INSERT INTO cms_posts (slug, status, author_id, featured_image, 
                                              created_at, updated_at, published_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (
                        slug, status, author_id, featured_image,
                        created_at, updated_at, published_at
                    ))
                    
                    mysql_post_id = my_cursor.lastrowid
                    logger.info(f"Inserted post '{slug}' with MySQL ID {mysql_post_id}")
                    
                    # Add English translation as placeholder if needed
                    pg_cursor.execute("""
                        SELECT language_code, title 
                        FROM cms_post_translations 
                        WHERE post_id = %s AND language_code = 'en'
                    """, (post_id,))
                    
                    en_translation = pg_cursor.fetchone()
                    
                    if en_translation:
                        language_code, title = en_translation
                        
                        # Check if translation exists
                        my_cursor.execute("""
                            SELECT id FROM cms_post_translations 
                            WHERE post_id = %s AND language_code = %s
                        """, (mysql_post_id, language_code))
                        
                        if not my_cursor.fetchone():
                            # Add English translation
                            my_cursor.execute("""
                                INSERT INTO cms_post_translations 
                                (post_id, language_code, title, content, meta_title)
                                VALUES (%s, %s, %s, %s, %s)
                            """, (
                                mysql_post_id, 
                                language_code, 
                                title,
                                f"<p>Content for {title}</p>",
                                title
                            ))
                            logger.info(f"Added English translation for '{slug}'")
                
                # Commit all changes
                my_conn.commit()
                logger.info("All posts migrated successfully")
    
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        if my_conn:
            my_conn.rollback()
    finally:
        # Close connections
        if pg_conn:
            pg_conn.close()
        if my_conn:
            my_conn.close()

if __name__ == "__main__":
    migrate_posts()