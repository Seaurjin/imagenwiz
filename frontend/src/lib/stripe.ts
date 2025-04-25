import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
let stripePromise = null;

// Default price IDs - these will be the same regardless of Stripe connection
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

try {
  // Get stripe key from environment
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Only attempt to load Stripe if we have a key
  if (stripeKey) {
    console.log('Initializing Stripe with public key');
    stripePromise = loadStripe(stripeKey);
  } else {
    console.warn('Stripe key missing: VITE_STRIPE_PUBLISHABLE_KEY. Payment features will be disabled.');
  }
} catch (error) {
  console.warn('Failed to initialize Stripe:', error);
}

// Export the Stripe promise so it can be used elsewhere
export default stripePromise;
