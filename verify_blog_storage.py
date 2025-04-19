#!/usr/bin/env python3
"""
Script to verify blog posts are stored in MySQL database
"""
import os
import sys
import pymysql
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file if present
load_dotenv()

# Database connection details - using environment variables with defaults matching application
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASS = os.environ.get('DB_PASSWORD', 'mysuperstrongpassword')  # Using the password from check_posts.py
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_PORT = int(os.environ.get('DB_PORT', 3306))

print(f"Connecting to MySQL: {DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

def verify_blog_tables():
    """Check if blog tables exist in MySQL and display their structure"""
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            port=DB_PORT,
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("✅ Successfully connected to MySQL database")
        
        with connection.cursor() as cursor:
            # Check if CMS tables exist
            print("\n📋 Checking CMS tables in the database:")
            
            # List of CMS tables to check
            cms_tables = [
                'cms_posts',
                'cms_post_translations',
                'cms_post_media',
                'cms_tags',
                'cms_post_tags',
                'cms_languages'
            ]
            
            for table in cms_tables:
                # Check if table exists
                cursor.execute("""
                    SELECT COUNT(*) as count
                    FROM information_schema.tables
                    WHERE table_schema = %s
                    AND table_name = %s
                """, (DB_NAME, table))
                
                result = cursor.fetchone()
                
                if result and result['count'] > 0:
                    print(f"✅ Table '{table}' exists")
                    
                    # Show table structure
                    cursor.execute(f"DESCRIBE {table}")
                    columns = cursor.fetchall()
                    print(f"  Table structure:")
                    for col in columns:
                        print(f"  - {col['Field']}: {col['Type']}")
                    
                    # Count records
                    cursor.execute(f"SELECT COUNT(*) as count FROM {table}")
                    count = cursor.fetchone()['count']
                    print(f"  Records count: {count}")
                    
                    # If it's the post table and records exist, show a sample
                    if table == 'cms_posts' and count > 0:
                        cursor.execute("""
                            SELECT id, slug, status, created_at, published_at
                            FROM cms_posts
                            ORDER BY created_at DESC
                            LIMIT 5
                        """)
                        posts = cursor.fetchall()
                        print("\n📝 Latest blog posts in database:")
                        for post in posts:
                            created = post['created_at'].strftime('%Y-%m-%d %H:%M:%S') if post['created_at'] else 'None'
                            published = post['published_at'].strftime('%Y-%m-%d %H:%M:%S') if post['published_at'] else 'None'
                            print(f"  - ID: {post['id']}, Slug: {post['slug']}, Status: {post['status']}")
                            print(f"    Created: {created}, Published: {published}")
                else:
                    print(f"❌ Table '{table}' does not exist")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
    finally:
        if 'connection' in locals() and connection:
            connection.close()

if __name__ == "__main__":
    verify_blog_tables()