#!/bin/bash

# Display header
echo "====================================="
echo "   iMagenWiz Services Restart Script"
echo "====================================="

# Kill any running services
echo "Stopping all running services..."
pkill -f "node frontend/node_modules/.bin/vite"
pkill -f "node blog-api-proxy-with-db.cjs"
pkill -f "node unified-server.cjs"
pkill -f "python run.py"
echo "All services stopped."

# Make sure we have environment files
echo "Creating/updating environment files..."
sed -i '' 's/BACKEND_PORT=5000/BACKEND_PORT=5001/g' create-env-files.sh
./create-env-files.sh

# Display environment variables
echo -e "\nEnvironment configuration:"
echo "- Backend port: $(grep BACKEND_PORT .env | cut -d= -f2)"
echo "- Frontend port: $(grep FRONTEND_PORT .env | cut -d= -f2)"
echo "- Blog API port: $(grep BLOG_PROXY_PORT .env | cut -d= -f2)"
echo "- Auth API port: $(grep AUTH_PROXY_PORT .env | cut -d= -f2)"

# Wait for processes to fully terminate
sleep 2

# Start backend in a virtual environment
echo -e "\nStarting backend on port $(grep BACKEND_PORT .env | cut -d= -f2)..."
cd backend
source venv/bin/activate
python run.py &
cd ..
sleep 2

# Start blog proxy service
echo -e "\nStarting blog proxy service on port $(grep BLOG_PROXY_PORT .env | cut -d= -f2)..."
node blog-api-proxy-with-db.cjs &
sleep 2

# Start frontend
echo -e "\nStarting frontend service on port $(grep FRONTEND_PORT .env | cut -d= -f2)..."
cd frontend
npm run dev &
cd ..

echo "====================================="
echo "All services started!"
echo "- Backend API: http://localhost:$(grep BACKEND_PORT .env | cut -d= -f2)"
echo "- Blog API:    http://localhost:$(grep BLOG_PROXY_PORT .env | cut -d= -f2)"
echo "- Frontend:    http://localhost:$(grep FRONTEND_PORT .env | cut -d= -f2)"
echo "====================================="
echo "Use 'pkill -f \"node\\|python\"' to stop all services"
echo "=====================================" 