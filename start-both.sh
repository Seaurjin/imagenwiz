#!/bin/bash

# Colors for console output
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting iMagenWiz Full Stack Application...${NC}"

# Function to check if a port is in use
function is_port_in_use() {
  if (echo > /dev/tcp/localhost/$1) >/dev/null 2>&1; then
    return 0
  else
    return 1
  fi
}

# Function to check Flask health
function check_flask_health() {
  curl -s http://localhost:5000/api/health-check >/dev/null
  return $?
}

# Start Flask backend in the background
echo -e "${PURPLE}Starting Flask backend server...${NC}"
cd backend && python run.py &
FLASK_PID=$!

# Wait for Flask to start
echo -e "${YELLOW}Waiting for Flask backend to start (up to 30 seconds)...${NC}"
MAX_ATTEMPTS=15
ATTEMPT=0
FLASK_STARTED=false

# Wait for Flask to be ready
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT+1))
  echo -e "${YELLOW}Checking Flask health (attempt $ATTEMPT/$MAX_ATTEMPTS)...${NC}"
  
  if check_flask_health; then
    FLASK_STARTED=true
    echo -e "${GREEN}Flask backend is running and responding to health checks!${NC}"
    break
  fi
  
  sleep 2
done

if [ "$FLASK_STARTED" = false ]; then
  echo -e "${RED}Flask backend failed to start or is not responding.${NC}"
  echo -e "${RED}Starting Express server in fallback mode...${NC}"
fi

# Start Express server in the foreground
echo -e "${CYAN}Starting Express server...${NC}"
cd .. && npx tsx server/index.ts

# When Express exits, kill the Flask process if it's still running
if kill -0 $FLASK_PID 2>/dev/null; then
  echo -e "${YELLOW}Shutting down Flask backend...${NC}"
  kill $FLASK_PID
fi

echo -e "${GREEN}Shutdown complete.${NC}"