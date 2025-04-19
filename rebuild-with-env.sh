#!/bin/bash

echo "Rebuilding the frontend with environment variables..."

# Create a temporary .env.local file in the root directory
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_for_development" > .env.local

# Run the build command
npm run build

# Remove the temporary file
rm .env.local

echo "Build completed!"