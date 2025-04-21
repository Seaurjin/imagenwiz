"""
Script to directly migrate blog post translations from PostgreSQL to MySQL

This script:
1. Extracts all blog post translations from PostgreSQL
2. For each post that exists in MySQL, adds all available translations
"""

import os
import psycopg2
import psycopg2.extras
import requests

def connect_postgres():
    """Connect to PostgreSQL database"""
    return psycopg2.connect(
        host=os.environ.get('PGHOST'),
        port=os.environ.get('PGPORT'),
        database=os.environ.get('PGDATABASE'),
        user=os.environ.get('PGUSER'),
        password=os.environ.get('PGPASSWORD')
    )

def get_languages_in_mysql():
    """Get available languages in MySQL via API"""
    resp = requests.get("http://localhost:5000/api/cms/languages")
    if resp.status_code != 200:
        print(f"Failed to get languages: {resp.text}")
        return []
    
    languages = resp.json()
    return [lang['code'] for lang in languages]

def get_posts_in_mysql():
    """Get all posts in MySQL via API"""
    resp = requests.get("http://localhost:5000/api/cms/blog?language=en")
    if resp.status_code != 200:
        print(f"Failed to get posts: {resp.text}")
        return []
    
    posts = resp.json()['posts']
    return [(post['id'], post['slug']) for post in posts]

def get_all_translations_from_postgres(pg_conn):
    """Get all translations for all posts from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    cursor.execute("""
        SELECT 
            p.id AS postgres_id,
            p.slug,
            pt.language_code,
            pt.title,
            pt.content,
            pt.meta_title,
            pt.meta_description,
            pt.meta_keywords,
            pt.is_auto_translated
        FROM 
            cms_posts p
        JOIN 
            cms_post_translations pt ON p.id = pt.post_id
        WHERE 
            p.status = 'published'
        ORDER BY 
            p.id, pt.language_code
    """)
    
    translations = cursor.fetchall()
    cursor.close()
    
    # Group translations by post slug
    posts_translations = {}
    for trans in translations:
        slug = trans['slug']
        if slug not in posts_translations:
            posts_translations[slug] = []
        posts_translations[slug].append({
            'language_code': trans['language_code'],
            'title': trans['title'],
            'content': trans['content'],
            'meta_title': trans['meta_title'],
            'meta_description': trans['meta_description'],
            'meta_keywords': trans['meta_keywords'],
            'is_auto_translated': trans['is_auto_translated']
        })
    
    return posts_translations

def add_translation_via_api(mysql_post_id, translation):
    """Add translation for a post via API"""
    data = {
        'post_id': mysql_post_id,
        'language_code': translation['language_code'],
        'title': translation['title'],
        'content': translation['content'],
        'meta_title': translation['meta_title'],
        'meta_description': translation['meta_description'],
        'meta_keywords': translation['meta_keywords'],
        'is_auto_translated': translation['is_auto_translated'] if translation['is_auto_translated'] is not None else False
    }
    
    resp = requests.post("http://localhost:5000/api/cms/blog/translations", json=data)
    return resp.status_code == 201, resp.text

def check_translation_exists(mysql_post_id, lang_code):
    """Check if translation already exists for a post in a language"""
    resp = requests.get(f"http://localhost:5000/api/cms/blog/{mysql_post_id}")
    if resp.status_code != 200:
        return False
    
    post_data = resp.json()
    translations = post_data.get('translations', [])
    
    for trans in translations:
        if trans['language_code'] == lang_code:
            return True
    
    return False

def migrate_all_translations():
    """Migrate all translations from PostgreSQL to MySQL"""
    # Connect to PostgreSQL and get all translations
    pg_conn = connect_postgres()
    posts_translations = get_all_translations_from_postgres(pg_conn)
    pg_conn.close()
    
    print(f"Retrieved translations for {len(posts_translations)} posts from PostgreSQL")
    
    # Get MySQL posts and languages
    mysql_posts = get_posts_in_mysql()
    available_languages = get_languages_in_mysql()
    
    print(f"Found {len(mysql_posts)} posts in MySQL")
    print(f"Available languages in MySQL: {', '.join(available_languages)}")
    
    # Map PostgreSQL slugs to MySQL post IDs
    slug_to_id_map = {slug: post_id for post_id, slug in mysql_posts}
    
    # Process each post's translations
    added_count = 0
    skipped_count = 0
    failed_count = 0
    
    for slug, translations in posts_translations.items():
        if slug not in slug_to_id_map:
            print(f"Post with slug '{slug}' not found in MySQL. Skipping.")
            continue
        
        mysql_post_id = slug_to_id_map[slug]
        print(f"\nProcessing post {slug} (MySQL ID: {mysql_post_id})")
        
        for translation in translations:
            lang_code = translation['language_code']
            
            # Skip languages not available in MySQL
            if lang_code not in available_languages:
                print(f"  Language {lang_code} not available in MySQL. Skipping.")
                skipped_count += 1
                continue
                
            # Skip English translations - they are already migrated
            if lang_code == 'en':
                print(f"  English translation already exists. Skipping.")
                skipped_count += 1
                continue
            
            # Skip existing translations
            if check_translation_exists(mysql_post_id, lang_code):
                print(f"  Translation for {lang_code} already exists. Skipping.")
                skipped_count += 1
                continue
            
            # Add translation
            print(f"  Adding {lang_code} translation for post {slug}...")
            success, message = add_translation_via_api(mysql_post_id, translation)
            
            if success:
                print(f"  ✅ Successfully added {lang_code} translation")
                added_count += 1
            else:
                print(f"  ❌ Failed to add {lang_code} translation: {message}")
                failed_count += 1
    
    # Print summary
    print("\nMigration Summary:")
    print(f"Total posts processed: {len(posts_translations)}")
    print(f"Translations added: {added_count}")
    print(f"Translations skipped: {skipped_count}")
    print(f"Translations failed: {failed_count}")

if __name__ == "__main__":
    migrate_all_translations()