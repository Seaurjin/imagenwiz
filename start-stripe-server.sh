#!/bin/bash

# Script to start the Express server with Stripe integration
# This will start the server on port 3000

echo "Starting Express server with Stripe integration..."
NODE_ENV=production FRONTEND_PATH="./frontend/dist" node start-express-with-stripe.js