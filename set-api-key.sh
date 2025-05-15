#!/bin/bash
# Script to set the DeepSeek API key and restart services

# Set the API key
export DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24

# Make the script executable
chmod +x "$0"

echo "DeepSeek API key set to environment: $DEEPSEEK_API_KEY"

# If backend directory exists, set the key there too
if [ -f "backend/.env" ]; then
  # Check if the file already contains the key
  if grep -q "DEEPSEEK_API_KEY" backend/.env; then
    # Update existing key
    sed -i '' 's/DEEPSEEK_API_KEY=.*/DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24/' backend/.env
  else
    # Add new key
    echo "DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24" >> backend/.env
  fi
  echo "Updated backend/.env file"
fi

# Also add to frontend .env if it exists
if [ -f "frontend/.env" ]; then
  # Check if the file already contains the key
  if grep -q "DEEPSEEK_API_KEY" frontend/.env; then
    # Update existing key
    sed -i '' 's/DEEPSEEK_API_KEY=.*/DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24/' frontend/.env
  else
    # Add new key
    echo "DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24" >> frontend/.env
  fi
  echo "Updated frontend/.env file"
fi

# Also add to root .env if it exists
if [ -f ".env" ]; then
  # Check if the file already contains the key
  if grep -q "DEEPSEEK_API_KEY" .env; then
    # Update existing key
    sed -i '' 's/DEEPSEEK_API_KEY=.*/DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24/' .env
  else
    # Add new key
    echo "DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24" >> .env
  fi
  echo "Updated root .env file"
fi

echo "DeepSeek API key has been set in all environment files"
echo "Please restart the backend and frontend to apply the changes" 