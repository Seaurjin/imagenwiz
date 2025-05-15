#!/bin/bash

echo "🚀 Setting up local MySQL database for iMagenWiz"
echo "==============================================="

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    echo "Mac: brew install mysql"
    echo "Linux: sudo apt-get install mysql-server"
    echo "Windows: Download MySQL installer from https://dev.mysql.com/downloads/installer/"
    exit 1
fi

# Check if MySQL server is running
if ! mysqladmin ping -h localhost --silent; then
    echo "⚠️ MySQL server does not appear to be running."
    echo "Starting MySQL service..."
    
    # Try to start MySQL based on OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew services start mysql || mysql.server start
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        sudo systemctl start mysql || sudo service mysql start
    else
        echo "❌ Unable to automatically start MySQL. Please start it manually."
        exit 1
    fi
    
    # Check again if MySQL is running
    if ! mysqladmin ping -h localhost --silent; then
        echo "❌ Failed to start MySQL service. Please start it manually."
        exit 1
    fi
    
    echo "✅ MySQL service started successfully."
fi

echo "✅ MySQL server is running."

# Get the root password
read -sp "Enter your MySQL root password (leave blank if none): " ROOT_PASSWORD
echo ""

# Create mat_db database
echo "Creating database 'mat_db'..."

if [ -z "$ROOT_PASSWORD" ]; then
    # No password
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS mat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
else
    # With password
    mysql -u root -p"$ROOT_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS mat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
fi

if [ $? -eq 0 ]; then
    echo "✅ Database 'mat_db' created successfully."
else
    echo "❌ Failed to create database. Please check your MySQL root password."
    exit 1
fi

# Set up environment variables
echo "Setting up environment variables..."

# Check if .env file exists
if [ -f ".env" ]; then
    # Update the existing .env file
    if grep -q "DB_HOST" .env; then
        sed -i.bak "s|DB_HOST=.*|DB_HOST=localhost|g" .env
    else
        echo "DB_HOST=localhost" >> .env
    fi
    
    if grep -q "DB_USER" .env; then
        sed -i.bak "s|DB_USER=.*|DB_USER=root|g" .env
    else
        echo "DB_USER=root" >> .env
    fi
    
    if grep -q "DB_PASSWORD" .env; then
        sed -i.bak "s|DB_PASSWORD=.*|DB_PASSWORD=$ROOT_PASSWORD|g" .env
    else
        echo "DB_PASSWORD=$ROOT_PASSWORD" >> .env
    fi
    
    if grep -q "DB_NAME" .env; then
        sed -i.bak "s|DB_NAME=.*|DB_NAME=mat_db|g" .env
    else
        echo "DB_NAME=mat_db" >> .env
    fi
    
    if grep -q "DB_PORT" .env; then
        sed -i.bak "s|DB_PORT=.*|DB_PORT=3306|g" .env
    else
        echo "DB_PORT=3306" >> .env
    fi
    
    rm -f .env.bak 2>/dev/null
else
    # Create a new .env file
    cat > .env << EOL
# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$ROOT_PASSWORD
DB_NAME=mat_db
DB_PORT=3306

# JWT Secret
JWT_SECRET_KEY=e8f9a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8

# Stripe keys (test keys)
STRIPE_SECRET_KEY=sk_test_51Q38qCAGgrMJnivhY2kRf3qYDlzfCQACMXg2A431cKit7KRgqtDxiC5jYJPrbe4aFbkaVzamc33QY8woZmKBINVP008lLQooRN
STRIPE_PUBLISHABLE_KEY=pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz

# Application settings
FLASK_AVAILABLE=true
FLASK_PORT=5000
NODE_ENV=development
PORT=3000
EOL
fi

echo "✅ Environment variables set up in .env file."

echo ""
echo "🎉 MySQL setup complete!"
echo "You can now run the iMagenWiz application with:"
echo "  cd backend && python run.py"
echo "=================================================" 