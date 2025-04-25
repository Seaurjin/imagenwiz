#!/usr/bin/env python
"""
Setup script to ensure the MySQL database has all required languages
with proper RTL settings and flag emojis
"""

import os
import sys
import pymysql
import time

# MySQL connection parameters
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')

# Define languages to ensure are in the database
LANGUAGES = [
    {'code': 'ar', 'name': 'Arabic', 'is_rtl': True, 'flag': '🇸🇦'},
    {'code': 'de', 'name': 'German', 'is_rtl': False, 'flag': '🇩🇪'},
    {'code': 'el', 'name': 'Greek', 'is_rtl': False, 'flag': '🇬🇷'},
    {'code': 'en', 'name': 'English', 'is_rtl': False, 'flag': '🇬🇧'},
    {'code': 'es', 'name': 'Spanish', 'is_rtl': False, 'flag': '🇪🇸'},
    {'code': 'fr', 'name': 'French', 'is_rtl': False, 'flag': '🇫🇷'},
    {'code': 'hu', 'name': 'Hungarian', 'is_rtl': False, 'flag': '🇭🇺'},
    {'code': 'id', 'name': 'Indonesian', 'is_rtl': False, 'flag': '🇮🇩'},
    {'code': 'it', 'name': 'Italian', 'is_rtl': False, 'flag': '🇮🇹'},
    {'code': 'ja', 'name': 'Japanese', 'is_rtl': False, 'flag': '🇯🇵'},
    {'code': 'ko', 'name': 'Korean', 'is_rtl': False, 'flag': '🇰🇷'},
    {'code': 'ms', 'name': 'Malay', 'is_rtl': False, 'flag': '🇲🇾'},
    {'code': 'nl', 'name': 'Dutch', 'is_rtl': False, 'flag': '🇳🇱'},
    {'code': 'no', 'name': 'Norwegian', 'is_rtl': False, 'flag': '🇳🇴'},
    {'code': 'pl', 'name': 'Polish', 'is_rtl': False, 'flag': '🇵🇱'},
    {'code': 'pt', 'name': 'Portuguese', 'is_rtl': False, 'flag': '🇵🇹'},
    {'code': 'ru', 'name': 'Russian', 'is_rtl': False, 'flag': '🇷🇺'},
    {'code': 'sv', 'name': 'Swedish', 'is_rtl': False, 'flag': '🇸🇪'},
    {'code': 'th', 'name': 'Thai', 'is_rtl': False, 'flag': '🇹🇭'},
    {'code': 'tr', 'name': 'Turkish', 'is_rtl': False, 'flag': '🇹🇷'},
    {'code': 'vi', 'name': 'Vietnamese', 'is_rtl': False, 'flag': '🇻🇳'},
    {'code': 'zh-TW', 'name': 'Traditional Chinese', 'is_rtl': False, 'flag': '🇹🇼'},
    {'code': 'he', 'name': 'Hebrew', 'is_rtl': True, 'flag': '🇮🇱'},
    {'code': 'fa', 'name': 'Persian', 'is_rtl': True, 'flag': '🇮🇷'},
    {'code': 'ur', 'name': 'Urdu', 'is_rtl': True, 'flag': '🇵🇰'}
]

def setup_languages():
    """Ensure all languages exist in the database with correct settings"""
    print("\n=================================================")
    print("Setting up languages in MySQL database")
    print("=================================================\n")
    
    start_time = time.time()
    
    try:
        # Connect to MySQL
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        print(f"✅ Connected to MySQL: {DB_HOST}:{DB_PORT}/{DB_NAME}")
        
        cursor = conn.cursor()
        
        # Check if the is_rtl column exists
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s 
              AND TABLE_NAME = 'cms_languages'
              AND COLUMN_NAME = 'is_rtl'
        """, (DB_NAME,))
        
        if not cursor.fetchone():
            print("⚠️ is_rtl column missing, adding it...")
            cursor.execute("""
                ALTER TABLE cms_languages 
                ADD COLUMN is_rtl TINYINT(1) DEFAULT 0
            """)
            print("✅ Added is_rtl column")
        
        # Get existing languages
        cursor.execute("SELECT code FROM cms_languages")
        existing_languages = [row[0] for row in cursor.fetchall()]
        print(f"Found {len(existing_languages)} existing languages")
        
        # Update or insert languages
        languages_added = 0
        languages_updated = 0
        
        for lang in LANGUAGES:
            if lang['code'] in existing_languages:
                # Update existing language
                cursor.execute("""
                    UPDATE cms_languages
                    SET name = %s,
                        is_rtl = %s,
                        flag = %s,
                        is_active = 1
                    WHERE code = %s
                """, (
                    lang['name'],
                    1 if lang['is_rtl'] else 0,
                    lang['flag'],
                    lang['code']
                ))
                languages_updated += 1
            else:
                # Insert new language
                cursor.execute("""
                    INSERT INTO cms_languages (code, name, is_rtl, flag, is_active, is_default)
                    VALUES (%s, %s, %s, %s, 1, %s)
                """, (
                    lang['code'],
                    lang['name'],
                    1 if lang['is_rtl'] else 0,
                    lang['flag'],
                    1 if lang['code'] == 'en' else 0
                ))
                languages_added += 1
        
        # Ensure English is the default language
        cursor.execute("""
            UPDATE cms_languages
            SET is_default = CASE WHEN code = 'en' THEN 1 ELSE 0 END
        """)
        
        # Commit changes
        conn.commit()
        
        # Display the updated languages
        cursor.execute("""
            SELECT code, name, is_rtl, flag, is_default
            FROM cms_languages
            ORDER BY code
        """)
        
        languages = cursor.fetchall()
        
        print("\nLANGUAGES IN DATABASE:")
        print("-" * 70)
        print(f"{'Code':<10} {'Name':<25} {'RTL':<5} {'Default':<8} {'Flag':<5}")
        print("-" * 70)
        
        for lang in languages:
            print(f"{lang[0]:<10} {lang[1]:<25} {'Yes' if lang[2] else 'No':<5} {'Yes' if lang[4] else 'No':<8} {lang[3] if lang[3] else '':<5}")
        
        print("\nSUMMARY:")
        print(f"Languages added: {languages_added}")
        print(f"Languages updated: {languages_updated}")
        print(f"Total languages in database: {len(languages)}")
        
        # Close database connection
        cursor.close()
        conn.close()
        
        end_time = time.time()
        print(f"\n✅ Language setup completed in {round(end_time - start_time, 2)} seconds")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if 'conn' in locals():
            conn.rollback()
        return False

if __name__ == "__main__":
    success = setup_languages()
    sys.exit(0 if success else 1)