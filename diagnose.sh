#!/bin/bash

echo "=== iMagenWiz Diagnostic Tool ==="
echo "Checking system configuration and dependencies..."
echo

# Check for Python and version
echo "=== Python Configuration ==="
which python3 || which python
python3 --version || python --version
echo

# Check for Node.js
echo "=== Node.js Configuration ==="
which node
node --version
echo

# Check for npm
echo "=== npm Configuration ==="
which npm
npm --version
echo

# Check backend dependencies
echo "=== Backend Dependencies ==="
echo "Checking Flask and required packages..."
if [ -d "./backend" ]; then
  if [ -f "./backend/requirements.txt" ]; then
    echo "Found backend/requirements.txt"
    echo "Required packages:"
    cat ./backend/requirements.txt
    
    echo
    echo "Checking installed packages:"
    python3 -m pip list | grep -E "flask|sqlalchemy|jwt"
  else
    echo "ERROR: requirements.txt not found in backend directory"
  fi
else
  echo "ERROR: Backend directory not found"
fi
echo

# Check frontend dependencies
echo "=== Frontend Dependencies ==="
if [ -d "./frontend" ]; then
  if [ -f "./frontend/package.json" ]; then
    echo "Found frontend/package.json"
    echo "Main dependencies:"
    grep -A 20 '"dependencies":' ./frontend/package.json
  else
    echo "ERROR: package.json not found in frontend directory"
  fi
else
  echo "ERROR: Frontend directory not found"
fi
echo

# Check port availability
echo "=== Port Availability ==="
check_port() {
  local port=$1
  local service=$2
  nc -z localhost $port 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "WARNING: Port $port ($service) is already in use"
    lsof -i :$port
  else
    echo "Port $port ($service) is available"
  fi
}

check_port 5000 "Backend"
check_port 3000 "Potential Frontend"
check_port 3001 "Potential Frontend"
check_port 3002 "Blog Proxy"
check_port 3003 "Auth Proxy"
echo

# Check running processes
echo "=== Running Processes ==="
echo "Checking for running iMagenWiz processes..."
ps aux | grep -E "node.*vite|node.*proxy|python.*run.py" | grep -v grep
echo

# Check network configuration
echo "=== Network Configuration ==="
echo "Checking for CORS issues in proxy configurations..."

if [ -f "./blog-api-proxy-with-db.cjs" ]; then
  echo "Found blog-api-proxy-with-db.cjs"
  grep -E "Access-Control-Allow-Origin|changeOrigin" ./blog-api-proxy-with-db.cjs
else
  echo "WARNING: blog-api-proxy-with-db.cjs not found"
fi

if [ -f "./auth-proxy-fixed.cjs" ]; then
  echo "Found auth-proxy-fixed.cjs"
  grep -E "Access-Control-Allow-Origin|changeOrigin" ./auth-proxy-fixed.cjs
else
  echo "WARNING: auth-proxy-fixed.cjs not found"
fi

echo
echo "=== Diagnostic complete ==="
echo "If you're still having issues, try running ./start-services.sh" 