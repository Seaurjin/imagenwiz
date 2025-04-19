#!/bin/bash

# Get the Stripe publishable key from environment
STRIPE_KEY=$(printenv STRIPE_PUBLISHABLE_KEY)

echo "Rebuilding the frontend with Stripe key..."

# Create a temporary .env.local file in the frontend directory
echo "VITE_STRIPE_PUBLISHABLE_KEY=$STRIPE_KEY" > .env.local
echo "Created .env.local with Stripe key: $STRIPE_KEY"

# Modify the stripe.ts file to handle missing key more gracefully
cat > ./frontend/src/lib/stripe-safe.ts << EOF
import { loadStripe } from '@stripe/stripe-js';

// Safe fallback key in case environment fails
const FALLBACK_KEY = "$STRIPE_KEY";

// Default price IDs
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

let stripePromise = null;

try {
  // First try to use environment variable
  const envKey = typeof import.meta !== 'undefined' && 
                import.meta.env && 
                import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Use env key or fallback
  const stripeKey = envKey || FALLBACK_KEY;
  
  if (stripeKey) {
    stripePromise = loadStripe(stripeKey);
    console.log('Stripe initialized with key');
  } else {
    console.warn('No Stripe key available, payment features will be disabled');
  }
} catch (error) {
  console.warn('Failed to initialize Stripe:', error);
  
  // Last resort - try with fallback key
  try {
    if (FALLBACK_KEY) {
      stripePromise = loadStripe(FALLBACK_KEY);
      console.log('Stripe initialized with fallback key');
    }
  } catch (e) {
    console.error('All Stripe initialization attempts failed');
  }
}

export default stripePromise;
EOF

# Replace the original stripe.ts file
mv ./frontend/src/lib/stripe-safe.ts ./frontend/src/lib/stripe.ts
echo "Updated stripe.ts with more resilient implementation"

# Run the build command
npm run build

# Remove the temporary file
rm .env.local

echo "Build completed with Stripe fixes!"