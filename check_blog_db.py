#!/usr/bin/env python3
"""
Check Blog Posts in Database

This script verifies if blog posts exist in the database and provides
information about the state of the blog data.
"""

import os
import sys
import pymysql
from urllib.parse import quote_plus
from tabulate import tabulate

# Try to load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
    print("Loaded environment variables from .env file")
except ImportError:
    print("python-dotenv not installed, skipping .env file loading")

# Get database configuration from environment variables
DB_HOST = os.environ.get('DB_HOST', 'localhost')
DB_PORT = int(os.environ.get('DB_PORT', 3306))
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASSWORD = os.environ.get('DB_PASSWORD', '')

# Fallback to remote database values if specified
USE_REMOTE = os.environ.get('USE_REMOTE_DB', 'false').lower() == 'true'
if USE_REMOTE:
    print("Using remote database configuration")
    DB_HOST = '8.130.113.102'
    DB_PASSWORD = 'Ir%86241992'

print(f"\nDatabase connection parameters:")
print(f"  Host: {DB_HOST}")
print(f"  Port: {DB_PORT}")
print(f"  Database: {DB_NAME}")
print(f"  User: {DB_USER}")
print(f"  Password: {'*' * (len(DB_PASSWORD) if DB_PASSWORD else 0)}")

def check_blog_tables():
    """Check if blog tables exist in the database"""
    try:
        print("\nConnecting to database...")
        
        # Connect to the database
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            connect_timeout=10
        )
        
        with connection.cursor() as cursor:
            # Check for blog-related tables
            cursor.execute("SHOW TABLES LIKE 'cms_%'")
            tables = cursor.fetchall()
            
            if not tables:
                print("\nNo CMS tables found in the database.")
                return False
                
            print(f"\nFound {len(tables)} CMS tables:")
            for table in tables:
                print(f"  - {table[0]}")
            
            # Check for posts
            try:
                cursor.execute("SELECT COUNT(*) FROM cms_posts")
                post_count = cursor.fetchone()[0]
                print(f"\nFound {post_count} blog posts in cms_posts table")
                
                if post_count == 0:
                    print("No blog posts found. Database may be empty.")
                    return False
                
                # Check post statuses
                cursor.execute("""
                    SELECT status, COUNT(*) 
                    FROM cms_posts 
                    GROUP BY status
                """)
                status_counts = cursor.fetchall()
                print("\nPost status distribution:")
                for status, count in status_counts:
                    print(f"  - {status}: {count}")
                
                # Check translations
                cursor.execute("SELECT COUNT(*) FROM cms_post_translations")
                translation_count = cursor.fetchone()[0]
                print(f"\nFound {translation_count} blog post translations")
                
                # Show posts with translations
                cursor.execute("""
                    SELECT 
                        p.id, 
                        p.slug, 
                        p.status, 
                        COUNT(t.id) as translation_count
                    FROM 
                        cms_posts p
                    LEFT JOIN 
                        cms_post_translations t ON p.id = t.post_id
                    GROUP BY 
                        p.id
                    ORDER BY 
                        p.id
                    LIMIT 20
                """)
                posts = cursor.fetchall()
                
                if posts:
                    headers = ["ID", "Slug", "Status", "Translations"]
                    table_data = []
                    for post in posts:
                        table_data.append([post[0], post[1], post[2], post[3]])
                    
                    print("\nPost details (up to 20 posts):")
                    print(tabulate(table_data, headers=headers, tablefmt="grid"))
                
                # Check if we have published posts with translations
                cursor.execute("""
                    SELECT COUNT(*) FROM cms_posts p
                    JOIN cms_post_translations t ON p.id = t.post_id
                    WHERE p.status = 'published'
                """)
                published_with_translations = cursor.fetchone()[0]
                
                if published_with_translations > 0:
                    print(f"\n✅ Found {published_with_translations} published posts with translations")
                    return True
                else:
                    print("\n⚠️ No published posts with translations found")
                    return False
                
            except pymysql.Error as e:
                print(f"\nError querying posts: {e}")
                return False
                
    except pymysql.Error as e:
        print(f"\nDatabase connection error: {e}")
        return False
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
            print("\nDatabase connection closed")

def seed_sample_post():
    """Create a sample blog post for testing"""
    try:
        print("\nAttempting to create a sample blog post...")
        
        # Connect to the database
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            port=DB_PORT,
            connect_timeout=10
        )
        
        with connection.cursor() as cursor:
            # Check if we have an admin user
            cursor.execute("SELECT id FROM users WHERE is_admin = 1 LIMIT 1")
            admin = cursor.fetchone()
            
            if not admin:
                print("No admin user found. Creating one...")
                # Create admin user if none exists
                cursor.execute("""
                    INSERT INTO users (username, email, password_hash, is_admin, created_at)
                    VALUES ('admin', 'admin@example.com', '$2b$12$xyz', 1, NOW())
                """)
                connection.commit()
                admin_id = cursor.lastrowid
                print(f"Created admin user with ID {admin_id}")
            else:
                admin_id = admin[0]
                print(f"Using existing admin user with ID {admin_id}")
            
            # Create a sample post
            cursor.execute("""
                INSERT INTO cms_posts (
                    slug, featured_image, author_id, status, 
                    created_at, updated_at, published_at
                ) VALUES (
                    'sample-blog-post', '/images/sample-post.jpg', %s, 'published',
                    NOW(), NOW(), NOW()
                )
            """, (admin_id,))
            connection.commit()
            post_id = cursor.lastrowid
            print(f"Created sample post with ID {post_id}")
            
            # Create English translation
            cursor.execute("""
                INSERT INTO cms_post_translations (
                    post_id, language_code, title, content,
                    meta_title, meta_description, meta_keywords,
                    is_auto_translated, last_updated_at
                ) VALUES (
                    %s, 'en', 'Sample Blog Post', 
                    '<h1>Welcome to iMagenWiz</h1><p>This is a sample blog post created for testing purposes.</p>',
                    'Sample Blog Post', 'A sample blog post for testing', 'sample, test',
                    0, NOW()
                )
            """, (post_id,))
            connection.commit()
            print("Added English translation for sample post")
            
            # Check language table
            cursor.execute("SELECT COUNT(*) FROM cms_languages")
            language_count = cursor.fetchone()[0]
            
            if language_count == 0:
                print("No languages found. Adding English...")
                cursor.execute("""
                    INSERT INTO cms_languages (code, name, is_default, is_active)
                    VALUES ('en', 'English', 1, 1)
                """)
                connection.commit()
                print("Added English language")
            
            print("\n✅ Sample blog post created successfully")
            return True
            
    except pymysql.Error as e:
        print(f"\nError creating sample post: {e}")
        return False
    finally:
        if 'connection' in locals() and connection.open:
            connection.close()
            print("Database connection closed")

def main():
    """Main function"""
    print("=== Blog Database Check ===")
    
    # First check if blog tables exist and have data
    has_blog_data = check_blog_tables()
    
    if not has_blog_data:
        print("\nNo blog data found or posts are not properly set up.")
        
        # Ask if sample data should be created
        if input("\nWould you like to create a sample blog post? (y/n): ").lower() == 'y':
            seed_sample_post()
        else:
            print("\nNo sample data was created.")
            print("You may need to add blog posts manually or run a seed script.")
    
    print("\n=== Check Complete ===")

if __name__ == "__main__":
    main() 