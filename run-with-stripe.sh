#!/bin/bash

# Script to run the Express server with Stripe integration
# This will demonstrate that the Stripe integration works correctly

echo "Starting Express server with Stripe integration..."
echo "STRIPE_SECRET_KEY is $(if [ -n \"$STRIPE_SECRET_KEY\" ]; then echo 'available'; else echo 'missing'; fi)"
echo "VITE_STRIPE_PUBLIC_KEY is $(if [ -n \"$VITE_STRIPE_PUBLIC_KEY\" ]; then echo 'available'; else echo 'missing'; fi)"

# Run the server with environment variables set
STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" VITE_STRIPE_PUBLIC_KEY="$VITE_STRIPE_PUBLIC_KEY" node start-with-stripe.js