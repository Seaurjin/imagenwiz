#!/usr/bin/env python
"""
Script to add the 'is_rtl' column to the cms_languages table in MySQL
and set appropriate values for RTL languages
"""

import os
import pymysql
import sys

# MySQL connection parameters
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')

def add_rtl_column():
    """Add is_rtl column to cms_languages table"""
    print("\n=================================================")
    print("Adding is_rtl column to cms_languages table in MySQL")
    print("=================================================\n")
    
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
        
        # Check if column already exists
        cursor.execute("""
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = %s 
              AND TABLE_NAME = 'cms_languages'
              AND COLUMN_NAME = 'is_rtl'
        """, (DB_NAME,))
        
        if cursor.fetchone():
            print("ℹ️ is_rtl column already exists in cms_languages table")
            print("ℹ️ Skipping column creation, proceeding to update values")
        else:
            # Add the column
            print("ℹ️ Adding is_rtl column to cms_languages table...")
            cursor.execute("""
                ALTER TABLE cms_languages 
                ADD COLUMN is_rtl TINYINT(1) DEFAULT 0
            """)
            print("✅ Added is_rtl column successfully")
            
        # Update RTL languages
        rtl_languages = ['ar', 'he', 'fa', 'ur']
        
        # First, set all languages to non-RTL by default
        cursor.execute("""
            UPDATE cms_languages 
            SET is_rtl = 0
        """)
        
        # Set known RTL languages
        for lang_code in rtl_languages:
            # Check if language exists
            cursor.execute("""
                SELECT code 
                FROM cms_languages 
                WHERE code = %s
            """, (lang_code,))
            
            if cursor.fetchone():
                cursor.execute("""
                    UPDATE cms_languages 
                    SET is_rtl = 1
                    WHERE code = %s
                """, (lang_code,))
                print(f"✅ Set {lang_code} as RTL language")
        
        # Commit changes
        conn.commit()
        print("\n✅ is_rtl column added and values updated successfully")
        
        # Display the updated schema
        cursor.execute("DESCRIBE cms_languages")
        columns = cursor.fetchall()
        
        print("\nUPDATED SCHEMA FOR cms_languages TABLE:")
        print("-" * 60)
        print(f"{'Column Name':<20} {'Type':<15} {'Null':<5} {'Key':<5} {'Default':<10} {'Extra':<15}")
        print("-" * 60)
        
        for col in columns:
            print(f"{col[0]:<20} {col[1]:<15} {col[2]:<5} {col[3]:<5} {str(col[4]):<10} {col[5]:<15}")
        
        # Display all languages with their RTL status
        cursor.execute("""
            SELECT code, name, is_rtl, flag 
            FROM cms_languages 
            ORDER BY code
        """)
        
        languages = cursor.fetchall()
        
        print("\nLANGUAGES WITH RTL STATUS:")
        print("-" * 60)
        print(f"{'Code':<10} {'Name':<20} {'Is RTL':<10} {'Flag':<5}")
        print("-" * 60)
        
        for lang in languages:
            print(f"{lang[0]:<10} {lang[1]:<20} {'Yes' if lang[2] else 'No':<10} {lang[3] if lang[3] else '':<5}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if 'conn' in locals() and conn:
            conn.rollback()
        return False
        
    finally:
        if 'cursor' in locals() and cursor:
            cursor.close()
        if 'conn' in locals() and conn:
            conn.close()

if __name__ == "__main__":
    success = add_rtl_column()
    sys.exit(0 if success else 1)