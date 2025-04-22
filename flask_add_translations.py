#!/usr/bin/env python3
"""
Script to directly add translations to all blog posts using Flask app context

This script:
1. Creates a Flask application context
2. Gets all blog posts with English translations
3. Creates placeholder translations for all supported languages
"""
import os
import sys
from datetime import datetime
from flask import Flask

# Set the database environment variables to match the running Flask app
os.environ['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Ir%2586241992@8.130.113.102:3306/mat_db'
os.environ['MYSQL_HOST'] = '8.130.113.102'
os.environ['MYSQL_PORT'] = '3306'
os.environ['MYSQL_USER'] = 'root'
os.environ['MYSQL_PASSWORD'] = 'Ir%2586241992'
os.environ['MYSQL_DATABASE'] = 'mat_db'

# Add the app directory to the path so we can import
sys.path.append('backend')

# Import the app factory function
try:
    from app import create_app
    from app.models.cms import Post, PostTranslation, Language
except ImportError as e:
    print(f"Import error: {e}")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)

# Define supported languages with names
SUPPORTED_LANGUAGES = [
    {"code": "en", "name": "English"},
    {"code": "fr", "name": "French"},
    {"code": "es", "name": "Spanish"},
    {"code": "de", "name": "German"},
    {"code": "it", "name": "Italian"},
    {"code": "pt", "name": "Portuguese"},
    {"code": "nl", "name": "Dutch"},
    {"code": "ru", "name": "Russian"},
    {"code": "zh-CN", "name": "Simplified Chinese"},
    {"code": "zh-TW", "name": "Traditional Chinese"},
    {"code": "ja", "name": "Japanese"},
    {"code": "ko", "name": "Korean"},
    {"code": "ar", "name": "Arabic"},
    {"code": "hi", "name": "Hindi"},
    {"code": "id", "name": "Indonesian"},
    {"code": "ms", "name": "Malaysian"},
    {"code": "th", "name": "Thai"},
    {"code": "vi", "name": "Vietnamese"},
    {"code": "tr", "name": "Turkish"},
    {"code": "pl", "name": "Polish"},
    {"code": "cs", "name": "Czech"}
]

# Language code to name mapping
LANG_NAMES = {lang["code"]: lang["name"] for lang in SUPPORTED_LANGUAGES}

def create_placeholder_translation(original_text, language_code):
    """Create a placeholder translation for the given language"""
    if not original_text:
        return ""
        
    lang_name = LANG_NAMES.get(language_code, language_code)
    
    # For titles or short texts, just add a language prefix
    if len(original_text) < 200:
        return f"[{lang_name}] {original_text}"
    
    # For longer content, wrap it in a placeholder notice
    return f"""
[This is an automatic placeholder for {lang_name} translation]

{original_text}

[End of placeholder translation. This will be replaced with proper {lang_name} translation.]
    """.strip()

def add_placeholder_translations():
    """Add placeholder translations for all languages to all posts with English content"""
    print("Starting blog post translation process...")
    
    # Create Flask app instance
    app = create_app()
    
    # Use app context
    with app.app_context():
        # Get all active languages
        try:
            languages = Language.query.filter_by(is_active=True).all()
            print(f"Found {len(languages)} active languages in the database")
            
            # If we have less than expected languages, get language codes from our hardcoded list
            language_codes = [lang.code for lang in languages]
            if len(language_codes) < 10:
                print("Using hardcoded language list instead of database languages")
                language_codes = [lang["code"] for lang in SUPPORTED_LANGUAGES]
                
            # Make sure English is excluded as it's the source language
            language_codes = [code for code in language_codes if code != 'en']
            print(f"Will create translations for these languages: {', '.join(language_codes)}")
            
            # Get all posts with English translations
            posts_with_english = Post.query.join(
                PostTranslation, 
                Post.id == PostTranslation.post_id
            ).filter(
                PostTranslation.language_code == 'en'
            ).all()
            
            print(f"Found {len(posts_with_english)} blog posts with English content")
            
            # For each post, create translations for all languages
            for post in posts_with_english:
                print(f"\nProcessing post ID {post.id}: {post.slug}")
                
                # Get the English translation
                english_translation = next((t for t in post.translations if t.language_code == 'en'), None)
                if not english_translation:
                    print(f"  Warning: English translation not found for post {post.id}, skipping")
                    continue
                
                # Get existing translation languages
                existing_langs = [t.language_code for t in post.translations]
                print(f"  Post already has translations for: {', '.join(existing_langs)}")
                
                # For each language, create a translation if it doesn't exist
                for lang_code in language_codes:
                    if lang_code in existing_langs:
                        print(f"  - {lang_code}: Translation already exists, skipping")
                        continue
                    
                    print(f"  - {lang_code}: Creating new placeholder translation")
                    
                    # Create placeholder translations
                    title = create_placeholder_translation(english_translation.title, lang_code)
                    content = create_placeholder_translation(english_translation.content, lang_code)
                    meta_title = create_placeholder_translation(english_translation.meta_title, lang_code) if english_translation.meta_title else ""
                    meta_description = create_placeholder_translation(english_translation.meta_description, lang_code) if english_translation.meta_description else ""
                    meta_keywords = english_translation.meta_keywords  # Keywords are usually not translated
                    
                    # Create the translation
                    now = datetime.utcnow()
                    new_translation = PostTranslation(
                        post_id=post.id,
                        language_code=lang_code,
                        title=title,
                        content=content,
                        meta_title=meta_title,
                        meta_description=meta_description,
                        meta_keywords=meta_keywords,
                        created_at=now,
                        updated_at=now,
                        is_auto_translated=True
                    )
                    
                    try:
                        from app import db
                        db.session.add(new_translation)
                        db.session.commit()
                        print(f"  ✓ Added translation for {lang_code}")
                    except Exception as e:
                        from app import db
                        db.session.rollback()
                        print(f"  ✗ Error adding translation for {lang_code}: {e}")
            
            print("\nTranslation process completed successfully!")
            
        except Exception as e:
            print(f"Error during translation process: {e}")

if __name__ == "__main__":
    add_placeholder_translations()