"""
Script to add all missing languages to the cms_languages table
"""
import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def execute_migration():
    """Add all missing languages to cms_languages table"""
    
    # Get MySQL credentials from environment variables
    mysql_user = os.environ.get('DB_USER', 'root')
    mysql_password = os.environ.get('DB_PASSWORD', 'Ir%2586241992')
    mysql_host = os.environ.get('DB_HOST', '8.130.113.102')
    mysql_db = os.environ.get('DB_NAME', 'mat_db')
    mysql_port = int(os.environ.get('DB_PORT', '3306'))
    
    print(f"Connecting to MySQL: {mysql_user}@{mysql_host}:{mysql_port}/{mysql_db}")
    
    # Define all languages with their flags
    all_languages = [
        {"code": "en", "name": "English", "is_active": True, "is_default": True, "flag": "🇬🇧"},
        {"code": "fr", "name": "French", "is_active": True, "is_default": False, "flag": "🇫🇷"},
        {"code": "es", "name": "Spanish", "is_active": True, "is_default": False, "flag": "🇪🇸"},
        {"code": "de", "name": "German", "is_active": True, "is_default": False, "flag": "🇩🇪"},
        {"code": "it", "name": "Italian", "is_active": True, "is_default": False, "flag": "🇮🇹"},
        {"code": "pt", "name": "Portuguese", "is_active": True, "is_default": False, "flag": "🇵🇹"},
        {"code": "ru", "name": "Russian", "is_active": True, "is_default": False, "flag": "🇷🇺"},
        {"code": "ja", "name": "Japanese", "is_active": True, "is_default": False, "flag": "🇯🇵"},
        {"code": "ko", "name": "Korean", "is_active": True, "is_default": False, "flag": "🇰🇷"},
        {"code": "zh-TW", "name": "Traditional Chinese", "is_active": True, "is_default": False, "flag": "🇹🇼"},
        {"code": "ar", "name": "Arabic", "is_active": True, "is_default": False, "flag": "🇸🇦"},
        {"code": "nl", "name": "Dutch", "is_active": True, "is_default": False, "flag": "🇳🇱"},
        {"code": "sv", "name": "Swedish", "is_active": True, "is_default": False, "flag": "🇸🇪"},
        {"code": "tr", "name": "Turkish", "is_active": True, "is_default": False, "flag": "🇹🇷"},
        {"code": "pl", "name": "Polish", "is_active": True, "is_default": False, "flag": "🇵🇱"},
        {"code": "hu", "name": "Hungarian", "is_active": True, "is_default": False, "flag": "🇭🇺"},
        {"code": "el", "name": "Greek", "is_active": True, "is_default": False, "flag": "🇬🇷"},
        {"code": "no", "name": "Norwegian", "is_active": True, "is_default": False, "flag": "🇳🇴"},
        {"code": "vi", "name": "Vietnamese", "is_active": True, "is_default": False, "flag": "🇻🇳"},
        {"code": "th", "name": "Thai", "is_active": True, "is_default": False, "flag": "🇹🇭"},
        {"code": "id", "name": "Indonesian", "is_active": True, "is_default": False, "flag": "🇮🇩"},
        {"code": "ms", "name": "Malay", "is_active": True, "is_default": False, "flag": "🇲🇾"},
        {"code": "zh-CN", "name": "Simplified Chinese", "is_active": True, "is_default": False, "flag": "🇨🇳"},
        {"code": "bg", "name": "Bulgarian", "is_active": True, "is_default": False, "flag": "🇧🇬"},
        {"code": "ca", "name": "Catalan", "is_active": True, "is_default": False, "flag": "🇪🇸"},
        {"code": "cs", "name": "Czech", "is_active": True, "is_default": False, "flag": "🇨🇿"},
        {"code": "da", "name": "Danish", "is_active": True, "is_default": False, "flag": "🇩🇰"},
        {"code": "fi", "name": "Finnish", "is_active": True, "is_default": False, "flag": "🇫🇮"},
        {"code": "he", "name": "Hebrew", "is_active": True, "is_default": False, "flag": "🇮🇱"},
        {"code": "hi", "name": "Hindi", "is_active": True, "is_default": False, "flag": "🇮🇳"},
        {"code": "ro", "name": "Romanian", "is_active": True, "is_default": False, "flag": "🇷🇴"},
        {"code": "sk", "name": "Slovak", "is_active": True, "is_default": False, "flag": "🇸🇰"},
        {"code": "uk", "name": "Ukrainian", "is_active": True, "is_default": False, "flag": "🇺🇦"}
    ]
    
    # Connect to MySQL database
    conn = pymysql.connect(
        host=mysql_host,
        user=mysql_user,
        password=mysql_password,
        database=mysql_db,
        port=mysql_port,
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )
    
    try:
        with conn.cursor() as cursor:
            # Get existing languages
            cursor.execute("SELECT code FROM `cms_languages`")
            existing_languages = [lang['code'] for lang in cursor.fetchall()]
            print(f"Found {len(existing_languages)} existing languages: {', '.join(existing_languages)}")
            
            # Add missing languages
            added_count = 0
            for lang in all_languages:
                if lang['code'] not in existing_languages:
                    print(f"Adding language: {lang['code']} - {lang['name']}")
                    cursor.execute(
                        "INSERT INTO `cms_languages` (code, name, is_default, is_active, flag) VALUES (%s, %s, %s, %s, %s)",
                        (lang['code'], lang['name'], lang['is_default'], lang['is_active'], lang['flag'])
                    )
                    added_count += 1
            
            conn.commit()
            print(f"Added {added_count} new languages")
            
            # Verify the updates
            cursor.execute("SELECT code, name, flag FROM `cms_languages` ORDER BY code")
            languages = cursor.fetchall()
            print(f"\nLanguages in database ({len(languages)} total):")
            for lang in languages:
                print(f"{lang['code']}: {lang['name']} {lang['flag'] or '(no flag)'}")
            
            return True
                
    except Exception as e:
        print(f"Error executing migration: {e}")
        conn.rollback()
        return False
    finally:
        conn.close()

if __name__ == "__main__":
    success = execute_migration()
    if success:
        print("\nLanguage addition completed successfully!")
    else:
        print("\nLanguage addition failed.")