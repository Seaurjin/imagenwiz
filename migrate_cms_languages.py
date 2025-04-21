"""
Script to migrate languages from PostgreSQL to MySQL

This script:
1. Connects to PostgreSQL to get all languages
2. Adds them to MySQL
"""

import os
import pymysql
import psycopg2
import psycopg2.extras

def connect_postgres():
    """Connect to PostgreSQL database"""
    return psycopg2.connect(
        host=os.environ.get('PGHOST'),
        port=os.environ.get('PGPORT'),
        database=os.environ.get('PGDATABASE'),
        user=os.environ.get('PGUSER'),
        password=os.environ.get('PGPASSWORD')
    )

def get_languages_from_postgres(pg_conn):
    """Get all languages from PostgreSQL"""
    cursor = pg_conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # First check which columns exist in the table
    cursor.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'cms_languages'
    """)
    columns = [col[0] for col in cursor.fetchall()]
    print(f"Available columns in PostgreSQL cms_languages: {', '.join(columns)}")
    
    # Build query based on available columns
    query = "SELECT code, name, is_active, is_default"
    if 'is_rtl' in columns:
        query += ", is_rtl"
    else:
        print("Note: 'is_rtl' column doesn't exist in PostgreSQL")
        
    if 'flag' in columns:
        query += ", flag"
    else:
        print("Note: 'flag' column doesn't exist in PostgreSQL")
        
    query += " FROM cms_languages"
    
    cursor.execute(query)
    languages_data = cursor.fetchall()
    
    # Convert to a list of dictionaries with consistent keys
    languages = []
    for lang in languages_data:
        lang_dict = {
            'code': lang['code'],
            'name': lang['name'],
            'is_active': lang['is_active'],
            'is_default': lang['is_default'],
            'is_rtl': lang.get('is_rtl', False) if 'is_rtl' in columns else False,
            'flag': lang.get('flag', None) if 'flag' in columns else None
        }
        languages.append(lang_dict)
    
    cursor.close()
    return languages

def migrate_languages_to_mysql():
    """Migrate languages from PostgreSQL to MySQL"""
    # Get the languages from Postgres
    pg_conn = connect_postgres()
    languages = get_languages_from_postgres(pg_conn)
    pg_conn.close()
    
    print(f"Found {len(languages)} languages in PostgreSQL")
    
    # Now we'll insert or update languages in MySQL using the Flask API
    # since we're having issues with direct MySQL connection
    import requests
    
    # First, get existing languages to avoid duplicates
    resp = requests.get("http://localhost:5000/api/cms/languages")
    existing_languages = resp.json()
    existing_codes = [lang['code'] for lang in existing_languages]
    print(f"Found {len(existing_languages)} existing languages in MySQL: {', '.join(existing_codes)}")
    
    # Get admin token for API authentication
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    auth_resp = requests.post("http://localhost:5000/api/auth/login", json=login_data)
    if auth_resp.status_code != 200:
        print(f"Authentication failed: {auth_resp.text}")
        return
    
    token = auth_resp.json()['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # Add languages that don't exist yet
    added = 0
    updated = 0
    already_exists = 0
    failed = 0
    
    for lang in languages:
        if lang['code'] in existing_codes:
            print(f"Language {lang['code']} already exists. Updating...")
            # Update existing language
            update_data = {
                "name": lang['name'],
                "is_active": lang['is_active'],
                "is_default": True if lang['code'] == 'en' else False,
                "is_rtl": lang['is_rtl'] if lang['is_rtl'] is not None else False,
                "flag": lang['flag'] if lang['flag'] is not None else None
            }
            
            update_resp = requests.patch(f"http://localhost:5000/api/cms/languages/{lang['code']}", 
                                         json=update_data, headers=headers)
            
            if update_resp.status_code == 200:
                print(f"Updated language: {lang['code']}")
                updated += 1
            else:
                print(f"Failed to update language {lang['code']}: {update_resp.text}")
                failed += 1
                
            continue
            
        # Add new language
        add_data = {
            "code": lang['code'],
            "name": lang['name'],
            "is_active": lang['is_active'],
            "is_default": True if lang['code'] == 'en' else False,
            "is_rtl": lang['is_rtl'] if lang['is_rtl'] is not None else False,
            "flag": lang['flag'] if lang['flag'] is not None else None
        }
        
        add_resp = requests.post("http://localhost:5000/api/cms/languages", 
                                json=add_data, headers=headers)
        
        if add_resp.status_code == 201:
            print(f"Added language: {lang['code']} - {lang['name']}")
            added += 1
        else:
            print(f"Failed to add language {lang['code']}: {add_resp.text}")
            failed += 1
    
    print("\nSummary:")
    print(f"Languages in PostgreSQL: {len(languages)}")
    print(f"Added: {added}")
    print(f"Updated: {updated}")
    print(f"Already exists: {already_exists}")
    print(f"Failed: {failed}")
    print(f"Total languages now in MySQL: {len(existing_languages) + added}")

if __name__ == "__main__":
    migrate_languages_to_mysql()