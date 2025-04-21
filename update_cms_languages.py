"""
Script to update CMS languages to match exactly with the website's supported languages
"""

import os
import sys
import pymysql
import json

# Setup direct database connection
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

def update_cms_languages():
    """Update languages in the database to match website's supported languages"""
    print("Starting CMS language update process...")
    
    # Connect to MySQL directly
    conn = connect_mysql()
    cursor = conn.cursor()
    
    # The supported languages in our application
    supported_languages = [
        {"code": "en", "name": "English", "flag": "🇬🇧", "active": True, "rtl": False},
        {"code": "fr", "name": "French", "flag": "🇫🇷", "active": True, "rtl": False},
        {"code": "es", "name": "Spanish", "flag": "🇪🇸", "active": True, "rtl": False},
        {"code": "de", "name": "German", "flag": "🇩🇪", "active": True, "rtl": False},
        {"code": "ru", "name": "Russian", "flag": "🇷🇺", "active": True, "rtl": False},
        {"code": "pt", "name": "Portuguese", "flag": "🇵🇹", "active": True, "rtl": False},
        {"code": "ja", "name": "Japanese", "flag": "🇯🇵", "active": True, "rtl": False},
        {"code": "ko", "name": "Korean", "flag": "🇰🇷", "active": True, "rtl": False},
        {"code": "ar", "name": "Arabic", "flag": "🇸🇦", "active": True, "rtl": True},
        {"code": "vi", "name": "Vietnamese", "flag": "🇻🇳", "active": True, "rtl": False},
        {"code": "th", "name": "Thai", "flag": "🇹🇭", "active": True, "rtl": False},
        {"code": "id", "name": "Indonesian", "flag": "🇮🇩", "active": True, "rtl": False},
        {"code": "ms", "name": "Malaysian", "flag": "🇲🇾", "active": True, "rtl": False},
        {"code": "nl", "name": "Dutch", "flag": "🇳🇱", "active": True, "rtl": False},
        {"code": "sv", "name": "Swedish", "flag": "🇸🇪", "active": True, "rtl": False},
        {"code": "zh-TW", "name": "Traditional Chinese", "flag": "🇹🇼", "active": True, "rtl": False},
        {"code": "it", "name": "Italian", "flag": "🇮🇹", "active": True, "rtl": False},
        {"code": "tr", "name": "Turkish", "flag": "🇹🇷", "active": True, "rtl": False},
        {"code": "hu", "name": "Hungarian", "flag": "🇭🇺", "active": True, "rtl": False},
        {"code": "pl", "name": "Polish", "flag": "🇵🇱", "active": True, "rtl": False},
    ]
    
    print(f"Processing {len(supported_languages)} supported languages...")
    
    # First, check if the language table exists in MySQL
    try:
        cursor.execute("SHOW TABLES LIKE 'cms_languages'")
        if cursor.fetchone() is None:
            print("Creating cms_languages table...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cms_languages (
                    code VARCHAR(10) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    is_active BOOLEAN NOT NULL DEFAULT TRUE,
                    is_default BOOLEAN NOT NULL DEFAULT FALSE,
                    is_rtl BOOLEAN NOT NULL DEFAULT FALSE,
                    flag VARCHAR(10)
                )
            """)
            conn.commit()
    except Exception as e:
        print(f"Error checking/creating language table: {str(e)}")
        return False
    
    # Track changes
    added = 0
    updated = 0
    unchanged = 0
    
    # Update or create each supported language
    for lang_data in supported_languages:
        code = lang_data["code"]
        
        # Check if language exists
        cursor.execute("SELECT * FROM cms_languages WHERE code = %s", (code,))
        lang = cursor.fetchone()
        
        if lang:
            # Update existing language
            changed = False
            if lang['name'] != lang_data["name"] or lang['is_rtl'] != lang_data["rtl"] or lang['flag'] != lang_data["flag"] or lang['is_active'] != lang_data["active"]:
                changed = True
                cursor.execute("""
                    UPDATE cms_languages 
                    SET name = %s, is_rtl = %s, flag = %s, is_active = %s
                    WHERE code = %s
                """, (lang_data["name"], lang_data["rtl"], lang_data["flag"], lang_data["active"], code))
            
            if changed:
                print(f"✏️ Updated language: {code} - {lang_data['name']}")
                updated += 1
            else:
                print(f"✓ Language already up-to-date: {code} - {lang_data['name']}")
                unchanged += 1
        else:
            # Create new language
            # Make English the default language
            is_default = True if code == 'en' else False
            
            cursor.execute("""
                INSERT INTO cms_languages (code, name, is_active, is_default, is_rtl, flag)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (code, lang_data["name"], lang_data["active"], is_default, lang_data["rtl"], lang_data["flag"]))
            
            print(f"➕ Added new language: {code} - {lang_data['name']}")
            added += 1
    
    # Commit all changes
    try:
        conn.commit()
        print("\nLanguage update completed successfully!")
        print(f"Summary:")
        print(f"  Added: {added}")
        print(f"  Updated: {updated}")
        print(f"  Unchanged: {unchanged}")
        print(f"  Total: {added + updated + unchanged}")
    except Exception as e:
        conn.rollback()
        print(f"Error committing changes: {str(e)}")
        return False
    finally:
        cursor.close()
        conn.close()
    
    return True

if __name__ == "__main__":
    update_cms_languages()