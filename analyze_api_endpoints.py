"""
Script to analyze available API endpoints and determine best migration approach

This script:
1. Tests various API endpoints to see what's available
2. Provides information on the best migration approach
"""

import requests
import sys
import json

# Flask API URL
API_URL = "http://localhost:5000/api"

def test_endpoint(method, endpoint, data=None, headers=None):
    """Test if an API endpoint exists and works"""
    url = f"{API_URL}/{endpoint}"
    
    try:
        if method.upper() == 'GET':
            response = requests.get(url, headers=headers)
        elif method.upper() == 'POST':
            response = requests.post(url, json=data, headers=headers)
        elif method.upper() == 'PUT':
            response = requests.put(url, json=data, headers=headers)
        elif method.upper() == 'DELETE':
            response = requests.delete(url, headers=headers)
        else:
            return False, "Invalid method"
        
        return response.status_code < 400, f"Status: {response.status_code}, Response: {response.text[:100]}"
    except Exception as e:
        return False, f"Error: {str(e)}"

def analyze_endpoints():
    """Analyze API endpoints and determine best migration approach"""
    print("Analyzing API endpoints...")
    
    # Endpoints to test
    endpoints = [
        ('GET', 'cms/blog'),
        ('GET', 'cms/languages'),
        ('GET', 'cms/blog/1'),  # Test specific post ID
        ('GET', 'cms/blog/slug/product-photography-tips'),  # Test slug lookup
        ('GET', 'cms/blog/1/translations'),  # Test translations lookup
        ('POST', 'cms/blog'),  # Test post creation
        ('POST', 'cms/blog/1/translation'),  # Test translation creation
        ('POST', 'cms/translation'),  # Test direct translation
        ('POST', 'cms/import/translation'),  # Test import functionality
        ('POST', 'cms/execute-sql'),  # Test SQL execution
    ]
    
    # Test each endpoint
    results = []
    for method, endpoint in endpoints:
        exists, message = test_endpoint(method, endpoint)
        results.append({
            'method': method,
            'endpoint': endpoint,
            'exists': exists,
            'message': message
        })
        print(f"{method} /{endpoint}: {'✅' if exists else '❌'} {message}")
    
    # Check for admin endpoints (will likely fail but worth trying)
    admin_endpoints = [
        ('GET', 'admin/cms/blog'),
        ('POST', 'admin/cms/blog/import'),
        ('POST', 'admin/cms/translation/import'),
    ]
    
    print("\nChecking admin endpoints...")
    for method, endpoint in admin_endpoints:
        exists, message = test_endpoint(method, endpoint)
        results.append({
            'method': method,
            'endpoint': endpoint,
            'exists': exists,
            'message': message
        })
        print(f"{method} /{endpoint}: {'✅' if exists else '❌'} {message}")
    
    # Now test actual CMS translation endpoints
    print("\nTesting CMS translation endpoints with a live test post ID...")
    
    # Get a valid post ID first
    _, posts_response = test_endpoint('GET', 'cms/blog')
    post_ids = []
    try:
        # Try to parse response and extract post IDs
        response = requests.get(f"{API_URL}/cms/blog")
        if response.status_code < 400:
            data = response.json()
            
            # Try to handle different response formats
            posts = []
            if isinstance(data, list):
                posts = data
            elif isinstance(data, dict) and 'posts' in data:
                posts = data.get('posts', [])
            
            for post in posts:
                if isinstance(post, dict) and 'id' in post:
                    post_ids.append(post['id'])
    except Exception as e:
        print(f"Error extracting post IDs: {str(e)}")
    
    if post_ids:
        test_post_id = post_ids[0]
        print(f"Using post ID {test_post_id} for testing translation endpoints")
        
        translation_endpoints = [
            ('GET', f'cms/blog/{test_post_id}/translations'),
            ('POST', f'cms/blog/{test_post_id}/translation'),
            ('POST', f'cms/blog/{test_post_id}/translations'),
            ('GET', f'cms/blog/{test_post_id}/translation/en'),
            ('PUT', f'cms/blog/{test_post_id}/translation/en'),
        ]
        
        for method, endpoint in translation_endpoints:
            exists, message = test_endpoint(method, endpoint)
            results.append({
                'method': method,
                'endpoint': endpoint,
                'exists': exists,
                'message': message
            })
            print(f"{method} /{endpoint}: {'✅' if exists else '❌'} {message}")
    else:
        print("No post IDs found for testing translation endpoints")
    
    # Analyze results and determine best approach
    print("\nAnalyzing results...")
    
    # Check if reading posts and languages works
    can_read_posts = any(r['exists'] for r in results if r['method'] == 'GET' and 'cms/blog' in r['endpoint'])
    can_read_langs = any(r['exists'] for r in results if r['method'] == 'GET' and 'cms/languages' in r['endpoint'])
    
    # Check if we can create/modify translations
    can_modify_trans = any(r['exists'] for r in results if r['method'] in ['POST', 'PUT'] and 'translation' in r['endpoint'])
    
    # Check if we can execute SQL
    can_exec_sql = any(r['exists'] for r in results if 'execute-sql' in r['endpoint'] or 'run-sql' in r['endpoint'])
    
    # Determine best approach
    print("\n=== Migration Approach Recommendation ===")
    
    if can_modify_trans:
        print("✅ Recommended Approach: Use API to create translations")
        print("   - API endpoints for translation management are available")
        print("   - Use POST requests to create translations for each post")
    elif can_exec_sql:
        print("✅ Recommended Approach: Use SQL execution API")
        print("   - Execute SQL statements to insert translations directly")
        print("   - Use prepared SQL migration script")
    elif can_read_posts and can_read_langs:
        print("⚠️ Limited Approach: Use direct database connection")
        print("   - API endpoints for reading data are available but not for writing")
        print("   - Use direct database connection to insert translations")
    else:
        print("❌ Challenging Approach: Use database dump and restore")
        print("   - API endpoints are limited")
        print("   - Consider exporting PostgreSQL data and importing to MySQL manually")
    
    print("\n=== Available API Routes ===")
    working_endpoints = [f"{r['method']} /{r['endpoint']}" for r in results if r['exists']]
    for endpoint in working_endpoints:
        print(f"- {endpoint}")
    
    # Save results to a file for reference
    with open('api_analysis.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\nAnalysis complete. Results saved to api_analysis.json")

if __name__ == "__main__":
    analyze_endpoints()