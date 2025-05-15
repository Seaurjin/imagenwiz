import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

from app import create_app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    # Get port from environment variable with fallback
    port = int(os.environ.get('BACKEND_PORT', 5000))
    
    # Log the port being used
    print(f"Starting backend on port {port}")
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=bool(int(os.environ.get('FLASK_DEBUG', 0)))
    )