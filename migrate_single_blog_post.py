"""
Script to migrate a single blog post from PostgreSQL to MySQL

This script:
1. Takes a post slug as an argument
2. Connects to PostgreSQL to extract the post and its translations
3. Transfers the data to MySQL
4. Reports detailed results

Usage:
    python migrate_single_blog_post.py <post_slug>
    
Example:
    python migrate_single_blog_post.py product-photography-tips
"""

import os
import sys
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
    user_pass = url_parts[0].split(':')
    
    PG_USER = user_pass[0]
    PG_PASSWORD = user_pass[1] if len(user_pass) > 1 else ''
    
    host_db = url_parts[1].split('/')
    host_port = host_db[0].split(':')
    PG_HOST = host_port[0]
    PG_PORT = int(host_port[1]) if len(host_port) > 1 else 5432
    
    PG_DATABASE = host_db[1].split('?')[0] if len(host_db) > 1 else 'neondb'
else:
    # Default PostgreSQL connection details
    PG_USER = 'neondb_owner'
    PG_PASSWORD = 'npg_lxsVTN71pZgG'
    PG_HOST = 'ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech'
    PG_PORT = 5432
    PG_DATABASE = 'neondb'

# MySQL connection details
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_PORT = int(os.environ.get('DB_PORT', 3306))

logger.info(f"Connecting to PostgreSQL: {PG_USER}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}")
logger.info(f"Connecting to MySQL: {DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

def connect_postgres():
    """Connect to PostgreSQL database"""
    return psycopg2.connect(
        user=PG_USER,
        password=PG_PASSWORD,
        host=PG_HOST,
        port=PG_PORT,
        database=PG_DATABASE
    )

def connect_mysql():
    """Connect to MySQL database"""
    try:
        logger.info(f"Attempting to connect to MySQL with these parameters:")
        logger.info(f"  Host: {DB_HOST}")
        logger.info(f"  User: {DB_USER}")
        logger.info(f"  Database: {DB_NAME}")
        logger.info(f"  Port: {DB_PORT}")
        
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            charset='utf8mb4',
            cursorclass=DictCursor,
            autocommit=False
        )
        
        # Test connection by executing a simple query
        with connection.cursor() as cursor:
            cursor.execute("SELECT DATABASE() as db")
            result = cursor.fetchone()
            if result and 'db' in result:
                db_name = result['db']
                logger.info(f"Successfully connected to MySQL database: {db_name}")
            else:
                logger.warning("Connected to MySQL but couldn't get database name")
            
            # List tables in the database
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            if tables:
                if isinstance(tables[0], dict):
                    # When using DictCursor
                    table_names = [list(table.values())[0] for table in tables]
                else:
                    # Fallback if not a dict
                    table_names = [table[0] for table in tables]
                logger.info(f"Tables in database: {', '.join(table_names)}")
            else:
                logger.warning("No tables found in the database")
            
        return connection
    except Exception as e:
        logger.error(f"Error connecting to MySQL: {e}")
        raise

def create_mysql_tables_if_not_exist(mysql_conn):
    """Ensure MySQL tables exist"""
    with mysql_conn.cursor() as cursor:
        # Check if cms_posts table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) NOT NULL UNIQUE,
                status ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
                author_id INT,
                featured_image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                published_at TIMESTAMP NULL,
                FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
            )
        """)
        
        # Check if cms_post_translations table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_post_translations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                language_code VARCHAR(10) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                meta_title VARCHAR(255),
                meta_description TEXT,
                meta_keywords TEXT,
                is_auto_translated BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES cms_posts(id) ON DELETE CASCADE,
                UNIQUE KEY unique_post_language (post_id, language_code)
            )
        """)
        
        # Check if cms_tags table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        """)
        
        # Check if cms_post_tags table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_post_tags (
                post_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (post_id, tag_id),
                FOREIGN KEY (post_id) REFERENCES cms_posts(id) ON DELETE CASCADE,
                FOREIGN KEY (tag_id) REFERENCES cms_tags(id) ON DELETE CASCADE
            )
        """)
        
        # Check if cms_post_media table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_post_media (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                media_type ENUM('image', 'video', 'document') NOT NULL DEFAULT 'image',
                file_path VARCHAR(255) NOT NULL,
                alt_text VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES cms_posts(id) ON DELETE CASCADE
            )
        """)
        
        # Check if cms_languages table exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS cms_languages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(10) NOT NULL UNIQUE,
                name VARCHAR(100) NOT NULL,
                is_default BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE
            )
        """)
        
        # Commit the changes
        mysql_conn.commit()

def get_post_by_slug(pg_conn, slug):
    """Get a specific post and its translations from PostgreSQL"""
    with pg_conn.cursor() as cursor:
        # Query for post details
        cursor.execute("""
            SELECT 
                id, slug, status, author_id, featured_image, 
                created_at, updated_at, published_at
            FROM cms_posts 
            WHERE slug = %s
        """, (slug,))
        post = cursor.fetchone()
        
        if not post:
            logger.error(f"Post with slug '{slug}' not found in PostgreSQL")
            return None
        
        # Query for post translations
        cursor.execute("""
            SELECT 
                language_code, title, content, meta_title, 
                meta_description, meta_keywords, is_auto_translated
            FROM cms_post_translations 
            WHERE post_id = %s
        """, (post[0],))
        translations = cursor.fetchall()
        
        # Query for post tags
        cursor.execute("""
            SELECT t.id, t.name, t.slug
            FROM cms_tags t
            JOIN cms_post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = %s
        """, (post[0],))
        tags = cursor.fetchall()
        
        # Return all post data
        post_data = post + (translations, tags)
        return post_data

def check_post_exists(mysql_conn, slug):
    """Check if a post with the given slug exists in MySQL"""
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT id, slug FROM cms_posts WHERE slug = %s", (slug,))
        result = cursor.fetchone()
        return result

def check_tag_exists(mysql_conn, slug):
    """Check if a tag with the given slug exists in MySQL"""
    with mysql_conn.cursor() as cursor:
        cursor.execute("SELECT id, slug FROM cms_tags WHERE slug = %s", (slug,))
        result = cursor.fetchone()
        return result

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
            # Try to find any admin user first
            cursor.execute("SELECT id FROM users WHERE is_admin = 1 LIMIT 1")
            admin_user = cursor.fetchone()
            
            if admin_user:
                logger.info(f"Using admin user id={admin_user['id']} as default author")
                return admin_user['id']
            
            # If no admin user, get any user
            cursor.execute("SELECT id FROM users LIMIT 1")
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
        return 1  # Return 1 (admin user) as a fallback

def migrate_post_to_mysql(mysql_conn, post_data):
    """Migrate a single post and its translations to MySQL"""
    post_id, slug, status, author_id, featured_image, created_at, updated_at, published_at, translations, tags = post_data
    
    try:
        # Add debugging
        logger.info(f"Starting migration of post {slug} to MySQL")
        logger.info(f"Post details: ID={post_id}, Status={status}, Author={author_id}")
        logger.info(f"Featured image: {featured_image}")
        logger.info(f"Translation count: {len(translations)}")
        logger.info(f"Tags count: {len(tags)}")
        
        with mysql_conn.cursor() as cursor:
            # Ensure there's a valid author ID (foreign key constraint)
            default_author_id = get_default_author_id(mysql_conn)
            logger.info(f"Default author ID: {default_author_id}")
            
            # Check if author exists
            cursor.execute("SELECT id FROM users WHERE id = %s", (author_id,))
            author_exists = cursor.fetchone()
            logger.info(f"Author exists check: {author_exists}")
            
            # Use default author if original author doesn't exist
            if not author_exists:
                author_id = default_author_id
                logger.info(f"Using default author id={default_author_id} for post: {slug}")
            
            # Check if post already exists to avoid duplicates
            existing_post = check_post_exists(mysql_conn, slug)
            logger.info(f"Existing post check: {existing_post}")
            mysql_post_id = None
            
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
                mysql_post_id = existing_post['id']
                logger.info(f"Post already exists in MySQL: {slug} (ID: {mysql_post_id})")
                
                # Update existing post
                cursor.execute("""
                    UPDATE cms_posts
                    SET status = %s, author_id = %s, featured_image = %s,
                        updated_at = %s, published_at = %s
                    WHERE id = %s
                """, (
                    status, author_id, featured_image,
                    updated_at, published_at, mysql_post_id
                ))
                logger.info(f"Updated existing post: {slug}")
            
            # Migrate translations
            for translation in translations:
                language_code, title, content, meta_title, meta_description, meta_keywords, is_auto_translated = translation
                
                # Check if translation exists
                cursor.execute("""
                    SELECT id FROM cms_post_translations 
                    WHERE post_id = %s AND language_code = %s
                """, (mysql_post_id, language_code))
                existing_translation = cursor.fetchone()
                
                if existing_translation:
                    # Update existing translation
                    cursor.execute("""
                        UPDATE cms_post_translations
                        SET title = %s, content = %s, meta_title = %s,
                            meta_description = %s, meta_keywords = %s,
                            is_auto_translated = %s, updated_at = NOW()
                        WHERE id = %s
                    """, (
                        title, content, meta_title,
                        meta_description, meta_keywords,
                        is_auto_translated, existing_translation['id']
                    ))
                    logger.info(f"Updated {language_code} translation for post {slug}")
                else:
                    # Insert new translation
                    cursor.execute("""
                        INSERT INTO cms_post_translations
                        (post_id, language_code, title, content, meta_title,
                         meta_description, meta_keywords, is_auto_translated)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        mysql_post_id, language_code, title, content, meta_title,
                        meta_description, meta_keywords, is_auto_translated
                    ))
                    logger.info(f"Added {language_code} translation for post {slug}")
            
            # Migrate tags
            for tag in tags:
                tag_id, tag_name, tag_slug = tag
                
                # Check if tag exists
                existing_tag = check_tag_exists(mysql_conn, tag_slug)
                mysql_tag_id = None
                
                if existing_tag:
                    mysql_tag_id = existing_tag['id']
                    logger.info(f"Tag already exists: {tag_name} (ID: {mysql_tag_id})")
                else:
                    # Insert new tag
                    cursor.execute("""
                        INSERT INTO cms_tags (name, slug)
                        VALUES (%s, %s)
                    """, (tag_name, tag_slug))
                    mysql_tag_id = cursor.lastrowid
                    logger.info(f"Created new tag: {tag_name} (ID: {mysql_tag_id})")
                
                # Add tag to post (if not already assigned)
                cursor.execute("""
                    INSERT IGNORE INTO cms_post_tags (post_id, tag_id)
                    VALUES (%s, %s)
                """, (mysql_post_id, mysql_tag_id))
            
            # Commit all changes
            mysql_conn.commit()
            logger.info(f"Post {slug} successfully migrated with all translations and tags")
            return True
    except Exception as e:
        logger.error(f"Error migrating post {slug}: {e}")
        mysql_conn.rollback()
        import traceback
        logger.error(traceback.format_exc())
        return False

def migrate_post(slug):
    """Main migration function for a single post"""
    pg_conn = None
    mysql_conn = None
    
    try:
        # Connect to PostgreSQL
        pg_conn = connect_postgres()
        logger.info(f"Connected to PostgreSQL database")
        
        # Connect to MySQL
        mysql_conn = connect_mysql()
        logger.info(f"Connected to MySQL database")
        
        # Create MySQL tables if they don't exist
        create_mysql_tables_if_not_exist(mysql_conn)
        logger.info(f"MySQL tables created or already exist")
        
        # Get the post from PostgreSQL
        post_data = get_post_by_slug(pg_conn, slug)
        if not post_data:
            logger.error(f"Failed to find post with slug '{slug}' in PostgreSQL")
            return False
        
        # Migrate the post to MySQL
        success = migrate_post_to_mysql(mysql_conn, post_data)
        if success:
            logger.info(f"Migration of post '{slug}' completed successfully")
            return True
        else:
            logger.error(f"Failed to migrate post '{slug}'")
            return False
    except Exception as e:
        logger.error(f"Error during migration: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False
    finally:
        # Close connections
        if pg_conn:
            pg_conn.close()
        if mysql_conn:
            mysql_conn.close()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python migrate_single_blog_post.py <post_slug>")
        post_slugs = ["product-photography-tips", "background-removal-applications", 
                     "ai-image-editing-workflow", "image-processing-for-social-media"]
        print(f"Available post slugs: {post_slugs}")
        sys.exit(1)
    
    post_slug = sys.argv[1]
    print(f"Starting migration for post: {post_slug}")
    result = migrate_post(post_slug)
    
    if result:
        print(f"✅ Successfully migrated post: {post_slug}")
        sys.exit(0)
    else:
        print(f"❌ Failed to migrate post: {post_slug}")
        sys.exit(1)