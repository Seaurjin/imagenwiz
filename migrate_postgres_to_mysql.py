"""
Script to migrate blog post translations from PostgreSQL to MySQL

This script:
1. Connects directly to both the PostgreSQL source and MySQL target databases
2. Adds all supported languages to MySQL
3. Migrates all blog posts and their translations
"""

import os
import sys
import time
import psycopg2
import psycopg2.extras
from datetime import datetime

# PostgreSQL connection details (from environment)
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

# MySQL connection details (hardcoded for this migration)
MYSQL_HOST = "8.130.113.102"
MYSQL_PORT = 3306
MYSQL_DATABASE = "mat_db"
MYSQL_USER = "root"
MYSQL_PASSWORD = "Ir%2586241992"

def connect_postgres():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            database=PG_DATABASE,
            user=PG_USER,
            password=PG_PASSWORD
        )
        print(f"✅ Connected to PostgreSQL: {PG_HOST}:{PG_PORT}/{PG_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {str(e)}")
        sys.exit(1)

def connect_mysql():
    """Connect to MySQL database using the mysql-connector-python package"""
    try:
        import mysql.connector
        conn = mysql.connector.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            database=MYSQL_DATABASE,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD
        )
        print(f"✅ Connected to MySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {str(e)}")
        
        # Try with pymysql as fallback
        try:
            import pymysql
            conn = pymysql.connect(
                host=MYSQL_HOST,
                port=MYSQL_PORT,
                database=MYSQL_DATABASE,
                user=MYSQL_USER,
                password=MYSQL_PASSWORD,
                charset='utf8mb4',
                cursorclass=pymysql.cursors.DictCursor
            )
            print(f"✅ Connected to MySQL with PyMySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
            return conn
        except Exception as e:
            print(f"❌ Failed to connect to MySQL with PyMySQL: {str(e)}")
            sys.exit(1)

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

def migrate_languages(pg_conn, mysql_conn):
    """Migrate languages from PostgreSQL to MySQL"""
    pg_languages = get_pg_languages(pg_conn)
    
    mysql_cursor = mysql_conn.cursor()
    
    # Check if languages table exists in MySQL
    try:
        mysql_cursor.execute("SHOW TABLES LIKE 'cms_languages'")
        if mysql_cursor.fetchone() is None:
            print("Creating cms_languages table in MySQL...")
            mysql_cursor.execute("""
                CREATE TABLE IF NOT EXISTS cms_languages (
                    code VARCHAR(10) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    is_active TINYINT(1) NOT NULL DEFAULT 1,
                    is_default TINYINT(1) NOT NULL DEFAULT 0,
                    is_rtl TINYINT(1) NOT NULL DEFAULT 0,
                    flag VARCHAR(10)
                )
            """)
            mysql_conn.commit()
    except Exception as e:
        print(f"❌ Error checking/creating languages table: {str(e)}")
        return False
    
    # Get existing languages from MySQL
    try:
        mysql_cursor.execute("SELECT code FROM cms_languages")
        existing_langs = [row[0] for row in mysql_cursor.fetchall()]
        print(f"Found {len(existing_langs)} existing languages in MySQL: {', '.join(existing_langs)}")
    except Exception as e:
        print(f"❌ Error fetching existing languages from MySQL: {str(e)}")
        existing_langs = []
    
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
        
        if code in existing_langs:
            try:
                mysql_cursor.execute("""
                    UPDATE cms_languages 
                    SET name = %s, is_active = %s, is_default = %s
                    WHERE code = %s
                """, (name, 1 if is_active else 0, 1 if is_default else 0, code))
                updated += 1
                print(f"✅ Updated language: {code} - {name}")
            except Exception as e:
                print(f"❌ Error updating language {code}: {str(e)}")
        else:
            try:
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
                
                mysql_cursor.execute("""
                    INSERT INTO cms_languages 
                    (code, name, is_active, is_default, is_rtl, flag)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (code, name, 1 if is_active else 0, 1 if is_default else 0, is_rtl, flag))
                added += 1
                print(f"✅ Added language: {code} - {name}")
            except Exception as e:
                print(f"❌ Error adding language {code}: {str(e)}")
    
    mysql_conn.commit()
    
    print("\nLanguage migration summary:")
    print(f"Added: {added}")
    print(f"Updated: {updated}")
    print(f"Skipped: {skipped}")
    print(f"Total: {added + updated + skipped}")
    
    return True

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

def get_mysql_post_by_slug(mysql_conn, slug):
    """Get a post from MySQL by slug"""
    cursor = mysql_conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id FROM cms_posts WHERE slug = %s", (slug,))
        post = cursor.fetchone()
        return post
    except Exception as e:
        print(f"❌ Error fetching post {slug} from MySQL: {str(e)}")
        return None
    finally:
        cursor.close()

def get_mysql_author_id(mysql_conn):
    """Get a valid author ID from MySQL"""
    cursor = mysql_conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id FROM users ORDER BY id LIMIT 1")
        user = cursor.fetchone()
        if user:
            return user['id']
        return 1  # Default to ID 1 if no users found
    except Exception as e:
        print(f"❌ Error fetching author ID from MySQL: {str(e)}")
        return 1
    finally:
        cursor.close()

def translation_exists(mysql_conn, post_id, lang_code):
    """Check if a translation already exists in MySQL"""
    cursor = mysql_conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT id FROM cms_post_translations 
            WHERE post_id = %s AND language_code = %s
        """, (post_id, lang_code))
        return cursor.fetchone() is not None
    except Exception as e:
        print(f"❌ Error checking translation existence: {str(e)}")
        return False
    finally:
        cursor.close()

def migrate_posts_translations(pg_conn, mysql_conn):
    """Migrate posts and their translations from PostgreSQL to MySQL"""
    pg_posts = get_pg_posts_translations(pg_conn)
    
    mysql_cursor = mysql_conn.cursor(dictionary=True)
    
    # Get default author ID
    default_author_id = get_mysql_author_id(mysql_conn)
    print(f"Using author ID {default_author_id} for posts without author")
    
    # Get available languages
    mysql_cursor.execute("SELECT code FROM cms_languages")
    available_langs = [row['code'] for row in mysql_cursor.fetchall()]
    print(f"Available languages in MySQL: {', '.join(available_langs)}")
    
    posts_added = 0
    posts_updated = 0
    posts_skipped = 0
    translations_added = 0
    translations_skipped = 0
    
    for post in pg_posts:
        post_slug = post['slug']
        
        # Check if post already exists
        existing_post = get_mysql_post_by_slug(mysql_conn, post_slug)
        
        if existing_post:
            mysql_post_id = existing_post['id']
            print(f"Post {post_slug} already exists in MySQL with ID {mysql_post_id}")
            posts_updated += 1
        else:
            # Create post
            try:
                now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                mysql_cursor.execute("""
                    INSERT INTO cms_posts
                    (slug, featured_image, author_id, status, created_at, updated_at, published_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    post_slug, 
                    post['featured_image'],
                    post['author_id'] if post['author_id'] else default_author_id,
                    post['status'],
                    post['created_at'].strftime('%Y-%m-%d %H:%M:%S') if post['created_at'] else now,
                    post['updated_at'].strftime('%Y-%m-%d %H:%M:%S') if post['updated_at'] else now,
                    post['published_at'].strftime('%Y-%m-%d %H:%M:%S') if post['published_at'] else now
                ))
                mysql_post_id = mysql_cursor.lastrowid
                print(f"✅ Added post {post_slug} with ID {mysql_post_id}")
                posts_added += 1
            except Exception as e:
                print(f"❌ Error adding post {post_slug}: {str(e)}")
                posts_skipped += 1
                continue
        
        # Add translations
        for translation in post['translations']:
            lang_code = translation['language_code']
            
            # Skip if language not available in MySQL
            if lang_code not in available_langs:
                print(f"⚠️ Language {lang_code} not available in MySQL. Skipping translation for {post_slug}.")
                translations_skipped += 1
                continue
            
            # Skip if translation already exists
            if translation_exists(mysql_conn, mysql_post_id, lang_code):
                print(f"Translation for {post_slug} in {lang_code} already exists. Skipping.")
                translations_skipped += 1
                continue
            
            try:
                now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                
                mysql_cursor.execute("""
                    INSERT INTO cms_post_translations
                    (post_id, language_code, title, content, meta_title, meta_description, meta_keywords, is_auto_translated, last_updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    mysql_post_id,
                    lang_code,
                    translation['title'],
                    translation['content'],
                    translation['meta_title'],
                    translation['meta_description'],
                    translation['meta_keywords'],
                    translation['is_auto_translated'] if translation['is_auto_translated'] is not None else 0,
                    now
                ))
                print(f"✅ Added {lang_code} translation for post {post_slug}")
                translations_added += 1
                
                # Commit after each translation to avoid losing progress if an error occurs
                mysql_conn.commit()
                
            except Exception as e:
                print(f"❌ Error adding {lang_code} translation for post {post_slug}: {str(e)}")
                translations_skipped += 1
    
    mysql_conn.commit()
    
    print("\nPosts migration summary:")
    print(f"Posts added: {posts_added}")
    print(f"Posts updated: {posts_updated}")
    print(f"Posts skipped: {posts_skipped}")
    print(f"Translations added: {translations_added}")
    print(f"Translations skipped: {translations_skipped}")

def main():
    """Main migration function"""
    print("Starting migration from PostgreSQL to MySQL...")
    
    # Connect to databases
    pg_conn = connect_postgres()
    mysql_conn = connect_mysql()
    
    try:
        # Step 1: Migrate languages
        print("\n🔄 Step 1: Migrating languages...")
        if not migrate_languages(pg_conn, mysql_conn):
            print("❌ Failed to migrate languages. Stopping migration.")
            return
        
        # Step 2: Migrate posts and translations
        print("\n🔄 Step 2: Migrating posts and translations...")
        migrate_posts_translations(pg_conn, mysql_conn)
        
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
    finally:
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    main()