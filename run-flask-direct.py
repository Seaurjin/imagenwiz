"""
Direct Flask runner for iMagenWiz

This script:
1. Sets the required environment variables for database connection
2. Skips database migrations for faster startup
3. Starts the Flask backend directly
"""

import os
import sys
from pathlib import Path

# Set MySQL environment variables
os.environ["DB_HOST"] = "8.130.113.102"
os.environ["DB_PORT"] = "3306" 
os.environ["DB_NAME"] = "mat_db"
os.environ["DB_USER"] = "root"
os.environ["DB_PASSWORD"] = "Ir%86241992"

# Skip migrations for faster startup
os.environ["SKIP_MIGRATIONS"] = "true"

# Find the backend path
current_dir = Path(__file__).parent.absolute()
backend_path = current_dir / "backend"
app_path = backend_path / "app"

# Add backend directory to Python path
sys.path.insert(0, str(backend_path))

print(f"📂 Using backend path: {backend_path}")
print(f"📂 App path: {app_path}")
print("🚀 Starting Flask server directly...")
print("⚠️ Migrations are DISABLED for faster startup")

try:
    # Import the Flask app
    from backend.run import app
    
    # Start the Flask app
    app.run(host="0.0.0.0", port=5000, debug=True)
except ImportError as e:
    print(f"❌ Error importing Flask app: {e}")
    print("Make sure you're running this script from the project root directory.")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting Flask app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)