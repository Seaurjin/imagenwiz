"""
Script to check which languages have blog post translations
"""

import os
import sys
import pymysql

def connect_mysql():
    """Connect to MySQL database for direct operations"""
    print("Connecting to MySQL: root@8.130.113.102:3306/mat_db")
    return pymysql.connect(
        host='8.130.113.102',
        user='root',
        password='Ir%2586241992',
        database='mat_db',
        port=3306,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

def check_blog_translations():
    """Check which languages have blog post translations"""
    # Connect directly to the database
    conn = connect_mysql()
    cursor = conn.cursor()
    
    try:
        print("Checking blog post translations...")
        
        # Get all active languages
        cursor.execute("SELECT code, name FROM cms_languages WHERE is_active = 1")
        languages = cursor.fetchall()
        
        if not languages:
            print("No active languages found.")
            return
        
        lang_codes = [lang['code'] for lang in languages]
        print(f"Found {len(languages)} active languages: {', '.join(lang_codes)}")
        
        # Get all published posts
        cursor.execute("SELECT id, slug FROM cms_posts WHERE status = 'published'")
        posts = cursor.fetchall()
        
        if not posts:
            print("No published posts found.")
            return
        
        print(f"Found {len(posts)} published posts.")
        
        # Create a table for displaying results
        print("\nTranslation Status:")
        print("=" * 80)
        print(f"{'Post Title':<40} | {'Available Languages':<35}")
        print("-" * 80)
        
        # Summary stats
        fully_translated = 0
        partially_translated = 0
        no_translation = 0
        
        # Check each post for translations
        for post in posts:
            post_id = post['id']
            slug = post['slug']
            
            # Get the post title from English translation
            cursor.execute("""
                SELECT title 
                FROM cms_post_translations 
                WHERE post_id = %s AND language_code = 'en'
            """, (post_id,))
            english_trans = cursor.fetchone()
            title = english_trans['title'] if english_trans else f"Post {post_id} ({slug})"
            
            # Get all translations for this post
            cursor.execute("""
                SELECT language_code 
                FROM cms_post_translations 
                WHERE post_id = %s
            """, (post_id,))
            translations = cursor.fetchall()
            translation_lang_codes = [t['language_code'] for t in translations]
            
            # Find missing translations
            missing_translations = set(lang_codes) - set(translation_lang_codes)
            
            print(f"{title[:37] + '...' if len(title) > 40 else title:<40} | {', '.join(translation_lang_codes):<35}")
            
            # Update stats
            if len(translation_lang_codes) == len(languages):
                fully_translated += 1
            elif len(translation_lang_codes) > 1:
                partially_translated += 1
            else:
                no_translation += 1
        
        print("=" * 80)
        
        # Print summary stats
        print("\nSummary Statistics:")
        print(f"Total posts: {len(posts)}")
        print(f"Fully translated (all languages): {fully_translated}")
        print(f"Partially translated: {partially_translated}")
        print(f"Only one language: {no_translation}")
        
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    check_blog_translations()