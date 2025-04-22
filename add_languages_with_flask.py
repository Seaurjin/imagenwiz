"""
Script to add all languages to the CMS using Flask application context

This script:
1. Creates a Flask application context
2. Uses SQLAlchemy to add languages directly to the database
"""

import os
import sys
import psycopg2
import psycopg2.extras
from datetime import datetime

# Add backend directory to system path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Import Flask app and models
from app import create_app, db
from app.models.cms import Language

# PostgreSQL connection details
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

def get_languages_from_postgres(pg_conn):
    """Get all languages from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    try:
        # Get all active languages
        cursor.execute("""
            SELECT code, name, is_active, is_default
            FROM cms_languages
            WHERE is_active = true
        """)
        
        languages = cursor.fetchall()
        print(f"Found {len(languages)} active languages in PostgreSQL")
        return languages
    
    except Exception as e:
        print(f"❌ Error fetching languages: {str(e)}")
        return []
    
    finally:
        cursor.close()

def add_languages_to_mysql(pg_languages, app_context):
    """Add languages to MySQL using Flask-SQLAlchemy"""
    
    # Get existing languages
    existing_langs = Language.query.all()
    existing_codes = [lang.code for lang in existing_langs]
    print(f"Found {len(existing_codes)} existing languages in MySQL: {', '.join(existing_codes)}")
    
    # Add or update languages
    added = 0
    updated = 0
    skipped = 0
    
    for lang_data in pg_languages:
        code = lang_data['code']
        name = lang_data['name']
        is_active = lang_data['is_active']
        is_default = lang_data['is_default']
        
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
        elif code == 'el': flag = '🇬🇷'
        
        # Check if language exists
        if code in existing_codes:
            try:
                # Update existing language
                lang = Language.query.get(code)
                lang.name = name
                lang.is_active = True
                lang.is_default = bool(is_default)
                
                if hasattr(lang, 'is_rtl'):
                    lang.is_rtl = is_rtl
                
                if hasattr(lang, 'flag'):
                    lang.flag = flag
                
                updated += 1
                print(f"✅ Updated language: {code} - {name}")
            except Exception as e:
                print(f"❌ Error updating language {code}: {str(e)}")
                skipped += 1
        else:
            try:
                # Create language data
                language_data = {
                    'code': code,
                    'name': name,
                    'is_active': True,
                    'is_default': bool(is_default)
                }
                
                if hasattr(Language, 'is_rtl'):
                    language_data['is_rtl'] = is_rtl
                
                if hasattr(Language, 'flag'):
                    language_data['flag'] = flag
                
                # Create new language
                new_lang = Language(**language_data)
                db.session.add(new_lang)
                
                added += 1
                print(f"✅ Added language: {code} - {name}")
            except Exception as e:
                print(f"❌ Error adding language {code}: {str(e)}")
                skipped += 1
    
    # Commit changes
    try:
        db.session.commit()
        
        print("\nLanguage migration summary:")
        print(f"Added: {added}")
        print(f"Updated: {updated}")
        print(f"Skipped: {skipped}")
        print(f"Total: {added + updated + skipped}")
        
        return True
    except Exception as e:
        print(f"❌ Error committing changes: {str(e)}")
        db.session.rollback()
        return False

def add_languages():
    """Add languages to the database using Flask application context"""
    print("Starting language migration...")
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        try:
            # Get languages from PostgreSQL
            pg_languages = get_languages_from_postgres(pg_conn)
            
            if pg_languages:
                # Add languages to MySQL
                add_languages_to_mysql(pg_languages, app)
                print("✅ Languages migration completed!")
            else:
                print("❌ No languages found in PostgreSQL. Migration aborted.")
        
        except Exception as e:
            print(f"❌ Error during migration: {str(e)}")
            import traceback
            traceback.print_exc()
        
        finally:
            # Close connections
            pg_conn.close()

if __name__ == "__main__":
    add_languages()