#!/usr/bin/env python
"""
Direct Flask app runner with improved debugging
and database configuration

This script:
1. Sets up correct database configuration
2. Directly loads the Flask app
3. Runs with detailed logging for debugging
"""

import os
import sys
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("flask-runner")

# Set environment variables - hard-coded to ensure consistency
os.environ['DB_HOST'] = '8.130.113.102'
os.environ['DB_PORT'] = '3306'
os.environ['DB_NAME'] = 'mat_db'
os.environ['DB_USER'] = 'root'
os.environ['DB_PASSWORD'] = 'Ir%86241992'
os.environ['SKIP_MIGRATIONS'] = 'true'
os.environ['FLASK_DEBUG'] = '1'
os.environ['FLASK_ENV'] = 'development'

# Load other environment variables from .env file if it exists
load_dotenv()

def run_flask_app():
    """Run the Flask app with detailed logging"""
    logger.info("Starting Flask application with debug logging")
    
    # Import the create_app function
    try:
        from backend.app import create_app
        logger.info("Successfully imported create_app function")
    except ImportError as e:
        logger.error(f"Failed to import create_app function: {e}")
        return False
    
    # Create the Flask application
    try:
        logger.info("Creating Flask application instance")
        app = create_app()
        logger.info("Successfully created Flask application instance")
    except Exception as e:
        logger.error(f"Failed to create Flask application: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False
    
    # Run the Flask application
    try:
        logger.info("Starting Flask application server")
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True, 
            use_reloader=False  # Disable reloader to avoid duplicate processes
        )
        return True
    except Exception as e:
        logger.error(f"Failed to run Flask application: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == "__main__":
    logger.info("=" * 80)
    logger.info("Starting Flask Application Runner")
    logger.info("=" * 80)
    
    # Display configuration
    logger.info(f"Database: MySQL at {os.environ['DB_HOST']}:{os.environ['DB_PORT']}/{os.environ['DB_NAME']}")
    logger.info(f"Migrations: {'DISABLED' if os.environ.get('SKIP_MIGRATIONS') == 'true' else 'ENABLED'}")
    logger.info(f"Debug mode: {'ENABLED' if os.environ.get('FLASK_DEBUG') == '1' else 'DISABLED'}")
    
    # Run the application
    success = run_flask_app()
    
    if not success:
        logger.error("Failed to start Flask application")
        sys.exit(1)