"""
Script to migrate blog tags from PostgreSQL to MySQL

This script:
1. Gets all blog tags from PostgreSQL
2. Adds them to MySQL
3. Updates post-tag relationships
"""

import os
import sys
import logging
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

def migrate_tags():
    """Migrate all blog tags from PostgreSQL to MySQL"""
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
        
        # Get all tags from PostgreSQL
        with pg_conn.cursor() as pg_cursor:
            pg_cursor.execute("""
                SELECT id, name, slug, description
                FROM cms_tags
            """)
            tags = pg_cursor.fetchall()
            logger.info(f"Found {len(tags)} tags in PostgreSQL")
            
            # Tag ID mapping from PostgreSQL to MySQL
            tag_id_map = {}
            
            # Add each tag to MySQL
            with my_conn.cursor() as my_cursor:
                for tag in tags:
                    pg_id, name, slug, description = tag
                    
                    # Check if tag already exists
                    my_cursor.execute("SELECT id FROM cms_tags WHERE slug = %s", (slug,))
                    existing_tag = my_cursor.fetchone()
                    
                    if existing_tag:
                        logger.info(f"Tag '{slug}' already exists in MySQL with ID {existing_tag['id']}")
                        tag_id_map[pg_id] = existing_tag['id']
                    else:
                        logger.info(f"Adding tag '{slug}' to MySQL")
                        
                        # Insert tag - use current timestamp for created_at and updated_at
                        my_cursor.execute("""
                            INSERT INTO cms_tags (name, slug, description)
                            VALUES (%s, %s, %s)
                        """, (
                            name, slug, description
                        ))
                        
                        # Get the new MySQL ID
                        mysql_id = my_cursor.lastrowid
                        tag_id_map[pg_id] = mysql_id
                        logger.info(f"Added tag '{slug}' with MySQL ID {mysql_id}")
                
                # Now that we have all tags, get the post-tag relationships
                pg_cursor.execute("SELECT post_id, tag_id FROM cms_post_tags")
                post_tags = pg_cursor.fetchall()
                logger.info(f"Found {len(post_tags)} post-tag relationships in PostgreSQL")
                
                # Create a mapping between PostgreSQL and MySQL post IDs
                pg_cursor.execute("SELECT id, slug FROM cms_posts")
                pg_posts = {post[0]: post[1] for post in pg_cursor.fetchall()}
                
                my_cursor.execute("SELECT id, slug FROM cms_posts")
                my_posts = {post['slug']: post['id'] for post in my_cursor.fetchall()}
                
                # Add post-tag relationships to MySQL
                for post_tag in post_tags:
                    pg_post_id, pg_tag_id = post_tag
                    
                    # Skip if tag wasn't migrated
                    if pg_tag_id not in tag_id_map:
                        logger.warning(f"Tag ID {pg_tag_id} not found in tag_id_map, skipping")
                        continue
                    
                    # Skip if post wasn't migrated
                    if pg_post_id not in pg_posts:
                        logger.warning(f"Post ID {pg_post_id} not found in pg_posts, skipping")
                        continue
                    
                    # Get MySQL IDs
                    post_slug = pg_posts[pg_post_id]
                    
                    if post_slug not in my_posts:
                        logger.warning(f"Post slug '{post_slug}' not found in MySQL, skipping")
                        continue
                    
                    my_post_id = my_posts[post_slug]
                    my_tag_id = tag_id_map[pg_tag_id]
                    
                    # Check if relationship already exists
                    my_cursor.execute("""
                        SELECT * FROM cms_post_tags 
                        WHERE post_id = %s AND tag_id = %s
                    """, (my_post_id, my_tag_id))
                    
                    if my_cursor.fetchone():
                        logger.info(f"Post-tag relationship already exists for post ID {my_post_id} and tag ID {my_tag_id}")
                    else:
                        logger.info(f"Adding post-tag relationship for post ID {my_post_id} and tag ID {my_tag_id}")
                        
                        # Insert relationship
                        my_cursor.execute("""
                            INSERT INTO cms_post_tags (post_id, tag_id)
                            VALUES (%s, %s)
                        """, (my_post_id, my_tag_id))
                
                # Commit all changes
                my_conn.commit()
                logger.info("All tags and relationships migrated successfully")
    
    except Exception as e:
        logger.error(f"Error during tag migration: {e}")
        if my_conn:
            my_conn.rollback()
    finally:
        # Close connections
        if pg_conn:
            pg_conn.close()
        if my_conn:
            my_conn.close()

if __name__ == "__main__":
    migrate_tags()