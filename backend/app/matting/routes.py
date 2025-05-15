import os
import json
from flask import request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.models.models import User, MattingHistory
from app import db
from . import bp
from .service import process_image, generate_unique_filename
from datetime import datetime, timedelta
from app.credits.utils import log_credit_change

# Ensure we have access to os.path functions
from os import path

# Helper function to check if a file has an allowed extension
def allowed_file(filename):
    """Check if the file has an allowed extension"""
    allowed_extensions = current_app.config.get('ALLOWED_EXTENSIONS', 'png,jpg,jpeg,webp').split(',')
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@bp.route('/process', methods=['POST'])
@jwt_required()
def process_matting():
    """Process an image to remove background"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if user has enough credits
    if user.credits < 1:
        return jsonify({"error": "Insufficient credits. Please recharge your account."}), 402
    
    # Check if file part exists in request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']
    
    # Check if a file was selected
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    # Check if file is allowed
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400
    
    # Create secure filenames
    original_filename = secure_filename(file.filename)
    unique_original = generate_unique_filename(original_filename)
    unique_processed = f"processed_{unique_original}"
    
    # Save original file
    # Use the OS module directly to create the paths
    upload_folder = current_app.config['UPLOAD_FOLDER']
    processed_folder = current_app.config['PROCESSED_FOLDER']
    
    original_path = upload_folder + '/' + unique_original
    file.save(original_path)
    
    # Process image
    processed_path = processed_folder + '/' + unique_processed
    success = process_image(original_path, processed_path)
    
    if not success:
        return jsonify({"error": "Failed to process image"}), 500
    
    # Generate URLs for the images
    # Import the os module at the top level
    import os
    
    # Hardcode the external URL for now to ensure consistent URLs
    host = "https://e3d010d3-10b7-4398-916c-9569531b7cb9-00-nzrxz81n08w.kirk.replit.dev"
    
    # Fallback to checking environment variables and config if the hardcoded URL is later removed
    if not host:
        external_url = os.environ.get('REPLIT_DOMAIN')
        
        # Use external URL if available, otherwise fallback to request host
        if external_url:
            host = f"https://{external_url}"
        else:
            # Fall back to the request host if no environment variable is set
            host = request.host_url.rstrip('/')
            
        # For local development, if hostname is localhost, use the server's external URL if available
        if 'localhost' in host:
            server_url = current_app.config.get('SERVER_EXTERNAL_URL')
            if server_url:
                host = server_url
            
    original_url = f"{host}/api/uploads/{unique_original}"
    processed_url = f"{host}/api/processed/{unique_processed}"
    
    # Deduct credit from user
    # This will be handled by log_credit_change now
    # user.credits -= 1 
    credit_deducted = 1
    
    # Record the matting history
    history = MattingHistory(
        user_id=user.id,
        original_image_url=original_url,
        processed_image_url=processed_url,
        credit_spent=credit_deducted
    )
    db.session.add(history) # Add history first

    # Log the credit change
    log_entry = log_credit_change(
        user_id=user.id,
        change_amount=-credit_deducted,
        source_type='image_processing',
        description=f'Processed image: {original_filename}', # Use original_filename for clarity
        source_details=json.dumps({'matting_history_id': history.id, 'original_image_url': original_url, 'processed_image_url': processed_url})
    )

    if not log_entry:
        # If logging fails, we might want to roll back the credit deduction and history, 
        # or at least log a critical error. For now, we proceed but this is a point of consideration.
        # db.session.rollback() # Example: Rollback if credit logging is absolutely critical to be atomic with deduction
        current_app.logger.error(f"CRITICAL: Failed to log credit change for image processing. User ID: {user.id}, Image: {original_filename}")
        # Potentially return an error to the user or mark the transaction for review

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error during commit for image processing: {e}. User ID: {user.id}, Image: {original_filename}")
        return jsonify({"error": "Failed to finalize image processing transaction"}), 500
    
    return jsonify({
        "message": "Image processed successfully",
        "original_image": original_url,
        "processed_image": processed_url,
        "credits_remaining": user.credits,
        "history_id": history.id
    }), 200

@bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get user's matting history"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Get history entries for the user
    history = MattingHistory.query.filter_by(user_id=user.id).order_by(MattingHistory.created_at.desc()).all()
    
    return jsonify({
        "history": [entry.to_dict() for entry in history]
    }), 200

@bp.route('/history/<int:id>', methods=['GET'])
@jwt_required()
def get_matting_detail(id):
    """Get a specific matting detail"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Get the specific history entry
    history = MattingHistory.query.filter_by(id=id, user_id=user.id).first()
    
    if not history:
        return jsonify({"error": "Matting history not found or not authorized"}), 404
    
    return jsonify(history.to_dict()), 200

from threading import Lock
from queue import Queue
import time

request_queue = Queue(maxsize=10)
queue_lock = Lock()

def process_queue():
    while True:
        if not request_queue.empty():
            with queue_lock:
                request = request_queue.get()
                # Process request
                time.sleep(1)  # Rate limiting

# Sample data for matting history
mock_matting_history = [
    {
        'id': 1,
        'created_at': (datetime.now() - timedelta(days=5)).isoformat(),
        'image_url': '/static/samples/matting1_result.png',
        'original_url': '/static/samples/matting1_original.jpg',
        'status': 'completed',
        'type': 'background_removal'
    },
    {
        'id': 2,
        'created_at': (datetime.now() - timedelta(days=3)).isoformat(),
        'image_url': '/static/samples/matting2_result.png',
        'original_url': '/static/samples/matting2_original.jpg',
        'status': 'completed',
        'type': 'background_change'
    },
    {
        'id': 3,
        'created_at': (datetime.now() - timedelta(days=1)).isoformat(),
        'image_url': '/static/samples/matting3_result.png',
        'original_url': '/static/samples/matting3_original.jpg',
        'status': 'completed',
        'type': 'background_removal'
    }
]

@bp.route('/history', methods=['GET'])
def get_matting_history():
    """Get user's image matting history"""
    # In a real app, we would fetch from database based on user_id
    # from authenticated session
    
    current_app.logger.info('Fetching matting history')
    
    # Add pagination parameters (optional)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Return mock data for now
    return jsonify({
        'success': True,
        'history': mock_matting_history,
        'pagination': {
            'total': len(mock_matting_history),
            'page': page,
            'limit': limit
        }
    })

# Sample data for matting history
mock_matting_history = [
    {
        'id': 1,
        'created_at': (datetime.now() - timedelta(days=5)).isoformat(),
        'image_url': '/static/samples/matting1_result.png',
        'original_url': '/static/samples/matting1_original.jpg',
        'status': 'completed',
        'type': 'background_removal'
    },
    {
        'id': 2,
        'created_at': (datetime.now() - timedelta(days=3)).isoformat(),
        'image_url': '/static/samples/matting2_result.png',
        'original_url': '/static/samples/matting2_original.jpg',
        'status': 'completed',
        'type': 'background_change'
    },
    {
        'id': 3,
        'created_at': (datetime.now() - timedelta(days=1)).isoformat(),
        'image_url': '/static/samples/matting3_result.png',
        'original_url': '/static/samples/matting3_original.jpg',
        'status': 'completed',
        'type': 'background_removal'
    }
]

@bp.route('/history', methods=['GET'])
def get_matting_history():
    """Get user's image matting history"""
    # In a real app, we would fetch from database based on user_id
    # from authenticated session
    
    current_app.logger.info('Fetching matting history')
    
    # Add pagination parameters (optional)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Return mock data for now
    return jsonify({
        'success': True,
        'history': mock_matting_history,
        'pagination': {
            'total': len(mock_matting_history),
            'page': page,
            'limit': limit
        }
    })

