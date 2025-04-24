"""
Direct migration script to add flag column to cms_languages table
"""
import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def execute_migration():
    """Add flag column to cms_languages table and update existing languages with flags"""
    
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
    
    try:
        with conn.cursor() as cursor:
            # Check if flag column exists
            cursor.execute("SHOW COLUMNS FROM `cms_languages` LIKE 'flag'")
            column_exists = cursor.fetchone() is not None
            
            if not column_exists:
                print("Adding flag column to cms_languages table...")
                cursor.execute("ALTER TABLE `cms_languages` ADD COLUMN `flag` VARCHAR(10)")
                conn.commit()
                print("Flag column added successfully")
            else:
                print("Flag column already exists, skipping table modification")
            
            # Define flag emojis for each language code
            flag_updates = [
                ("en", "🇬🇧"), ("fr", "🇫🇷"), ("es", "🇪🇸"), ("de", "🇩🇪"), ("it", "🇮🇹"),
                ("pt", "🇵🇹"), ("ru", "🇷🇺"), ("ja", "🇯🇵"), ("ko", "🇰🇷"), ("zh-TW", "🇹🇼"),
                ("ar", "🇸🇦"), ("nl", "🇳🇱"), ("sv", "🇸🇪"), ("tr", "🇹🇷"), ("pl", "🇵🇱"),
                ("hu", "🇭🇺"), ("el", "🇬🇷"), ("no", "🇳🇴"), ("vi", "🇻🇳"), ("th", "🇹🇭"),
                ("id", "🇮🇩"), ("ms", "🇲🇾"), ("bg", "🇧🇬"), ("ca", "🇪🇸"), ("cs", "🇨🇿"),
                ("da", "🇩🇰"), ("fi", "🇫🇮"), ("he", "🇮🇱"), ("hi", "🇮🇳"), ("ro", "🇷🇴"),
                ("sk", "🇸🇰"), ("uk", "🇺🇦"), ("zh-CN", "🇨🇳")
            ]
            
            # Update flags for existing languages
            print("Updating language flags...")
            updated_count = 0
            for code, flag in flag_updates:
                cursor.execute(
                    "UPDATE `cms_languages` SET flag = %s WHERE code = %s AND (flag IS NULL OR flag = '')",
                    (flag, code)
                )
                updated_count += cursor.rowcount
            
            conn.commit()
            print(f"Updated {updated_count} language records with flag values")
            
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
        print("\nMigration completed successfully!")
    else:
        print("\nMigration failed.")