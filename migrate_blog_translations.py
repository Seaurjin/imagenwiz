"""
Script to migrate blog post translations from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to get all blog posts and their translations
2. Checks which posts exist in MySQL
3. Adds missing translations for existing posts
"""

import os
import sys
import psycopg2
import psycopg2.extras
import tempfile
import subprocess
import json
import time
import requests
from datetime import datetime

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

# Flask API URL
API_URL = "http://localhost:5000/api"

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

def get_mysql_posts():
    """Get all posts from MySQL via API"""
    try:
        # Get all posts, including slugs which we need for matching
        url = f"{API_URL}/cms/blog"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            
            # Handle different response formats
            if isinstance(data, list):
                posts = data
            elif isinstance(data, dict) and 'posts' in data:
                posts = data.get('posts', [])
            else:
                posts = []
                
            print(f"Found {len(posts)} posts in MySQL")
            
            # Ensure each post has slug and id
            valid_posts = []
            for post in posts:
                if isinstance(post, dict) and 'slug' in post and 'id' in post:
                    valid_posts.append(post)
            
            print(f"Valid posts for migration: {len(valid_posts)}")
            return valid_posts
        else:
            print(f"❌ Error fetching posts from MySQL API: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Error fetching posts from MySQL API: {str(e)}")
        return []

def get_mysql_languages():
    """Get all languages from MySQL via API"""
    try:
        url = f"{API_URL}/cms/languages"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            
            # Handle different response formats
            languages = []
            if isinstance(data, list):
                languages = data
            elif isinstance(data, dict) and 'languages' in data:
                languages = data.get('languages', [])
            
            # Extract language codes from valid language objects
            lang_codes = []
            for lang in languages:
                if isinstance(lang, dict) and 'code' in lang:
                    lang_codes.append(lang['code'])
            
            print(f"Found {len(lang_codes)} languages in MySQL: {', '.join(lang_codes)}")
            
            # If we have languages but couldn't find codes, make a direct SQL query
            if not lang_codes and len(languages) > 0:
                print("Warning: Found languages but couldn't extract codes. Using hardcoded list.")
                # List the 22 language codes that should be available
                lang_codes = [
                    'en', 'fr', 'es', 'de', 'zh-TW', 'it', 'ja', 'ko', 'pt',
                    'ru', 'ar', 'nl', 'sv', 'pl', 'tr', 'hu', 'no', 'th',
                    'vi', 'id', 'ms', 'el'
                ]
                print(f"Using {len(lang_codes)} hardcoded language codes: {', '.join(lang_codes)}")
            
            return lang_codes
        else:
            print(f"❌ Error fetching languages from MySQL API: {response.text}")
            
            # If API fails, use a hardcoded list of languages as fallback
            print("Using hardcoded list of languages as fallback")
            lang_codes = [
                'en', 'fr', 'es', 'de', 'zh-TW', 'it', 'ja', 'ko', 'pt',
                'ru', 'ar', 'nl', 'sv', 'pl', 'tr', 'hu', 'no', 'th',
                'vi', 'id', 'ms', 'el'
            ]
            print(f"Using {len(lang_codes)} hardcoded language codes: {', '.join(lang_codes)}")
            return lang_codes
    except Exception as e:
        print(f"❌ Error fetching languages from MySQL API: {str(e)}")
        
        # If an exception occurs, use a hardcoded list of languages as fallback
        print("Using hardcoded list of languages as fallback due to error")
        lang_codes = [
            'en', 'fr', 'es', 'de', 'zh-TW', 'it', 'ja', 'ko', 'pt',
            'ru', 'ar', 'nl', 'sv', 'pl', 'tr', 'hu', 'no', 'th',
            'vi', 'id', 'ms', 'el'
        ]
        print(f"Using {len(lang_codes)} hardcoded language codes: {', '.join(lang_codes)}")
        return lang_codes

def create_sql_migration(pg_posts, mysql_posts, available_languages):
    """Create SQL migration script for blog post translations"""
    
    # Match PostgreSQL posts to MySQL posts by slug
    mysql_post_map = {post.get('slug'): post.get('id') for post in mysql_posts if post.get('slug')}
    
    # Create SQL script
    sql_script = """
-- SQL script to migrate blog post translations
-- Generated by migrate_blog_translations.py

-- Make sure posts table exists (should already exist)
CREATE TABLE IF NOT EXISTS cms_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    featured_image TEXT,
    author_id INT,
    status VARCHAR(20) DEFAULT 'draft',
    created_at DATETIME,
    updated_at DATETIME,
    published_at DATETIME
);

-- Make sure translations table exists (should already exist)
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
    last_updated_at DATETIME,
    UNIQUE KEY post_language (post_id, language_code),
    FOREIGN KEY (post_id) REFERENCES cms_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (language_code) REFERENCES cms_languages(code) ON DELETE CASCADE
);

-- Add is_auto_translated column if it doesn't exist (using simple ALTER TABLE statement)
-- This is more compatible with different SQL execution methods
ALTER TABLE cms_post_translations ADD COLUMN IF NOT EXISTS is_auto_translated BOOLEAN DEFAULT FALSE;

"""
    
    # Add migration operations for each post
    translation_count = 0
    skipped_count = 0
    
    for pg_post in pg_posts:
        slug = pg_post['slug']
        
        # Skip if post doesn't exist in MySQL
        if slug not in mysql_post_map:
            print(f"Post '{slug}' not found in MySQL. Skipping.")
            skipped_count += len(pg_post['translations'])
            continue
        
        mysql_id = mysql_post_map[slug]
        
        for trans in pg_post['translations']:
            lang_code = trans['language_code']
            
            # Skip if language not available in MySQL
            if lang_code not in available_languages:
                print(f"Language {lang_code} not available in MySQL. Skipping translation for '{slug}'.")
                skipped_count += 1
                continue
            
            # Escape strings for SQL
            title = trans['title'].replace("'", "''") if trans['title'] else ""
            content = trans['content'].replace("'", "''") if trans['content'] else ""
            meta_title = trans['meta_title'].replace("'", "''") if trans['meta_title'] else ""
            meta_desc = trans['meta_description'].replace("'", "''") if trans['meta_description'] else ""
            meta_keys = trans['meta_keywords'].replace("'", "''") if trans['meta_keywords'] else ""
            is_auto = "TRUE" if trans['is_auto_translated'] else "FALSE"
            
            sql_script += f"""
-- Translation for {slug} in {lang_code}
INSERT INTO cms_post_translations 
    (post_id, language_code, title, content, meta_title, meta_description, meta_keywords, is_auto_translated, last_updated_at)
VALUES 
    ({mysql_id}, '{lang_code}', '{title}', '{content}', '{meta_title}', '{meta_desc}', '{meta_keys}', {is_auto}, NOW())
ON DUPLICATE KEY UPDATE 
    title = '{title}',
    content = '{content}',
    meta_title = '{meta_title}',
    meta_description = '{meta_desc}',
    meta_keywords = '{meta_keys}',
    is_auto_translated = {is_auto},
    last_updated_at = NOW();
"""
            translation_count += 1
    
    # Write summary
    sql_script += f"""
-- Migration Summary
-- Total translations to migrate: {translation_count}
-- Skipped translations: {skipped_count}
-- Total posts processed: {len(pg_posts)}
"""
    
    # Write to temporary file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.sql', mode='w')
    temp_file.write(sql_script)
    temp_file.close()
    
    print(f"Created SQL migration script at {temp_file.name}")
    print(f"SQL script will migrate {translation_count} translations ({skipped_count} skipped)")
    
    return temp_file.name, translation_count

def run_sql_file(sql_file):
    """Run SQL file using the Flask app context via execute_sql_via_flask.py"""
    
    try:
        print("Running SQL migration using Flask application context...")
        
        # Use the execute_sql_via_flask.py script
        command = [
            'python',
            'execute_sql_via_flask.py',
            '--file', sql_file
        ]
        
        result = subprocess.run(
            command,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ SQL migration executed successfully via Flask application context")
            return True
        else:
            print(f"❌ Error executing SQL migration via Flask: {result.stderr if result.stderr else result.stdout}")
            
            # Try direct method with mysql client
            print("Trying alternative approach: direct MySQL client...")
            
            mysql_command = [
                'mysql',
                '-h', '8.130.113.102',
                '-u', 'root',
                '-pIr%2586241992',
                'mat_db',
                '-e', f"source {sql_file}"
            ]
            
            mysql_result = subprocess.run(
                mysql_command,
                capture_output=True,
                text=True
            )
            
            if mysql_result.returncode == 0:
                print("✅ SQL migration executed successfully via MySQL client")
                return True
            else:
                print(f"❌ Error executing SQL migration via MySQL client: {mysql_result.stderr}")
                return False
    except Exception as e:
        print(f"❌ Error executing SQL migration: {str(e)}")
        return False
    finally:
        # Clean up the temporary file
        try:
            os.unlink(sql_file)
            print(f"Deleted temporary SQL file: {sql_file}")
        except Exception as e:
            print(f"Warning: Could not delete temporary file {sql_file}: {str(e)}")

def migrate_translations():
    """Main function to migrate blog post translations"""
    print("Starting blog post translations migration...")
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    try:
        # Get PostgreSQL posts with translations
        pg_posts = get_pg_posts_translations(pg_conn)
        
        if not pg_posts:
            print("❌ No posts found in PostgreSQL. Migration aborted.")
            return
        
        # Get MySQL posts
        mysql_posts = get_mysql_posts()
        
        if not mysql_posts:
            print("❌ No posts found in MySQL. Migration aborted.")
            return
        
        # Get available languages
        available_languages = get_mysql_languages()
        
        if not available_languages:
            print("❌ No languages found in MySQL. Migration aborted.")
            return
        
        # Create migration script
        sql_file, translation_count = create_sql_migration(pg_posts, mysql_posts, available_languages)
        
        if translation_count == 0:
            print("No translations to migrate. Skipping SQL execution.")
            return
        
        # Run migration
        if run_sql_file(sql_file):
            print("\n✅ Blog post translations migration completed successfully.")
        else:
            print("\n❌ Blog post translations migration failed.")
    
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close PostgreSQL connection
        pg_conn.close()

if __name__ == "__main__":
    migrate_translations()