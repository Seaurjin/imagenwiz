import os
# Ensure .env is loaded before other app imports
from dotenv import load_dotenv
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..')) # backend -> project_root
DOTENV_PATH = os.path.join(PROJECT_ROOT, '.env')
if os.path.exists(DOTENV_PATH):
    print(f"CREATE_TABLES: Loading .env file from {DOTENV_PATH}")
    load_dotenv(dotenv_path=DOTENV_PATH, override=True)
else:
    print(f"CREATE_TABLES: .env file not found at {DOTENV_PATH}.")

from app import create_app, db

app = create_app()

with app.app_context():
    print("Attempting to create all database tables...")
    try:
        db.create_all()
        print("Database tables check/creation complete.")
        print("Please check your MySQL database to confirm 'credit_logs' table and 'users.email' column exist.")
    except Exception as e:
        print(f"An error occurred during db.create_all(): {e}")
        import traceback
        traceback.print_exc() 