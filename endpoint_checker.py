#!/usr/bin/env python3
"""
Endpoint Checker Script

This script analyzes the backend code to identify API endpoints and their functionality
without needing to run the server. It focuses on admin-related endpoints.
"""

import os
import re
import glob
import json
from collections import defaultdict

def find_blueprint_definitions():
    """Find all Flask blueprint definitions in the codebase"""
    blueprints = {}
    
    # Look for blueprint definitions
    for root, _, files in os.walk("backend"):
        for filename in files:
            if filename.endswith(".py"):
                file_path = os.path.join(root, filename)
                
                with open(file_path, 'r', encoding='utf-8') as file:
                    try:
                        content = file.read()
                        # Find blueprint definitions like: bp = Blueprint('name', __name__, url_prefix='/prefix')
                        matches = re.findall(r'(\w+)\s*=\s*Blueprint\([\'"](\w+)[\'"],\s*[^,]+,\s*url_prefix=[\'"]([^\'"]+)[\'"]', content)
                        
                        for bp_var, bp_name, url_prefix in matches:
                            blueprints[bp_var] = {
                                'name': bp_name,
                                'url_prefix': url_prefix,
                                'file_path': file_path,
                                'variable': bp_var
                            }
                    except Exception as e:
                        print(f"Error reading {file_path}: {e}")
    
    return blueprints

def find_route_definitions(blueprints):
    """Find all route definitions for each blueprint"""
    routes = defaultdict(list)
    admin_routes = []
    
    for bp_var, blueprint in blueprints.items():
        # Get the directory containing the blueprint
        bp_dir = os.path.dirname(blueprint['file_path'])
        
        # Look for route definitions in all Python files in the same directory
        for py_file in glob.glob(f"{bp_dir}/*.py"):
            with open(py_file, 'r', encoding='utf-8') as file:
                try:
                    content = file.read()
                    
                    # Find all route definitions: @bp.route('/path', methods=['GET', 'POST'])
                    # Simplified regex pattern that's more robust
                    route_pattern = rf'@{bp_var}\.route\([\'"]([^\'"]+)[\'"](.*?)\)'
                    
                    for match in re.finditer(route_pattern, content, re.DOTALL):
                        path = match.group(1)
                        route_args = match.group(2)
                        
                        # Extract methods if specified
                        methods = "['GET']"  # Default
                        methods_match = re.search(r'methods\s*=\s*(\[[^\]]+\])', route_args)
                        if methods_match:
                            methods = methods_match.group(1)
                        
                        # Find the function name
                        func_match = re.search(rf'{re.escape(match.group(0))}\s*\n\s*def\s+(\w+)\(', content, re.DOTALL)
                        func_name = func_match.group(1) if func_match else "unknown"
                        
                        # Check if this is an admin-only route
                        start_pos = match.start()
                        end_pos = match.end()
                        
                        # First check if there's a JWT requirement or admin_required decorator
                        previous_lines = content[max(0, start_pos-200):start_pos].split('\n')
                        jwt_required = any('@jwt_required' in line for line in previous_lines)
                        admin_required = any('@admin_required' in line for line in previous_lines)
                        
                        # Look for admin indicators in the function and surrounding lines
                        function_start = content.find(f"def {func_name}", end_pos)
                        if function_start == -1:
                            function_start = end_pos
                        function_end = content.find("def ", function_start + 1)
                        if function_end == -1:
                            function_end = len(content)
                            
                        function_text = content[function_start:function_end]
                        
                        is_admin = (
                            admin_required or
                            'check_admin_access' in function_text or
                            'user = check_admin_access()' in function_text or
                            'if not user or not user.is_admin' in function_text or
                            'if user and user.is_admin' in function_text or
                            jwt_required and ('admin' in func_name.lower() or 'is_admin' in function_text) or
                            'admin' in path.lower()
                        )
                        
                        full_path = f"{blueprint['url_prefix']}{path}"
                        route_info = {
                            'path': path,
                            'full_path': full_path,
                            'methods': eval(methods) if methods else ['GET'],
                            'function': func_name,
                            'file': py_file,
                            'is_admin': is_admin,
                            'has_jwt': jwt_required,
                            'admin_decorator': admin_required
                        }
                        
                        # Also print admin routes as they're found
                        if is_admin:
                            print(f"Found admin route: {', '.join(route_info['methods'])} {route_info['full_path']}")
                        
                        routes[blueprint['name']].append(route_info)
                        if is_admin:
                            admin_routes.append(route_info)
                    
                except Exception as e:
                    print(f"Error analyzing routes in {py_file}: {e}")
    
    return routes, admin_routes

def analyze_admin_route_implementations(admin_routes):
    """Analyze the implementation of admin routes to understand their functionality"""
    admin_route_details = []
    
    for route in admin_routes:
        with open(route['file'], 'r', encoding='utf-8') as file:
            try:
                content = file.read()
                
                # Find the function implementation
                func_pattern = rf"def\s+{route['function']}\s*\([^)]*\):(?:\s*(?:\'\'\'|\"\"\")([^\"\']+?)(?:\'\'\'|\"\"\"))?(.*?)(?=\s*def|\Z)"
                func_match = re.search(func_pattern, content, re.DOTALL)
                
                if func_match:
                    docstring = func_match.group(1).strip() if func_match.group(1) else ""
                    implementation = func_match.group(2).strip() if func_match.group(2) else ""
                    
                    # Look for common patterns in the implementation
                    uses_patterns = {
                        'database_read': any(p in implementation for p in ['.query.', '.get(', '.filter_by(', '.all()']),
                        'database_write': any(p in implementation for p in ['db.session.add', 'db.session.commit', 'db.session.delete']),
                        'request_json': 'request.get_json()' in implementation,
                        'request_form': 'request.form' in implementation,
                        'request_files': 'request.files' in implementation,
                        'returns_json': 'jsonify' in implementation,
                        'admin_check': 'check_admin_access()' in implementation or 'is_admin' in implementation
                    }
                    
                    # Try to determine the purpose
                    purpose = ''
                    if 'create' in route['function'].lower() or 'add' in route['function'].lower() or 'POST' in route['methods'] and uses_patterns['database_write']:
                        purpose = 'Create resource'
                    elif 'update' in route['function'].lower() or 'edit' in route['function'].lower() or 'PUT' in route['methods'] or 'PATCH' in route['methods']:
                        purpose = 'Update resource'
                    elif 'delete' in route['function'].lower() or 'remove' in route['function'].lower() or 'DELETE' in route['methods']:
                        purpose = 'Delete resource'
                    elif 'get' in route['function'].lower() or 'list' in route['function'].lower() or 'GET' in route['methods']:
                        purpose = 'Read resource'
                    else:
                        purpose = 'Other operation'
                    
                    admin_route_details.append({
                        'route': route,
                        'docstring': docstring,
                        'uses': uses_patterns,
                        'purpose': purpose
                    })
            except Exception as e:
                print(f"Error analyzing implementation for {route['function']} in {route['file']}: {e}")
    
    return admin_route_details

def find_frontend_api_calls():
    """Find frontend API calls to backend endpoints"""
    api_calls = []
    
    # Look for API calls in frontend JavaScript/TypeScript/JSX files
    for ext in ['js', 'jsx', 'ts', 'tsx']:
        for file_path in glob.glob(f"frontend/src/**/*.{ext}", recursive=True):
            with open(file_path, 'r', encoding='utf-8') as file:
                try:
                    content = file.read()
                    
                    # Look for axios calls and fetch calls
                    patterns = [
                        # axios pattern
                        r'axios\.(get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]',
                        # fetch pattern
                        r'fetch\s*\(\s*[\'"]([^\'"]+)[\'"](?:.*?method:\s*[\'"]([^\'"]+)[\'"])?'
                    ]
                    
                    for pattern in patterns:
                        for match in re.finditer(pattern, content, re.DOTALL):
                            if len(match.groups()) == 2 and match.group(2):
                                # axios pattern or fetch with method
                                if 'fetch' in pattern:
                                    url = match.group(1)
                                    method = match.group(2) or 'GET'
                                else:
                                    method = match.group(1)
                                    url = match.group(2)
                            else:
                                # fetch without method
                                url = match.group(1)
                                method = 'GET'
                            
                            method = method.upper()
                            
                            # Only include API calls
                            if '/api/' in url or url.startswith('/auth/') or url.startswith('/cms/'):
                                # Extract context around the API call
                                line_num = content[:match.start()].count('\n') + 1
                                lines = content.split('\n')
                                start_line = max(0, line_num - 10)
                                end_line = min(len(lines), line_num + 10)
                                context = '\n'.join(lines[start_line:end_line])
                                
                                # Check if it's an admin call
                                is_admin = (
                                    'admin' in url.lower() or
                                    'isAdmin' in context or
                                    'is_admin' in context or
                                    'requireAdmin' in context or
                                    'admin_required' in context or
                                    'AdminOnly' in context or
                                    'CMS' in context and 'user.is_admin' in context
                                )
                                
                                api_calls.append({
                                    'method': method,
                                    'url': url,
                                    'file': file_path,
                                    'line': line_num,
                                    'is_admin': is_admin,
                                    'context': context[:200] + '...' if len(context) > 200 else context
                                })
                    
                except Exception as e:
                    print(f"Error analyzing API calls in {file_path}: {e}")
    
    return api_calls

def match_frontend_to_backend(frontend_calls, backend_routes):
    """Match frontend API calls to backend routes"""
    # Flatten the backend routes
    all_backend_routes = []
    for routes in backend_routes.values():
        all_backend_routes.extend(routes)
    
    matches = []
    
    for call in frontend_calls:
        # Normalize URL for matching
        call_url = call['url']
        
        # For relative URLs, add /api prefix if needed
        if call_url.startswith('/') and not call_url.startswith('/api/'):
            call_url = f"/api{call_url}"
        
        # Remove query params for matching
        call_url = call_url.split('?')[0]
        
        # Find matching backend routes
        matching_routes = []
        for route in all_backend_routes:
            # Convert route path patterns to regex for matching
            # Replace route params like <int:id> with regex pattern
            route_pattern = re.sub(r'<(?:int|string|float|path|any):(\w+)>', r'(?P<\1>[^/]+)', route['full_path'])
            route_pattern = f"^{route_pattern}$"
            
            if re.match(route_pattern, call_url) and call['method'] in route['methods']:
                matching_routes.append(route)
        
        matches.append({
            'frontend_call': call,
            'matching_backend_routes': matching_routes
        })
    
    return matches

def generate_report(blueprints, routes, admin_routes, admin_details, frontend_calls, matches):
    """Generate a comprehensive report of endpoints and their matches"""
    report = {
        'blueprints': blueprints,
        'total_routes': sum(len(routes_list) for routes_list in routes.values()),
        'admin_routes': len(admin_routes),
        'admin_routes_details': admin_details,
        'frontend_api_calls': frontend_calls,
        'frontend_to_backend_matches': matches,
        'summary': {
            'total_admin_endpoints': len(admin_routes),
            'admin_endpoints_with_frontend_calls': 0,
            'admin_frontend_calls_without_backend': 0
        }
    }
    
    # Count matches
    matched_backend_routes = set()
    unmatched_frontend_calls = []
    
    for match in matches:
        if match['frontend_call']['is_admin']:
            if match['matching_backend_routes']:
                for route in match['matching_backend_routes']:
                    if route['is_admin']:
                        matched_backend_routes.add(json.dumps({
                            'path': route['full_path'],
                            'methods': route['methods']
                        }))
            else:
                unmatched_frontend_calls.append(match['frontend_call'])
    
    report['summary']['admin_endpoints_with_frontend_calls'] = len(matched_backend_routes)
    report['summary']['admin_frontend_calls_without_backend'] = len(unmatched_frontend_calls)
    
    return report

def print_report(report):
    """Print a human-readable report"""
    print("\n=== API ENDPOINT ANALYSIS REPORT ===\n")
    
    print(f"Total routes: {report['total_routes']}")
    print(f"Admin routes: {report['admin_routes']}")
    
    print("\n=== ADMIN ENDPOINTS ===\n")
    for i, route_info in enumerate(report['admin_routes_details']):
        route = route_info['route']
        print(f"{i+1}. {', '.join(route['methods'])} {route['full_path']}")
        print(f"   Function: {route['function']}")
        print(f"   Purpose: {route_info['purpose']}")
        if route_info['docstring']:
            print(f"   Description: {route_info['docstring']}")
        print(f"   File: {route['file']}")
        print(f"   Actions: {'Reads' if route_info['uses']['database_read'] else ''} {'Writes' if route_info['uses']['database_write'] else ''}")
        print()
    
    print("\n=== FRONTEND ADMIN API CALLS ===\n")
    admin_calls = [call for call in report['frontend_api_calls'] if call['is_admin']]
    for i, call in enumerate(admin_calls):
        print(f"{i+1}. {call['method']} {call['url']}")
        print(f"   File: {call['file']}:{call['line']}")
        
        # Find matching backend routes
        matching_routes = []
        for match in report['frontend_to_backend_matches']:
            if match['frontend_call'] == call:
                matching_routes = match['matching_backend_routes']
                break
        
        if matching_routes:
            print(f"   Matching backend routes:")
            for route in matching_routes:
                print(f"     - {', '.join(route['methods'])} {route['full_path']}")
        else:
            print(f"   ⚠️ No matching backend route found")
        print()
    
    print("\n=== SUMMARY ===\n")
    print(f"Total admin endpoints: {report['summary']['total_admin_endpoints']}")
    print(f"Admin endpoints with frontend calls: {report['summary']['admin_endpoints_with_frontend_calls']}")
    print(f"Admin frontend calls without backend: {report['summary']['admin_frontend_calls_without_backend']}")
    print("\n")

def main():
    """Main function to run the analysis"""
    print("Analyzing API endpoints...")
    
    # Find blueprint definitions
    blueprints = find_blueprint_definitions()
    print(f"Found {len(blueprints)} blueprint definitions")
    
    # Find route definitions
    routes, admin_routes = find_route_definitions(blueprints)
    print(f"Found {sum(len(routes_list) for routes_list in routes.values())} routes, {len(admin_routes)} admin routes")
    
    # Analyze admin route implementations
    admin_details = analyze_admin_route_implementations(admin_routes)
    print(f"Analyzed {len(admin_details)} admin route implementations")
    
    # Find frontend API calls
    frontend_calls = find_frontend_api_calls()
    print(f"Found {len(frontend_calls)} frontend API calls")
    
    # Match frontend calls to backend routes
    matches = match_frontend_to_backend(frontend_calls, routes)
    
    # Generate and print report
    report = generate_report(blueprints, routes, admin_routes, admin_details, frontend_calls, matches)
    print_report(report)

if __name__ == "__main__":
    main() 