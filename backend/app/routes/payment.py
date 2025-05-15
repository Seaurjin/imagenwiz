from flask import Blueprint, jsonify, request, current_app
from datetime import datetime, timedelta
import random

payment_bp = Blueprint('payment', __name__)

# Sample data for payment history
mock_payment_history = [
    {
        'id': 'pay_1AbCdEfGhIjKlM',
        'amount': 9.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=30)).isoformat(),
        'description': 'Monthly Subscription - Basic Plan',
        'payment_method': 'visa (****4242)'
    },
    {
        'id': 'pay_2BcDeFgHiJkLmN',
        'amount': 19.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=15)).isoformat(),
        'description': 'Credit Pack - 100 Credits',
        'payment_method': 'mastercard (****5555)'
    },
    {
        'id': 'pay_3CdEfGhIjKlMnO',
        'amount': 49.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=7)).isoformat(),
        'description': 'Monthly Subscription - Pro Plan',
        'payment_method': 'visa (****1234)'
    }
]

@payment_bp.route('/api/payment/history', methods=['GET'])
def get_payment_history():
    """Get user's payment history"""
    # In a real app, we would fetch from database based on user_id
    # from authenticated session
    
    current_app.logger.info('Fetching payment history')
    
    # Add pagination parameters (optional)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Return mock data for now
    return jsonify({
        'success': True,
        'history': mock_payment_history,
        'pagination': {
            'total': len(mock_payment_history),
            'page': page,
            'limit': limit
        }
    }) 
from datetime import datetime, timedelta
import random

payment_bp = Blueprint('payment', __name__)

# Sample data for payment history
mock_payment_history = [
    {
        'id': 'pay_1AbCdEfGhIjKlM',
        'amount': 9.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=30)).isoformat(),
        'description': 'Monthly Subscription - Basic Plan',
        'payment_method': 'visa (****4242)'
    },
    {
        'id': 'pay_2BcDeFgHiJkLmN',
        'amount': 19.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=15)).isoformat(),
        'description': 'Credit Pack - 100 Credits',
        'payment_method': 'mastercard (****5555)'
    },
    {
        'id': 'pay_3CdEfGhIjKlMnO',
        'amount': 49.99,
        'currency': 'USD',
        'status': 'succeeded',
        'created_at': (datetime.now() - timedelta(days=7)).isoformat(),
        'description': 'Monthly Subscription - Pro Plan',
        'payment_method': 'visa (****1234)'
    }
]

@payment_bp.route('/api/payment/history', methods=['GET'])
def get_payment_history():
    """Get user's payment history"""
    # In a real app, we would fetch from database based on user_id
    # from authenticated session
    
    current_app.logger.info('Fetching payment history')
    
    # Add pagination parameters (optional)
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)
    
    # Return mock data for now
    return jsonify({
        'success': True,
        'history': mock_payment_history,
        'pagination': {
            'total': len(mock_payment_history),
            'page': page,
            'limit': limit
        }
    }) 