import { loadStripe } from '@stripe/stripe-js';

// Safe fallback key in case environment fails
const FALLBACK_KEY = "pk_test_51Q38qCAGgrMJnivhKhP3M0pG1Z6omOTWZgJcOxHwLql8i7raQ1IuDhTDk4SOHHjjKmijuyO5gTRkT6JhUw3kHDF600BjMLjeRz";

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
