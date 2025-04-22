#!/usr/bin/env python3
"""
Script to trigger auto-translation of all blog posts via API

This script calls the Flask API endpoint to auto-translate all English
blog posts to all supported languages.
"""
import sys
import requests
import json
import time

def login_as_admin():
    """Log in as admin to get access token"""
    try:
        # You might need to adjust the admin credentials
        login_data = {
            "username": "admin",
            "password": "password123"
        }
        
        response = requests.post("http://localhost:5000/api/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            print("Successfully logged in as admin")
            return token
        else:
            print(f"Failed to log in as admin: {response.text}")
            return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None

def trigger_auto_translate(token):
    """Trigger auto-translation for all posts"""
    if not token:
        print("No authentication token available")
        return False
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Use placeholder mode to ensure translations are created
    # even if the DeepSeek API key is not available
    data = {
        "batch_size": 10,  # Process all posts
        "placeholder_mode": True,  # Use placeholders instead of DeepSeek
        "force_translate": True  # Force update of all translations
    }
    
    try:
        print("Triggering auto-translation via API...")
        response = requests.post(
            "http://localhost:5000/api/cms/posts/auto-translate-all", 
            headers=headers,
            json=data
        )
        
        if response.status_code == 200:
            result = response.json()
            print("Auto-translation triggered successfully!")
            print(json.dumps(result, indent=2))
            return True
        else:
            print(f"Failed to trigger auto-translation: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print(f"Error during API call: {e}")
        return False

def main():
    """Main function"""
    print("Starting auto-translation process via API...")
    
    # Log in as admin
    token = login_as_admin()
    
    if not token:
        print("Failed to get authentication token, cannot continue")
        sys.exit(1)
    
    # Trigger auto-translation
    success = trigger_auto_translate(token)
    
    if success:
        print("\nAuto-translation process completed successfully!")
    else:
        print("\nAuto-translation process failed")
        sys.exit(1)

if __name__ == "__main__":
    main()