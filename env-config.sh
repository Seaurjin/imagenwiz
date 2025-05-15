#!/bin/bash
# iMagenWiz Environment Configuration

# Export all variables
export_env() {
  # API Keys - Set to actual values you use
  export DEEPSEEK_API_KEY="sk-at-480..."  # Replace with your full key value
  export OPENAI_API_KEY="your-openai-api-key"
  export API_PRIORITY="deepseek"

  # Port Configuration
  export BACKEND_PORT=5000
  export BLOG_PROXY_PORT=3002
  export AUTH_PROXY_PORT=3003
  export FRONTEND_PORT=3001

  # Database Configuration
  export DB_HOST=8.130.113.102
  export DB_USER=root
  export DB_PASSWORD="Ir%86241992"
  export DB_NAME=mat_db

  # Flask Configuration
  export FLASK_APP=run.py
  export FLASK_ENV=development

  # API URLs for services
  export FLASK_BACKEND_URL="http://localhost:$BACKEND_PORT"
  export VITE_API_URL="http://localhost:$BACKEND_PORT"
  
  echo "Environment variables set"
}

# Execute the function
export_env 