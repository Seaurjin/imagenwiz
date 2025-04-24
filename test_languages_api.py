"""
Script to test the language API and verify all languages are returned
"""
import requests
import json

def test_api():
    """Test the language API and verify all languages are returned"""
    
    url = "http://localhost:5000/api/cms/languages"
    print(f"Testing API: {url}")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Parse JSON response
        languages = response.json()
        print(f"API returned {len(languages)} languages:")
        
        # Print all languages
        for lang in languages:
            print(f"{lang['code']}: {lang['name']} {lang.get('flag', '(no flag)')}")
        
        # Return count
        return len(languages)
    except Exception as e:
        print(f"Error testing API: {e}")
        return 0

if __name__ == "__main__":
    count = test_api()
    print(f"\nFound {count} languages in the API response")
    if count == 33:
        print("SUCCESS: All 33 languages are returned from the API!")
    else:
        print(f"ISSUE: Only {count} languages are returned from the API, should be 33")