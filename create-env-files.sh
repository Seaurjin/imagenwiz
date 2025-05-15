#!/bin/bash

# Create .env in project root
cat > .env <<EOL
# Backend
BACKEND_PORT=5001
DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24
OPENAI_API_KEY=
JWT_SECRET_KEY=bcd3473d44ba4fa83c56c286575ac45805377cce8b9f88678345a7b459c2306b
STRIPE_SECRET_KEY=sk_test_51Q38qCAGgrMJnivhY2kRf3qYDlzfCQACMXg2A431cKit7KRgqtDxiC5jYJPrbe4aFbkaVzamc33QY8woZmKBINVP008lLQooRN
STRIPE_WEBHOOK_SECRET=

# Main API Proxy Target (Python Backend)
# PROXY_PORT is no longer used by a separate proxy server, but PROXY_TARGET might be used by blog proxy if not overridden by FLASK_BACKEND_URL
PROXY_TARGET=http://localhost:5001 

# Frontend (for reference)
FRONTEND_PORT=3000

# Blog Proxy
BLOG_PROXY_PORT=4002

# Unified Server (if still used, ensure port is distinct or service removed)
# UNIFIED_SERVER_PORT=3002 
EOL

echo ".env created in project root."

# Create .env in frontend directory
cat > frontend/.env <<EOL
# Frontend Port
VITE_PORT=3000

# API Proxies
# VITE_AUTH_PROXY no longer needed, /api/auth goes to VITE_API_PROXY
VITE_BLOG_PROXY=http://localhost:4002
VITE_API_PROXY=http://localhost:5001 # For all /api including /api/auth

# Image Processing API
VITE_IMAGE_PROCESSING_API=/api/process-image-api

# Stripe Configuration (Add your Stripe keys here)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz
EOL

echo ".env created in frontend directory." 