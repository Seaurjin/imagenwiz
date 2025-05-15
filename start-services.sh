#!/bin/bash

# iMagenWiz Services Startup Script
echo "Starting iMagenWiz services..."

# Kill any existing services that might be running
echo "Aggressively stopping any existing services (just in case)..."

PORTS_TO_CLEAR=(3000 3002 3003 4002 5000 5001)

# Specific kill for Vite to ensure it dies before we check its port
echo "Attempting to kill any running Vite processes by pattern..."
pkill -f "vite" 2>/dev/null && echo "Killed Vite instances by name pattern."
sleep 1 # Give Vite a moment to die

for port_to_clear in "${PORTS_TO_CLEAR[@]}"; do
  echo "Ensuring port $port_to_clear is free..."
  for i in {1..5}; do # Try up to 5 times
    PIDS=$(lsof -ti :$port_to_clear -sTCP:LISTEN)
    if [ -n "$PIDS" ]; then
      echo "Port $port_to_clear is in use by PIDs: $PIDS. Attempting to kill (attempt $i)..."
      echo "$PIDS" | tr '\n' ' ' | xargs kill -9 2>/dev/null
      sleep 0.5 # Wait a bit for processes to terminate
    else
      echo "Port $port_to_clear is free."
      break # Port is free, exit loop
    fi
    if [ "$i" -eq 5 ]; then
      echo "ERROR: Failed to free port $port_to_clear after 5 attempts. Please check manually."
      # Optionally exit here: exit 1
    fi
  done
done

# Broader pkill for other common service names/patterns
pkill -f "node auth-proxy.cjs" 2>/dev/null && echo "Killed old auth-proxy by name."
pkill -f "node fix-api-server.cjs" 2>/dev/null && echo "Killed old fix-api-server by name."
pkill -f "python run.py" 2>/dev/null && echo "Killed old python run.py by name (Flask dev server)."
pkill -f "gunicorn" 2>/dev/null && echo "Killed old gunicorn processes by name."
pkill -f "node blog-api-proxy-with-db.cjs" 2>/dev/null && echo "Killed old blog-api-proxy by name."
sleep 2 # Added sleep to give OS time to release ports fully

# Ensure .env files are up-to-date (this creates/updates .env with JWT_SECRET_KEY)
echo "Ensuring environment files are up-to-date..."
./create-env-files.sh

# Read JWT_SECRET_KEY from the .env file to pass to Gunicorn
JWT_SECRET_KEY_VALUE=$(grep JWT_SECRET_KEY .env | cut -d= -f2)

# Start Python API server with Gunicorn
BACKEND_PORT_VALUE=$(grep BACKEND_PORT .env | cut -d= -f2)
echo "Starting Python API server with Gunicorn on port $BACKEND_PORT_VALUE (Debug Mode for Gunicorn logs)..."
cd backend
source venv/bin/activate

# Pass JWT_SECRET_KEY directly as an environment variable to the Gunicorn process
JWT_SECRET_KEY="$JWT_SECRET_KEY_VALUE" FLASK_APP="app:create_app()" FLASK_DEBUG=1 gunicorn \
    --workers 1 \
    --bind "0.0.0.0:$BACKEND_PORT_VALUE" \
    "app:create_app()" \
    --preload \
    --log-level debug \
    --access-logfile ../api_access.log \
    --error-logfile ../api_error.log \
    --timeout 120 \
    &
API_PID=$!
cd ..
echo "Python API server (Gunicorn) commanded to start with PID: $API_PID (Target: http://localhost:$BACKEND_PORT_VALUE)"

# Start blog proxy service on port 4002 (handles /api/cms)
BLOG_PROXY_PORT_VALUE=$(grep BLOG_PROXY_PORT .env | cut -d= -f2)
echo "Starting blog proxy service on port $BLOG_PROXY_PORT_VALUE..."
BLOG_PROXY_PORT=$BLOG_PROXY_PORT_VALUE node blog-api-proxy-with-db.cjs > blog-proxy.log 2>&1 &
BLOG_PID=$!
echo "Blog proxy started with PID: $BLOG_PID (Target: http://localhost:$BLOG_PROXY_PORT_VALUE, Proxies to Python API on $BACKEND_PORT_VALUE)"

# Start frontend on port 3000
FRONTEND_PORT_VALUE=$(grep FRONTEND_PORT .env | cut -d= -f2 | head -n 1)
echo "Starting frontend on port $FRONTEND_PORT_VALUE..."
if lsof -ti :$FRONTEND_PORT_VALUE -sTCP:LISTEN >/dev/null ; then
    echo "ERROR: Port $FRONTEND_PORT_VALUE is still in use before starting Vite. Aborting Vite start."
else
    echo "Port $FRONTEND_PORT_VALUE confirmed free. Starting Vite..."
    cd frontend && VITE_PORT=$FRONTEND_PORT_VALUE npm run dev -- --port $FRONTEND_PORT_VALUE --strictPort > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started with PID: $FRONTEND_PID (Target: http://localhost:$FRONTEND_PORT_VALUE)"
    cd ..
fi

echo ""
echo "All services have been commanded to start."
echo "Check individual logs for confirmation and status."
echo ""
echo "Services configured for targets:"
echo "- API Server (Python/Gunicorn, incl. Auth): http://localhost:$BACKEND_PORT_VALUE"
echo "- Blog Proxy (Node, for CMS):              http://localhost:$BLOG_PROXY_PORT_VALUE"
echo "- Frontend (Vite):                         http://localhost:$FRONTEND_PORT_VALUE"
echo ""
echo "To check service logs:"
echo "- API Server: tail -f api_error.log (Gunicorn errors), api_access.log (Gunicorn access), ai_content_module.log (AI logic)"
echo "- Blog Proxy: tail -f blog-proxy.log"
echo "- Frontend:   tail -f frontend.log"
echo ""
echo "To stop all services, run ./stop-services.sh" 