"""
Script to execute SQL statements using Flask application context

This script:
1. Creates a Flask application context
2. Executes SQL statements directly through SQLAlchemy engine
"""

import os
import sys
import argparse

# Add backend directory to system path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

# Import Flask app
from app import create_app, db

def execute_sql_from_file(sql_file):
    """Execute SQL statements from a file using Flask application context"""
    try:
        with open(sql_file, 'r') as f:
            sql_content = f.read()
        
        return execute_sql(sql_content)
    except Exception as e:
        print(f"❌ Error reading SQL file: {str(e)}")
        return False

def execute_sql(sql_content):
    """Execute SQL statements using Flask application context"""
    print("Creating Flask application context...")
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        print("Executing SQL statements...")
        
        # Split SQL script into individual statements
        # This is a very basic approach and won't work for all complex SQL
        statements = sql_content.split(';')
        executed = 0
        failed = 0
        
        for i, statement in enumerate(statements):
            statement = statement.strip()
            if not statement:
                continue
            
            try:
                db.session.execute(statement)
                executed += 1
                if (i + 1) % 10 == 0:
                    print(f"Executed {i + 1}/{len(statements)} statements...")
            except Exception as e:
                failed += 1
                print(f"❌ Error executing statement {i + 1}: {str(e)}")
                print(f"Statement: {statement[:100]}...")
        
        try:
            # Commit all changes
            db.session.commit()
            print(f"✅ SQL execution completed. {executed} statements executed, {failed} failed.")
            return True
        except Exception as e:
            # Rollback on error
            db.session.rollback()
            print(f"❌ Error committing changes: {str(e)}")
            return False

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Execute SQL statements using Flask application context')
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--file', '-f', help='SQL file to execute')
    group.add_argument('--statement', '-s', help='SQL statement to execute')
    
    args = parser.parse_args()
    
    if args.file:
        print(f"Executing SQL from file: {args.file}")
        if execute_sql_from_file(args.file):
            print("✅ SQL execution successful")
            return 0
        else:
            print("❌ SQL execution failed")
            return 1
    elif args.statement:
        print(f"Executing SQL statement: {args.statement}")
        if execute_sql(args.statement):
            print("✅ SQL execution successful")
            return 0
        else:
            print("❌ SQL execution failed")
            return 1

if __name__ == "__main__":
    sys.exit(main())