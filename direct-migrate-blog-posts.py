"""
Script to directly migrate blog posts from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to extract blog posts
2. Connects to MySQL to insert the posts
3. Imports translations as well
"""

import os
import sys
import psycopg2
import psycopg2.extras
import pymysql
from datetime import datetime
import time

# Set MySQL environment variables
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST', 'ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech')
PG_PORT = os.environ.get('PGPORT', '5432')
PG_DATABASE = os.environ.get('PGDATABASE', 'neondb')
PG_USER = os.environ.get('PGUSER', 'neondb_owner')
PG_PASSWORD = os.environ.get('PGPASSWORD', 'npg_lxsVTN71pZgG')

def connect_postgres():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            dbname=PG_DATABASE,
            user=PG_USER,
            password=PG_PASSWORD
        )
        print(f"✅ Connected to PostgreSQL: {PG_HOST}:{PG_PORT}/{PG_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {str(e)}")
        return None

def connect_mysql():
    """Connect to MySQL database"""
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        print(f"✅ Connected to MySQL: {DB_HOST}:{DB_PORT}/{DB_NAME}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {str(e)}")
        return None

def get_pg_languages(pg_conn):
    """Get all languages from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        # First check which columns exist in the table
        cursor.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'cms_languages'
        """)
        columns = [col[0] for col in cursor.fetchall()]
        
        # Build query based on available columns
        query = "SELECT code, name, is_active, is_default FROM cms_languages"
        cursor.execute(query)
        languages = cursor.fetchall()
        print(f"Found {len(languages)} languages in PostgreSQL")
        return languages
    except Exception as e:
        print(f"❌ Error fetching languages from PostgreSQL: {str(e)}")
        return []
    finally:
        cursor.close()

def get_pg_posts_translations(pg_conn):
    """Get all published posts with their translations from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        # Get posts
        cursor.execute("""
            SELECT 
                id, slug, featured_image, author_id, status, 
                created_at, updated_at, published_at
            FROM 
                cms_posts 
            WHERE 
                status = 'published'
            ORDER BY 
                id
        """)
        posts = cursor.fetchall()
        print(f"Found {len(posts)} published posts in PostgreSQL")
        
        # Get translations for each post
        posts_with_translations = []
        for post in posts:
            post_id = post['id']
            
            cursor.execute("""
                SELECT 
                    language_code, title, content, meta_title, 
                    meta_description, meta_keywords, is_auto_translated
                FROM 
                    cms_post_translations
                WHERE 
                    post_id = %s
            """, (post_id,))
            translations = cursor.fetchall()
            
            post_dict = dict(post)
            post_dict['translations'] = [dict(t) for t in translations]
            
            posts_with_translations.append(post_dict)
            print(f"- Post {post['slug']} has {len(translations)} translations")
        
        return posts_with_translations
    except Exception as e:
        print(f"❌ Error fetching posts from PostgreSQL: {str(e)}")
        return []
    finally:
        cursor.close()

def get_mysql_tables(mysql_conn):
    """Get list of tables in MySQL"""
    cursor = mysql_conn.cursor()
    try:
        cursor.execute("SHOW TABLES")
        tables = [t[0] for t in cursor.fetchall()]
        return tables
    except Exception as e:
        print(f"❌ Error fetching tables from MySQL: {str(e)}")
        return []
    finally:
        cursor.close()

def check_mysql_schema(mysql_conn):
    """Check if MySQL has required tables and create them if missing"""
    tables = get_mysql_tables(mysql_conn)
    required_tables = [
        'cms_languages', 
        'cms_posts', 
        'cms_post_translations', 
        'cms_tags', 
        'cms_post_tags'
    ]
    
    all_present = True
    for table in required_tables:
        if table not in tables:
            all_present = False
            print(f"❌ Required table '{table}' is missing")
    
    if all_present:
        print("✅ All required tables exist in MySQL")
        return True
    
    print("⚠️ Creating missing tables...")
    cursor = mysql_conn.cursor()
    try:
        # Create languages table if missing
        if 'cms_languages' not in tables:
            cursor.execute("""
            CREATE TABLE cms_languages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(10) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                is_default BOOLEAN DEFAULT FALSE,
                is_rtl BOOLEAN DEFAULT FALSE,
                flag VARCHAR(10) DEFAULT NULL
            )
            """)
            print("✅ Created cms_languages table")
        
        # Create posts table if missing
        if 'cms_posts' not in tables:
            cursor.execute("""
            CREATE TABLE cms_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                featured_image VARCHAR(255),
                author_id INT,
                status VARCHAR(20) DEFAULT 'draft',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                published_at DATETIME
            )
            """)
            print("✅ Created cms_posts table")
        
        # Create post translations table if missing
        if 'cms_post_translations' not in tables:
            cursor.execute("""
            CREATE TABLE cms_post_translations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                post_id INT NOT NULL,
                language_code VARCHAR(10) NOT NULL,
                title VARCHAR(255) NOT NULL,
                content TEXT,
                meta_title VARCHAR(255),
                meta_description TEXT,
                meta_keywords VARCHAR(255),
                is_auto_translated BOOLEAN DEFAULT FALSE,
                UNIQUE KEY post_language (post_id, language_code)
            )
            """)
            print("✅ Created cms_post_translations table")
        
        # Create tags table if missing
        if 'cms_tags' not in tables:
            cursor.execute("""
            CREATE TABLE cms_tags (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                description TEXT
            )
            """)
            print("✅ Created cms_tags table")
        
        # Create post-tags relationship table if missing
        if 'cms_post_tags' not in tables:
            cursor.execute("""
            CREATE TABLE cms_post_tags (
                post_id INT NOT NULL,
                tag_id INT NOT NULL,
                PRIMARY KEY (post_id, tag_id)
            )
            """)
            print("✅ Created cms_post_tags table")
        
        mysql_conn.commit()
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {str(e)}")
        mysql_conn.rollback()
        return False
    finally:
        cursor.close()

def migrate_languages(pg_languages, mysql_conn):
    """Migrate languages from PostgreSQL to MySQL"""
    cursor = mysql_conn.cursor()
    
    try:
        # Get existing languages from MySQL
        cursor.execute("SELECT code FROM cms_languages")
        existing_codes = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(existing_codes)} existing languages in MySQL: {', '.join(existing_codes)}")
        
        # Insert or update languages
        added = 0
        updated = 0
        skipped = 0
        
        for lang in pg_languages:
            code = lang['code']
            name = lang['name']
            is_active = lang['is_active']
            is_default = lang['is_default']
            
            # Skip non-active languages
            if not is_active:
                print(f"Skipping inactive language: {code}")
                skipped += 1
                continue
            
            # Set RTL flag for known RTL languages
            is_rtl = 1 if code in ['ar', 'he', 'fa', 'ur'] else 0
            
            # Set flag emoji based on language code
            flag = None
            if code == 'en': flag = '🇬🇧'
            elif code == 'fr': flag = '🇫🇷'
            elif code == 'es': flag = '🇪🇸'
            elif code == 'de': flag = '🇩🇪'
            elif code == 'zh-TW': flag = '🇹🇼'
            elif code == 'it': flag = '🇮🇹'
            elif code == 'ja': flag = '🇯🇵'
            elif code == 'ko': flag = '🇰🇷'
            elif code == 'pt': flag = '🇵🇹'
            elif code == 'ru': flag = '🇷🇺'
            elif code == 'ar': flag = '🇸🇦'
            elif code == 'nl': flag = '🇳🇱'
            elif code == 'sv': flag = '🇸🇪'
            elif code == 'pl': flag = '🇵🇱'
            elif code == 'tr': flag = '🇹🇷'
            elif code == 'hu': flag = '🇭🇺'
            elif code == 'no': flag = '🇳🇴'
            elif code == 'th': flag = '🇹🇭'
            elif code == 'vi': flag = '🇻🇳'
            elif code == 'id': flag = '🇮🇩'
            elif code == 'ms': flag = '🇲🇾'
            
            if code in existing_codes:
                # Update existing language
                cursor.execute("""
                UPDATE cms_languages 
                SET 
                    name = %s, 
                    is_active = %s, 
                    is_default = %s,
                    is_rtl = %s,
                    flag = %s
                WHERE code = %s
                """, (
                    name, 
                    1 if is_active else 0, 
                    1 if is_default else 0,
                    is_rtl,
                    flag,
                    code
                ))
                updated += 1
                print(f"✅ Updated language: {code} - {name}")
            else:
                # Insert new language
                cursor.execute("""
                INSERT INTO cms_languages (code, name, is_active, is_default, is_rtl, flag)
                VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    code, 
                    name, 
                    1 if is_active else 0, 
                    1 if is_default else 0,
                    is_rtl,
                    flag
                ))
                added += 1
                print(f"✅ Added language: {code} - {name}")
        
        mysql_conn.commit()
        
        print("\nLanguage migration summary:")
        print(f"Added: {added}")
        print(f"Updated: {updated}")
        print(f"Skipped: {skipped}")
        print(f"Total: {added + updated + skipped}")
        
        return True
    except Exception as e:
        print(f"❌ Error migrating languages: {str(e)}")
        mysql_conn.rollback()
        return False
    finally:
        cursor.close()

def get_default_author_id(mysql_conn):
    """Get a default author ID from users table"""
    cursor = mysql_conn.cursor()
    try:
        cursor.execute("SELECT id FROM users LIMIT 1")
        result = cursor.fetchone()
        if result:
            return result[0]
        else:
            print("⚠️ No users found in database, creating a default user")
            cursor.execute("""
            INSERT INTO users (username, password, email, role)
            VALUES ('admin', 'default_password_hash', 'admin@example.com', 'admin')
            """)
            mysql_conn.commit()
            return cursor.lastrowid
    except Exception as e:
        print(f"❌ Error getting default author: {str(e)}")
        return 1  # Fallback to ID 1
    finally:
        cursor.close()

def migrate_posts_and_translations(pg_posts, mysql_conn):
    """Migrate posts and their translations from PostgreSQL to MySQL"""
    default_author_id = get_default_author_id(mysql_conn)
    print(f"Using default author ID: {default_author_id}")
    
    cursor = mysql_conn.cursor()
    
    try:
        # Get existing posts from MySQL by slug
        cursor.execute("SELECT id, slug FROM cms_posts")
        existing_posts = {row[1]: row[0] for row in cursor.fetchall()}
        print(f"Found {len(existing_posts)} existing posts in MySQL")
        
        posts_added = 0
        posts_updated = 0
        translations_added = 0
        translations_skipped = 0
        
        for post in pg_posts:
            post_slug = post['slug']
            
            # Format dates to MySQL format
            created_at = post['created_at'].strftime('%Y-%m-%d %H:%M:%S') if post['created_at'] else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            updated_at = post['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if post['updated_at'] else datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            published_at = post['published_at'].strftime('%Y-%m-%d %H:%M:%S') if post['published_at'] else None
            
            if post_slug in existing_posts:
                # Post exists, update it
                mysql_post_id = existing_posts[post_slug]
                cursor.execute("""
                UPDATE cms_posts 
                SET 
                    featured_image = %s,
                    author_id = %s,
                    status = %s,
                    updated_at = %s,
                    published_at = %s
                WHERE id = %s
                """, (
                    post['featured_image'],
                    post['author_id'] or default_author_id,
                    post['status'],
                    updated_at,
                    published_at,
                    mysql_post_id
                ))
                posts_updated += 1
                print(f"✅ Updated post {post_slug} with ID {mysql_post_id}")
            else:
                # Insert new post
                cursor.execute("""
                INSERT INTO cms_posts (
                    slug, featured_image, author_id, status, 
                    created_at, updated_at, published_at
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    post_slug,
                    post['featured_image'],
                    post['author_id'] or default_author_id,
                    post['status'],
                    created_at,
                    updated_at,
                    published_at
                ))
                mysql_post_id = cursor.lastrowid
                existing_posts[post_slug] = mysql_post_id
                posts_added += 1
                print(f"✅ Added post {post_slug} with ID {mysql_post_id}")
            
            # Get existing translations for this post
            cursor.execute("SELECT language_code FROM cms_post_translations WHERE post_id = %s", (mysql_post_id,))
            existing_translations = [row[0] for row in cursor.fetchall()]
            
            # Add or update translations
            for translation in post['translations']:
                language_code = translation['language_code']
                
                # Check if translation exists
                if language_code in existing_translations:
                    # Skip existing translations to prevent duplicates
                    print(f"⏩ Skipping existing translation for {post_slug} in {language_code}")
                    translations_skipped += 1
                    continue
                
                # Add new translation
                try:
                    is_auto_translated = translation.get('is_auto_translated', False)
                    cursor.execute("""
                    INSERT INTO cms_post_translations (
                        post_id, language_code, title, content, 
                        meta_title, meta_description, meta_keywords, is_auto_translated
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        mysql_post_id,
                        language_code,
                        translation['title'],
                        translation['content'],
                        translation['meta_title'],
                        translation['meta_description'],
                        translation['meta_keywords'],
                        1 if is_auto_translated else 0
                    ))
                    translations_added += 1
                    print(f"✅ Added translation for {post_slug} in {language_code}")
                except Exception as e:
                    print(f"❌ Error adding translation for {post_slug} in {language_code}: {str(e)}")
            
            # Commit after each post to prevent losing all work on error
            mysql_conn.commit()
        
        print("\nPost migration summary:")
        print(f"Posts added: {posts_added}")
        print(f"Posts updated: {posts_updated}")
        print(f"Translations added: {translations_added}")
        print(f"Translations skipped: {translations_skipped}")
        
        return True
    except Exception as e:
        print(f"❌ Error migrating posts: {str(e)}")
        mysql_conn.rollback()
        return False
    finally:
        cursor.close()

def migrate_posts():
    """Main migration function"""
    print("\n=================================================")
    print("Starting blog post migration from PostgreSQL to MySQL")
    print("=================================================\n")
    
    # Connect to databases
    pg_conn = connect_postgres()
    if not pg_conn:
        print("❌ Failed to connect to PostgreSQL. Aborting migration.")
        return False
    
    mysql_conn = connect_mysql()
    if not mysql_conn:
        print("❌ Failed to connect to MySQL. Aborting migration.")
        pg_conn.close()
        return False
    
    try:
        # Check and create MySQL schema if needed
        if not check_mysql_schema(mysql_conn):
            print("❌ Failed to set up MySQL schema. Aborting migration.")
            return False
        
        # Get languages from PostgreSQL
        pg_languages = get_pg_languages(pg_conn)
        if not pg_languages:
            print("❌ Failed to get languages from PostgreSQL. Aborting migration.")
            return False
        
        # Migrate languages
        print("\nMigrating languages...")
        if not migrate_languages(pg_languages, mysql_conn):
            print("❌ Failed to migrate languages. Aborting migration.")
            return False
        
        # Get posts with translations from PostgreSQL
        pg_posts = get_pg_posts_translations(pg_conn)
        if not pg_posts:
            print("❌ Failed to get posts from PostgreSQL. Aborting migration.")
            return False
        
        # Migrate posts and translations
        print("\nMigrating posts and translations...")
        if not migrate_posts_and_translations(pg_posts, mysql_conn):
            print("❌ Failed to migrate posts. Aborting migration.")
            return False
        
        print("\n✅ Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error during migration: {str(e)}")
        return False
    finally:
        # Close database connections
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    start_time = time.time()
    success = migrate_posts()
    end_time = time.time()
    
    duration = round(end_time - start_time, 2)
    print(f"\nMigration {'completed successfully' if success else 'failed'} in {duration} seconds")
    
    sys.exit(0 if success else 1)