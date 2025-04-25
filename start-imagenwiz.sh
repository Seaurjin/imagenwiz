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
  echo -e "${RED}Port 5000 is already in use. Please stop any other services using this port.${NC}"
  exit 1
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

# Launch the application
node minimal-5000.js

# Exit with the status of the last command
exit $?