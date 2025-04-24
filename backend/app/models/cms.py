from datetime import datetime
from app import db
from sqlalchemy import Text

# Association table for many-to-many relationship between posts and tags
post_tags = db.Table('cms_post_tags',
    db.Column('post_id', db.Integer, db.ForeignKey('cms_posts.id'), primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('cms_tags.id'), primary_key=True)
)

class Post(db.Model):
    """
    Blog post model with support for multiple languages and SEO
    """
    __tablename__ = 'cms_posts'
    
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(255), nullable=False, unique=True)
    featured_image = db.Column(db.String(255))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    published_at = db.Column(db.DateTime)
    
    # Relationships
    translations = db.relationship('PostTranslation', backref='post', lazy=True, cascade="all, delete-orphan")
    media = db.relationship('PostMedia', backref='post', lazy=True, cascade="all, delete-orphan")
    tags = db.relationship('Tag', secondary=post_tags, backref=db.backref('posts', lazy='dynamic'))
    
    def to_dict(self, include_translations=True, language=None):
        """Convert post to dictionary for API responses"""
        import logging
        logger = logging.getLogger('flask.app')
        
        logger.info(f"Converting post {self.id} to dict, include_translations={include_translations}, language={language}")
        
        # Log some debug info about this post
        logger.info(f"Post {self.id}: slug={self.slug}, status={self.status}, translations_count={len(self.translations)}")
        
        result = {
            'id': self.id,
            'slug': self.slug,
            'featured_image': self.featured_image,
            'author_id': self.author_id,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'published_at': self.published_at.isoformat() if self.published_at else None,
            'media': [media.to_dict() for media in self.media],
            'tags': [tag.to_dict() for tag in self.tags]
        }
        
        if include_translations:
            if language:
                # First try to get the requested language
                logger.info(f"Looking for translation in language: {language}")
                translation = next((t for t in self.translations if t.language_code == language), None)
                
                if translation:
                    logger.info(f"Found translation for language {language}")
                    result['translation'] = translation.to_dict()
                    # Set a flag to indicate this is the requested language
                    result['translation']['is_requested_language'] = True
                else:
                    # Try to get English as fallback
                    logger.info(f"No translation found for language {language}, trying English fallback")
                    en_translation = next((t for t in self.translations if t.language_code == 'en'), None)
                    
                    if en_translation:
                        logger.info(f"Using English translation as fallback")
                        result['translation'] = en_translation.to_dict()
                        # Set a flag to indicate this is a fallback language
                        result['translation']['is_requested_language'] = False
                        result['translation']['is_fallback'] = True
                    else:
                        # If there's no English, use the first available translation
                        if self.translations:
                            first_translation = self.translations[0]
                            logger.info(f"No English translation, using {first_translation.language_code} as fallback")
                            result['translation'] = first_translation.to_dict()
                            result['translation']['is_requested_language'] = False
                            result['translation']['is_fallback'] = True
                        else:
                            logger.info(f"No translations available at all")
                            result['translation'] = None
                
                # Always include available languages
                result['available_languages'] = [t.language_code for t in self.translations]
            else:
                # Get all translations
                logger.info(f"Including all {len(self.translations)} translations")
                result['translations'] = [trans.to_dict() for trans in self.translations]
                # Log language codes of available translations
                trans_langs = [t.language_code for t in self.translations]
                logger.info(f"Translation languages: {trans_langs}")
        
        return result

class PostTranslation(db.Model):
    """
    Translation model for blog posts to support multiple languages
    """
    __tablename__ = 'cms_post_translations'
    
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('cms_posts.id'), nullable=False)
    language_code = db.Column(db.String(10), nullable=False)  # e.g., 'en', 'es', 'fr'
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(Text, nullable=False)
    
    # SEO fields
    meta_title = db.Column(db.String(255))
    meta_description = db.Column(db.String(255))
    meta_keywords = db.Column(db.String(255))
    
    # Track if this is auto-translated content
    is_auto_translated = db.Column(db.Boolean, default=False)
    
    # Track the last update timestamp
    last_updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Add unique constraint to ensure one translation per language for each post
    __table_args__ = (db.UniqueConstraint('post_id', 'language_code', name='uix_post_language'),)
    
    def to_dict(self):
        """Convert translation to dictionary for API responses"""
        return {
            'id': self.id,
            'post_id': self.post_id,
            'language_code': self.language_code,
            'title': self.title,
            'content': self.content,
            'meta_title': self.meta_title,
            'meta_description': self.meta_description,
            'meta_keywords': self.meta_keywords,
            'is_auto_translated': self.is_auto_translated,
            'last_updated_at': self.last_updated_at.isoformat() if self.last_updated_at else None
        }

class PostMedia(db.Model):
    """
    Media assets associated with blog posts
    """
    __tablename__ = 'cms_post_media'
    
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('cms_posts.id'), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # image, video, document, etc.
    alt_text = db.Column(db.String(255))
    title = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert media to dictionary for API responses"""
        return {
            'id': self.id,
            'post_id': self.post_id,
            'file_path': self.file_path,
            'url': self.file_path,  # Add url key for frontend compatibility
            'file_type': self.file_type,
            'alt_text': self.alt_text or '',
            'title': self.title or '',
            'created_at': self.created_at.isoformat()
        }

class Tag(db.Model):
    """
    Tags for categorizing blog posts
    """
    __tablename__ = 'cms_tags'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    slug = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255))
    
    def to_dict(self):
        """Convert tag to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description
        }

class Language(db.Model):
    """
    Supported languages for the CMS
    """
    __tablename__ = 'cms_languages'
    
    code = db.Column(db.String(10), primary_key=True)  # e.g., 'en', 'es', 'fr'
    name = db.Column(db.String(50), nullable=False)  # e.g., 'English', 'Spanish', 'French'
    is_default = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    
    # Virtual property for flag since it's not in the database yet
    @property
    def flag(self):
        # 22 website languages with appropriate flag emojis
        flags = {
            'en': '🇬🇧', 'fr': '🇫🇷', 'es': '🇪🇸', 'de': '🇩🇪', 'it': '🇮🇹', 
            'pt': '🇵🇹', 'ru': '🇷🇺', 'ja': '🇯🇵', 'ko': '🇰🇷', 'zh-TW': '🇹🇼',
            'ar': '🇸🇦', 'nl': '🇳🇱', 'sv': '🇸🇪', 'tr': '🇹🇷', 'pl': '🇵🇱',
            'hu': '🇭🇺', 'el': '🇬🇷', 'no': '🇳🇴', 'vi': '🇻🇳', 'th': '🇹🇭',
            'id': '🇮🇩', 'ms': '🇲🇾'
        }
        return flags.get(self.code, '🌐')
    
    def to_dict(self):
        """Convert language to dictionary for API responses"""
        # Use the virtual property flag
        return {
            'code': self.code,
            'name': self.name,
            'is_default': self.is_default,
            'is_active': self.is_active,
            'flag': self.flag
        }