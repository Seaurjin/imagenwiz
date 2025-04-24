"""
Script to clean up CMS languages to keep only the 22 website languages
"""
import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def trim_languages():
    """Trim languages to keep only the 22 website languages"""
    
    # Get MySQL credentials from environment variables
    mysql_user = os.environ.get('DB_USER', 'root')
    mysql_password = os.environ.get('DB_PASSWORD', 'Ir%2586241992')
    mysql_host = os.environ.get('DB_HOST', '8.130.113.102')
    mysql_db = os.environ.get('DB_NAME', 'mat_db')
    mysql_port = int(os.environ.get('DB_PORT', '3306'))
    
    print(f"Connecting to MySQL: {mysql_user}@{mysql_host}:{mysql_port}/{mysql_db}")
    
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
    
    # Website languages - the 22 languages to keep
    website_languages = [
        'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW',
        'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
    ]
    
    try:
        with conn.cursor() as cursor:
            # Get all current languages
            cursor.execute("SELECT code, name, flag FROM `cms_languages`")
            current_languages = cursor.fetchall()
            
            print(f"\nCurrent languages in database ({len(current_languages)} total):")
            for lang in current_languages:
                print(f"{lang['code']}: {lang['name']} {lang['flag'] or '(no flag)'}")
            
            # Identify languages to remove (not in website_languages list)
            languages_to_remove = [lang for lang in current_languages if lang['code'] not in website_languages]
            
            if languages_to_remove:
                print(f"\nRemoving {len(languages_to_remove)} languages:")
                for lang in languages_to_remove:
                    print(f"{lang['code']}: {lang['name']} {lang['flag'] or '(no flag)'}")
                    
                    # Delete the language
                    cursor.execute("DELETE FROM `cms_languages` WHERE code = %s", (lang['code'],))
                
                # Commit changes
                conn.commit()
                print(f"Successfully removed {len(languages_to_remove)} languages")
            else:
                print("No languages need to be removed")
                
            # Verify final languages
            cursor.execute("SELECT code, name, flag FROM `cms_languages` ORDER BY code")
            final_languages = cursor.fetchall()
            
            print(f"\nFinal languages in database ({len(final_languages)} total):")
            for lang in final_languages:
                print(f"{lang['code']}: {lang['name']} {lang['flag'] or '(no flag)'}")
            
            return len(final_languages)
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        conn.close()

if __name__ == "__main__":
    count = trim_languages()
    print(f"\nKept {count} languages in the database")
    if count == 22:
        print("SUCCESS: Database now has exactly 22 website languages!")
    else:
        print(f"ISSUE: Database has {count} languages, should be 22")