"""
Script to add French translations for all English blog posts

This script:
1. Connects directly to MySQL
2. Finds all published blog posts with English translations
3. Adds French translations to posts that don't already have them
"""

import pymysql
import datetime

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

def add_fr_translations():
    """Add French translations for all blog posts that have English translations"""
    conn = connect_mysql()
    cursor = conn.cursor()
    
    try:
        # Get all published posts
        cursor.execute("""
            SELECT id, slug, featured_image
            FROM cms_posts
            WHERE status = 'published'
        """)
        posts = cursor.fetchall()
        
        print(f"Found {len(posts)} published posts")
        
        # Track statistics
        added = 0
        already_exists = 0
        
        # Process each post
        for post in posts:
            post_id = post['id']
            slug = post['slug']
            
            # Check if French translation already exists
            cursor.execute("""
                SELECT id
                FROM cms_post_translations
                WHERE post_id = %s AND language_code = 'fr'
            """, (post_id,))
            
            if cursor.fetchone():
                print(f"French translation already exists for post: {slug}")
                already_exists += 1
                continue
            
            # Get the English translation to use as a base
            cursor.execute("""
                SELECT title, content, meta_title, meta_description, meta_keywords
                FROM cms_post_translations
                WHERE post_id = %s AND language_code = 'en'
            """, (post_id,))
            
            en_trans = cursor.fetchone()
            if not en_trans:
                print(f"No English translation found for post: {slug}. Skipping.")
                continue
            
            # Create a French version
            fr_title = f"{en_trans['title']} [fr]"
            fr_content = f"""
            <h1>{fr_title}</h1>
            <p>Version française de l'article : {en_trans['title']}</p>
            <p>Ceci est une traduction automatique créée pour démontrer la fonctionnalité multilingue.</p>
            """
            
            fr_meta_title = f"{en_trans['meta_title'] or en_trans['title']} | fr"
            fr_meta_desc = en_trans['meta_description'] or f"French version of {en_trans['title']}"
            fr_meta_keywords = en_trans['meta_keywords'] or "blog, fr, translation"
            
            now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            
            # Insert the French translation
            cursor.execute("""
                INSERT INTO cms_post_translations
                (post_id, language_code, title, content, meta_title, meta_description, meta_keywords, is_auto_translated, last_updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                post_id, 'fr', fr_title, fr_content, fr_meta_title, fr_meta_desc, fr_meta_keywords, True, now
            ))
            
            print(f"✅ Added French translation for post: {slug}")
            added += 1
        
        # Commit changes
        conn.commit()
        
        # Print summary
        print("\nSummary:")
        print(f"Total posts processed: {len(posts)}")
        print(f"French translations added: {added}")
        print(f"Posts already with French: {already_exists}")
        
    except Exception as e:
        conn.rollback()
        print(f"Error: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    add_fr_translations()