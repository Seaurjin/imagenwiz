#!/usr/bin/env python3
"""
Script to add a sample blog post to the MySQL database
"""
import os
import sys
import pymysql
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection details
DB_HOST = os.environ.get('DB_HOST', '8.130.113.102')
DB_USER = os.environ.get('DB_USER', 'root')
DB_PASS = os.environ.get('DB_PASSWORD', 'Ir%86241992')
DB_NAME = os.environ.get('DB_NAME', 'mat_db')
DB_PORT = int(os.environ.get('DB_PORT', 3306))

print(f"Connecting to MySQL: {DB_USER}@{DB_HOST}:{DB_PORT}/{DB_NAME}")

def add_sample_blog_post():
    """Add a sample blog post to the database using direct SQL queries"""
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            port=DB_PORT,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        print("✅ Successfully connected to MySQL database")
        
        with connection.cursor() as cursor:
            # 1. First check if we already have the sample post
            cursor.execute("""
                SELECT id FROM cms_posts WHERE slug = %s
            """, ('sample-blog-post',))
            
            existing_post = cursor.fetchone()
            if existing_post:
                print(f"Blog post with slug 'sample-blog-post' already exists with ID: {existing_post['id']}")
                return
            
            # 2. Get admin user ID for author
            cursor.execute("""
                SELECT id FROM users WHERE is_admin = 1 LIMIT 1
            """)
            
            admin_user = cursor.fetchone()
            if not admin_user:
                print("❌ No admin user found. Creating sample admin user...")
                # Create a sample admin user if none exists
                cursor.execute("""
                    INSERT INTO users (username, email, password_hash, is_admin)
                    VALUES (%s, %s, %s, %s)
                """, ('admin', 'admin@example.com', 'sample_hash', 1))
                connection.commit()
                admin_user_id = cursor.lastrowid
            else:
                admin_user_id = admin_user['id']
            
            print(f"Using admin user ID: {admin_user_id}")
            
            # 3. Create the blog post
            now = datetime.utcnow()
            cursor.execute("""
                INSERT INTO cms_posts 
                (slug, featured_image, author_id, status, created_at, updated_at, published_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                'sample-blog-post',
                '/static/uploads/blog/sample-image.jpg',
                admin_user_id,
                'published',
                now,
                now,
                now
            ))
            post_id = cursor.lastrowid
            print(f"✅ Created blog post with ID: {post_id}")
            
            # 4. Get existing languages
            cursor.execute("SELECT code FROM cms_languages WHERE is_active = 1")
            languages = [row['code'] for row in cursor.fetchall()]
            
            if not languages:
                print("❌ No languages found. Adding English as default...")
                cursor.execute("""
                    INSERT INTO cms_languages (code, name, is_default, is_active)
                    VALUES (%s, %s, %s, %s)
                """, ('en', 'English', 1, 1))
                connection.commit()
                languages = ['en']
            
            print(f"Available languages: {', '.join(languages)}")
            
            # 5. Add translations for each language
            for lang_code in languages:
                # If language is English, use original content
                if lang_code == 'en':
                    title = "Sample Blog Post"
                    content = """
                    <h1>Welcome to our Sample Blog Post</h1>
                    <p>This is a sample blog post created to demonstrate the multilingual CMS functionality of iMagenWiz.</p>
                    <h2>Key Features of iMagenWiz</h2>
                    <ul>
                        <li>AI-powered image processing</li>
                        <li>Multilingual content support</li>
                        <li>Advanced blog management</li>
                        <li>SEO optimization</li>
                    </ul>
                    <p>This sample post was automatically generated to verify the blog storage functionality.</p>
                    """
                    meta_title = "Sample Blog Post | iMagenWiz"
                    meta_description = "A sample blog post demonstrating the CMS capabilities of iMagenWiz platform"
                    meta_keywords = "sample, blog, cms, imagenwiz"
                    is_auto_translated = 0
                elif lang_code == 'es':
                    title = "Publicación de Blog de Muestra"
                    content = """
                    <h1>Bienvenido a nuestra Publicación de Blog de Muestra</h1>
                    <p>Esta es una publicación de blog de muestra creada para demostrar la funcionalidad CMS multilingüe de iMagenWiz.</p>
                    <h2>Características Principales de iMagenWiz</h2>
                    <ul>
                        <li>Procesamiento de imágenes con IA</li>
                        <li>Soporte de contenido multilingüe</li>
                        <li>Gestión avanzada de blogs</li>
                        <li>Optimización SEO</li>
                    </ul>
                    <p>Esta publicación de muestra fue generada automáticamente para verificar la funcionalidad de almacenamiento del blog.</p>
                    """
                    meta_title = "Publicación de Blog de Muestra | iMagenWiz"
                    meta_description = "Una publicación de blog de muestra que demuestra las capacidades CMS de la plataforma iMagenWiz"
                    meta_keywords = "muestra, blog, cms, imagenwiz"
                    is_auto_translated = 1
                else:
                    # For any other language, use English with a note
                    title = f"Sample Blog Post [{lang_code}]"
                    content = f"""
                    <h1>Sample Blog Post in {lang_code}</h1>
                    <p>This is a placeholder for content in {lang_code} language.</p>
                    <p>The actual content would typically be translated by a human or an AI translation service.</p>
                    """
                    meta_title = f"Sample Blog Post in {lang_code} | iMagenWiz"
                    meta_description = f"A sample blog post in {lang_code} language demonstrating CMS functionality"
                    meta_keywords = f"sample, blog, cms, {lang_code}, imagenwiz"
                    is_auto_translated = 1
                
                cursor.execute("""
                    INSERT INTO cms_post_translations
                    (post_id, language_code, title, content, meta_title, meta_description, meta_keywords)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (
                    post_id,
                    lang_code,
                    title,
                    content,
                    meta_title,
                    meta_description,
                    meta_keywords
                ))
                print(f"✅ Added translation for language: {lang_code}")
            
            # 6. Get existing tags
            cursor.execute("SELECT id, name FROM cms_tags")
            tags = cursor.fetchall()
            
            if not tags:
                print("❌ No tags found. Adding sample tags...")
                cursor.execute("INSERT INTO cms_tags (name, slug) VALUES (%s, %s)", ('Sample', 'sample'))
                cursor.execute("INSERT INTO cms_tags (name, slug) VALUES (%s, %s)", ('Blog', 'blog'))
                connection.commit()
                
                cursor.execute("SELECT id, name FROM cms_tags")
                tags = cursor.fetchall()
            
            # 7. Associate tags with the post
            for tag in tags:
                cursor.execute("""
                    INSERT INTO cms_post_tags (post_id, tag_id)
                    VALUES (%s, %s)
                """, (post_id, tag['id']))
                print(f"✅ Associated post with tag: {tag['name']}")
            
            # Commit all changes
            connection.commit()
            print("\n✅ Sample blog post successfully created!")
            
            # 8. Verify the post was created
            cursor.execute("""
                SELECT p.id, p.slug, p.status, 
                       GROUP_CONCAT(DISTINCT t.language_code) as languages,
                       GROUP_CONCAT(DISTINCT tg.name) as tags
                FROM cms_posts p
                LEFT JOIN cms_post_translations t ON p.id = t.post_id
                LEFT JOIN cms_post_tags pt ON p.id = pt.post_id
                LEFT JOIN cms_tags tg ON pt.tag_id = tg.id
                WHERE p.id = %s
                GROUP BY p.id
            """, (post_id,))
            
            post_summary = cursor.fetchone()
            if post_summary:
                print("\n📝 Blog Post Summary:")
                print(f"  ID: {post_summary['id']}")
                print(f"  Slug: {post_summary['slug']}")
                print(f"  Status: {post_summary['status']}")
                print(f"  Languages: {post_summary['languages']}")
                print(f"  Tags: {post_summary['tags']}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        # If a meaningful error message, provide more context
        if "Duplicate entry" in str(e):
            print("This error suggests the blog post already exists. Try using a different slug.")
        elif "foreign key constraint fails" in str(e):
            print("This error suggests a referenced record does not exist (like a missing user or language).")
    finally:
        if 'connection' in locals() and connection:
            connection.close()

if __name__ == "__main__":
    add_sample_blog_post()