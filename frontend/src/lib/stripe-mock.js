/**
 * Mock Stripe module that returns dummy objects
 * This completely bypasses the need for Stripe keys
 */

// Export a mock Stripe API that doesn't throw errors
export const loadStripe = () => {
  console.log('Using mock loadStripe function');
  return Promise.resolve({
    // Fake Stripe object with methods that return promises
    elements: () => ({
      create: () => ({ mount: () => {}, unmount: () => {} }),
      getElement: () => ({}),
      update: () => {}
    }),
    confirmPayment: () => Promise.resolve({ error: null }),
    createToken: () => Promise.resolve({ token: { id: 'mock_token_123' } }),
    createSource: () => Promise.resolve({ source: { id: 'mock_source_123' } }),
    createPaymentMethod: () => Promise.resolve({ paymentMethod: { id: 'mock_pm_123' } }),
    confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
    confirmCardSetup: () => Promise.resolve({ setupIntent: { status: 'succeeded' } }),
    retrievePaymentIntent: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
    retrieveSetupIntent: () => Promise.resolve({ setupIntent: { status: 'succeeded' } })
  });
};

// Export default price IDs 
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

// Mock Elements implementation
export const Elements = ({ children }) => children;

// Mock Element components
export const PaymentElement = () => null;
export const CardElement = () => null;
export const useStripe = () => ({
  confirmPayment: () => Promise.resolve({ error: null }),
  createToken: () => Promise.resolve({ token: { id: 'mock_token_123' } }),
  createSource: () => Promise.resolve({ source: { id: 'mock_source_123' } }),
  createPaymentMethod: () => Promise.resolve({ paymentMethod: { id: 'mock_pm_123' } }),
  confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
  confirmCardSetup: () => Promise.resolve({ setupIntent: { status: 'succeeded' } })
});

export const useElements = () => ({
  getElement: () => ({}),
  createElement: () => ({}),
  update: () => {}
});