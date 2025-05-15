#!/bin/bash

echo "=== Backend Setup and Dependency Installer ==="
echo "This script ensures all backend dependencies are properly installed"

# Get the absolute path
BACKEND_DIR="$(cd "$(dirname "$0")/backend" && pwd)"
if [ ! -d "$BACKEND_DIR" ]; then
  echo "ERROR: Backend directory not found at $BACKEND_DIR"
  exit 1
fi

cd "$BACKEND_DIR" || exit 1
echo "Changed to directory: $BACKEND_DIR"

# Check Python version
PYTHON_CMD="python3"
echo "Using Python: $($PYTHON_CMD --version)"

# Ensure pip is installed and up to date
$PYTHON_CMD -m pip install --upgrade pip

# Uninstall problem packages first to ensure clean reinstall
echo "Removing any problematic package installations..."
$PYTHON_CMD -m pip uninstall -y flask_sqlalchemy flask_jwt_extended flask-cors flask-bcrypt
$PYTHON_CMD -m pip uninstall -y Flask-SQLAlchemy Flask-JWT-Extended Flask-Cors Flask-Bcrypt

# Install core dependencies with --force-reinstall to ensure correct versions
echo "Installing core dependencies directly..."
$PYTHON_CMD -m pip install --force-reinstall flask==2.2.3 Werkzeug==2.2.3
$PYTHON_CMD -m pip install --force-reinstall flask-cors==3.0.10
$PYTHON_CMD -m pip install --force-reinstall flask-sqlalchemy==3.0.3
$PYTHON_CMD -m pip install --force-reinstall flask-jwt-extended==4.4.4
$PYTHON_CMD -m pip install --force-reinstall flask-bcrypt==1.0.1
$PYTHON_CMD -m pip install --force-reinstall pymysql==1.0.3 python-dotenv==1.0.0 pillow==9.5.0 stripe==5.4.0

# Check if requirements.txt exists and install from it
if [ -f "requirements.txt" ]; then
  echo "Installing from requirements.txt..."
  $PYTHON_CMD -m pip install -r requirements.txt
else
  echo "WARNING: requirements.txt not found"
fi

# Verify key packages
echo "Verifying key packages installation:"
$PYTHON_CMD -c "import flask; print(f'Flask version: {flask.__version__}')" || echo "ERROR: Flask not installed properly"
$PYTHON_CMD -c "import flask_sqlalchemy; print('flask_sqlalchemy installed')" || echo "ERROR: flask_sqlalchemy not installed properly"
$PYTHON_CMD -c "import flask_jwt_extended; print('flask_jwt_extended installed')" || echo "ERROR: flask_jwt_extended not installed properly"

echo "Backend setup complete" 