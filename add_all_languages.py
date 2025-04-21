"""
Script to add all languages to the CMS

This script directly connects to the PostgreSQL database to get all languages
and registers them in MySQL.
"""

import os
import sys
import pymysql
import psycopg2
import psycopg2.extras

# MySQL connection details
MYSQL_HOST = "8.130.113.102" 
MYSQL_PORT = 3306
MYSQL_DATABASE = "mat_db"
MYSQL_USER = "root"
MYSQL_PASSWORD = "Ir%2586241992"

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

def connect_mysql():
    """Connect to MySQL database"""
    try:
        conn = pymysql.connect(
            host=MYSQL_HOST,
            port=MYSQL_PORT,
            database=MYSQL_DATABASE,
            user=MYSQL_USER,
            password=MYSQL_PASSWORD,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print(f"✅ Connected to MySQL: {MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}")
        return conn
    except Exception as e:
        print(f"❌ Failed to connect to MySQL: {str(e)}")
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

def add_languages_to_mysql(mysql_conn, languages):
    """Add languages to MySQL database"""
    cursor = mysql_conn.cursor()
    
    try:
        # Check if languages table exists
        cursor.execute("SHOW TABLES LIKE 'cms_languages'")
        if not cursor.fetchone():
            print("Creating cms_languages table...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS cms_languages (
                    code VARCHAR(10) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    is_active TINYINT(1) NOT NULL DEFAULT 1,
                    is_default TINYINT(1) NOT NULL DEFAULT 0,
                    is_rtl TINYINT(1) NOT NULL DEFAULT 0,
                    flag VARCHAR(10)
                )
            """)
            mysql_conn.commit()
    
        # Get existing languages
        cursor.execute("SELECT code FROM cms_languages")
        existing_langs = [row['code'] for row in cursor.fetchall()]
        print(f"Found {len(existing_langs)} existing languages in MySQL: {', '.join(existing_langs)}")
        
        # Add or update languages
        added = 0
        updated = 0
        skipped = 0
        
        for lang in languages:
            code = lang['code']
            name = lang['name']
            is_active = lang['is_active']
            is_default = lang['is_default']
            
            # Set RTL flag for known RTL languages
            is_rtl = 1 if code in ['ar', 'he', 'fa', 'ur'] else 0
            
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
            
            if code in existing_langs:
                try:
                    cursor.execute("""
                        UPDATE cms_languages 
                        SET name = %s, is_active = %s, is_default = %s, is_rtl = %s, flag = %s
                        WHERE code = %s
                    """, (name, 1 if is_active else 0, 1 if is_default else 0, is_rtl, flag, code))
                    updated += 1
                    print(f"✅ Updated language: {code} - {name}")
                except Exception as e:
                    print(f"❌ Error updating language {code}: {str(e)}")
                    skipped += 1
            else:
                try:
                    cursor.execute("""
                        INSERT INTO cms_languages 
                        (code, name, is_active, is_default, is_rtl, flag)
                        VALUES (%s, %s, %s, %s, %s, %s)
                    """, (code, name, 1 if is_active else 0, 1 if is_default else 0, is_rtl, flag))
                    added += 1
                    print(f"✅ Added language: {code} - {name}")
                except Exception as e:
                    print(f"❌ Error adding language {code}: {str(e)}")
                    skipped += 1
        
        mysql_conn.commit()
        
        print("\nLanguage migration summary:")
        print(f"Added: {added}")
        print(f"Updated: {updated}")
        print(f"Skipped: {skipped}")
        print(f"Total: {added + updated + skipped}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        mysql_conn.rollback()
    
    finally:
        cursor.close()

def add_languages():
    """Add languages to the database using direct SQL queries"""
    print("Starting language migration...")
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    # Connect to MySQL
    mysql_conn = connect_mysql()
    
    try:
        # Get languages from PostgreSQL
        languages = get_languages_from_postgres(pg_conn)
        
        if languages:
            # Add languages to MySQL
            add_languages_to_mysql(mysql_conn, languages)
            print("✅ Languages migration completed!")
        else:
            print("❌ No languages found in PostgreSQL. Migration aborted.")
    
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
    
    finally:
        # Close connections
        pg_conn.close()
        mysql_conn.close()

if __name__ == "__main__":
    add_languages()