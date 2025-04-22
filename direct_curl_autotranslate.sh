#!/bin/bash
# Script to trigger auto-translation of all blog posts using curl

# Get admin login token
echo "Logging in as admin..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

# Extract token
TOKEN=$(echo $LOGIN_RESULT | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get admin token. Trying alternative password..."
  LOGIN_RESULT=$(curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"password123"}')
  
  TOKEN=$(echo $LOGIN_RESULT | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
  
  if [ -z "$TOKEN" ]; then
    echo "Failed to get admin token. Cannot proceed."
    exit 1
  fi
fi

echo "Successfully logged in and got token."

# Trigger auto-translation
echo "Triggering auto-translation of all blog posts..."
RESULT=$(curl -s -X POST http://localhost:5000/api/cms/posts/auto-translate-all \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"placeholder_mode": true, "batch_size": 100, "force_translate": true}')

echo "API response:"
echo $RESULT | python -m json.tool

echo "Auto-translation process completed!"