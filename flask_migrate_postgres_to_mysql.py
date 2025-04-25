"""
PostgreSQL to MySQL migration using Flask application context

This script:
1. Creates a Flask application context
2. Uses the Flask app's database connection to access MySQL
3. Connects to PostgreSQL directly
4. Migrates data from PostgreSQL to MySQL

This approach ensures we use the same database connection that works
with the Flask app, avoiding connection issues.
"""

import os
import sys
import time
import psycopg2
import psycopg2.extras
from datetime import datetime

# Set MySQL environment variables - UPDATED with corrected credentials
os.environ['DB_HOST'] = '8.130.113.102'
os.environ['DB_PORT'] = '3306'
os.environ['DB_NAME'] = 'mat_db'
os.environ['DB_USER'] = 'root'
os.environ['DB_PASSWORD'] = 'Ir%86241992'  # FIXED: Corrected password

# Set up Flask application context
# Try different import paths to find the Flask app
import importlib.util
import inspect

# Add possible paths to sys.path
sys.path.append('.')
sys.path.append('./backend')
sys.path.append('./backend/app')

def find_module(module_paths):
    """Try to import a module from multiple possible paths"""
    for module_path in module_paths:
        try:
            if '.' in module_path:
                # For dotted paths
                module = importlib.import_module(module_path)
            else:
                # For file paths
                spec = importlib.util.spec_from_file_location("module", module_path)
                if spec:
                    module = importlib.util.module_from_spec(spec)
                    spec.loader.exec_module(module)
                else:
                    continue
            return module
        except (ImportError, FileNotFoundError) as e:
            print(f"Failed to import {module_path}: {e}")
    return None

# Try to find app modules
app_module = find_module([
    'backend.app', 
    'app', 
    './backend/app/__init__.py',
    './app/__init__.py'
])

if not app_module or not hasattr(app_module, 'create_app'):
    print("❌ Failed to find Flask create_app function. Make sure you're running this script from the project root.")
    print("Current directory:", os.getcwd())
    print("Files in current directory:", os.listdir('.'))
    print("Files in backend directory (if exists):", os.listdir('./backend') if os.path.exists('./backend') else "Directory doesn't exist")
    sys.exit(1)

# Get create_app function and db
create_app = app_module.create_app
db = app_module.db
print("✅ Imported Flask app and db")

# Try to find model modules
from backend.app.models.cms import Language, Post, PostTranslation
print("✅ Imported Flask models")

# PostgreSQL connection details (from environment)
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

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

def migrate_languages(pg_conn, app):
    """Migrate languages from PostgreSQL to MySQL using Flask-SQLAlchemy"""
    pg_languages = get_pg_languages(pg_conn)
    
    with app.app_context():
        # Get existing languages from MySQL
        existing_langs = Language.query.all()
        existing_codes = [lang.code for lang in existing_langs]
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
            
            # Check if language exists
            existing_lang = Language.query.filter_by(code=code).first()
            
            if existing_lang:
                # Update existing language
                existing_lang.name = name
                existing_lang.is_active = True if is_active else False
                existing_lang.is_default = True if is_default else False
                db.session.commit()
                updated += 1
                print(f"✅ Updated language: {code} - {name}")
            else:
                try:
                    # Set RTL flag for known RTL languages
                    is_rtl = True if code in ['ar', 'he', 'fa', 'ur'] else False
                    
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
                    
                    # Create new language
                    new_lang = Language(
                        code=code,
                        name=name,
                        is_active=True if is_active else False,
                        is_default=True if is_default else False,
                        is_rtl=is_rtl,
                        flag=flag
                    )
                    db.session.add(new_lang)
                    db.session.commit()
                    added += 1
                    print(f"✅ Added language: {code} - {name}")
                except Exception as e:
                    print(f"❌ Error adding language {code}: {str(e)}")
        
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

def migrate_posts_translations(pg_conn, app):
    """Migrate posts and their translations from PostgreSQL to MySQL using Flask-SQLAlchemy"""
    pg_posts = get_pg_posts_translations(pg_conn)
    
    with app.app_context():
        # Get default author ID
        from backend.app.models.models import User
        default_author = User.query.first()
        if default_author:
            default_author_id = default_author.id
            print(f"Using author ID {default_author_id} for posts without author")
        else:
            print(f"❌ No users found in the database")
            return False
        
        # Get available languages
        available_langs = Language.query.all()
        available_lang_codes = [lang.code for lang in available_langs]
        print(f"Available languages in MySQL: {', '.join(available_lang_codes)}")
        
        posts_added = 0
        posts_updated = 0
        posts_skipped = 0
        translations_added = 0
        translations_skipped = 0
        
        for post in pg_posts:
            post_slug = post['slug']
            
            # Check if post already exists
            existing_post = Post.query.filter_by(slug=post_slug).first()
            
            if existing_post:
                print(f"Post {post_slug} already exists in MySQL with ID {existing_post.id}")
                posts_updated += 1
                mysql_post_id = existing_post.id
            else:
                # Create post
                try:
                    now = datetime.now()
                    
                    new_post = Post(
                        slug=post_slug,
                        featured_image=post['featured_image'],
                        author_id=post['author_id'] if post['author_id'] else default_author_id,
                        status=post['status'],
                        created_at=post['created_at'] if post['created_at'] else now,
                        updated_at=post['updated_at'] if post['updated_at'] else now,
                        published_at=post['published_at'] if post['published_at'] else now
                    )
                    db.session.add(new_post)
                    db.session.commit()
                    mysql_post_id = new_post.id
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
                if lang_code not in available_lang_codes:
                    print(f"⚠️ Language {lang_code} not available in MySQL. Skipping translation for {post_slug}.")
                    translations_skipped += 1
                    continue
                
                # Skip if translation already exists
                existing_translation = PostTranslation.query.filter_by(
                    post_id=mysql_post_id, 
                    language_code=lang_code
                ).first()
                
                if existing_translation:
                    print(f"Translation for {post_slug} in {lang_code} already exists. Skipping.")
                    translations_skipped += 1
                    continue
                
                try:
                    now = datetime.now()
                    
                    new_translation = PostTranslation(
                        post_id=mysql_post_id,
                        language_code=lang_code,
                        title=translation['title'],
                        content=translation['content'],
                        meta_title=translation['meta_title'],
                        meta_description=translation['meta_description'],
                        meta_keywords=translation['meta_keywords'],
                        is_auto_translated=translation['is_auto_translated'] if translation['is_auto_translated'] is not None else False,
                        last_updated_at=now
                    )
                    
                    db.session.add(new_translation)
                    db.session.commit()
                    print(f"✅ Added {lang_code} translation for post {post_slug}")
                    translations_added += 1
                    
                except Exception as e:
                    print(f"❌ Error adding {lang_code} translation for post {post_slug}: {str(e)}")
                    translations_skipped += 1
        
        print("\nPosts migration summary:")
        print(f"Posts added: {posts_added}")
        print(f"Posts updated: {posts_updated}")
        print(f"Posts skipped: {posts_skipped}")
        print(f"Translations added: {translations_added}")
        print(f"Translations skipped: {translations_skipped}")
        
        return True

def main():
    """Main migration function"""
    print("Starting migration from PostgreSQL to MySQL using Flask app context...")
    
    # Create Flask app
    app = create_app()
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    try:
        # Step 1: Migrate languages
        print("\n🔄 Step 1: Migrating languages...")
        if not migrate_languages(pg_conn, app):
            print("❌ Failed to migrate languages")
            return False
            
        # Step 2: Migrate posts and translations
        print("\n🔄 Step 2: Migrating posts and translations...")
        if not migrate_posts_translations(pg_conn, app):
            print("❌ Failed to migrate posts and translations")
            return False
            
        print("\n✅ Migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Migration failed with error: {str(e)}")
        return False
    finally:
        pg_conn.close()
        print("PostgreSQL connection closed")

if __name__ == "__main__":
    main()