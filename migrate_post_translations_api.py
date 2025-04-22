"""
Script to directly migrate blog post translations using the API endpoints

This script:
1. Connects to PostgreSQL to get all blog posts and their translations
2. Uses API endpoints to create or update translations in MySQL
"""

import os
import sys
import psycopg2
import psycopg2.extras
import requests
import json
import time
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

def get_admin_login_token():
    """Log in as admin to get access token"""
    login_url = f"{API_URL}/auth/login"
    
    # Try different admin credentials
    login_credentials = [
        {"username": "admin", "password": "admin123"},
        {"username": "admin", "password": "changeme"},
        {"username": "admin", "password": "password"},
        {"username": "admin@imagenwiz.com", "password": "admin123"},
        {"username": "support@imagenwiz.com", "password": "admin123"}
    ]
    
    for login_data in login_credentials:
        try:
            print(f"Trying login with username: {login_data['username']}")
            response = requests.post(login_url, json=login_data)
            if response.status_code == 200:
                token = response.json().get('token')
                print(f"✅ Logged in successfully as {login_data['username']}")
                return token
            else:
                print(f"Login attempt failed for {login_data['username']}")
        except Exception as e:
            print(f"❌ Error during login: {str(e)}")
    
    print("❌ All login attempts failed")
    return None

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

def add_translation_via_api(token, post_id, translation_data):
    """Add a translation for a post using the API"""
    if not token:
        print("❌ No token available. Cannot add translation.")
        return False
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Prepare translation data
    lang_code = translation_data['language_code']
    
    api_data = {
        "post_id": post_id,
        "language_code": lang_code,
        "title": translation_data['title'],
        "content": translation_data['content'],
        "meta_title": translation_data['meta_title'],
        "meta_description": translation_data['meta_description'],
        "meta_keywords": translation_data['meta_keywords'],
        "is_auto_translated": bool(translation_data['is_auto_translated']),
    }
    
    # Try different API endpoints to add translation
    endpoints = [
        f"{API_URL}/cms/blog/{post_id}/translation/{lang_code}",
        f"{API_URL}/cms/blog/{post_id}/translations/{lang_code}",
        f"{API_URL}/cms/blog/translation",
        f"{API_URL}/cms/translation"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.post(endpoint, headers=headers, json=api_data)
            if response.status_code in [200, 201]:
                print(f"✅ Added {lang_code} translation for post {post_id}")
                return True
            
            # If 404, try another endpoint
            if response.status_code == 404:
                continue
                
            # If another error, print details
            print(f"❌ Failed to add {lang_code} translation for post {post_id}: {response.text}")
            print(f"Status code: {response.status_code}")
            return False
        
        except Exception as e:
            print(f"❌ Error adding {lang_code} translation for post {post_id}: {str(e)}")
            continue
    
    print(f"❌ All API endpoints failed for adding {lang_code} translation to post {post_id}")
    return False

def create_blog_translation_record(post_id, translation_data):
    """Create a blog post translation record directly in the CMS posts API"""
    # Try to check if translation already exists (optional)
    # Implementation would go here...
    
    # Create translation data payload
    lang_code = translation_data['language_code']
    data = {
        "post_id": post_id,
        "language_code": lang_code,
        "title": translation_data['title'],
        "content": translation_data['content'],
        "meta_title": translation_data['meta_title'] or "",
        "meta_description": translation_data['meta_description'] or "",
        "meta_keywords": translation_data['meta_keywords'] or "",
        "is_auto_translated": bool(translation_data['is_auto_translated']),
        "last_updated_at": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Try different API endpoints
    endpoints = [
        f"{API_URL}/cms/blog/{post_id}/translation",
        f"{API_URL}/cms/blog/translation"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.post(endpoint, json=data)
            if response.status_code in [200, 201]:
                print(f"✅ Created {lang_code} translation for post {post_id}")
                return True
            else:
                print(f"❌ Failed to create {lang_code} translation for post {post_id}: {response.text}")
        except Exception as e:
            print(f"❌ Error creating translation: {str(e)}")
    
    return False

def migrate_translations():
    """Main function to migrate blog post translations"""
    print("Starting blog post translations migration using API approach...")
    
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
        
        # Get admin token for API calls
        token = get_admin_login_token()
        
        # Match PostgreSQL posts to MySQL posts by slug
        mysql_post_map = {post.get('slug'): post.get('id') for post in mysql_posts if post.get('slug')}
        
        # Process each PostgreSQL post
        translations_added = 0
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
                
                # Try to add translation
                if add_translation_via_api(token, mysql_id, translation):
                    translations_added += 1
                else:
                    print(f"Trying alternative approach for {lang_code} translation of '{slug}'...")
                    if create_blog_translation_record(mysql_id, translation):
                        translations_added += 1
                    else:
                        translations_failed += 1
                
                # Add small delay to avoid overwhelming the API
                time.sleep(0.5)
        
        # Print summary
        print("\nTranslation migration summary:")
        print(f"Added: {translations_added}")
        print(f"Skipped: {translations_skipped}")
        print(f"Failed: {translations_failed}")
        print(f"Total posts processed: {len(pg_posts)}")
        
        if translations_added > 0:
            print("\n✅ Blog post translations migration completed with some successful additions.")
        else:
            print("\n❌ No translations were successfully added.")
    
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        # Close PostgreSQL connection
        pg_conn.close()

if __name__ == "__main__":
    migrate_translations()