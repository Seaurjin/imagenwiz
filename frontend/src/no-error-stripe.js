/**
 * Standalone module that provides Stripe price IDs without requiring any keys
 * This is used as a fallback when environment variables aren't correctly loaded
 */

// Default price IDs - these are copied from the original stripe.ts file
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

// Default export is null, indicating no Stripe connection
export default null;