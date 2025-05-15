#!/bin/bash
# Script to set API keys prioritizing DeepSeek over OpenAI

# Set the API keys - update this value with your actual API key
DEEPSEEK_API_KEY=sk-4a95019a3b53450d8b69598cd8741d24
OPENAI_API_KEY=""  # Leave empty to use DeepSeek as primary

# Make the script executable
chmod +x "$0"

echo "Setting up API keys (DeepSeek prioritized over OpenAI)..."

# Create or update backend/.env file
if [ ! -f "backend/.env" ]; then
  echo "Creating new backend/.env file"
  cat > backend/.env << EOF
# Database Configuration
DB_HOST=8.130.113.102
DB_PORT=3306
DB_NAME=mat_db
DB_USER=root
DB_PASSWORD=Ir%86241992

# AI API keys
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}

# Flask settings
FLASK_ENV=development
FLASK_DEBUG=1

# Other settings
JWT_SECRET_KEY=e8f9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8
EOF
else
  echo "Updating existing backend/.env file"
  if grep -q "DEEPSEEK_API_KEY" backend/.env; then
    # Using sed with different syntax for macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|DEEPSEEK_API_KEY=.*|DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" backend/.env
    else
      # Linux
      sed -i "s|DEEPSEEK_API_KEY=.*|DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" backend/.env
    fi
  else
    echo "DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}" >> backend/.env
  fi
fi

# Create or update root .env file
if [ ! -f ".env" ]; then
  echo "Creating new root .env file"
  cat > .env << EOF
# Database Configuration
DB_HOST=8.130.113.102
DB_PORT=3306
DB_NAME=mat_db
DB_USER=root
DB_PASSWORD=Ir%86241992

# AI API keys
DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
OPENAI_API_KEY=${OPENAI_API_KEY}

# Flask settings
FLASK_ENV=development
FLASK_DEBUG=1

# Other settings
JWT_SECRET_KEY=e8f9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8
EOF
else
  echo "Updating existing root .env file"
  if grep -q "DEEPSEEK_API_KEY" .env; then
    # Using sed with different syntax for macOS and Linux
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|DEEPSEEK_API_KEY=.*|DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" .env
    else
      # Linux
      sed -i "s|DEEPSEEK_API_KEY=.*|DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" .env
    fi
  else
    echo "DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}" >> .env
  fi
fi

# Create or update frontend/.env file if the directory exists
if [ -d "frontend" ]; then
  if [ ! -f "frontend/.env" ]; then
    echo "Creating new frontend/.env file"
    cat > frontend/.env << EOF
# AI API keys
VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
VITE_OPENAI_API_KEY=${OPENAI_API_KEY}
EOF
  else
    echo "Updating existing frontend/.env file"
    if grep -q "VITE_DEEPSEEK_API_KEY" frontend/.env; then
      # Using sed with different syntax for macOS and Linux
      if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|VITE_DEEPSEEK_API_KEY=.*|VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" frontend/.env
      else
        # Linux
        sed -i "s|VITE_DEEPSEEK_API_KEY=.*|VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}|" frontend/.env
      fi
    else
      echo "VITE_DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}" >> frontend/.env
    fi
  fi
fi

# Set current environment variables
export DEEPSEEK_API_KEY=${DEEPSEEK_API_KEY}
export OPENAI_API_KEY=${OPENAI_API_KEY}

echo "API keys have been set up successfully, prioritizing DeepSeek over OpenAI."
echo "Please restart the backend and frontend to apply the changes." 