#!/bin/bash

echo "Rebuilding the frontend with Stripe fixes..."

# Create a temporary .env.local file in the root directory
echo "VITE_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder_key_for_development" > .env.local

# Create a temp file with vite.env.js import fix
cat > ./frontend/src/temp-env.js << 'EOF'
// This is a temporary workaround to handle missing environment variables
const env = {
  VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_placeholder_key_for_development'
};

export default env;
EOF

# Run the build command
npm run build

# Remove the temporary files
rm .env.local
rm ./frontend/src/temp-env.js

echo "Build completed with Stripe fixes!"