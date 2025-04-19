// Mock implementation that doesn't require the real Stripe library
// This prevents the app from crashing when Stripe keys are missing

// Default price IDs for the pricing page
export const PRICE_IDS = {
  LITE_MONTHLY: 'price_1QIA8yAGgrMJnivhbqEgzPCx',
  LITE_YEARLY: 'price_1QIA8yAGgrMJnivhKTBJHjP9',
  PRO_MONTHLY: 'price_1QIAAnAGgrMJnivhkSDhFFsD',
  PRO_YEARLY: 'price_1QIAAnAGgrMJnivhCL2VYPNH',
};

// Mock loadStripe function that returns a Promise with a mock Stripe instance
export const loadStripe = (key: string) => {
  console.log('Using mock Stripe implementation with key:', key);
  
  // Return a Promise that resolves to a mock Stripe instance
  return Promise.resolve({
    elements: () => ({
      getElement: () => null,
      create: () => ({}),
      update: () => ({}),
    }),
    confirmPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
    createToken: () => Promise.resolve({ token: { id: 'mock_token' } }),
    createSource: () => Promise.resolve({ source: { id: 'mock_source' } }),
    createPaymentMethod: () => Promise.resolve({ paymentMethod: { id: 'mock_payment_method' } }),
    confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
    confirmCardSetup: () => Promise.resolve({ setupIntent: { status: 'succeeded' } }),
  });
};

// Mock Stripe Elements components
export const Elements = ({ children }: { children: React.ReactNode }) => children;
export const PaymentElement = () => null;
export const CardElement = () => null;

// Mock Stripe hooks
export const useStripe = () => ({
  confirmPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
  createToken: () => Promise.resolve({ token: { id: 'mock_token' } }),
  confirmCardPayment: () => Promise.resolve({ paymentIntent: { status: 'succeeded' } }),
});

export const useElements = () => ({
  getElement: () => null,
});

// For modules that expect default export
const stripePromise = Promise.resolve(null);
export default stripePromise;
