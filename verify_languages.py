"""
Script to verify languages directly from the database
"""
import os
import pymysql
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def verify_languages():
    """Verify languages directly from the database"""
    
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
            # Get all languages
            cursor.execute("SELECT code, name, flag FROM `cms_languages` ORDER BY code")
            languages = cursor.fetchall()
            
            print(f"\nLanguages in database ({len(languages)} total):")
            for lang in languages:
                print(f"{lang['code']}: {lang['name']} {lang['flag'] or '(no flag)'}")
            
            return len(languages)
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        conn.close()

if __name__ == "__main__":
    count = verify_languages()
    print(f"\nFound {count} languages in the database")
    if count == 33:
        print("SUCCESS: All 33 languages are in the database!")
    else:
        print(f"ISSUE: Only {count} languages are in the database, should be 33")