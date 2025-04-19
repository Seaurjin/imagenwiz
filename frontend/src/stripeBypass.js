/**
 * This is a utility file to find and patch any component that's trying
 * to load the problematic stripe.ts and causing the blank screen
 */

// Search for components importing stripe
console.log('Stripe bypass initialized');

// Mock the stripe module
window.mockStripeModule = {
  PRICE_IDS: {
    LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
    LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
    PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
    PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
  },
  default: null
};

// Try to intercept Module system
const originalImport = window.import;
if (originalImport) {
  window.import = function(path) {
    if (path.includes('stripe')) {
      console.log('Intercepted import for:', path);
      return Promise.resolve(window.mockStripeModule);
    }
    return originalImport.apply(this, arguments);
  };
}

// Expose as global for emergency access
window.STRIPE_BYPASS = { 
  active: true,
  mockModule: window.mockStripeModule
};