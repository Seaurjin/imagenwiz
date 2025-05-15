#!/usr/bin/env python3
"""
Script to identify all admin endpoints from the code

This script directly looks for check_admin_access() calls in route functions
to identify which API endpoints require admin access.
"""

import os
import re
import json
from tabulate import tabulate

def find_admin_routes():
    """Find all routes that use check_admin_access()"""
    admin_routes = []
    
    # Look in cms/routes.py
    cms_route_file = "backend/app/cms/routes.py"
    if os.path.exists(cms_route_file):
        with open(cms_route_file, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # Find all route definitions
            route_pattern = r'@bp\.route\([\'"]([^\'"]+)[\'"](?:,\s*methods=(\[[^\]]+\]))?\)'
            function_pattern = r'def\s+(\w+)\([^)]*\):'
            
            # Find all route definitions and their associated functions
            for match in re.finditer(route_pattern, content, re.DOTALL):
                route_path = match.group(1)
                methods = match.group(2)
                if methods:
                    methods = eval(methods)
                else:
                    methods = ['GET']
                
                # Find the function associated with this route
                start_pos = match.end()
                func_match = re.search(function_pattern, content[start_pos:start_pos+200])
                if func_match:
                    func_name = func_match.group(1)
                    
                    # Now find the function implementation
                    func_def_pattern = rf'def\s+{func_name}\([^)]*\):'
                    func_pos = content.find(func_def_pattern)
                    if func_pos != -1:
                        # Find the end of the function (next def or EOF)
                        next_func = content.find('\ndef ', func_pos + 10)
                        if next_func == -1:
                            next_func = len(content)
                        
                        func_impl = content[func_pos:next_func]
                        
                        # Check if this is an admin-only route
                        # Different patterns for detecting admin routes
                        admin_patterns = [
                            'user = check_admin_access()',
                            'check_admin_access()',
                            '@admin_required',
                            'user.is_admin',
                            'if not user or not user.is_admin'
                        ]
                        is_admin = any(pattern in func_impl for pattern in admin_patterns)
                        requires_jwt = '@jwt_required()' in content[match.start()-50:match.start()]
                        
                        # Also check the 50 lines before the route for admin decorators
                        previous_lines = content[max(0, match.start()-500):match.start()]
                        if '@admin_required' in previous_lines or 'admin_required' in previous_lines:
                            is_admin = True
                        
                        # Add to list if it's admin-only
                        if is_admin:
                            admin_routes.append({
                                'path': f"/api/cms{route_path}",
                                'methods': methods,
                                'function': func_name,
                                'requires_jwt': requires_jwt
                            })
    
    # Look in settings/routes.py
    settings_route_file = "backend/app/settings/routes.py"
    if os.path.exists(settings_route_file):
        with open(settings_route_file, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # Same pattern matching as above
            route_pattern = r'@bp\.route\([\'"]([^\'"]+)[\'"](?:,\s*methods=(\[[^\]]+\]))?\)'
            function_pattern = r'def\s+(\w+)\([^)]*\):'
            
            for match in re.finditer(route_pattern, content, re.DOTALL):
                route_path = match.group(1)
                methods = match.group(2)
                if methods:
                    methods = eval(methods)
                else:
                    methods = ['GET']
                
                start_pos = match.end()
                func_match = re.search(function_pattern, content[start_pos:start_pos+200])
                if func_match:
                    func_name = func_match.group(1)
                    
                    func_def_pattern = rf'def\s+{func_name}\([^)]*\):'
                    func_pos = content.find(func_def_pattern)
                    if func_pos != -1:
                        next_func = content.find('\ndef ', func_pos + 10)
                        if next_func == -1:
                            next_func = len(content)
                        
                        func_impl = content[func_pos:next_func]
                        
                        # Check if this is an admin-only route using the same patterns
                        admin_patterns = [
                            'user = check_admin_access()',
                            'check_admin_access()',
                            '@admin_required',
                            'user.is_admin',
                            'if not user or not user.is_admin'
                        ]
                        is_admin = any(pattern in func_impl for pattern in admin_patterns)
                        requires_jwt = '@jwt_required()' in content[match.start()-50:match.start()]
                        
                        # Also check the 50 lines before the route for admin decorators
                        previous_lines = content[max(0, match.start()-500):match.start()]
                        if '@admin_required' in previous_lines or 'admin_required' in previous_lines:
                            is_admin = True
                        
                        if is_admin:
                            admin_routes.append({
                                'path': f"/api/settings{route_path}",
                                'methods': methods,
                                'function': func_name,
                                'requires_jwt': requires_jwt
                            })
    
    return admin_routes

def find_frontend_admin_calls():
    """Find admin API calls in frontend code"""
    admin_calls = []
    
    # Look in frontend files for API calls that likely require admin access
    frontend_dirs = [
        "frontend/src/pages/admin",
        "frontend/src/components/admin",
        "frontend/src/components/cms",
        "frontend/src/lib"
    ]
    
    for dir_path in frontend_dirs:
        if not os.path.exists(dir_path):
            continue
            
        for root, _, files in os.walk(dir_path):
            for filename in files:
                if filename.endswith(('.js', '.jsx')):
                    file_path = os.path.join(root, filename)
                    
                    with open(file_path, 'r', encoding='utf-8') as file:
                        try:
                            content = file.read()
                            
                            # Look for axios and fetch calls
                            api_patterns = [
                                r'axios\.(get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                                r'fetch\s*\(\s*[\'"]([^\'"]+)[\'"](?:.*?method:\s*[\'"]([^\'"]+)[\'"])?'
                            ]
                            
                            for pattern in api_patterns:
                                for match in re.finditer(pattern, content, re.DOTALL):
                                    if 'axios' in pattern:
                                        method = match.group(1).upper()
                                        url = match.group(2)
                                    else:
                                        url = match.group(1)
                                        method = match.group(2).upper() if match.group(2) else 'GET'
                                    
                                    # Include if it's related to admin functions
                                    if '/api/' in url or url.startswith('/auth/') or url.startswith('/cms/'):
                                        # Add /api prefix if missing
                                        if url.startswith('/') and not url.startswith('/api/'):
                                            url = f"/api{url}"
                                            
                                        # Remove query params
                                        url = url.split('?')[0]
                                        
                                        admin_calls.append({
                                            'method': method,
                                            'url': url,
                                            'file': file_path,
                                            'line': content[:match.start()].count('\n') + 1
                                        })
                        except Exception as e:
                            print(f"Error analyzing {file_path}: {e}")
    
    return admin_calls

def match_endpoints_to_frontend(admin_routes, frontend_calls):
    """Match backend admin endpoints to frontend calls"""
    matches = []
    unmatched_frontend = []
    unmatched_backend = admin_routes.copy()
    
    for call in frontend_calls:
        matching_routes = []
        
        for route in admin_routes:
            # Convert route path to regex pattern
            route_pattern = re.sub(r'<(?:int|string|float|path|any):(\w+)>', r'(?P<\1>[^/]+)', route['path'])
            route_pattern = f"^{route_pattern}$"
            
            if re.match(route_pattern, call['url']) and call['method'] in route['methods']:
                matching_routes.append(route)
                if route in unmatched_backend:
                    unmatched_backend.remove(route)
        
        if matching_routes:
            matches.append({
                'frontend_call': call,
                'matching_routes': matching_routes
            })
        else:
            unmatched_frontend.append(call)
    
    return matches, unmatched_frontend, unmatched_backend

def main():
    """Main function"""
    print("Analyzing admin endpoints...")
    
    admin_routes = find_admin_routes()
    print(f"Found {len(admin_routes)} admin routes in backend code")
    
    frontend_calls = find_frontend_admin_calls()
    print(f"Found {len(frontend_calls)} potential admin API calls in frontend code")
    
    matches, unmatched_frontend, unmatched_backend = match_endpoints_to_frontend(admin_routes, frontend_calls)
    
    # Create a tabular report 
    print("\n=== ADMIN ENDPOINTS ===\n")
    admin_table = []
    for route in admin_routes:
        admin_table.append([
            ', '.join(route['methods']),
            route['path'],
            route['function'],
            "Yes" if route['requires_jwt'] else "No",
            "Yes" if route not in unmatched_backend else "No"
        ])
    
    print(tabulate(
        admin_table,
        headers=["Methods", "Path", "Function", "JWT Required", "Has Frontend Call"],
        tablefmt="grid"
    ))
    
    print("\n=== FRONTEND ADMIN CALLS ===\n")
    frontend_table = []
    for call in frontend_calls:
        has_match = call not in unmatched_frontend
        frontend_table.append([
            call['method'],
            call['url'],
            f"{os.path.basename(call['file'])}:{call['line']}",
            "Yes" if has_match else "No"
        ])
    
    print(tabulate(
        frontend_table,
        headers=["Method", "URL", "Location", "Has Backend Route"],
        tablefmt="grid"
    ))
    
    print("\n=== SUMMARY ===\n")
    print(f"Total admin endpoints: {len(admin_routes)}")
    print(f"Frontend calls with matching backend: {len(matches)}")
    print(f"Frontend calls without backend: {len(unmatched_frontend)}")
    print(f"Backend endpoints without frontend: {len(unmatched_backend)}")

if __name__ == "__main__":
    try:
        main()
    except ImportError:
        # If tabulate isn't installed, install it
        import subprocess
        print("Installing tabulate package...")
        subprocess.check_call(["pip", "install", "tabulate"])
        main() 