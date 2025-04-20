import os
import uuid
from flask import request, jsonify, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.settings import bp
from app.models.models import SiteSettings, User, db
from flask import send_from_directory
import json

# Admin access check function
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

# Define the upload folder for logos
LOGO_UPLOAD_FOLDER = 'uploads/logos'

# Ensure the upload directory exists
def ensure_upload_dir():
    """Create the logo upload directory if it doesn't exist"""
    full_path = os.path.join(current_app.config['UPLOAD_FOLDER'], LOGO_UPLOAD_FOLDER)
    if not os.path.exists(full_path):
        os.makedirs(full_path, exist_ok=True)
    return full_path

# Function to get or create a site setting
def get_or_create_setting(key, default_value=None):
    """Get a setting from the database or create it if it doesn't exist"""
    setting = SiteSettings.query.filter_by(setting_key=key).first()
    if not setting:
        setting = SiteSettings(setting_key=key, setting_value=default_value)
        db.session.add(setting)
        db.session.commit()
    return setting

# Endpoint to get all site settings
@bp.route('', methods=['GET'])
def get_settings():
    """Get all site settings"""
    settings = SiteSettings.query.all()
    return jsonify([setting.to_dict() for setting in settings])

# Endpoint to get a specific site setting
@bp.route('/<key>', methods=['GET'])
def get_setting(key):
    """Get a specific site setting by key"""
    setting = SiteSettings.query.filter_by(setting_key=key).first()
    if not setting:
        return jsonify({'error': 'Setting not found'}), 404
    return jsonify(setting.to_dict())

# Endpoint to update a site setting (admin only)
@bp.route('/<key>', methods=['POST'])
@jwt_required()
def update_setting(key):
    """Update a site setting (admin only)"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({'error': 'Admin access required'}), 403
    if 'value' not in request.form:
        return jsonify({'error': 'Value is required'}), 400
    
    value = request.form['value']
    setting = get_or_create_setting(key)
    setting.setting_value = value
    db.session.commit()
    
    return jsonify(setting.to_dict())

# Endpoint to upload a logo (admin only)
@bp.route('/logo/upload', methods=['POST'])
@jwt_required()
def upload_logo():
    """Upload a logo (admin only)"""
    # Check admin access
    user = check_admin_access()
    if not user:
        return jsonify({'error': 'Admin access required'}), 403
    # Check if the post request has the file part
    if 'logo' not in request.files:
        return jsonify({'error': 'No logo file provided'}), 400
    
    logo_file = request.files['logo']
    
    # If user doesn't select a file, the browser might submit an empty file
    if logo_file.filename == '':
        return jsonify({'error': 'No logo file selected'}), 400
    
    # Check if the file type is allowed
    allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'svg'}
    file_ext = logo_file.filename.rsplit('.', 1)[1].lower() if '.' in logo_file.filename else ''
    
    if file_ext not in allowed_extensions:
        return jsonify({'error': f'File type {file_ext} not allowed. Allowed types: {", ".join(allowed_extensions)}'}), 400
    
    # Secure the filename and make it unique
    logo_type = request.form.get('type', 'navbar') # navbar, footer, favicon
    filename = f"{logo_type}-{uuid.uuid4().hex}.{file_ext}"
    filename = secure_filename(filename)
    
    # Ensure the upload directory exists
    upload_path = ensure_upload_dir()
    
    # Save the file
    file_path = os.path.join(upload_path, filename)
    relative_path = os.path.join(LOGO_UPLOAD_FOLDER, filename)
    logo_file.save(file_path)
    
    # Update the logo setting
    setting_key = f"logo_{logo_type}"
    setting = get_or_create_setting(setting_key)
    
    # For compatibility with the frontend, we'll store the full URL path
    setting_value = f"/api/uploads/{relative_path}"
    setting.setting_value = setting_value
    db.session.commit()
    
    # Return the logo URL
    return jsonify({
        'message': 'Logo uploaded successfully',
        'logo_url': setting_value
    })

# Endpoint to get logo URLs
@bp.route('/logo', methods=['GET'])
def get_logos():
    """Get all logo URLs"""
    logo_types = ['navbar', 'footer', 'favicon']
    logo_settings = {}
    
    for logo_type in logo_types:
        setting_key = f"logo_{logo_type}"
        setting = SiteSettings.query.filter_by(setting_key=setting_key).first()
        logo_settings[logo_type] = setting.setting_value if setting else None
    
    return jsonify(logo_settings)

# Endpoint to get a specific logo URL
@bp.route('/logo/<logo_type>', methods=['GET'])
def get_logo(logo_type):
    """Get a specific logo URL by type"""
    if logo_type not in ['navbar', 'footer', 'favicon']:
        return jsonify({'error': 'Invalid logo type'}), 400
    
    setting_key = f"logo_{logo_type}"
    setting = SiteSettings.query.filter_by(setting_key=setting_key).first()
    
    if not setting or not setting.setting_value:
        # Return default logo path
        return jsonify({'logo_url': f"/images/imagenwiz-logo-{logo_type}.svg"})
    
    return jsonify({'logo_url': setting.setting_value})