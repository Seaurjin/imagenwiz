"""
Script to fix the migration of languages from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to get languages
2. Connects to MySQL for the target
3. Updates languages considering the actual schema
"""

import os
import psycopg2
import psycopg2.extras
import pymysql

# MySQL connection parameters
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST', 'ep-noisy-glade-a6vbi1rt.us-west-2.aws.neon.tech')
PG_PORT = os.environ.get('PGPORT', '5432')
PG_DATABASE = os.environ.get('PGDATABASE', 'neondb')
PG_USER = os.environ.get('PGUSER', 'neondb_owner')
PG_PASSWORD = os.environ.get('PGPASSWORD', 'npg_lxsVTN71pZgG')

def connect_postgres():
    """Connect to PostgreSQL database"""
    try:
        conn = psycopg2.connect(
            host=PG_HOST,
            port=PG_PORT,
            dbname=PG_DATABASE,
            user=PG_USER,
            password=PG_PASSWORD
        )
        print(f"✅ Connected to PostgreSQL: {PG_HOST}:{PG_PORT}/{PG_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to PostgreSQL: {str(e)}")
        return None

def connect_mysql():
    """Connect to MySQL database"""
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        print(f"✅ Connected to MySQL: {DB_HOST}:{DB_PORT}/{DB_NAME}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {str(e)}")
        return None

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

def migrate_languages(pg_languages, mysql_conn):
    """Migrate languages from PostgreSQL to MySQL"""
    cursor = mysql_conn.cursor()
    
    try:
        # Get existing languages from MySQL
        cursor.execute("SELECT code FROM cms_languages")
        existing_codes = [row[0] for row in cursor.fetchall()]
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
            
            if code in existing_codes:
                # Update existing language
                cursor.execute("""
                UPDATE cms_languages 
                SET 
                    name = %s, 
                    is_active = %s, 
                    is_default = %s,
                    flag = %s
                WHERE code = %s
                """, (
                    name, 
                    1 if is_active else 0, 
                    1 if is_default else 0,
                    flag,
                    code
                ))
                updated += 1
                print(f"✅ Updated language: {code} - {name}")
            else:
                # Insert new language
                cursor.execute("""
                INSERT INTO cms_languages (code, name, is_active, is_default, flag)
                VALUES (%s, %s, %s, %s, %s)
                """, (
                    code, 
                    name, 
                    1 if is_active else 0, 
                    1 if is_default else 0,
                    flag
                ))
                added += 1
                print(f"✅ Added language: {code} - {name}")
        
        mysql_conn.commit()
        
        print("\nLanguage migration summary:")
        print(f"Added: {added}")
        print(f"Updated: {updated}")
        print(f"Skipped: {skipped}")
        print(f"Total: {added + updated + skipped}")
        
        return True
    except Exception as e:
        print(f"❌ Error migrating languages: {str(e)}")
        mysql_conn.rollback()
        return False
    finally:
        cursor.close()

def main():
    """Main migration function"""
    print("\n=================================================")
    print("Starting language migration from PostgreSQL to MySQL")
    print("=================================================\n")
    
    # Connect to databases
    pg_conn = connect_postgres()
    if not pg_conn:
        print("❌ Failed to connect to PostgreSQL. Aborting migration.")
        return False
    
    mysql_conn = connect_mysql()
    if not mysql_conn:
        print("❌ Failed to connect to MySQL. Aborting migration.")
        pg_conn.close()
        return False
    
    try:
        # Get languages from PostgreSQL
        pg_languages = get_pg_languages(pg_conn)
        if not pg_languages:
            print("❌ Failed to get languages from PostgreSQL. Aborting migration.")
            return False
        
        # Migrate languages
        print("\nMigrating languages...")
        if not migrate_languages(pg_languages, mysql_conn):
            print("❌ Failed to migrate languages.")
            return False
        
        print("\n✅ Language migration completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Unexpected error during migration: {str(e)}")
        return False
    finally:
        # Close database connections
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    main()