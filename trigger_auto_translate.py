#!/usr/bin/env python3
"""
Simple script to trigger auto-translation of blog posts via Python requests

This script calls the Flask backend API directly to trigger auto-translation 
of all blog posts in all languages.
"""
import requests
import json
import os
import sys

# URL for the API
BASE_URL = "http://localhost:5000/api"

def call_api(method, endpoint, data=None, params=None, headers=None):
    """Call the API with the given method, endpoint, and data"""
    url = f"{BASE_URL}/{endpoint}"
    
    if headers is None:
        headers = {}
    
    headers['Content-Type'] = 'application/json'
    
    try:
        if method.lower() == 'get':
            response = requests.get(url, params=params, headers=headers)
        elif method.lower() == 'post':
            response = requests.post(url, json=data, headers=headers, params=params)
        else:
            print(f"Unsupported method: {method}")
            return None
        
        # Check response
        if response.status_code >= 200 and response.status_code < 300:
            try:
                return response.json()
            except json.JSONDecodeError:
                return {"text": response.text}
        else:
            print(f"API call failed with status code {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Error calling API: {e}")
        return None

def get_admin_login_token():
    """Get admin login token for API calls"""
    admin_data = {
        "username": "admin",
        "password": "admin123"  # Default password, may need to be updated
    }
    
    print("Trying to log in as admin...")
    result = call_api('post', 'auth/login', data=admin_data)
    
    if result and 'access_token' in result:
        print("Login successful!")
        return result['access_token']
    
    # Try alternative admin credentials
    admin_data = {
        "username": "admin",
        "password": "password123"
    }
    
    print("Trying alternative admin credentials...")
    result = call_api('post', 'auth/login', data=admin_data)
    
    if result and 'access_token' in result:
        print("Login successful with alternative credentials!")
        return result['access_token']
    
    print("Failed to log in as admin.")
    return None

def trigger_auto_translation():
    """Trigger auto-translation of blog posts"""
    # Get admin token
    token = get_admin_login_token()
    
    if not token:
        print("Failed to get admin token. Cannot proceed with auto-translation.")
        return False
    
    # Set up headers with token
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # Set up data for auto-translation - use placeholder mode and translate all posts
    data = {
        "placeholder_mode": True,
        "batch_size": 100,  # Process all posts in one batch
        "force_translate": True  # Update all translations
    }
    
    print("Triggering auto-translation of all blog posts...")
    result = call_api('post', 'cms/posts/auto-translate-all', data=data, headers=headers)
    
    if result:
        print("Auto-translation triggered successfully!")
        print(json.dumps(result, indent=2))
        return True
    else:
        print("Failed to trigger auto-translation.")
        return False

def main():
    """Main function"""
    print("Starting auto-translation process...")
    success = trigger_auto_translation()
    
    if success:
        print("Auto-translation process completed!")
        sys.exit(0)
    else:
        print("Auto-translation process failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()