#!/usr/bin/env python

import os
import pymysql

# MySQL connection parameters
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', 'Ir%86241992')

def check_language_table_schema():
    """Check the actual schema of the cms_languages table"""
    try:
        # Connect to MySQL
        conn = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        
        cursor = conn.cursor()
        
        # Get table structure
        cursor.execute("DESCRIBE cms_languages")
        columns = cursor.fetchall()
        
        print(f"SCHEMA FOR cms_languages TABLE:")
        print("-" * 60)
        print(f"{'Column Name':<20} {'Type':<15} {'Null':<5} {'Key':<5} {'Default':<10} {'Extra':<15}")
        print("-" * 60)
        
        for col in columns:
            print(f"{col[0]:<20} {col[1]:<15} {col[2]:<5} {col[3]:<5} {str(col[4]):<10} {col[5]:<15}")
        
        # Check if the table contains any data
        cursor.execute("SELECT COUNT(*) FROM cms_languages")
        count = cursor.fetchone()[0]
        print(f"\nTotal records: {count}")
        
        # Display sample data if available
        if count > 0:
            cursor.execute("SELECT * FROM cms_languages LIMIT 5")
            rows = cursor.fetchall()
            
            print("\nSAMPLE RECORDS:")
            print("-" * 80)
            for row in rows:
                print(row)
        
        # Close connection
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"Error checking schema: {e}")

if __name__ == "__main__":
    check_language_table_schema()