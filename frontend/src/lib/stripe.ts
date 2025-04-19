import { loadStripe } from '@stripe/stripe-js';

// Use hardcoded key if environment variable fails
const STRIPE_PUBLISHABLE_KEY = "pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz";

// Default price IDs
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

// Initialize stripe outside of any conditional to avoid blank screen errors
let stripePromise = null;

try {
  console.log('Initializing Stripe with key');
  stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
} catch (error) {
  console.warn('Non-critical error initializing Stripe:', error);
  // Let's continue without Stripe - this prevents the blank screen
}

export default stripePromise;
