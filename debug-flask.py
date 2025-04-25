#!/usr/bin/env python
"""
Debug script to isolate and test the Flask backend initialization

This script:
1. Sets necessary environment variables
2. Directly imports and runs the Flask app
3. Runs in debug mode with detailed logging
"""

import os
import sys
import time
import importlib.util
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger("flask-debug")

# Set environment variables
os.environ['DB_HOST'] = '8.130.113.102'
os.environ['DB_PORT'] = '3306'
os.environ['DB_NAME'] = 'mat_db'
os.environ['DB_USER'] = 'root'
os.environ['DB_PASSWORD'] = 'Ir%86241992'
os.environ['SKIP_MIGRATIONS'] = 'true'
os.environ['FLASK_DEBUG'] = '1'
os.environ['FLASK_ENV'] = 'development'

def import_flask_app():
    """Import the Flask app without executing it"""
    logger.info("Attempting to import Flask app from backend/app/__init__.py")
    
    try:
        # Try to directly import the app module
        spec = importlib.util.spec_from_file_location("app", "backend/app/__init__.py")
        app_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(app_module)
        
        logger.info("✅ Successfully imported Flask app")
        
        # Check if app is defined
        if hasattr(app_module, 'app') and app_module.app:
            logger.info("✅ Flask app instance found")
            return app_module.app
        else:
            logger.error("❌ Flask app instance not found in module")
            return None
    except Exception as e:
        logger.error(f"❌ Error importing Flask app: {str(e)}")
        return None

def test_mysql_connection():
    """Test direct connection to MySQL"""
    logger.info("Testing direct connection to MySQL")
    
    try:
        import pymysql
        
        conn = pymysql.connect(
            host=os.environ['DB_HOST'],
            port=int(os.environ['DB_PORT']),
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD'],
            database=os.environ['DB_NAME']
        )
        
        logger.info("✅ Successfully connected to MySQL database")
        
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE()")
        db_name = cursor.fetchone()[0]
        logger.info(f"✅ Connected to database: {db_name}")
        
        cursor.execute("SHOW TABLES")
        tables = cursor.fetchall()
        logger.info(f"✅ Found {len(tables)} tables in database")
        for table in tables:
            logger.info(f"  - {table[0]}")
        
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        logger.error(f"❌ MySQL connection error: {str(e)}")
        return False

def run_flask_app(app):
    """Run the Flask app with debug options"""
    if not app:
        logger.error("❌ Cannot run Flask app - app instance is None")
        return False
    
    logger.info("Starting Flask app in debug mode")
    try:
        app.run(
            host='0.0.0.0',
            port=5000,
            debug=True,
            use_reloader=False
        )
        return True
    except Exception as e:
        logger.error(f"❌ Error running Flask app: {str(e)}")
        return False

def check_flask_dependencies():
    """Check if all required Flask dependencies are installed"""
    logger.info("Checking Flask dependencies")
    
    dependencies = [
        'flask',
        'flask_sqlalchemy',
        'flask_jwt_extended',
        'flask_bcrypt',
        'werkzeug'
    ]
    
    all_installed = True
    for dep in dependencies:
        try:
            module = importlib.import_module(dep)
            logger.info(f"✅ Dependency installed: {dep} ({getattr(module, '__version__', 'version unknown')})")
        except ImportError as e:
            logger.error(f"❌ Missing dependency: {dep} - {str(e)}")
            all_installed = False
    
    return all_installed

def main():
    """Main debug function"""
    start_time = time.time()
    
    logger.info("=" * 80)
    logger.info("Flask Debug Harness - Testing Flask Backend Initialization")
    logger.info("=" * 80)
    
    # Check database connection
    if not test_mysql_connection():
        logger.error("❌ Cannot proceed - database connection failed")
        return False
    
    # Check dependencies
    if not check_flask_dependencies():
        logger.warning("⚠️ Some dependencies might be missing - attempting to continue")
    
    # Import Flask app
    app = import_flask_app()
    
    # Run the app
    if app:
        run_flask_app(app)
        return True
    else:
        return False

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1)