import os
from flask import Flask, send_from_directory, jsonify, redirect, request, Response
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from werkzeug.exceptions import HTTPException
from flask_cors import CORS
import stripe
import re
import time
import socket
import logging
from logging.handlers import RotatingFileHandler
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Determine project root to load .env reliably
# Corrected path: app/__init__.py -> app -> backend -> project_root
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
DOTENV_PATH = os.path.join(PROJECT_ROOT, '.env')

# Load .env file from the project root if it exists
if os.path.exists(DOTENV_PATH):
    print(f"INIT.PY MODULE LEVEL: Loading .env file from {DOTENV_PATH}")
    load_dotenv(dotenv_path=DOTENV_PATH)
else:
    print(f"INIT.PY MODULE LEVEL WARNING: .env file not found at {DOTENV_PATH}. Calculated PROJECT_ROOT: {PROJECT_ROOT}")

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

# Initialize Stripe API key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

def is_host_reachable(host, port, timeout=1):
    """Check if a host is reachable by attempting a socket connection"""
    try:
        socket.setdefaulttimeout(timeout)
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((host, port))
        s.close()
        return True
    except (socket.timeout, socket.error, OSError):
        return False

def setup_logging(app):
    """Set up logging for the application"""
    # Create logs directory if it doesn't exist
    log_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'logs')
    os.makedirs(log_dir, exist_ok=True)
    
    # Configure logging
    log_file = os.path.join(log_dir, 'app.log')
    handler = RotatingFileHandler(log_file, maxBytes=10485760, backupCount=5)  # 10MB per file, keep 5 files
    
    # Set up formatter
    formatter = logging.Formatter('%(asctime)s [%(levelname)s] %(name)s - %(module)s - %(funcName)s - %(lineno)d - %(message)s')
    handler.setFormatter(formatter)
    
    # Set level based on environment
    log_level = logging.DEBUG if app.debug else logging.INFO
    handler.setLevel(log_level)
    
    # Add handler to app.logger
    if not app.logger.handlers:
        app.logger.addHandler(handler)
    app.logger.setLevel(log_level)
    
    # Log startup information
    app.logger.info("=" * 80)
    app.logger.info("Application starting")
    app.logger.info(f"Environment: {os.environ.get('FLASK_ENV', 'production')}")
    app.logger.info(f"Debug mode: {app.debug}")
    app.logger.info(f"Root logger level set to: {logging.getLevelName(app.logger.getEffectiveLevel())}")
    app.logger.info("=" * 80)
    
    return app

def create_app():
    """Initialize the core application."""
    app = Flask(__name__, static_folder=None)
    print("CREATE_APP: Entered create_app() for MINIMAL + DB + AUTH_BP + CMS_BP test.")
    
    # Force load .env again with override for Gunicorn context
    # This ensures that variables from .env are loaded into os.environ for this app instance
    if os.path.exists(DOTENV_PATH):
        print(f"CREATE_APP: Loading .env from {DOTENV_PATH} with override.")
        load_dotenv(dotenv_path=DOTENV_PATH, override=True)
    else:
        print(f"CREATE_APP WARNING: .env not found at {DOTENV_PATH}.")

    # IMPORTANT: Configure JWT_SECRET_KEY *before* initializing JWTManager with app
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    
    # Direct print to stdout/stderr for Gunicorn to catch, after attempting to set from os.environ
    if app.config['JWT_SECRET_KEY']:
        print(f"CREATE_APP: JWT_SECRET_KEY has been set in app.config.")
    else:
        print("CREATE_APP CRITICAL ERROR: JWT_SECRET_KEY is STILL NONE!")

    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(
        seconds=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400))
    )
    
    # Set up file logging
    app = setup_logging(app)
    
    # Configure the application
    # Try to use local database first, then fall back to remote database if needed
    from urllib.parse import quote_plus
    from .utils.database_config import (
        MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD,
        REMOTE_MYSQL_HOST, REMOTE_MYSQL_PASSWORD
    )
    
    # Update MySQL connection credentials
    mysql_user = os.environ.get('DB_USER', 'root') # Get from env or default
    mysql_password = quote_plus(os.environ.get('DB_PASSWORD', 'Ir%86241992')) # Get from env or default
    mysql_host = os.environ.get('DB_HOST', '8.130.113.102') # Get from env or default
    mysql_db_name = os.environ.get('DB_NAME', 'mat_db') # Get from env or default
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}/{mysql_db_name}'
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_recycle': 3600,
        'pool_pre_ping': True,
        'pool_timeout': 30,
        'connect_args': {'connect_timeout': 10}
    }
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    print(f"CREATE_APP: Database URI configured for {mysql_db_name}.")
    
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(
        seconds=int(os.environ.get('JWT_ACCESS_TOKEN_EXPIRES', 86400))
    )
    
    # Set up upload folders
    app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'app/static/uploads')
    app.config['PROCESSED_FOLDER'] = os.environ.get('PROCESSED_FOLDER', 'app/static/processed')
    
    # Check for upload directories and create if they don't exist
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    os.makedirs(app.config['PROCESSED_FOLDER'], exist_ok=True)
    
    # Set server's external URL for image processing responses
    replit_domain = os.environ.get('REPLIT_DOMAIN')
    if replit_domain:
        app.config['SERVER_EXTERNAL_URL'] = f"https://{replit_domain}"
    else:
        # Get the hostname from the app config
        app.config['SERVER_EXTERNAL_URL'] = os.environ.get('SERVER_EXTERNAL_URL')
        
    if app.config['SERVER_EXTERNAL_URL']:
        app.logger.info(f"Using external URL for image links: {app.config['SERVER_EXTERNAL_URL']}")
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.logger.info("MINIMAL + DB + AUTH_BP + CMS_BP APP: CORS configured.")
    
    with app.app_context():
        try:
            # from .models.models import User # Keep User for auth
            # from .models.cms import Post, PostTranslation, Tag, Language # Keep CMS for core functionality testing
            db.create_all() # Re-introduce table creation
            app.logger.info("MINIMAL + DB + AUTH_BP + CMS_BP APP: db.create_all() called.")
        except Exception as e:
            app.logger.error(f"MINIMAL + DB + AUTH_BP + CMS_BP APP: Error during db.create_all(): {e}", exc_info=True)

        # Register Auth blueprint
        from .auth import bp as auth_bp
        app.register_blueprint(auth_bp)
        app.logger.info("MINIMAL + DB + AUTH_BP + CMS_BP APP: Auth blueprint registered.")
        
        # Register CMS blueprint
        from .cms import bp as cms_bp
        app.register_blueprint(cms_bp)
        app.logger.info("MINIMAL + DB + AUTH_BP + CMS_BP APP: CMS blueprint registered.")
        
        # Temporarily comment out other blueprints to reduce memory load
        # from .matting import bp as matting_bp
        # app.register_blueprint(matting_bp)
        # app.logger.info("Matting blueprint SKIPPED (temporarily). ")
        
        from .payment import bp as payment_bp
        app.register_blueprint(payment_bp)
        app.logger.info("Payment blueprint registered.")
        
        from .payment.order_confirmation import order_bp as order_confirmation_bp # Might be complex
        app.register_blueprint(order_confirmation_bp)
        from .payment.order_confirmation import api_bp as api_order_confirmation_bp
        app.register_blueprint(api_order_confirmation_bp)
        app.logger.info("Order confirmation blueprints registered.")
        
        # from .settings import bp as settings_bp # Settings might be okay
        # app.register_blueprint(settings_bp)
        # app.logger.info("Settings blueprint SKIPPED (temporarily). ")

        # Static file routes
        @app.route('/api/uploads/<filename>')
        def serve_upload(filename):
            """Serve uploaded files"""
            return send_from_directory(os.path.abspath(app.config['UPLOAD_FOLDER']), filename)
            
        @app.route('/api/uploads/cms/<filename>')
        def serve_cms_upload(filename):
            """Serve CMS uploaded files"""
            cms_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'cms')
            return send_from_directory(os.path.abspath(cms_folder), filename)
            
        @app.route('/static/uploads/blog/<path:filename>')
        def serve_blog_upload(filename):
            """Serve blog uploaded files from static folder"""
            app.logger.info(f"Serving blog image: {filename}")
            blog_folder = os.path.join(app.static_folder, 'uploads', 'blog')
            app.logger.info(f"Blog folder path: {blog_folder}")
            return send_from_directory(os.path.abspath(blog_folder), filename)
            
        @app.route('/api/processed/<filename>')
        def serve_processed(filename):
            """Serve processed files"""
            return send_from_directory(os.path.abspath(app.config['PROCESSED_FOLDER']), filename)
            
        @app.route('/images/placeholder-image.svg')
        @app.route('/api/images/placeholder-image.svg')
        def serve_placeholder_image():
            """Serve placeholder image SVG for missing images"""
            app.logger.info("Serving placeholder SVG image")
            placeholder_svg = '''<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f0f0f0"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#888888">Image Not Found</text>
  <path d="M200,100 L175,150 L225,150 Z" fill="#888888"/>
  <rect x="175" y="150" width="50" height="50" fill="#888888"/>
</svg>'''
            return Response(placeholder_svg, mimetype='image/svg+xml')
            
        # API root route only - no more root route in Flask
        @app.route('/api')
        def api_index():
            """Return API root route response"""
            return jsonify({"status": "ok", "message": "iMagenWiz API is running"})
            
        # Just serve API info on root route instead of redirecting
        @app.route('/')
        def root_route():
            """Return API info at root"""
            # Get frontend port from environment variable or default to 3000
            frontend_port = os.environ.get('FRONTEND_PORT', '3000')
            return jsonify({"status": "ok", "message": f"iMagenWiz API (minimal + DB + Auth BP test) is running. Frontend: {frontend_port}"})
            
        # Health check routes
        @app.route('/api/health')
        @app.route('/api/health-check')  # Add alternative path for Express server's health check
        def health_check():
            """Return a simple health check response"""
            return jsonify({"status": "ok", "message": "iMagenWiz API is running"})
            
        # Additional health check route without /api prefix - for proxy compatibility
        @app.route('/health')
        @app.route('/health-check')  # Add alternative path without /api prefix
        def health_check_no_prefix():
            """Return the same health check response for a non-prefixed route"""
            app.logger.info("Health check called without /api prefix")
            return jsonify({"status": "ok", "message": "iMagenWiz API is running"})
            
        # Error handler for all exceptions
        # Payment-success is no longer handled by Flask at all
        # We now use /payment-success-direct in Stripe which goes directly to Express
        # Instead of having a Flask route, we'll just ensure the 404 handler catches these URLs
            
        # Add a similar redirect for other frontend routes commonly accessed directly
        # Dashboard routes are now handled by Express directly
        # No need for Flask to redirect, removing this route to prevent redirect loops
            
        @app.route('/pricing')
        def handle_pricing_redirect():
            """Return JSON response for pricing route"""
            app.logger.info("Pricing page request received at Flask - should be handled by Express")
            return jsonify({
                "error": "Not Found",
                "message": "The pricing page should be accessed via the Express server at port 3000, not directly through the Flask API",
                "status": 404
            }), 404
            
        @app.errorhandler(Exception)
        def handle_exception(e):
            """Return JSON instead of HTML for HTTP errors."""
            # Check if this is a 404 for a frontend route
            if isinstance(e, HTTPException) and e.code == 404:
                path = request.path
                
                # Instead of redirecting dashboard routes, return a JSON response indicating 
                # this is a frontend route that should be handled by Express
                if path == '/dashboard' or path.startswith('/dashboard/'):
                    app.logger.info(f"404 for dashboard route: {path}")
                    return jsonify({
                        "error": "Not Found",
                        "message": "This route should be accessed via the Express server, not directly through the Flask API",
                        "status": 404
                    }), 404
                
                # For other frontend routes, also return a JSON response instead of redirecting
                elif (not path.startswith('/payment') and not path.startswith('/api/payment')
                      and (path == '/pricing' or path == '/login')):
                    app.logger.info(f"404 for frontend route: {path}")
                    return jsonify({
                        "error": "Not Found",
                        "message": "This route should be accessed via the Express server, not directly through the Flask API",
                        "status": 404
                    }), 404
            
            if isinstance(e, HTTPException):
                response = {
                    "code": e.code,
                    "name": e.name,
                    "description": e.description,
                }
                status_code = e.code
            else:
                # Handle non-HTTP exceptions
                response = {
                    "code": 500,
                    "name": "Internal Server Error",
                    "description": str(e),
                }
                status_code = 500
                
            app.logger.error(f"Error: {e}")
            return jsonify(response), status_code
            
        # Add API route mappings for missing endpoints
        @app.route('/api/matting/history', methods=['GET'])
        def api_matting_history():
            """API route for matting history that maps to the blueprint route"""
            from .matting.routes import get_matting_history
            return get_matting_history()
        
        @app.route('/api/payment/history', methods=['GET'])
        def api_payment_history():
            """API route for payment history"""
            # Create a mock payment history response
            from datetime import datetime, timedelta
            import random
            
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
            
            # Add pagination parameters (optional)
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)
            
            # Log the request
            app.logger.info('Fetching payment history')
            
            # Return mock data
            return jsonify({
                'success': True,
                'history': mock_payment_history,
                'pagination': {
                    'total': len(mock_payment_history),
                    'page': page,
                    'limit': limit
                }
            })
        
    app.logger.info("MINIMAL + DB + AUTH_BP + CMS_BP APP: Flask app creation completed.")
    return app