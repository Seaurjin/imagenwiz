"""
Script to migrate blog post translations using the Flask application context

This script:
1. Creates a Flask application context
2. Uses the SQLAlchemy models to migrate posts and translations
"""

import os
import sys
from datetime import datetime
import psycopg2
import psycopg2.extras

# Add backend directory to system path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Import Flask app and models
from app import create_app, db
from app.models.cms import Post, PostTranslation, Language, Tag

def connect_postgres():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=os.environ.get('PGHOST'),
            port=os.environ.get('PGPORT'),
            database=os.environ.get('PGDATABASE'),
            user=os.environ.get('PGUSER'),
            password=os.environ.get('PGPASSWORD')
        )
        print(f"✅ Connected to PostgreSQL database")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {str(e)}")
        sys.exit(1)

def get_pg_languages(pg_conn):
    """Get all languages from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    try:
        # Build query based on available columns
        query = "SELECT code, name, is_active, is_default FROM cms_languages WHERE is_active = True"
        cursor.execute(query)
        languages = cursor.fetchall()
        print(f"Found {len(languages)} active languages in PostgreSQL")
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
            print(f"Post {post['slug']} has {len(translations)} translations")
        
        return posts_with_translations
    except Exception as e:
        print(f"❌ Error fetching posts from PostgreSQL: {str(e)}")
        return []
    finally:
        cursor.close()

def migrate_languages(pg_conn, app_context):
    """Migrate languages from PostgreSQL to MySQL using Flask-SQLAlchemy"""
    languages = get_pg_languages(pg_conn)
    if not languages:
        return
    
    # Add or update each language in MySQL
    added = 0
    updated = 0
    
    for lang_data in languages:
        code = lang_data['code']
        
        # Check if language exists
        lang = Language.query.get(code)
        
        # Set RTL flag for known RTL languages
        is_rtl = False
        if code in ['ar', 'he', 'fa', 'ur']:
            is_rtl = True
        
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
        
        if lang:
            # Update existing language
            lang.name = lang_data['name']
            lang.is_active = True
            lang.is_default = lang_data['is_default']
            
            if hasattr(Language, 'is_rtl'):
                lang.is_rtl = is_rtl
                
            if hasattr(Language, 'flag'):
                lang.flag = flag
            
            print(f"✅ Updated language: {code} - {lang_data['name']}")
            updated += 1
        else:
            # Create new language
            language_data = {
                'code': code,
                'name': lang_data['name'],
                'is_active': True,
                'is_default': lang_data['is_default']
            }
            
            if hasattr(Language, 'is_rtl'):
                language_data['is_rtl'] = is_rtl
                
            if hasattr(Language, 'flag'):
                language_data['flag'] = flag
                
            new_lang = Language(**language_data)
            db.session.add(new_lang)
            print(f"✅ Added language: {code} - {lang_data['name']}")
            added += 1
    
    # Commit changes
    db.session.commit()
    
    print("\nLanguage migration summary:")
    print(f"Added: {added}")
    print(f"Updated: {updated}")
    print(f"Total: {added + updated}")
    
    # Return list of available languages
    return [lang['code'] for lang in languages]

def get_or_create_user(app_context):
    """Get or create a default user for post authorship"""
    from app.models.user import User
    
    # Try to find an existing user
    user = User.query.first()
    
    if user:
        print(f"Using existing user with ID {user.id} as default author")
        return user.id
    
    # No users found, should not happen normally
    print("No users found in the database. Using ID 1 as default author.")
    return 1

def migrate_posts_translations(pg_conn, app_context, available_languages):
    """Migrate posts and their translations using Flask-SQLAlchemy"""
    pg_posts = get_pg_posts_translations(pg_conn)
    
    # Get default author ID
    default_author_id = get_or_create_user(app_context)
    
    posts_added = 0
    posts_updated = 0
    translations_added = 0
    translations_skipped = 0
    
    for post_data in pg_posts:
        slug = post_data['slug']
        
        # Check if post already exists
        existing_post = Post.query.filter_by(slug=slug).first()
        
        if existing_post:
            post = existing_post
            print(f"Post '{slug}' already exists with ID {post.id}")
            posts_updated += 1
        else:
            # Create new post
            try:
                post = Post(
                    slug=slug,
                    featured_image=post_data['featured_image'],
                    author_id=default_author_id,
                    status='published',
                    created_at=post_data['created_at'],
                    updated_at=post_data['updated_at'],
                    published_at=post_data['published_at']
                )
                db.session.add(post)
                db.session.flush()  # Get the ID without committing
                
                print(f"✅ Added post '{slug}' with ID {post.id}")
                posts_added += 1
            except Exception as e:
                print(f"❌ Error creating post '{slug}': {str(e)}")
                continue
        
        # Process translations
        for trans_data in post_data['translations']:
            lang_code = trans_data['language_code']
            
            # Skip if language not available
            if lang_code not in available_languages:
                print(f"⚠️ Language {lang_code} not available. Skipping translation for '{slug}'")
                translations_skipped += 1
                continue
            
            # Check if translation already exists
            existing_trans = PostTranslation.query.filter_by(
                post_id=post.id, 
                language_code=lang_code
            ).first()
            
            if existing_trans:
                print(f"Translation for '{slug}' in {lang_code} already exists. Skipping.")
                translations_skipped += 1
                continue
            
            # Add translation
            try:
                translation = PostTranslation(
                    post_id=post.id,
                    language_code=lang_code,
                    title=trans_data['title'],
                    content=trans_data['content'],
                    meta_title=trans_data['meta_title'],
                    meta_description=trans_data['meta_description'],
                    meta_keywords=trans_data['meta_keywords'],
                    is_auto_translated=trans_data['is_auto_translated'] if trans_data['is_auto_translated'] is not None else False,
                    last_updated_at=datetime.now()
                )
                db.session.add(translation)
                
                print(f"✅ Added {lang_code} translation for '{slug}'")
                translations_added += 1
                
                # Commit after each translation to avoid losing progress
                db.session.commit()
                
            except Exception as e:
                print(f"❌ Error adding {lang_code} translation for '{slug}': {str(e)}")
                db.session.rollback()
                translations_skipped += 1
    
    # Final commit
    try:
        db.session.commit()
    except Exception as e:
        print(f"❌ Error committing changes: {str(e)}")
        db.session.rollback()
    
    print("\nPosts migration summary:")
    print(f"Posts added: {posts_added}")
    print(f"Posts updated: {posts_updated}")
    print(f"Translations added: {translations_added}")
    print(f"Translations skipped: {translations_skipped}")

def main():
    """Main migration function"""
    print("Starting migration from PostgreSQL to MySQL using Flask application context...")
    
    # Create Flask app and get application context
    app = create_app()
    
    with app.app_context():
        # Connect to PostgreSQL
        pg_conn = connect_postgres()
        
        try:
            # Step 1: Migrate languages
            print("\n🔄 Step 1: Migrating languages...")
            available_languages = migrate_languages(pg_conn, app)
            
            # Step 2: Migrate posts and translations
            print("\n🔄 Step 2: Migrating posts and translations...")
            migrate_posts_translations(pg_conn, app, available_languages)
            
            print("\n✅ Migration completed successfully!")
            
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")
            import traceback
            traceback.print_exc()
        finally:
            pg_conn.close()

if __name__ == "__main__":
    main()