#!/usr/bin/env python3
"""
Find admin routes in the backend code
"""

import os
import re

def check_file_for_admin_routes(filepath):
    """Check a file for routes that require admin access"""
    print(f"Examining {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # First check if this file even has the admin check function
            if 'check_admin_access' not in content and 'admin_required' not in content:
                print(f"  No admin check found in {filepath}")
                return []
            
            # Find all route definitions
            routes = []
            route_pattern = r'@bp\.route\([\'"]([^\'"]+)[\'"](?:,\s*methods=(\[[^\]]+\]))?\)'
            
            for match in re.finditer(route_pattern, content, re.DOTALL):
                route_path = match.group(1)
                methods = match.group(2) or "['GET']"
                
                # Get function name associated with this route
                route_pos = match.end()
                func_match = re.search(r'\ndef\s+(\w+)\(', content[route_pos:route_pos+200])
                
                if func_match:
                    func_name = func_match.group(1)
                    print(f"  Found route: {methods} {route_path} -> {func_name}")
                    
                    # Find the function implementation
                    func_start = content.find(f"def {func_name}", route_pos)
                    if func_start >= 0:
                        # Find end of function (next def or end of file)
                        func_end = content.find("\ndef ", func_start + 4)
                        if func_end < 0:
                            func_end = len(content)
                        
                        func_code = content[func_start:func_end]
                        
                        # Check if it's an admin route
                        has_admin_check = 'check_admin_access()' in func_code
                        has_admin_var = 'user = check_admin_access()' in func_code
                        has_admin_check_if = 'if not user:' in func_code and has_admin_var
                        has_admin_decorator = '@admin_required' in content[max(0, func_start-100):func_start]
                        
                        is_admin = has_admin_check or has_admin_check_if or has_admin_decorator
                        
                        if is_admin:
                            print(f"    ✅ Admin route: {methods} {route_path}")
                            
                            jwt_required = '@jwt_required()' in content[max(0, func_start-100):func_start]
                            
                            routes.append({
                                'path': route_path,
                                'methods': eval(methods),
                                'function': func_name,
                                'requires_jwt': jwt_required,
                                'file': filepath
                            })
            
            return routes
                    
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return []

def main():
    """Main function"""
    all_routes = []
    
    # Check CMS routes
    cms_routes_path = "backend/app/cms/routes.py"
    if os.path.exists(cms_routes_path):
        blueprint_prefix = "/api/cms"
        routes = check_file_for_admin_routes(cms_routes_path)
        for route in routes:
            route['path'] = f"{blueprint_prefix}{route['path']}"
        all_routes.extend(routes)
    
    # Check Settings routes
    settings_routes_path = "backend/app/settings/routes.py"
    if os.path.exists(settings_routes_path):
        blueprint_prefix = "/api/settings"
        routes = check_file_for_admin_routes(settings_routes_path)
        for route in routes:
            route['path'] = f"{blueprint_prefix}{route['path']}"
        all_routes.extend(routes)
    
    # Check Auth routes
    auth_routes_path = "backend/app/auth/routes.py"
    if os.path.exists(auth_routes_path):
        blueprint_prefix = "/api/auth"
        routes = check_file_for_admin_routes(auth_routes_path)
        for route in routes:
            route['path'] = f"{blueprint_prefix}{route['path']}"
        all_routes.extend(routes)
    
    # Print summary
    print("\n=== ADMIN ROUTES ===")
    for route in all_routes:
        print(f"{', '.join(route['methods'])} {route['path']} -> {route['function']}")
    
    print(f"\nTotal admin routes found: {len(all_routes)}")

if __name__ == "__main__":
    main() 