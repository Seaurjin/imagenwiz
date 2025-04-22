"""
Script to directly insert blog post translations into MySQL

This script:
1. Connects to PostgreSQL to get all blog posts and their translations
2. Connects to MySQL with the credentials used by the Flask app
3. Directly inserts or updates translations
"""

import os
import sys
import pymysql
import psycopg2
import psycopg2.extras
from datetime import datetime

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

# MySQL connection details (taken from Flask app environment)
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
    """Connect to MySQL database"""
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            database=MYSQL_DATABASE,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print(f"✅ Connected to MySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {str(e)}")
        sys.exit(1)

def get_pg_posts_translations(pg_conn):
    """Get all published posts with their translations from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        # Get posts
        cursor.execute("""
            SELECT 
                id, slug, featured_image, status, 
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

def get_mysql_posts(mysql_conn):
    """Get all posts from MySQL database"""
    cursor = mysql_conn.cursor()
    try:
        cursor.execute("""
            SELECT id, slug, featured_image, author_id, status, 
                   created_at, updated_at, published_at
            FROM cms_posts
            WHERE status = 'published'
        """)
        posts = cursor.fetchall()
        print(f"Found {len(posts)} published posts in MySQL")
        return posts
    except Exception as e:
        print(f"❌ Error fetching posts from MySQL: {str(e)}")
        return []
    finally:
        cursor.close()

def get_mysql_languages(mysql_conn):
    """Get all available languages from MySQL database"""
    cursor = mysql_conn.cursor()
    try:
        cursor.execute("SELECT code FROM cms_languages")
        languages = cursor.fetchall()
        lang_codes = [lang['code'] for lang in languages]
        print(f"Found {len(lang_codes)} languages in MySQL: {', '.join(lang_codes)}")
        return lang_codes
    except Exception as e:
        print(f"❌ Error fetching languages from MySQL: {str(e)}")
        # Fallback to known languages
        return ['en', 'fr', 'es', 'de', 'zh-TW', 'it', 'ja', 'ko', 'pt',
                'ru', 'ar', 'nl', 'sv', 'pl', 'tr', 'hu', 'no', 'th',
                'vi', 'id', 'ms', 'el']
    finally:
        cursor.close()

def check_translation_exists(mysql_conn, post_id, lang_code):
    """Check if a translation already exists in MySQL"""
    cursor = mysql_conn.cursor()
    try:
        cursor.execute("""
            SELECT id FROM cms_post_translations 
            WHERE post_id = %s AND language_code = %s
        """, (post_id, lang_code))
        exists = cursor.fetchone() is not None
        return exists
    except Exception as e:
        print(f"❌ Error checking translation existence: {str(e)}")
        return False
    finally:
        cursor.close()

def migrate_translations(pg_posts, mysql_conn, available_languages):
    """Migrate translations from PostgreSQL posts to MySQL"""
    
    # Get MySQL posts by slug for mapping
    mysql_posts = get_mysql_posts(mysql_conn)
    mysql_post_map = {post['slug']: post['id'] for post in mysql_posts}
    
    cursor = mysql_conn.cursor()
    
    translations_added = 0
    translations_updated = 0
    translations_skipped = 0
    translations_failed = 0
    
    for pg_post in pg_posts:
        slug = pg_post['slug']
        
        # Skip if post doesn't exist in MySQL
        if slug not in mysql_post_map:
            print(f"Post '{slug}' not found in MySQL. Skipping.")
            translations_skipped += len(pg_post['translations'])
            continue
        
        mysql_id = mysql_post_map[slug]
        
        for translation in pg_post['translations']:
            lang_code = translation['language_code']
            
            # Skip if language not available in MySQL
            if lang_code not in available_languages:
                print(f"Language {lang_code} not available in MySQL. Skipping translation for '{slug}'.")
                translations_skipped += 1
                continue
            
            # Check if translation already exists
            exists = check_translation_exists(mysql_conn, mysql_id, lang_code)
            
            # Escape strings for SQL
            title = translation['title'].replace("'", "''") if translation['title'] else ""
            content = translation['content'].replace("'", "''") if translation['content'] else ""
            meta_title = translation['meta_title'].replace("'", "''") if translation['meta_title'] else ""
            meta_desc = translation['meta_description'].replace("'", "''") if translation['meta_description'] else ""
            meta_keys = translation['meta_keywords'].replace("'", "''") if translation['meta_keywords'] else ""
            is_auto = 1 if translation['is_auto_translated'] else 0
            now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            try:
                if exists:
                    # Update existing translation
                    cursor.execute("""
                        UPDATE cms_post_translations
                        SET title = %s, content = %s, meta_title = %s,
                            meta_description = %s, meta_keywords = %s,
                            is_auto_translated = %s, last_updated_at = %s
                        WHERE post_id = %s AND language_code = %s
                    """, (
                        title, content, meta_title, meta_desc, meta_keys,
                        is_auto, now, mysql_id, lang_code
                    ))
                    translations_updated += 1
                    print(f"✅ Updated {lang_code} translation for '{slug}'")
                else:
                    # Insert new translation
                    cursor.execute("""
                        INSERT INTO cms_post_translations
                        (post_id, language_code, title, content, meta_title,
                         meta_description, meta_keywords, is_auto_translated, last_updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        mysql_id, lang_code, title, content, meta_title,
                        meta_desc, meta_keys, is_auto, now
                    ))
                    translations_added += 1
                    print(f"✅ Added {lang_code} translation for '{slug}'")
                
                # Commit after each translation to avoid losing everything on error
                mysql_conn.commit()
                
            except Exception as e:
                print(f"❌ Error adding/updating {lang_code} translation for '{slug}': {str(e)}")
                # Rollback and try again without the auto_translated field in case it's missing
                mysql_conn.rollback()
                translations_failed += 1
    
    print("\nTranslation migration summary:")
    print(f"Added: {translations_added}")
    print(f"Updated: {translations_updated}")
    print(f"Skipped: {translations_skipped}")
    print(f"Failed: {translations_failed}")
    print(f"Total posts processed: {len(pg_posts)}")
    
    if translations_added > 0 or translations_updated > 0:
        print("\n✅ Blog post translations migration completed successfully.")
    else:
        print("\n❌ No translations were successfully added or updated.")

def main():
    """Main function to migrate blog post translations"""
    print("Starting direct SQL migration of blog post translations...")
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    # Connect to MySQL
    mysql_conn = connect_mysql()
    
    try:
        # Get PostgreSQL posts with translations
        pg_posts = get_pg_posts_translations(pg_conn)
        
        if not pg_posts:
            print("❌ No posts found in PostgreSQL. Migration aborted.")
            return
        
        # Get available languages
        available_languages = get_mysql_languages(mysql_conn)
        
        if not available_languages:
            print("❌ No languages found in MySQL. Migration aborted.")
            return
        
        # Migrate translations
        migrate_translations(pg_posts, mysql_conn, available_languages)
    
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close connections
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    main()