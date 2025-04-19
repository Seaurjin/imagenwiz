import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Log warning instead of throwing an error
if (!stripeKey) {
  console.warn('Stripe key missing: VITE_STRIPE_PUBLISHABLE_KEY. Payment features will be disabled.');
}

export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

// Only attempt to load Stripe if we have a key
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default stripePromise;