#!/usr/bin/env python3
"""
Script to check frontend calls to admin routes
"""

import os
import re
import json
from collections import defaultdict

# Admin routes from our previous analysis
ADMIN_ROUTES = [
    {"method": "POST", "path": "/api/cms/languages"},
    {"method": "PUT", "path": "/api/cms/languages/<code>"},
    {"method": "DELETE", "path": "/api/cms/languages/<code>"},
    {"method": "POST", "path": "/api/cms/tags"},
    {"method": "PUT", "path": "/api/cms/tags/<int:tag_id>"},
    {"method": "DELETE", "path": "/api/cms/tags/<int:tag_id>"},
    {"method": "POST", "path": "/api/cms/posts/generate-content"},
    {"method": "POST", "path": "/api/cms/posts"},
    {"method": "PUT", "path": "/api/cms/posts/<int:post_id>"},
    {"method": "DELETE", "path": "/api/cms/posts/<int:post_id>"},
    {"method": "DELETE", "path": "/api/cms/posts/<int:post_id>/translations/<language_code>"},
    {"method": "POST", "path": "/api/cms/posts/force-translate-es-fr"},
    {"method": "POST", "path": "/api/cms/posts/auto-translate-all"},
    {"method": "POST", "path": "/api/cms/posts/<int:post_id>/auto-translate"},
    {"method": "POST", "path": "/api/cms/posts/<int:post_id>/media"},
    {"method": "PUT", "path": "/api/cms/media/<int:media_id>"},
    {"method": "DELETE", "path": "/api/cms/media/<int:media_id>"},
    {"method": "POST", "path": "/api/settings/<key>"},
    {"method": "POST", "path": "/api/settings/logo/upload"}
]

def find_frontend_api_calls():
    """Find all API calls in the frontend code"""
    api_calls = []
    admin_api_calls = []
    
    # Search through all frontend JavaScript files
    for root, _, files in os.walk("frontend/src"):
        for filename in files:
            if filename.endswith((".js", ".jsx", ".ts", ".tsx")):
                file_path = os.path.join(root, filename)
                
                try:
                    with open(file_path, "r", encoding="utf-8") as file:
                        content = file.read()
                        
                        # Find API calls using axios or fetch
                        api_patterns = [
                            # axios calls
                            r'axios\.(get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                            # fetch calls
                            r'fetch\s*\(\s*[\'"]([^\'"]+)[\'"](?:.*?method:\s*[\'"]([^\'"]+)[\'"])?'
                        ]
                        
                        for pattern in api_patterns:
                            for match in re.finditer(pattern, content, re.DOTALL):
                                if "axios" in pattern:
                                    method = match.group(1).upper()
                                    url = match.group(2)
                                else:
                                    url = match.group(1)
                                    method = match.group(2).upper() if match.group(2) else "GET"
                                
                                # Clean up URL
                                if url.startswith("/") and not url.startswith("/api/"):
                                    url = f"/api{url}"
                                
                                # Remove query parameters
                                url = url.split("?")[0]
                                
                                # Extract line number and context
                                line_num = content[:match.start()].count("\n") + 1
                                line_context = content.split("\n")[max(0, line_num-1)]
                                
                                # Create API call object
                                api_call = {
                                    "method": method,
                                    "url": url,
                                    "file": file_path,
                                    "line": line_num,
                                    "context": line_context
                                }
                                
                                # Add to list of all API calls
                                api_calls.append(api_call)
                                
                                # Check if this is an admin API call
                                for admin_route in ADMIN_ROUTES:
                                    if matches_admin_route(admin_route, api_call):
                                        admin_api_calls.append(api_call)
                                        break
                
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")
    
    return api_calls, admin_api_calls

def matches_admin_route(admin_route, api_call):
    """Check if an API call matches an admin route"""
    if admin_route["method"] != api_call["method"]:
        return False
    
    # Convert the route path to a regex pattern
    route_path = admin_route["path"]
    route_pattern = route_path.replace("/api/", "^/api/")
    
    # Replace route parameters like <int:id> or <param> with regex patterns
    route_pattern = re.sub(r"<(?:int|string|float|path|any):(\w+)>", r"([^/]+)", route_pattern)
    route_pattern = re.sub(r"<(\w+)>", r"([^/]+)", route_pattern)
    
    # Add end of string anchor and make it a regex pattern
    route_pattern = f"{route_pattern}$"
    
    # Check if the API call URL matches the route pattern
    if re.match(route_pattern, api_call["url"]):
        return True
    
    return False

def group_api_calls_by_route(admin_routes, api_calls):
    """Group API calls by their matching admin routes"""
    route_to_calls = defaultdict(list)
    
    for call in api_calls:
        for route in admin_routes:
            if matches_admin_route(route, call):
                route_key = f"{route['method']} {route['path']}"
                route_to_calls[route_key].append(call)
    
    return route_to_calls

def main():
    """Main function"""
    print("Analyzing frontend API calls...")
    
    api_calls, admin_api_calls = find_frontend_api_calls()
    
    print(f"Found {len(api_calls)} total API calls in frontend code")
    print(f"Found {len(admin_api_calls)} admin API calls")
    
    # Group by route
    route_to_calls = group_api_calls_by_route(ADMIN_ROUTES, admin_api_calls)
    
    # Check which admin routes are called from the frontend
    routes_with_calls = set(route_to_calls.keys())
    all_route_keys = {f"{route['method']} {route['path']}" for route in ADMIN_ROUTES}
    uncalled_routes = all_route_keys - routes_with_calls
    
    print("\n=== ADMIN ROUTES WITH FRONTEND CALLS ===")
    for route_key, calls in route_to_calls.items():
        print(f"\n{route_key}:")
        for call in calls:
            rel_path = os.path.relpath(call["file"], "frontend/src")
            print(f"  {rel_path}:{call['line']} - {call['context'].strip()}")
    
    print("\n=== ADMIN ROUTES WITHOUT FRONTEND CALLS ===")
    for route_key in sorted(uncalled_routes):
        print(f"  {route_key}")
    
    print("\n=== SUMMARY ===")
    print(f"Total admin routes: {len(ADMIN_ROUTES)}")
    print(f"Routes with frontend calls: {len(routes_with_calls)}")
    print(f"Routes without frontend calls: {len(uncalled_routes)}")

if __name__ == "__main__":
    main() 