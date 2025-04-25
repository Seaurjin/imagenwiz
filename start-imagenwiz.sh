#!/bin/bash
# iMagenWiz Startup Script
# This script starts the full application stack with optimized settings for Replit

# Define colors for prettier output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║       ${GREEN}iMagenWiz${BLUE} Application Startup Script       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"

# Get Replit domain
REPLIT_DOMAIN=$(echo $REPL_SLUG.$REPL_OWNER.repl.co)
echo -e "${GREEN}Replit domain: ${YELLOW}$REPLIT_DOMAIN${NC}"

# Create a logs directory if it doesn't exist
mkdir -p logs

# Start the minimal placeholder server on port 5000 to satisfy Replit
# This will then automatically start the main application
echo -e "${GREEN}Starting application...${NC}"
echo -e "${YELLOW}This may take a moment. Please be patient.${NC}"

# Check if port 5000 is already in use
if nc -z localhost 5000 >/dev/null 2>&1; then
  echo -e "${YELLOW}Port 5000 is already in use. Starting without placeholder server.${NC}"
else
  # Start placeholder server in the background
  echo -e "${GREEN}Starting placeholder server on port 5000...${NC}"
  node ultraminimal.js > logs/placeholder-server.log 2>&1 &
  PLACEHOLDER_PID=$!
  echo -e "${GREEN}Placeholder server started with PID $PLACEHOLDER_PID${NC}"
fi

# Set environment variables for the application
export REPLIT_DOMAIN=$REPLIT_DOMAIN
export EXPRESS_PORT=3000
export FLASK_PORT=5001
export FLASK_URL=https://$REPLIT_DOMAIN
export FLASK_ENV=development
export FLASK_DEBUG=1
export DB_USER=root
export DB_PASSWORD="Ir%86241992"
export DB_HOST=8.130.113.102
export DB_NAME=mat_db
export DB_PORT=3306
export SKIP_MIGRATIONS=true

# Start Flask backend in the background
echo -e "${GREEN}Starting Flask backend...${NC}"
python backend/run.py > logs/flask-backend.log 2>&1 &
FLASK_PID=$!
echo -e "${GREEN}Flask backend started with PID $FLASK_PID${NC}"

# Give Flask a moment to initialize before starting Express
sleep 3

# Start Express frontend
echo -e "${GREEN}Starting Express frontend...${NC}"
npm run dev

# If we reach here, the Express process has terminated
echo -e "${YELLOW}Express frontend terminated. Stopping other processes...${NC}"

# Kill background processes if they exist
if [ -n "$FLASK_PID" ] && ps -p $FLASK_PID > /dev/null; then
  echo -e "${YELLOW}Stopping Flask backend (PID $FLASK_PID)...${NC}"
  kill $FLASK_PID
fi

if [ -n "$PLACEHOLDER_PID" ] && ps -p $PLACEHOLDER_PID > /dev/null; then
  echo -e "${YELLOW}Stopping placeholder server (PID $PLACEHOLDER_PID)...${NC}"
  kill $PLACEHOLDER_PID
fi

echo -e "${GREEN}All processes stopped. Exiting...${NC}"
exit 0