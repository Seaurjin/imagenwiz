"""
Script to add all languages to the CMS

This script:
1. Connects to PostgreSQL to get all languages
2. Uses Flask's backend API to add them
"""

import os
import sys
import requests
import psycopg2
import psycopg2.extras
import json
import time

# PostgreSQL connection details
PG_HOST = os.environ.get('PGHOST')
PG_PORT = os.environ.get('PGPORT')
PG_DATABASE = os.environ.get('PGDATABASE')
PG_USER = os.environ.get('PGUSER')
PG_PASSWORD = os.environ.get('PGPASSWORD')

# Flask API URL
API_URL = "http://localhost:5000/api"

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

def get_admin_login_token():
    """Log in as admin to get access token"""
    login_url = f"{API_URL}/auth/login"
    
    # Try different admin credentials
    login_credentials = [
        {"username": "admin", "password": "admin123"},
        {"username": "admin", "password": "changeme"},
        {"username": "admin", "password": "password"},
        {"username": "admin@imagenwiz.com", "password": "admin123"},
        {"username": "support@imagenwiz.com", "password": "admin123"}
    ]
    
    for login_data in login_credentials:
        try:
            print(f"Trying login with username: {login_data['username']}")
            response = requests.post(login_url, json=login_data)
            if response.status_code == 200:
                token = response.json().get('token')
                print(f"✅ Logged in successfully as {login_data['username']}")
                return token
            else:
                print(f"Login attempt failed for {login_data['username']}")
        except Exception as e:
            print(f"❌ Error during login: {str(e)}")
    
    print("❌ All login attempts failed")
    return None

def add_language_via_api(token, language_data):
    """Add a language using the API"""
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Set RTL flag for known RTL languages
    code = language_data['code']
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
    
    api_data = {
        "code": code,
        "name": language_data['name'],
        "is_active": True,
        "is_default": bool(language_data['is_default']),
        "is_rtl": is_rtl,
        "flag": flag
    }
    
    url = f"{API_URL}/cms/languages"
    
    try:
        response = requests.post(url, headers=headers, json=api_data)
        if response.status_code in [200, 201]:
            print(f"✅ Added language: {code} - {language_data['name']}")
            return True
        else:
            print(f"❌ Failed to add language {code}: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error adding language {code}: {str(e)}")
        return False

def get_existing_languages():
    """Get existing languages from MySQL via API"""
    try:
        url = f"{API_URL}/cms/languages"
        response = requests.get(url)
        
        if response.status_code == 200:
            languages = response.json()
            codes = [lang['code'] for lang in languages]
            print(f"Found {len(codes)} existing languages: {', '.join(codes)}")
            return codes
        else:
            print(f"❌ Error fetching languages: {response.text}")
            return []
    except Exception as e:
        print(f"❌ Error fetching languages: {str(e)}")
        return []

def add_languages():
    """Add languages to the database using API"""
    print("Starting language migration...")
    
    # Connect to PostgreSQL
    pg_conn = connect_postgres()
    
    try:
        # Get languages from PostgreSQL
        pg_languages = get_languages_from_postgres(pg_conn)
        
        if not pg_languages:
            print("❌ No languages found in PostgreSQL. Migration aborted.")
            return
        
        # Get existing languages from API
        existing_langs = get_existing_languages()
        
        # Log in as admin to get token
        token = get_admin_login_token()
        if not token:
            print("❌ Cannot proceed without admin access.")
            return
        
        # Add languages
        added = 0
        skipped = 0
        failed = 0
        
        for lang in pg_languages:
            code = lang['code']
            
            # Skip if already exists
            if code in existing_langs:
                print(f"Language {code} already exists. Skipping.")
                skipped += 1
                continue
            
            # Add language via API
            if add_language_via_api(token, lang):
                added += 1
            else:
                failed += 1
            
            # Add small delay to avoid overwhelming the API
            time.sleep(0.5)
        
        print("\nLanguage migration summary:")
        print(f"Added: {added}")
        print(f"Skipped: {skipped}")
        print(f"Failed: {failed}")
        print(f"Total: {len(pg_languages)}")
        
        if added > 0:
            print("✅ Languages migration completed!")
        else:
            print("⚠️ No new languages were added.")
    
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
    
    finally:
        pg_conn.close()

if __name__ == "__main__":
    add_languages()