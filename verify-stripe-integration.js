/**
 * Script to verify Stripe API integration by creating a test checkout session
 * 
 * This standalone script will:
 * 1. Create a Stripe instance with your secret key
 * 2. Create a test checkout session
 * 3. Display the checkout URL that would be used in the frontend
 */

import Stripe from 'stripe';

// Get the STRIPE_SECRET_KEY from environment or use the one provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ ERROR: STRIPE_SECRET_KEY environment variable is required');
  console.error('Please make sure the STRIPE_SECRET_KEY environment variable is set');
  process.exit(1);
}

// Initialize Stripe with the secret key
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16'
});

// Test product data
const testProduct = {
  name: 'Standard Package',
  description: 'Advanced features for professionals',
  price: 19.99,
  currency: 'usd'
};

async function testStripeIntegration() {
  console.log('🔍 Verifying Stripe Integration');
  console.log('------------------------------');
  console.log(`✓ STRIPE_SECRET_KEY available (begins with: ${stripeSecretKey.substring(0, 7)}...)`);
  
  try {
    console.log('\n📋 Creating a test checkout session...');
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: testProduct.currency,
            product_data: {
              name: testProduct.name,
              description: testProduct.description,
            },
            unit_amount: Math.round(testProduct.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });
    
    console.log('\n✅ SUCCESS: Stripe checkout session created!');
    console.log('------------------------------');
    console.log(`Session ID: ${session.id}`);
    console.log(`Checkout URL: ${session.url}`);
    console.log('\nIf you see this output, your Stripe integration is working correctly!');
    console.log('This checkout URL can be used to process real test payments with Stripe.');
    
  } catch (error) {
    console.error('\n❌ ERROR: Failed to create Stripe checkout session');
    console.error('------------------------------');
    console.error(`Error Message: ${error.message}`);
    console.error('\nPlease check your Stripe secret key and try again.');
    process.exit(1);
  }
}

// Run the test
testStripeIntegration();