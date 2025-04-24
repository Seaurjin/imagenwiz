import os
import uuid
from datetime import datetime
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models.models import User
from app.models.cms import Post, PostTranslation, PostMedia, Tag, Language
from sqlalchemy import or_, and_
from app.services.translation_service import translation_service
from .ai_content import generate_blog_content
from . import bp

# Define allowed file extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def check_admin_access():
    """Check if the current user has admin access"""
    user_id = get_jwt_identity()
    try:
        user_id = int(user_id)
    except (ValueError, TypeError):
        return None
        
    user = User.query.get(user_id)
    
    if not user or not user.is_admin:
        return None
    
    return user

# Language management
@bp.route('/languages', methods=['GET'])
def get_languages():
    """Get all supported languages"""
    # Return a comprehensive list of supported languages directly
    # This ensures language availability without database issues
    
    # Optional parameter to filter to only website-supported languages
    website_only = request.args.get('website_only', 'false').lower() == 'true'
    is_active_filter = request.args.get('is_active', 'false').lower() == 'true'
    
    try:
        # Try to get languages from database first
        languages = Language.query.all()
        
        if languages:
            # Convert to list of dictionaries for JSON response
            language_list = []
            for lang in languages:
                language_list.append({
                    "code": lang.code,
                    "name": lang.name,
                    "is_default": lang.is_default,
                    "is_active": lang.is_active,
                    "flag": lang.flag if hasattr(lang, 'flag') and lang.flag else None
                })
                
            current_app.logger.info(f"Found {len(language_list)} languages in database")
                
            # Add flag field if missing (for backward compatibility)
            for lang in language_list:
                if not lang.get('flag'):
                    # Set default flag based on language code - only the 22 website languages
                    flags = {
                        'en': '🇬🇧', 'fr': '🇫🇷', 'es': '🇪🇸', 'de': '🇩🇪', 'it': '🇮🇹', 
                        'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh-TW': '🇹🇼',
                        'ar': '🇸🇦', 'nl': '🇳🇱', 'sv': '🇸🇪', 'tr': '🇹🇷', 'pl': '🇵🇱',
                        'hu': '🇭🇺', 'el': '🇬🇷', 'no': '🇳🇴', 'vi': '🇻🇳', 'th': '🇹🇭',
                        'id': '🇮🇩', 'ms': '🇲🇾'
                    }
                    lang['flag'] = flags.get(lang['code'], '🌐')
                    
            # Filter to only active languages if requested
            if is_active_filter:
                language_list = [lang for lang in language_list if lang.get('is_active', False)]
                
            # Filter to only website languages if requested
            if website_only:
                # These are the language codes supported by the website
                website_lang_codes = [
                    'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW',
                    'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
                ]
                language_list = [lang for lang in language_list if lang.get('code') in website_lang_codes]
                
            current_app.logger.info(f"Returning {len(language_list)} languages from database")
            return jsonify(language_list), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving languages from database: {e}")
        # Fall back to predefined languages if database query fails
    
    # List of 22 languages supported by the website
    predefined_languages = [
        {"code": "en", "name": "English", "is_active": True, "is_default": True, "flag": "🇬🇧"},
        {"code": "fr", "name": "French", "is_active": True, "is_default": False, "flag": "🇫🇷"},
        {"code": "es", "name": "Spanish", "is_active": True, "is_default": False, "flag": "🇪🇸"},
        {"code": "de", "name": "German", "is_active": True, "is_default": False, "flag": "🇩🇪"},
        {"code": "it", "name": "Italian", "is_active": True, "is_default": False, "flag": "🇮🇹"},
        {"code": "pt", "name": "Portuguese", "is_active": True, "is_default": False, "flag": "🇵🇹"},
        {"code": "nl", "name": "Dutch", "is_active": True, "is_default": False, "flag": "🇳🇱"},
        {"code": "ru", "name": "Russian", "is_active": True, "is_default": False, "flag": "🇷🇺"},
        {"code": "zh-TW", "name": "Traditional Chinese", "is_active": True, "is_default": False, "flag": "🇹🇼"},
        {"code": "ja", "name": "Japanese", "is_active": True, "is_default": False, "flag": "🇯🇵"},
        {"code": "ko", "name": "Korean", "is_active": True, "is_default": False, "flag": "🇰🇷"},
        {"code": "ar", "name": "Arabic", "is_active": True, "is_default": False, "flag": "🇸🇦"},
        {"code": "id", "name": "Indonesian", "is_active": True, "is_default": False, "flag": "🇮🇩"},
        {"code": "ms", "name": "Malay", "is_active": True, "is_default": False, "flag": "🇲🇾"},
        {"code": "th", "name": "Thai", "is_active": True, "is_default": False, "flag": "🇹🇭"},
        {"code": "vi", "name": "Vietnamese", "is_active": True, "is_default": False, "flag": "🇻🇳"},
        {"code": "tr", "name": "Turkish", "is_active": True, "is_default": False, "flag": "🇹🇷"},
        {"code": "pl", "name": "Polish", "is_active": True, "is_default": False, "flag": "🇵🇱"},
        {"code": "sv", "name": "Swedish", "is_active": True, "is_default": False, "flag": "🇸🇪"},
        {"code": "hu", "name": "Hungarian", "is_active": True, "is_default": False, "flag": "🇭🇺"},
        {"code": "el", "name": "Greek", "is_active": True, "is_default": False, "flag": "🇬🇷"},
        {"code": "no", "name": "Norwegian", "is_active": True, "is_default": False, "flag": "🇳🇴"}
    ]
    
    # Filter to only website languages if requested
    if website_only:
        website_lang_codes = [
            'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW',
            'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
        ]
        predefined_languages = [lang for lang in predefined_languages if lang.get('code') in website_lang_codes]
    
    # Filter to only active languages if requested
    if is_active_filter:
        predefined_languages = [lang for lang in predefined_languages if lang.get('is_active', False)]
    
    current_app.logger.info(f"Returning predefined list of {len(predefined_languages)} languages")
    return jsonify(predefined_languages), 200

# Add a dedicated endpoint for website languages
@bp.route('/website-languages', methods=['GET'])
def get_website_languages():
    """Get languages that are specifically supported by the website frontend"""
    try:
        # Try to get languages from database first
        # This approach ensures consistency between all language endpoints
        languages = Language.query.all()
        
        if languages:
            # Website language codes - ensure consistency with TranslationModal.jsx
            website_lang_codes = [
                'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW',
                'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
            ]
            
            # Filter to only website languages
            website_languages = []
            for lang in languages:
                if lang.code in website_lang_codes:
                    website_languages.append({
                        "code": lang.code,
                        "name": lang.name,
                        "is_default": lang.is_default,
                        "is_active": lang.is_active,
                        "flag": lang.flag if hasattr(lang, 'flag') and lang.flag else None
                    })
            
            # Add flag field if missing (for backward compatibility)
            for lang in website_languages:
                if not lang.get('flag'):
                    # Set default flag based on language code
                    flags = {
                        'en': '🇬🇧', 'fr': '🇫🇷', 'es': '🇪🇸', 'de': '🇩🇪', 'it': '🇮🇹', 
                        'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh-TW': '🇹🇼',
                        'ar': '🇸🇦', 'nl': '🇳🇱', 'sv': '🇸🇪', 'tr': '🇹🇷', 'pl': '🇵🇱',
                        'hu': '🇭🇺', 'el': '🇬🇷', 'no': '🇳🇴', 'vi': '🇻🇳', 'th': '🇹🇭',
                        'id': '🇮🇩', 'ms': '🇲🇾'
                    }
                    lang['flag'] = flags.get(lang['code'], '🌐')
                    
            current_app.logger.info(f"Returning {len(website_languages)} website languages from database")
            return jsonify(website_languages), 200
    except Exception as e:
        current_app.logger.error(f"Error retrieving website languages from database: {e}")
        # Fall back to predefined languages if database query fails
    
    # These are the 22 languages supported by the website frontend
    website_languages = [
        {"code": "en", "name": "English", "is_active": True, "is_default": True, "flag": "🇬🇧"},
        {"code": "fr", "name": "French", "is_active": True, "is_default": False, "flag": "🇫🇷"},
        {"code": "es", "name": "Spanish", "is_active": True, "is_default": False, "flag": "🇪🇸"},
        {"code": "de", "name": "German", "is_active": True, "is_default": False, "flag": "🇩🇪"},
        {"code": "it", "name": "Italian", "is_active": True, "is_default": False, "flag": "🇮🇹"},
        {"code": "pt", "name": "Portuguese", "is_active": True, "is_default": False, "flag": "🇵🇹"},
        {"code": "ru", "name": "Russian", "is_active": True, "is_default": False, "flag": "🇷🇺"},
        {"code": "ja", "name": "Japanese", "is_active": True, "is_default": False, "flag": "🇯🇵"},
        {"code": "ko", "name": "Korean", "is_active": True, "is_default": False, "flag": "🇰🇷"},
        {"code": "zh-TW", "name": "Traditional Chinese", "is_active": True, "is_default": False, "flag": "🇹🇼"},
        {"code": "ar", "name": "Arabic", "is_active": True, "is_default": False, "flag": "🇸🇦"},
        {"code": "nl", "name": "Dutch", "is_active": True, "is_default": False, "flag": "🇳🇱"},
        {"code": "sv", "name": "Swedish", "is_active": True, "is_default": False, "flag": "🇸🇪"},
        {"code": "tr", "name": "Turkish", "is_active": True, "is_default": False, "flag": "🇹🇷"},
        {"code": "pl", "name": "Polish", "is_active": True, "is_default": False, "flag": "🇵🇱"},
        {"code": "hu", "name": "Hungarian", "is_active": True, "is_default": False, "flag": "🇭🇺"},
        {"code": "el", "name": "Greek", "is_active": True, "is_default": False, "flag": "🇬🇷"},
        {"code": "no", "name": "Norwegian", "is_active": True, "is_default": False, "flag": "🇳🇴"},
        {"code": "vi", "name": "Vietnamese", "is_active": True, "is_default": False, "flag": "🇻🇳"},
        {"code": "th", "name": "Thai", "is_active": True, "is_default": False, "flag": "🇹🇭"},
        {"code": "id", "name": "Indonesian", "is_active": True, "is_default": False, "flag": "🇮🇩"},
        {"code": "ms", "name": "Malay", "is_active": True, "is_default": False, "flag": "🇲🇾"}
    ]
    
    current_app.logger.info(f"Returning predefined list of {len(website_languages)} website languages")
    return jsonify(website_languages), 200

@bp.route('/languages', methods=['POST'])
@jwt_required()
def add_language():
    """Add a new language"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('code') or not data.get('name'):
        return jsonify({"error": "Language code and name are required"}), 400
    
    # Check if language already exists
    existing_language = Language.query.get(data['code'])
    if existing_language:
        return jsonify({"error": "Language already exists"}), 400
    
    # Set as default if it's the first language
    is_default = not Language.query.first()
    
    # Create new language
    new_language = Language(
        code=data['code'],
        name=data['name'],
        is_default=data.get('is_default', is_default),
        is_active=data.get('is_active', True)
    )
    
    # If this language is set as default, update any existing default languages
    if new_language.is_default:
        default_languages = Language.query.filter_by(is_default=True).all()
        for lang in default_languages:
            lang.is_default = False
    
    db.session.add(new_language)
    db.session.commit()
    
    return jsonify(new_language.to_dict()), 201

@bp.route('/languages/<code>', methods=['PUT'])
@jwt_required()
def update_language(code):
    """Update a language"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    language = Language.query.get(code)
    if not language:
        return jsonify({"error": "Language not found"}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'name' in data:
        language.name = data['name']
    if 'is_active' in data:
        language.is_active = data['is_active']
    if 'is_default' in data and data['is_default']:
        # Update any existing default languages
        default_languages = Language.query.filter_by(is_default=True).all()
        for lang in default_languages:
            lang.is_default = False
        language.is_default = True
    
    db.session.commit()
    
    return jsonify(language.to_dict()), 200

@bp.route('/languages/<code>', methods=['DELETE'])
@jwt_required()
def delete_language(code):
    """Delete a language"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    language = Language.query.get(code)
    if not language:
        return jsonify({"error": "Language not found"}), 404
    
    # Don't allow deleting the default language
    if language.is_default:
        return jsonify({"error": "Cannot delete the default language"}), 400
    
    # Check if language is in use
    translations = PostTranslation.query.filter_by(language_code=code).first()
    if translations:
        return jsonify({"error": "Language is in use and cannot be deleted"}), 400
    
    db.session.delete(language)
    db.session.commit()
    
    return jsonify({"message": "Language deleted successfully"}), 200

# Tag management
@bp.route('/tags', methods=['GET'])
def get_tags():
    """Get all tags"""
    tags = Tag.query.all()
    return jsonify({"tags": [tag.to_dict() for tag in tags]}), 200

@bp.route('/tags', methods=['POST'])
@jwt_required()
def add_tag():
    """Add a new tag"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('name'):
        return jsonify({"error": "Tag name is required"}), 400
    
    # Generate slug from name if not provided
    if not data.get('slug'):
        # Convert to lowercase, replace spaces with hyphens
        slug = data['name'].lower().replace(' ', '-')
        # Remove special characters
        import re
        slug = re.sub(r'[^a-z0-9-]', '', slug)
    else:
        slug = data['slug']
    
    # Check if tag already exists
    existing_tag = Tag.query.filter(or_(Tag.name == data['name'], Tag.slug == slug)).first()
    if existing_tag:
        return jsonify({"error": "Tag already exists"}), 400
    
    # Create new tag
    new_tag = Tag(
        name=data['name'],
        slug=slug,
        description=data.get('description', '')
    )
    
    db.session.add(new_tag)
    db.session.commit()
    
    return jsonify(new_tag.to_dict()), 201

@bp.route('/tags/<int:tag_id>', methods=['PUT'])
@jwt_required()
def update_tag(tag_id):
    """Update a tag"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "Tag not found"}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'name' in data:
        tag.name = data['name']
    if 'slug' in data:
        tag.slug = data['slug']
    if 'description' in data:
        tag.description = data['description']
    
    db.session.commit()
    
    return jsonify(tag.to_dict()), 200

@bp.route('/tags/<int:tag_id>', methods=['DELETE'])
@jwt_required()
def delete_tag(tag_id):
    """Delete a tag"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    tag = Tag.query.get(tag_id)
    if not tag:
        return jsonify({"error": "Tag not found"}), 404
    
    db.session.delete(tag)
    db.session.commit()
    
    return jsonify({"message": "Tag deleted successfully"}), 200

# AI Content Generation
@bp.route('/posts/generate-content', methods=['POST'])
@jwt_required()
def ai_generate_content():
    """Generate blog content using AI"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('title'):
        return jsonify({"error": "Blog post title is required"}), 400
    
    # Get optional parameters
    language = data.get('language', 'en')
    length = data.get('length', 'medium')  # short, medium, long
    
    # Generate content
    result = generate_blog_content(data['title'], language, length)
    
    if not result.get('success', False):
        return jsonify({"error": result.get('error', 'Failed to generate content')}), 500
    
    return jsonify(result), 200

# Post management
@bp.route('/posts', methods=['GET'])
def get_posts():
    """Get all posts with optional filters"""
    # Get query parameters
    status = request.args.get('status')
    language = request.args.get('language')
    tag = request.args.get('tag')
    search = request.args.get('search')
    
    # Base query
    query = Post.query
    
    # Apply filters
    if status:
        query = query.filter(Post.status == status)
    
    if tag:
        query = query.join(Post.tags).filter(Tag.slug == tag)
    
    if search:
        search_term = f"%{search}%"
        # Search in translations
        query = query.join(PostTranslation).filter(
            or_(
                PostTranslation.title.like(search_term),
                PostTranslation.content.like(search_term)
            )
        )
    
    # Execute query
    posts = query.order_by(Post.created_at.desc()).all()
    
    # Format results
    result = []
    for post in posts:
        post_dict = post.to_dict(include_translations=True, language=language)
        result.append(post_dict)
    
    return jsonify(result), 200

@bp.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    """Get a specific post"""
    language = request.args.get('language')
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    return jsonify(post.to_dict(include_translations=True, language=language)), 200

@bp.route('/posts/by-slug/<slug>', methods=['GET'])
def get_post_by_slug(slug):
    """Get a specific post by slug"""
    language = request.args.get('language')
    
    post = Post.query.filter_by(slug=slug).first()
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    return jsonify(post.to_dict(include_translations=True, language=language)), 200

@bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    """Create a new post"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    data = request.get_json()
    
    # Validate required fields
    if not data or not data.get('slug'):
        return jsonify({"error": "Post slug is required"}), 400
    
    # Check if slug already exists
    existing_post = Post.query.filter_by(slug=data['slug']).first()
    if existing_post:
        return jsonify({"error": "Post with this slug already exists"}), 400
    
    # Create new post
    new_post = Post(
        slug=data['slug'],
        featured_image=data.get('featured_image'),
        author_id=user.id,
        status=data.get('status', 'draft')
    )
    
    # Set published_at date if status is published
    if new_post.status == 'published' and not data.get('published_at'):
        new_post.published_at = datetime.utcnow()
    elif data.get('published_at'):
        try:
            new_post.published_at = datetime.fromisoformat(data['published_at'])
        except (ValueError, TypeError):
            pass
    
    # Add tags if provided
    if data.get('tags'):
        for tag_id in data['tags']:
            tag = Tag.query.get(tag_id)
            if tag:
                new_post.tags.append(tag)
    
    # Add translations if provided
    if data.get('translations'):
        for trans_data in data['translations']:
            language_code = trans_data.get('language_code')
            title = trans_data.get('title')
            content = trans_data.get('content')
            
            if language_code and title and content:
                translation = PostTranslation(
                    language_code=language_code,
                    title=title,
                    content=content,
                    meta_title=trans_data.get('meta_title', title),
                    meta_description=trans_data.get('meta_description', ''),
                    meta_keywords=trans_data.get('meta_keywords', '')
                )
                new_post.translations.append(translation)
    
    db.session.add(new_post)
    db.session.commit()
    
    return jsonify(new_post.to_dict()), 201

@bp.route('/posts/<int:post_id>', methods=['PUT'])
@jwt_required()
def update_post(post_id):
    """Update a post"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'slug' in data:
        # Check if slug already exists for another post
        existing_post = Post.query.filter(and_(Post.slug == data['slug'], Post.id != post_id)).first()
        if existing_post:
            return jsonify({"error": "Post with this slug already exists"}), 400
        post.slug = data['slug']
    
    if 'featured_image' in data:
        post.featured_image = data['featured_image']
    
    if 'status' in data:
        old_status = post.status
        post.status = data['status']
        
        # Set published_at date if status is changing to published
        if old_status != 'published' and post.status == 'published' and not post.published_at:
            post.published_at = datetime.utcnow()
    
    if 'published_at' in data:
        try:
            post.published_at = datetime.fromisoformat(data['published_at'])
        except (ValueError, TypeError):
            pass
    
    # Update tags if provided
    if 'tags' in data:
        # Clear existing tags
        post.tags = []
        
        # Add new tags
        for tag_id in data['tags']:
            tag = Tag.query.get(tag_id)
            if tag:
                post.tags.append(tag)
    
    # Update translations if provided
    if 'translations' in data:
        # Track if English translation was updated
        english_updated = False
        english_translation_data = None
        
        # First pass: Update existing translations and identify if English was updated
        for trans_data in data['translations']:
            language_code = trans_data.get('language_code')
            
            if not language_code:
                continue
                
            # Keep track of English translation for potential auto-translation
            if language_code == 'en':
                english_updated = True
                english_translation_data = trans_data
            
            # Find existing translation or create new one
            translation = next((t for t in post.translations if t.language_code == language_code), None)
            
            if translation:
                # Update existing translation
                if 'title' in trans_data:
                    translation.title = trans_data['title']
                if 'content' in trans_data:
                    translation.content = trans_data['content']
                if 'meta_title' in trans_data:
                    translation.meta_title = trans_data['meta_title']
                if 'meta_description' in trans_data:
                    translation.meta_description = trans_data['meta_description']
                if 'meta_keywords' in trans_data:
                    translation.meta_keywords = trans_data['meta_keywords']
                    
                # Mark as manually edited (not auto-translated)
                translation.is_auto_translated = False
            else:
                # Create new translation
                title = trans_data.get('title')
                content = trans_data.get('content')
                
                if title and content:
                    new_translation = PostTranslation(
                        language_code=language_code,
                        title=title,
                        content=content,
                        meta_title=trans_data.get('meta_title', title),
                        meta_description=trans_data.get('meta_description', ''),
                        meta_keywords=trans_data.get('meta_keywords', ''),
                        is_auto_translated=False
                    )
                    post.translations.append(new_translation)
        
        # If English content was updated, auto-translate to all other languages
        if english_updated and english_translation_data and translation_service.is_available():
            current_app.logger.info("English content updated, auto-translating to other languages")
            
            # Get all available languages
            all_languages = Language.query.filter_by(is_active=True).all()
            
            for language in all_languages:
                # Skip English as it's the source language
                if language.code == 'en':
                    continue
                
                # Check if this language translation exists and was manually edited
                existing_translation = next((t for t in post.translations if t.language_code == language.code), None)
                
                # Only auto-translate if:
                # 1. Translation doesn't exist, or
                # 2. Translation exists but was previously auto-translated
                if not existing_translation or existing_translation.is_auto_translated:
                    current_app.logger.info(f"Auto-translating to {language.code}")
                    
                    # Perform the translation
                    translated_data = translation_service.translate_post_fields(
                        english_translation_data, 
                        from_lang_code='en', 
                        to_lang_code=language.code
                    )
                    
                    if translated_data:
                        if existing_translation:
                            # Update existing translation with auto-translated content
                            existing_translation.title = translated_data.get('title', existing_translation.title)
                            existing_translation.content = translated_data.get('content', existing_translation.content)
                            existing_translation.meta_title = translated_data.get('meta_title', existing_translation.meta_title)
                            existing_translation.meta_description = translated_data.get('meta_description', existing_translation.meta_description)
                            existing_translation.meta_keywords = translated_data.get('meta_keywords', existing_translation.meta_keywords)
                            existing_translation.is_auto_translated = True
                        else:
                            # Create new auto-translated entry
                            new_translation = PostTranslation(
                                language_code=language.code,
                                title=translated_data.get('title', ''),
                                content=translated_data.get('content', ''),
                                meta_title=translated_data.get('meta_title', ''),
                                meta_description=translated_data.get('meta_description', ''),
                                meta_keywords=translated_data.get('meta_keywords', ''),
                                is_auto_translated=True
                            )
                            post.translations.append(new_translation)
                    else:
                        current_app.logger.warning(f"Failed to auto-translate to {language.code}")
            
    
    db.session.commit()
    
    return jsonify(post.to_dict()), 200

@bp.route('/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    """Delete a post"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    # Delete the post (cascading will delete translations and media)
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"message": "Post deleted successfully"}), 200

@bp.route('/posts/<int:post_id>/translations/<language_code>', methods=['DELETE'])
@jwt_required()
def delete_translation(post_id, language_code):
    """Delete a specific translation"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    translation = PostTranslation.query.filter_by(post_id=post_id, language_code=language_code).first()
    if not translation:
        return jsonify({"error": "Translation not found"}), 404
    
    db.session.delete(translation)
    db.session.commit()
    
    return jsonify({"message": "Translation deleted successfully"}), 200

@bp.route('/posts/force-translate-es-fr', methods=['POST'])
@jwt_required()
def force_translate_es_fr_endpoint():
    """Force translate all posts to Spanish and French"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
        
    # Import and run the force translation script
    from app.cms.force_translate_es_fr import force_translate_es_fr
    result = force_translate_es_fr()
    
    if result.get('success', False):
        return jsonify({
            "message": "Successfully translated posts to Spanish and French",
            "results": result
        }), 200
    else:
        return jsonify({
            "error": "Failed to translate posts",
            "details": result.get('error', 'Unknown error')
        }), 500

@bp.route('/posts/auto-translate-all', methods=['POST'])
@jwt_required()
def auto_translate_all_posts():
    """Auto-translate all posts with English content to all languages"""
    try:
        # Check admin access
        user = check_admin_access()
        if not user:
            return jsonify({"error": "Admin access required"}), 403
        
        # Get optional parameters from request
        data = request.get_json() or {}
        batch_size = data.get('batch_size', 10)  # Default to 10 posts at a time
        languages_to_translate = data.get('languages', [])  # Default to all languages
        post_ids_to_translate = data.get('post_ids', [])  # Default to all posts
        force_translate = data.get('force_translate', False)  # Default to not overwriting manual translations
        placeholder_mode = data.get('placeholder_mode', True)  # Default to placeholder mode
        
        # Get predefined languages from our hardcoded list (22 languages)
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
            {"code": "cs", "name": "Czech"},
            {"code": "sv", "name": "Swedish"}
        ]
        
        # Create dict to map codes to names
        lang_names = {lang["code"]: lang["name"] for lang in SUPPORTED_LANGUAGES}
        
        # Get all active languages from database
        all_languages = Language.query.filter_by(is_active=True).all()
        current_app.logger.info(f"Found {len(all_languages)} active languages in database")
        
        # Get list of language codes from database
        db_language_codes = [lang.code for lang in all_languages]
        
        # Use predefined language list if database doesn't have enough languages
        if len(db_language_codes) < 10:
            current_app.logger.info(f"Using predefined language list instead of database (only {len(db_language_codes)} found in db)")
            all_language_codes = [lang["code"] for lang in SUPPORTED_LANGUAGES]
        else:
            all_language_codes = db_language_codes
        
        # Filter languages if specified
        if languages_to_translate:
            filtered_language_codes = [code for code in all_language_codes if code in languages_to_translate]
            current_app.logger.info(f"Filtered to {len(filtered_language_codes)} specific languages: {', '.join(filtered_language_codes)}")
        else:
            filtered_language_codes = all_language_codes
        
        # Make sure English is excluded from translation targets
        filtered_language_codes = [code for code in filtered_language_codes if code != 'en']
        
        # Get all published posts that have English translations
        query = Post.query.join(PostTranslation).filter(
            PostTranslation.language_code == 'en'
        )
        
        # Filter posts by ID if specified
        if post_ids_to_translate:
            query = query.filter(Post.id.in_(post_ids_to_translate))
            
        posts = query.all()
        current_app.logger.info(f"Found {len(posts)} posts with English content to translate")
        
        # Process all posts if requested, otherwise limit to batch size
        posts_to_process = posts[:batch_size] if batch_size > 0 else posts
        remaining_posts = len(posts) - len(posts_to_process)
        
        current_app.logger.info(f"Processing batch of {len(posts_to_process)} posts ({remaining_posts} remaining)")
        
        results = {
            'total_posts': len(posts_to_process),
            'remaining_posts': remaining_posts,
            'total_languages': len(filtered_language_codes),
            'successfully_translated_posts': 0,
            'failed_posts': 0,
            'skipped_languages': 0,
            'translated_languages': 0,
            'details': []
        }
    
        # Process each post
        for post in posts_to_process:
            post_result = {
                'post_id': post.id,
                'post_slug': post.slug,
                'successful_languages': [],
                'failed_languages': [],
                'skipped_languages': []
            }
            
            # Get English translation
            english_translation = next((t for t in post.translations if t.language_code == 'en'), None)
            if not english_translation:
                current_app.logger.warning(f"Post {post.id} has no English translation despite query filter")
                continue
                
            # Prepare English translation data
            english_translation_data = {
                'title': english_translation.title,
                'content': english_translation.content,
                'meta_title': english_translation.meta_title,
                'meta_description': english_translation.meta_description,
                'meta_keywords': english_translation.meta_keywords
            }
            
            # Translate to each language
            for lang_code in filtered_language_codes:
                if lang_code == 'en':  # Skip English
                    continue
                    
                # Check if translation exists
                existing_translation = next((t for t in post.translations if t.language_code == lang_code), None)
                
                # Skip if translation exists and is manually edited (unless forced)
                if existing_translation and not existing_translation.is_auto_translated and not force_translate:
                    post_result['skipped_languages'].append(lang_code)
                    results['skipped_languages'] += 1
                    continue
                
                # Get language name
                lang_name = lang_names.get(lang_code, lang_code)
                    
                # Try to use translation service if available and not in placeholder mode
                translated_data = None
                if not placeholder_mode and translation_service.is_available():
                    # Perform translation
                    current_app.logger.info(f"Translating post {post.id} to {lang_code} using DeepSeek")
                    translated_data = translation_service.translate_post_fields(
                        english_translation_data, 
                        from_lang_code='en', 
                        to_lang_code=lang_code
                    )
                
                # If translation service failed or we're in placeholder mode, create placeholder
                if not translated_data:
                    current_app.logger.info(f"Creating placeholder translation for post {post.id} to {lang_code}")
                    # Create placeholder translations
                    translated_data = {
                        'title': f"[{lang_name}] {english_translation.title}",
                        'content': f"""
[This is an automatic placeholder for {lang_name} translation]

{english_translation.content}

[End of placeholder translation. This will be replaced with proper {lang_name} translation.]
                        """.strip(),
                        'meta_title': f"[{lang_name}] {english_translation.meta_title}" if english_translation.meta_title else "",
                        'meta_description': english_translation.meta_description,
                        'meta_keywords': english_translation.meta_keywords
                    }
                
                # Update if translation exists, create if not
                try:
                    now = datetime.utcnow()
                    if existing_translation:
                        existing_translation.title = translated_data.get('title', existing_translation.title)
                        existing_translation.content = translated_data.get('content', existing_translation.content)
                        existing_translation.meta_title = translated_data.get('meta_title', existing_translation.meta_title)
                        existing_translation.meta_description = translated_data.get('meta_description', existing_translation.meta_description)
                        existing_translation.meta_keywords = translated_data.get('meta_keywords', existing_translation.meta_keywords)
                        existing_translation.updated_at = now
                        existing_translation.is_auto_translated = True
                    else:
                        # Create new translation
                        new_translation = PostTranslation(
                            post_id=post.id,
                            language_code=lang_code,
                            title=translated_data.get('title', ''),
                            content=translated_data.get('content', ''),
                            meta_title=translated_data.get('meta_title', ''),
                            meta_description=translated_data.get('meta_description', ''),
                            meta_keywords=translated_data.get('meta_keywords', ''),
                            created_at=now,
                            updated_at=now,
                            is_auto_translated=True
                        )
                        db.session.add(new_translation)
                    
                    post_result['successful_languages'].append(lang_code)
                    results['translated_languages'] += 1
                except Exception as ex:
                    current_app.logger.error(f"Error creating translation for post {post.id} to {lang_code}: {str(ex)}")
                    post_result['failed_languages'].append(lang_code)
                    results['failed_posts'] += 1
                    
            # Add this post's results to the overall results
            if len(post_result['successful_languages']) > 0:
                results['successfully_translated_posts'] += 1
                
            results['details'].append(post_result)
            
            # Commit after each post to avoid losing all work if there's an error
            db.session.commit()
        
        return jsonify({
            'message': 'Auto-translation of all posts completed',
            'results': results
        }), 200
    
    except Exception as e:
        current_app.logger.error(f"Error in auto-translate-all posts: {str(e)}")
        
        # Try to rollback if needed
        try:
            db.session.rollback()
        except:
            pass
            
        return jsonify({
            'error': 'Failed to auto-translate posts',
            'message': str(e)
        }), 500
    
@bp.route('/posts/<int:post_id>/auto-translate', methods=['POST'])
@jwt_required()
def auto_translate_post(post_id):
    """Trigger auto-translation for a post based on its English content"""
    try:
        # Check admin access
        user = check_admin_access()
        if not user:
            return jsonify({"error": "Admin access required"}), 403
        
        post = Post.query.get(post_id)
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Check if translation service is available
        if not translation_service.is_available():
            current_app.logger.error("Translation service is not available - DEEPSEEK_API_KEY may be missing or invalid")
            return jsonify({"error": "Translation service is not available. Please check your DEEPSEEK_API_KEY."}), 503
        
        # Check if English translation exists
        english_translation = next((t for t in post.translations if t.language_code == 'en'), None)
        if not english_translation:
            return jsonify({"error": "English translation not found. Auto-translation requires English content as the source."}), 400
            
        # Prepare English translation data
        english_translation_data = {
            'title': english_translation.title,
            'content': english_translation.content,
            'meta_title': english_translation.meta_title,
            'meta_description': english_translation.meta_description,
            'meta_keywords': english_translation.meta_keywords
        }
        
        # Get optional parameters
        data = request.get_json() or {}
        force_translate = data.get('force_translate', False)
        target_languages = data.get('target_languages', [])
        
        # Get all active languages
        all_languages = Language.query.filter_by(is_active=True).all()
        current_app.logger.info(f"Found {len(all_languages)} active languages for translation")
        
        # Track translation results
        results = {
            'successful': [],
            'failed': [],
            'skipped': []
        }
        
        # Get website languages if available (to focus on these first)
        website_languages = []
        try:
            # These are the 22 languages typically supported by the website frontend
            website_lang_codes = [
                'en', 'fr', 'es', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh-TW',
                'ar', 'nl', 'sv', 'tr', 'pl', 'hu', 'el', 'no', 'vi', 'th', 'id', 'ms'
            ]
            # Filter active languages to match website languages
            website_languages = [lang for lang in all_languages if lang.code in website_lang_codes]
            current_app.logger.info(f"Found {len(website_languages)} website languages")
        except Exception as e:
            current_app.logger.error(f"Error getting website languages: {str(e)}")
            # If this fails, we'll just use all_languages
        
        # Filter languages to process
        languages_to_process = []
        
        # First handle specifically requested languages (if any)
        if target_languages:
            # Process target languages in requested order
            current_app.logger.info(f"Processing specifically requested languages: {target_languages}")
            for lang_code in target_languages:
                # Skip English as it's the source language
                if lang_code == 'en':
                    continue
                
                # Find the language object
                language = next((lang for lang in all_languages if lang.code == lang_code), None)
                if not language:
                    current_app.logger.warning(f"Requested language {lang_code} not found or not active")
                    results['failed'].append(lang_code)
                    continue
                
                # Check if translation exists
                existing_translation = next((t for t in post.translations if t.language_code == lang_code), None)
                
                # Add to processing list
                languages_to_process.append((language, existing_translation))
        else:
            # No specific languages requested, process all website languages first, then others
            # Start with the website languages
            for language in website_languages:
                # Skip English as it's the source language
                if language.code == 'en':
                    continue
                
                # Check if translation exists
                existing_translation = next((t for t in post.translations if t.language_code == language.code), None)
                
                # Add to processing list (website languages take priority)
                languages_to_process.append((language, existing_translation))
            
            # Add any remaining non-website languages
            for language in all_languages:
                # Skip if already in processing list (website languages) or if English
                if language.code == 'en' or language in website_languages:
                    continue
                
                # Check if translation exists
                existing_translation = next((t for t in post.translations if t.language_code == language.code), None)
                
                # Skip if translation exists and is manually edited, unless force_translate is true
                if existing_translation and not existing_translation.is_auto_translated and not force_translate:
                    results['skipped'].append(language.code)
                    continue
                    
                # Add to processing list
                languages_to_process.append((language, existing_translation))
        
        # Process in smaller batches to prevent timeouts and memory issues
        BATCH_SIZE = 5
        for i in range(0, len(languages_to_process), BATCH_SIZE):
            batch = languages_to_process[i:i+BATCH_SIZE]
            current_app.logger.info(f"Processing batch {i//BATCH_SIZE + 1}: {[lang.code for lang, _ in batch]}")
            
            # Commit after each batch to prevent large transactions
            for language, existing_translation in batch:
                try:
                    # Perform the translation
                    current_app.logger.info(f"Auto-translating post {post_id} to {language.code}")
                    translated_data = translation_service.translate_post_fields(
                        english_translation_data, 
                        from_lang_code='en', 
                        to_lang_code=language.code
                    )
                    
                    if translated_data:
                        if existing_translation:
                            # Update existing translation
                            existing_translation.title = translated_data.get('title', existing_translation.title)
                            existing_translation.content = translated_data.get('content', existing_translation.content)
                            existing_translation.meta_title = translated_data.get('meta_title', existing_translation.meta_title)
                            existing_translation.meta_description = translated_data.get('meta_description', existing_translation.meta_description)
                            existing_translation.meta_keywords = translated_data.get('meta_keywords', existing_translation.meta_keywords)
                            existing_translation.is_auto_translated = True
                        else:
                            # Create new translation
                            new_translation = PostTranslation(
                                post_id=post_id,
                                language_code=language.code,
                                title=translated_data.get('title', ''),
                                content=translated_data.get('content', ''),
                                meta_title=translated_data.get('meta_title', ''),
                                meta_description=translated_data.get('meta_description', ''),
                                meta_keywords=translated_data.get('meta_keywords', ''),
                                is_auto_translated=True
                            )
                            db.session.add(new_translation)
                            
                        results['successful'].append(language.code)
                    else:
                        results['failed'].append(language.code)
                except Exception as e:
                    current_app.logger.error(f"Error translating to {language.code}: {str(e)}")
                    results['failed'].append(language.code)
            
            # Commit after each batch
            db.session.commit()
            current_app.logger.info(f"Committed batch {i//BATCH_SIZE + 1}")
            
        # Final commit to ensure all changes are saved
        db.session.commit()
        
        return jsonify({
            'message': 'Auto-translation completed',
            'translations': results
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in auto-translate post {post_id}: {str(e)}")
        
        # Try to rollback if needed
        try:
            db.session.rollback()
        except:
            pass
            
        return jsonify({
            'error': 'Failed to auto-translate post',
            'message': str(e)
        }), 500

# Media management
@bp.route('/posts/<int:post_id>/media', methods=['POST'])
@jwt_required()
def upload_media(post_id):
    """Upload media for a post"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    
    # If user does not select file, browser also
    # submit an empty part without filename
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        # Secure filename and add unique ID to prevent collisions
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        
        # Determine file type
        file_ext = filename.rsplit('.', 1)[1].lower()
        if file_ext in ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']:
            file_type = 'image'
        elif file_ext in ['pdf']:
            file_type = 'document'
        else:
            file_type = 'other'
        
        # Create uploads directory for CMS if it doesn't exist
        cms_upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], 'cms')
        os.makedirs(cms_upload_folder, exist_ok=True)
        
        # Save the file
        file_path = os.path.join(cms_upload_folder, unique_filename)
        file.save(file_path)
        
        # Create media record
        new_media = PostMedia(
            post_id=post_id,
            file_path=f"/api/uploads/cms/{unique_filename}",
            file_type=file_type,
            alt_text=request.form.get('alt_text', ''),
            title=request.form.get('title', '')
        )
        
        db.session.add(new_media)
        db.session.commit()
        
        # Return in a format expected by the frontend
        return jsonify({
            "media": new_media.to_dict(),
            "message": "Media uploaded successfully"
        }), 201
    
    return jsonify({"error": "File type not allowed"}), 400

@bp.route('/posts/<int:post_id>/media', methods=['GET'])
def get_post_media(post_id):
    """Get all media for a post"""
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"error": "Post not found"}), 404
    
    media = PostMedia.query.filter_by(post_id=post_id).all()
    
    # Format response to match frontend expectations
    return jsonify({
        "media": [m.to_dict() for m in media],
        "message": "Media retrieved successfully"
    }), 200

@bp.route('/media/<int:media_id>', methods=['PUT'])
@jwt_required()
def update_media(media_id):
    """Update media metadata"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    media = PostMedia.query.get(media_id)
    if not media:
        return jsonify({"error": "Media not found"}), 404
    
    data = request.get_json()
    
    # Update fields
    if 'alt_text' in data:
        media.alt_text = data['alt_text']
    if 'title' in data:
        media.title = data['title']
    
    db.session.commit()
    
    return jsonify(media.to_dict()), 200

@bp.route('/media/<int:media_id>', methods=['DELETE'])
@jwt_required()
def delete_media(media_id):
    """Delete media"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({"error": "Admin access required"}), 403
    
    media = PostMedia.query.get(media_id)
    if not media:
        return jsonify({"error": "Media not found"}), 404
    
    # Delete the physical file
    try:
        # Extract filename from the path
        filename = media.file_path.split('/')[-1]
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], 'cms', filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        current_app.logger.error(f"Error deleting media file: {e}")
    
    # Delete the database record
    db.session.delete(media)
    db.session.commit()
    
    return jsonify({"message": "Media deleted successfully"}), 200

# Public Blog API
@bp.route('/blog', methods=['GET'])
def get_blog_posts():
    """Get published blog posts for public consumption"""
    try:
        # Get query parameters
        language = request.args.get('language')
        tag = request.args.get('tag')
        search = request.args.get('search')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('limit', 10, type=int)  # Use 'limit' for consistency with frontend
        
        current_app.logger.info(f"GET /blog - Params: language={language}, tag={tag}, search={search}, page={page}, per_page={per_page}")
        
        # Limit per_page to avoid potential performance issues
        per_page = min(per_page, 50)
        
        # Base query - only published posts
        query = Post.query.filter_by(status='published')
        
        # Log the initial query SQL
        current_app.logger.info(f"Initial query: {str(query)}")
        current_app.logger.info(f"Total posts in database: {Post.query.count()}")
        current_app.logger.info(f"Published posts: {Post.query.filter_by(status='published').count()}")
        
        # We don't filter by language anymore - instead we'll include all posts and handle 
        # fallback translations in the response formatting
        if language:
            current_app.logger.info(f"Language requested: {language} - Will provide fallbacks if needed")
            
        # Apply tag filter
        if tag:
            query = query.join(Post.tags).filter(Tag.slug == tag)
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            # Search in translations
            if not language:  # Only add this join if we haven't already joined for language filtering
                query = query.join(PostTranslation)
            query = query.filter(
                or_(
                    PostTranslation.title.like(search_term),
                    PostTranslation.content.like(search_term)
                )
            )
        
        # Order by published date (newest first)
        query = query.order_by(Post.published_at.desc())
        
        # Get total count for pagination
        total = query.count()
        current_app.logger.info(f"Total posts matching filters: {total}")
        
        # Paginate
        posts = query.offset((page - 1) * per_page).limit(per_page).all()
        current_app.logger.info(f"Retrieved posts count: {len(posts)}")
        
        # Format results
        result = []
        for post in posts:
            post_dict = post.to_dict(include_translations=True, language=language)
            
            # The post_dict will always have 'translation' for the requested language
            # because our query is already filtering for posts with the right language
            result.append(post_dict)
        
        # Calculate total pages
        total_pages = (total + per_page - 1) // per_page if total > 0 else 1
        
        # Return with pagination metadata
        return jsonify({
            'posts': result,
            'total_pages': total_pages,
            'pagination': {
                'total': total,
                'page': page,
                'per_page': per_page,
                'pages': total_pages
            }
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_blog_posts: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

@bp.route('/blog/<slug>', methods=['GET'])
def get_blog_post_by_slug(slug):
    """Get a specific published blog post by slug for public consumption"""
    try:
        # Get query parameters
        language = request.args.get('language')
        
        current_app.logger.info(f"GET /blog/{slug} - Params: language={language}")
        
        # Find the published post with the given slug
        post = Post.query.filter_by(slug=slug, status='published').first()
        current_app.logger.info(f"Post found: {post is not None}")
        
        if not post:
            current_app.logger.info(f"No published post found with slug: {slug}")
            # Try to find any post with this slug regardless of status to debug
            any_post = Post.query.filter_by(slug=slug).first()
            if any_post:
                current_app.logger.info(f"Found post with slug {slug} but status is {any_post.status}")
            return jsonify({"error": "Blog post not found"}), 404
    
        # If language is specified, verify that the post has a translation in that language
        if language:
            has_translation = False
            for trans in post.translations:
                if trans.language_code == language:
                    has_translation = True
                    break
                    
            if not has_translation:
                current_app.logger.info(f"No translation found for language: {language}")
                # Return available languages so the client can offer alternatives
                available_langs = [t.language_code for t in post.translations]
                current_app.logger.info(f"Available languages: {available_langs}")
                
                # If English is available, suggest it as default
                if 'en' in available_langs:
                    suggested_language = 'en'
                else:
                    suggested_language = available_langs[0] if available_langs else None
                    
                return jsonify({
                    "error": f"This post is not available in {language}",
                    "available_languages": available_langs,
                    "suggested_language": suggested_language
                }), 404
    
        # Format the post with comprehensive data
        post_data = post.to_dict(include_translations=True, language=language)
        
        # Get author details
        author = User.query.get(post.author_id)
        author_data = {
            "id": author.id,
            "name": author.username,
            # Add other author fields as needed
        }
        
        # Find related posts (similar tags, limit to 3)
        # Also filter related posts to only include those available in the requested language
        if post.tags:
            tag_ids = [tag.id for tag in post.tags]
            related_posts_query = Post.query.filter(
                Post.id != post.id, 
                Post.status == 'published'
            )
            
            # Filter by language if specified
            if language:
                # Use subquery to find posts with the requested language
                lang_subquery = db.session.query(PostTranslation.post_id).filter(
                    PostTranslation.language_code == language
                ).subquery()
                
                related_posts_query = related_posts_query.filter(Post.id.in_(lang_subquery))
                
            # Continue building the query
            related_posts_query = (
                related_posts_query
                .join(Post.tags)
                .filter(Tag.id.in_(tag_ids))
                .group_by(Post.id)
                .order_by(Post.published_at.desc())
                .limit(3)
            )
            
            related_posts = [p.to_dict(include_translations=True, language=language) for p in related_posts_query.all()]
        else:
            # If no tags, get the latest 3 published posts that aren't this one
            related_posts_query = Post.query.filter(
                Post.id != post.id, 
                Post.status == 'published'
            )
            
            # Filter by language if specified
            if language:
                # Use subquery to find posts with the requested language
                lang_subquery = db.session.query(PostTranslation.post_id).filter(
                    PostTranslation.language_code == language
                ).subquery()
                
                related_posts_query = related_posts_query.filter(Post.id.in_(lang_subquery))
                
            # Continue building the query
            related_posts_query = (
                related_posts_query
                .order_by(Post.published_at.desc())
                .limit(3)
            )
            
            related_posts = [p.to_dict(include_translations=True, language=language) for p in related_posts_query.all()]
        
        # Get available languages for this post
        available_languages = []
        used_languages = set(trans.language_code for trans in post.translations)
        all_languages = Language.query.all()
        for lang in all_languages:
            if lang.code in used_languages:
                available_languages.append({
                    "code": lang.code,
                    "name": lang.name,
                    "is_default": lang.is_default
                })
        
        # Get the content for the requested language
        content = None
        title = None
        meta_description = None
        excerpt = None
        for trans in post.translations:
            if (language and trans.language_code == language) or (not language and trans.language_code == 'en'):
                content = trans.content
                title = trans.title
                meta_description = trans.meta_description
                
                # Generate excerpt from content if not provided
                if trans.content:
                    # Strip HTML tags and limit to ~200 characters
                    import re
                    plain_text = re.sub(r'<[^>]*>', '', trans.content)
                    excerpt = plain_text[:200] + ('...' if len(plain_text) > 200 else '')
                break
        
        # Return a more comprehensive response for the blog post page
        return jsonify({
            "post": {
                "id": post.id,
                "slug": post.slug,
                "title": title,
                "content": content,
                "excerpt": excerpt,
                "meta_description": meta_description,
                "featured_image": post.featured_image,
                "created_at": post.created_at.isoformat(),
                "updated_at": post.updated_at.isoformat() if post.updated_at else None,
                "published_at": post.published_at.isoformat() if post.published_at else None,
                "author": author_data,
                "tags": [tag.to_dict() for tag in post.tags]
            },
            "related_posts": related_posts,
            "available_languages": available_languages,
            "current_language": language or "en"
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error in get_blog_post_by_slug: {str(e)}")
        import traceback
        current_app.logger.error(traceback.format_exc())
        return jsonify({"error": "Internal server error", "details": str(e)}), 500