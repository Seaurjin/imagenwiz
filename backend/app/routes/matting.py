from flask import Blueprint, jsonify, request, current_app
from datetime import datetime, timedelta
import random
import os
import json

matting_bp = Blueprint('matting', __name__)

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

@matting_bp.route('/api/matting/history', methods=['GET'])
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
from datetime import datetime, timedelta
import random
import os
import json

matting_bp = Blueprint('matting', __name__)

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

@matting_bp.route('/api/matting/history', methods=['GET'])
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