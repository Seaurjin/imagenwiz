#!/usr/bin/env python3
"""
Script to check for admin service functions that might call the admin endpoints
"""

import os
import re
import json

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

def find_service_functions():
    """Find service functions in the frontend code"""
    service_functions = []
    
    # Look for service files
    service_file_patterns = [
        "frontend/src/**/service*.js*",
        "frontend/src/**/*-service.js*",
        "frontend/src/**/*Service.js*",
        "frontend/src/**/api*.js*",
        "frontend/src/**/lib/*.js*",
        "frontend/src/**/utils/*.js*",
    ]
    
    # Get all potential service files
    service_files = []
    for pattern in service_file_patterns:
        base_dir = pattern.split('*')[0]
        if os.path.exists(base_dir):
            for root, _, files in os.walk(base_dir):
                for file in files:
                    if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                        if ('service' in file.lower() or 
                            'api' in file.lower() or 
                            ('lib' in root.lower() and not file.startswith('_')) or
                            ('utils' in root.lower() and not file.startswith('_'))):
                            service_files.append(os.path.join(root, file))
    
    # Find admin-related functions in service files
    for file_path in service_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                
                # Find all export/function declarations
                function_pattern = r'(?:export\s+(?:async\s+)?function|export\s+const)\s+(\w+)\s*='
                for match in re.finditer(function_pattern, content):
                    func_name = match.group(1)
                    
                    # Find the function body
                    start_pos = match.end()
                    # Look for the opening brace or arrow function
                    func_start = content.find('{', start_pos)
                    if func_start == -1:
                        func_start = content.find('=>', start_pos)
                        if func_start == -1:
                            continue
                        func_start += 2
                    else:
                        func_start += 1
                    
                    # Find the function end (matching closing brace)
                    brace_count = 1
                    func_end = func_start
                    while brace_count > 0 and func_end < len(content) - 1:
                        func_end += 1
                        if content[func_end] == '{':
                            brace_count += 1
                        elif content[func_end] == '}':
                            brace_count -= 1
                    
                    # Get the function body
                    func_body = content[func_start:func_end]
                    
                    # Check if it's admin-related
                    admin_related = (
                        'admin' in func_name.lower() or
                        'admin' in func_body.lower() or
                        any(route["path"].split('/')[2] in func_body.lower() for route in ADMIN_ROUTES) or
                        '/api/cms' in func_body or
                        '/api/settings' in func_body or
                        'Authorization' in func_body or
                        'Bearer' in func_body or
                        'token' in func_body.lower()
                    )
                    
                    if admin_related:
                        service_functions.append({
                            'name': func_name,
                            'file': file_path,
                            'api_methods': find_api_methods_in_function(func_body),
                            'has_token': 'token' in func_body.lower() or 'Authorization' in func_body,
                            'line': content[:match.start()].count('\n') + 1
                        })
        except Exception as e:
            print(f"Error analyzing {file_path}: {e}")
    
    return service_functions

def find_api_methods_in_function(func_body):
    """Find API methods called in a function"""
    api_methods = []
    
    # Check for axios calls
    axios_pattern = r'axios\.(get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]'
    for match in re.finditer(axios_pattern, func_body, re.DOTALL):
        method = match.group(1).upper()
        url = match.group(2)
        
        # Normalize URL
        if url.startswith('/') and not url.startswith('/api/'):
            url = f'/api{url}'
        
        api_methods.append({
            'method': method,
            'url': url
        })
    
    # Check for fetch calls
    fetch_pattern = r'fetch\s*\(\s*[\'"]([^\'"]+)[\'"](?:.*?method:\s*[\'"]([^\'"]+)[\'"])?'
    for match in re.finditer(fetch_pattern, func_body, re.DOTALL):
        url = match.group(1)
        method = match.group(2).upper() if match.group(2) else 'GET'
        
        # Normalize URL
        if url.startswith('/') and not url.startswith('/api/'):
            url = f'/api{url}'
        
        api_methods.append({
            'method': method,
            'url': url
        })
    
    return api_methods

def find_service_usage():
    """Find where service functions are used in components"""
    service_usage = []
    
    # Check all JavaScript/JSX files
    for root, _, files in os.walk('frontend/src'):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                        # Look for import statements that might import admin services
                        import_pattern = r'import\s+\{([^}]+)\}\s+from\s+[\'"]([^\'"]+)[\'"]'
                        for match in re.finditer(import_pattern, content):
                            imports = match.group(1).split(',')
                            source = match.group(2)
                            
                            # Check if it's importing from a likely service file
                            if ('service' in source.lower() or 
                                'api' in source.lower() or 
                                '/lib/' in source or 
                                '/utils/' in source):
                                
                                # Check each imported function
                                for imp in imports:
                                    func_name = imp.strip()
                                    
                                    # Look for usage of this function in the file
                                    usage_pattern = rf'{func_name}\s*\('
                                    for usage_match in re.finditer(usage_pattern, content):
                                        line_num = content[:usage_match.start()].count('\n') + 1
                                        line = content.split('\n')[line_num - 1] if line_num <= len(content.split('\n')) else ""
                                        
                                        service_usage.append({
                                            'service': func_name,
                                            'file': file_path,
                                            'line': line_num,
                                            'context': line.strip(),
                                            'import_from': source
                                        })
                except Exception as e:
                    print(f"Error analyzing usage in {file_path}: {e}")
    
    return service_usage

def main():
    """Main function"""
    print("Analyzing admin service functions...")
    
    # Find service functions
    service_functions = find_service_functions()
    print(f"Found {len(service_functions)} potentially admin-related service functions")
    
    # Find service usage
    service_usage = find_service_usage()
    print(f"Found {len(service_usage)} usages of service functions")
    
    # Print admin service functions
    print("\n=== ADMIN SERVICE FUNCTIONS ===")
    for func in service_functions:
        rel_path = os.path.relpath(func['file'], 'frontend/src')
        print(f"\n{func['name']} ({rel_path}:{func['line']})")
        if func['api_methods']:
            print("  API calls:")
            for api in func['api_methods']:
                print(f"    {api['method']} {api['url']}")
                
                # Check if this matches an admin route
                for route in ADMIN_ROUTES:
                    route_path = route['path'].replace('/api/', '^/api/')
                    route_path = re.sub(r'<(?:int|string|float|path|any):\w+>', r'[^/]+', route_path)
                    route_path = re.sub(r'<\w+>', r'[^/]+', route_path)
                    route_path = f"{route_path}$"
                    
                    if route['method'] == api['method'] and re.match(route_path, api['url']):
                        print(f"      ✅ Matches admin route: {route['method']} {route['path']}")
        
        # Check where this function is used
        usages = [u for u in service_usage if u['service'] == func['name']]
        if usages:
            print("  Used in:")
            for usage in usages:
                rel_usage_path = os.path.relpath(usage['file'], 'frontend/src')
                print(f"    {rel_usage_path}:{usage['line']} - {usage['context']}")
    
    # Count how many admin routes are covered by service functions
    covered_routes = set()
    for func in service_functions:
        for api in func['api_methods']:
            for route in ADMIN_ROUTES:
                route_path = route['path'].replace('/api/', '^/api/')
                route_path = re.sub(r'<(?:int|string|float|path|any):\w+>', r'[^/]+', route_path)
                route_path = re.sub(r'<\w+>', r'[^/]+', route_path)
                route_path = f"{route_path}$"
                
                if route['method'] == api['method'] and re.match(route_path, api['url']):
                    covered_routes.add(f"{route['method']} {route['path']}")
    
    # Print summary
    print("\n=== SUMMARY ===")
    print(f"Total admin routes: {len(ADMIN_ROUTES)}")
    print(f"Routes covered by service functions: {len(covered_routes)}")
    
    # Print uncovered routes
    all_route_keys = {f"{route['method']} {route['path']}" for route in ADMIN_ROUTES}
    uncovered_routes = all_route_keys - covered_routes
    if uncovered_routes:
        print("\n=== UNCOVERED ADMIN ROUTES ===")
        for route in sorted(uncovered_routes):
            print(f"  {route}")

if __name__ == "__main__":
    main() 