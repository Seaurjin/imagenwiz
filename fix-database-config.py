#!/usr/bin/env python
"""
Script to check and fix database configuration in the Flask application

This script:
1. Examines all possible database configuration files
2. Updates MySQL connection details if necessary
3. Fixes any incorrect or broken configuration
"""

import os
import glob
import re
import sys

def check_and_fix_database_config():
    """Check and fix database configuration files"""
    print("\n=================================================")
    print("Checking and fixing database configuration")
    print("=================================================\n")
    
    # Correct MySQL parameters
    DB_HOST = "8.130.113.102"
    DB_PORT = "3306"
    DB_NAME = "mat_db"
    DB_USER = "root"
    DB_PASSWORD = "Ir%86241992"
    
    # Configuration files to check
    config_patterns = [
        "backend/app/config.py",
        "backend/app/utils/database_config.py",
        "backend/config.py",
        "backend/app/utils/db_config.py",
        "backend/app/__init__.py",
        "backend/**/config*.py"
    ]
    
    # Expand patterns to find all matching files
    config_files = []
    for pattern in config_patterns:
        matches = glob.glob(pattern, recursive=True)
        for match in matches:
            if match not in config_files and os.path.isfile(match):
                config_files.append(match)
    
    if not config_files:
        print("❌ No database configuration files found")
        return False
    
    print(f"Found {len(config_files)} potential configuration files:")
    for file in config_files:
        print(f"  - {file}")
    
    # Fix each file
    fixed_files = []
    
    for file_path in config_files:
        try:
            print(f"\nChecking {file_path}...")
            with open(file_path, 'r') as file:
                content = file.read()
            
            original_content = content
            changes_made = []
            
            # Check and fix MySQL connection settings
            if re.search(r'(?:mysql|MySQL|MYSQL|DB_HOST|host)', content):
                print(f"Found database configuration in {file_path}")
                
                # Fix hostname
                if re.search(r'(?:DB_HOST|host)\s*=\s*[\'"].*?[\'"]', content):
                    new_content = re.sub(
                        r'((?:DB_HOST|host)\s*=\s*)[\'"].*?[\'"]',
                        rf'\1"{DB_HOST}"',
                        content
                    )
                    if new_content != content:
                        content = new_content
                        changes_made.append(f"Updated DB_HOST to {DB_HOST}")
                
                # Fix port
                if re.search(r'(?:DB_PORT|port)\s*=\s*(?:[\'"].*?[\'"]|\d+)', content):
                    new_content = re.sub(
                        r'((?:DB_PORT|port)\s*=\s*)(?:[\'"].*?[\'"]|\d+)',
                        rf'\1{DB_PORT}',
                        content
                    )
                    if new_content != content:
                        content = new_content
                        changes_made.append(f"Updated DB_PORT to {DB_PORT}")
                
                # Fix database name
                if re.search(r'(?:DB_NAME|database)\s*=\s*[\'"].*?[\'"]', content):
                    new_content = re.sub(
                        r'((?:DB_NAME|database)\s*=\s*)[\'"].*?[\'"]',
                        rf'\1"{DB_NAME}"',
                        content
                    )
                    if new_content != content:
                        content = new_content
                        changes_made.append(f"Updated DB_NAME to {DB_NAME}")
                
                # Fix username
                if re.search(r'(?:DB_USER|username|user)\s*=\s*[\'"].*?[\'"]', content):
                    new_content = re.sub(
                        r'((?:DB_USER|username|user)\s*=\s*)[\'"].*?[\'"]',
                        rf'\1"{DB_USER}"',
                        content
                    )
                    if new_content != content:
                        content = new_content
                        changes_made.append(f"Updated DB_USER to {DB_USER}")
                
                # Fix password - being careful with special characters
                if re.search(r'(?:DB_PASSWORD|password)\s*=\s*[\'"].*?[\'"]', content):
                    escaped_password = DB_PASSWORD.replace('%', '%%')
                    new_content = re.sub(
                        r'((?:DB_PASSWORD|password)\s*=\s*)[\'"].*?[\'"]',
                        rf'\1"{escaped_password}"',
                        content
                    )
                    if new_content != content:
                        content = new_content
                        changes_made.append(f"Updated DB_PASSWORD")
                
                # Fix SQLALCHEMY_DATABASE_URI if present
                if "SQLALCHEMY_DATABASE_URI" in content:
                    # Handle various URI formats
                    uri_patterns = [
                        r'(SQLALCHEMY_DATABASE_URI\s*=\s*f?[\'"]mysql.*?:\/\/)[^:]+:[^@]*@[^\/]+\/[^\'"\s]+([\'"])',
                        r'(SQLALCHEMY_DATABASE_URI\s*=\s*f?[\'"]mysql.*?:\/\/)[^:]+:[^@]*@[^\/]+(\/[^\'"\s]+[\'"])',
                        r'(SQLALCHEMY_DATABASE_URI\s*=\s*f?[\'"]mysql.*?:\/\/)[^:]+:[^@]*@([^\/]+)',
                        r'(SQLALCHEMY_DATABASE_URI\s*=\s*f?[\'"]mysql.*?:\/\/)([^:]+)'
                    ]
                    
                    for pattern in uri_patterns:
                        if re.search(pattern, content):
                            escaped_password = DB_PASSWORD.replace('%', '%%')
                            new_uri = f"mysql+pymysql://{DB_USER}:{escaped_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
                            new_content = re.sub(
                                pattern,
                                rf'\1{DB_USER}:{escaped_password}@{DB_HOST}:{DB_PORT}/{DB_NAME}\2',
                                content
                            )
                            if new_content != content:
                                content = new_content
                                changes_made.append(f"Updated SQLALCHEMY_DATABASE_URI to {new_uri}")
                                break
            
            # If changes were made, write the updated content
            if original_content != content:
                with open(file_path, 'w') as file:
                    file.write(content)
                
                fixed_files.append(file_path)
                print(f"✅ Updated {file_path} with the following changes:")
                for change in changes_made:
                    print(f"  - {change}")
            else:
                print(f"ℹ️ No changes needed for {file_path}")
        
        except Exception as e:
            print(f"❌ Error processing {file_path}: {str(e)}")
    
    if fixed_files:
        print(f"\n✅ Fixed {len(fixed_files)} configuration files:")
        for file in fixed_files:
            print(f"  - {file}")
        return True
    else:
        print("\nℹ️ No configuration files needed updating")
        return True

if __name__ == "__main__":
    success = check_and_fix_database_config()
    sys.exit(0 if success else 1)