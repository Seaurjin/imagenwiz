"""
Migration script to transfer blog posts from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to extract blog posts and translations
2. Transfers the data to MySQL
3. Ensures all posts and translations are available in both CMS systems
"""

import os
import sys
import json
import logging
from datetime import datetime
import psycopg2
import pymysql
from pymysql.cursors import DictCursor

# Configure logging
logging.basicConfig(level=logging.INFO, 
                   format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Parse DATABASE_URL to get PostgreSQL connection details
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql://neondb_owner:npg_lxsVTN71pZgG@ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech/neondb?sslmode=require')

# Parse the URL to extract components
if 'postgres' in DATABASE_URL:
    # Extract components from DATABASE_URL
    url_parts = DATABASE_URL.replace('postgresql://', '').split('@')
    auth_parts = url_parts[0].split(':')
    host_db_parts = url_parts[1].split('/')
    
    PG_USER = auth_parts[0]
    PG_PASSWORD = auth_parts[1]
    
    if '?' in host_db_parts[1]:
        PG_DATABASE = host_db_parts[1].split('?')[0]
    else:
        PG_DATABASE = host_db_parts[1]
    
    if ':' in host_db_parts[0]:
        host_port = host_db_parts[0].split(':')
        PG_HOST = host_port[0]
        PG_PORT = host_port[1]
    else:
        PG_HOST = host_db_parts[0]
        PG_PORT = '5432'
else:
    # Default values if DATABASE_URL is not properly formatted
    PG_HOST = 'ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech'
    PG_PORT = '5432'
    PG_USER = 'neondb_owner'
    PG_PASSWORD = 'npg_lxsVTN71pZgG'
    PG_DATABASE = 'neondb'

# Get MySQL connection details from environment variables
MYSQL_HOST = os.environ.get('DB_HOST', '8.130.113.102')
MYSQL_PORT = int(os.environ.get('DB_PORT', '3306'))
MYSQL_USER = os.environ.get('DB_USER', 'root')
MYSQL_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')  # Updated from .env file
MYSQL_DATABASE = os.environ.get('DB_NAME', 'mat_db')

def connect_postgres():
    """Connect to PostgreSQL database"""
    try:
        logger.info(f"Connecting to PostgreSQL: {PG_USER}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}")
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            user=PG_USER,
            password=PG_PASSWORD,
            database=PG_DATABASE,
            sslmode='require'  # Required for Neon.tech PostgreSQL
        )
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
        return None

def connect_mysql():
    """Connect to MySQL database"""
    try:
        logger.info(f"Connecting to MySQL: {MYSQL_USER}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            database=MYSQL_DATABASE,
            cursorclass=DictCursor
        )
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to MySQL: {e}")
        return None

def get_postgres_posts(pg_conn):
    """Get all blog posts from PostgreSQL"""
    posts = []
    try:
        with pg_conn.cursor() as cursor:
            # Query to get all posts
            cursor.execute("""
                SELECT id, slug, status, author_id, featured_image, 
                       created_at, updated_at, published_at
                FROM cms_posts
            """)
            posts = cursor.fetchall()
            logger.info(f"Found {len(posts)} posts in PostgreSQL")
            
            # Get translations for each post
            for i, post in enumerate(posts):
                cursor.execute("""
                    SELECT id, post_id, language_code, title, content, 
                           meta_title, meta_description, meta_keywords,
                           last_updated_at
                    FROM cms_post_translations
                    WHERE post_id = %s
                """, (post[0],))
                translations = cursor.fetchall()
                posts[i] = (*post, translations)
                
                # Get tags for each post
                cursor.execute("""
                    SELECT t.id, t.name, t.slug, t.description
                    FROM cms_tags t
                    JOIN cms_post_tags pt ON t.id = pt.tag_id
                    WHERE pt.post_id = %s
                """, (post[0],))
                tags = cursor.fetchall()
                posts[i] = (*posts[i], tags)
                
    except Exception as e:
        logger.error(f"Error fetching posts from PostgreSQL: {e}")
    
    return posts

def create_mysql_tables_if_not_exist(mysql_conn):
    """Ensure MySQL tables exist"""
    sql_statements = [
        """
        CREATE TABLE IF NOT EXISTS cms_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL UNIQUE,
            status VARCHAR(50) NOT NULL,
            author_id INT,
            featured_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            published_at TIMESTAMP NULL
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS cms_post_translations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            post_id INT NOT NULL,
            language_code VARCHAR(10) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT,
            meta_title VARCHAR(255),
            meta_description VARCHAR(255),
            meta_keywords VARCHAR(255),
            is_auto_translated BOOLEAN DEFAULT FALSE,
            last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY (post_id, language_code)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS cms_tags (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description VARCHAR(255)
        )
        """,
        """
        CREATE TABLE IF NOT EXISTS cms_post_tags (
            post_id INT NOT NULL,
            tag_id INT NOT NULL,
            PRIMARY KEY (post_id, tag_id)
        )
        """
    ]
    
    try:
        with mysql_conn.cursor() as cursor:
            for sql in sql_statements:
                cursor.execute(sql)
            mysql_conn.commit()
            logger.info("MySQL tables created or already exist")
    except Exception as e:
        logger.error(f"Error creating MySQL tables: {e}")
        mysql_conn.rollback()

def check_post_exists(mysql_conn, slug):
    """Check if a post with the given slug exists in MySQL"""
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
        return cursor.fetchone() is not None

def check_tag_exists(mysql_conn, slug):
    """Check if a tag with the given slug exists in MySQL"""
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT id FROM cms_tags WHERE slug = %s", (slug,))
        return cursor.fetchone()

def get_post_id_by_slug(mysql_conn, slug):
    """Get MySQL post ID by slug"""
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
        result = cursor.fetchone()
        return result['id'] if result else None

def get_default_author_id(mysql_conn):
    """Get a default author ID for blog posts using existing users"""
    try:
        with mysql_conn.cursor() as cursor:
            # Try to get the admin user first (id=1)
            cursor.execute("SELECT id FROM users WHERE id = 1")
            admin_user = cursor.fetchone()
            
            if admin_user:
                logger.info("Using admin user (id=1) as default author")
                return 1
            
            # If no admin user, try to get any user
            cursor.execute("SELECT id FROM users ORDER BY id LIMIT 1")
            any_user = cursor.fetchone()
            
            if any_user:
                logger.info(f"Using user id={any_user['id']} as default author")
                return any_user['id']
            
            # If no users exist at all, create a default one
            logger.info("No users found, creating default admin user")
            cursor.execute("""
                INSERT INTO users (id, username, password, is_admin, credits, created_at)
                VALUES (1, 'admin', 'not-a-real-password', 1, 0, NOW())
                ON DUPLICATE KEY UPDATE id=id
            """)
            mysql_conn.commit()
            return 1
    except Exception as e:
        logger.error(f"Error getting default author: {e}")
        return 2  # Return 2 (demo user) as a fallback

def migrate_post_to_mysql(mysql_conn, post_data):
    """Migrate a single post and its translations to MySQL"""
    post_id, slug, status, author_id, featured_image, created_at, updated_at, published_at, translations, tags = post_data
    
    try:
        with mysql_conn.cursor() as cursor:
            # Ensure there's a valid author ID (foreign key constraint)
            default_author_id = get_default_author_id(mysql_conn)
            
            # Check if author exists
            cursor.execute("SELECT id FROM users WHERE id = %s", (author_id,))
            author_exists = cursor.fetchone()
            
            # Use default author if original author doesn't exist
            if not author_exists:
                author_id = default_author_id
                logger.info(f"Using default author id={default_author_id} for post: {slug}")
            
            # Check if post already exists to avoid duplicates
            existing_post = check_post_exists(mysql_conn, slug)
            
            if not existing_post:
                # Insert post
                cursor.execute("""
                    INSERT INTO cms_posts (slug, status, author_id, featured_image, 
                                           created_at, updated_at, published_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    slug, status, author_id, featured_image,
                    created_at, updated_at, published_at
                ))
                mysql_post_id = cursor.lastrowid
                logger.info(f"Created new post in MySQL: {slug} (ID: {mysql_post_id})")
            else:
                # Get existing post ID
                mysql_post_id = get_post_id_by_slug(mysql_conn, slug)
                logger.info(f"Post already exists in MySQL: {slug} (ID: {mysql_post_id})")
            
            # Process translations
            for translation in translations:
                _, _, language_code, title, content, meta_title, meta_description, meta_keywords, last_updated_at = translation
                
                # Check if translation exists
                cursor.execute("""
                    SELECT id FROM cms_post_translations 
                    WHERE post_id = %s AND language_code = %s
                """, (mysql_post_id, language_code))
                
                translation_exists = cursor.fetchone()
                
                if not translation_exists:
                    # Insert translation
                    cursor.execute("""
                        INSERT INTO cms_post_translations (post_id, language_code, title, content,
                                                           meta_title, meta_description, meta_keywords,
                                                           is_auto_translated, last_updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        mysql_post_id, language_code, title, content,
                        meta_title, meta_description, meta_keywords,
                        False, last_updated_at or datetime.now()
                    ))
                    logger.info(f"Added {language_code} translation for post {slug}")
                else:
                    logger.info(f"Translation {language_code} already exists for post {slug}")
            
            # Process tags
            for tag in tags:
                tag_id, tag_name, tag_slug, tag_description = tag
                
                # Check if tag exists
                existing_tag = check_tag_exists(mysql_conn, tag_slug)
                
                if not existing_tag:
                    # Create tag
                    cursor.execute("""
                        INSERT INTO cms_tags (name, slug, description)
                        VALUES (%s, %s, %s)
                    """, (tag_name, tag_slug, tag_description))
                    mysql_tag_id = cursor.lastrowid
                    logger.info(f"Created new tag: {tag_name}")
                else:
                    mysql_tag_id = existing_tag['id']
                    logger.info(f"Tag already exists: {tag_name}")
                
                # Create post-tag association
                cursor.execute("""
                    SELECT * FROM cms_post_tags WHERE post_id = %s AND tag_id = %s
                """, (mysql_post_id, mysql_tag_id))
                
                if not cursor.fetchone():
                    cursor.execute("""
                        INSERT INTO cms_post_tags (post_id, tag_id)
                        VALUES (%s, %s)
                    """, (mysql_post_id, mysql_tag_id))
                    logger.info(f"Added tag {tag_name} to post {slug}")
            
            mysql_conn.commit()
            return True
            
    except Exception as e:
        logger.error(f"Error migrating post {slug} to MySQL: {e}")
        mysql_conn.rollback()
        return False

def migrate_posts():
    """Main migration function"""
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    if not pg_conn:
        logger.error("Cannot continue without PostgreSQL connection")
        return False
    
    # Connect to MySQL
    mysql_conn = connect_mysql()
    if not mysql_conn:
        logger.error("Cannot continue without MySQL connection")
        pg_conn.close()
        return False
    
    try:
        # Ensure MySQL tables exist
        create_mysql_tables_if_not_exist(mysql_conn)
        
        # Get posts from PostgreSQL
        posts = get_postgres_posts(pg_conn)
        
        if not posts:
            logger.warning("No posts found in PostgreSQL to migrate")
            return True
        
        # Migrate each post
        for post in posts:
            migrate_post_to_mysql(mysql_conn, post)
        
        logger.info(f"Successfully migrated {len(posts)} posts from PostgreSQL to MySQL")
        return True
        
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        return False
    finally:
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    success = migrate_posts()
    sys.exit(0 if success else 1)