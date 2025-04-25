/**
 * Custom startup script for iMagenWiz with Stripe enabled
 * This script starts the Express server component with full Stripe integration
 */

import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { Stripe } from 'stripe';

// Get dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("ERROR: Missing STRIPE_SECRET_KEY environment variable. Payments won't work correctly.");
} else {
  console.log("✅ STRIPE_SECRET_KEY is available. Payments should work correctly.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Payment packages offered
const paymentPackages = [
  { 
    id: 'basic', 
    name: 'Basic Package', 
    price: 9.99, 
    credits: 50,
    description: '50 credits for basic image processing',
    is_yearly: false
  },
  { 
    id: 'standard', 
    name: 'Standard Package', 
    price: 19.99, 
    credits: 150,
    description: '150 credits for standard image processing',
    is_yearly: false
  },
  { 
    id: 'premium', 
    name: 'Premium Package', 
    price: 49.99, 
    credits: 500,
    description: '500 credits for advanced image processing',
    is_yearly: false
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise Package', 
    price: 199.99, 
    credits: 2500,
    description: '2500 credits for enterprise image processing',
    is_yearly: false
  },
  { 
    id: 'yearly-basic', 
    name: 'Basic Yearly', 
    price: 99.99, 
    credits: 600,
    description: '600 credits for basic yearly subscription',
    is_yearly: true
  },
  { 
    id: 'yearly-standard', 
    name: 'Standard Yearly', 
    price: 199.99, 
    credits: 1800,
    description: '1800 credits for standard yearly subscription',
    is_yearly: true
  },
  { 
    id: 'yearly-premium', 
    name: 'Premium Yearly', 
    price: 499.99, 
    credits: 6000,
    description: '6000 credits for premium yearly subscription',
    is_yearly: true
  }
];

// Enable CORS and JSON
app.use(cors());
app.use(express.json());

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// API endpoint for payment packages
app.get('/api/payment/packages', (req, res) => {
  console.log('📦 Payment Packages: Serving available packages');
  res.json({ 
    success: true, 
    packages: paymentPackages 
  });
});

// API endpoint for Stripe checkout
app.post('/api/payment/create-checkout-session', async (req, res) => {
  console.log('✅ Payment Checkout: Creating Stripe checkout session');
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('❌ Error: No authorization header provided');
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required to create checkout session' 
      });
    }
    
    // Get the package ID from the request body
    const { packageId } = req.body;
    if (!packageId) {
      console.log('❌ Error: No package ID provided');
      return res.status(400).json({ 
        success: false,
        message: 'Package ID is required' 
      });
    }
    
    // Find the package in our packages list
    const selectedPackage = paymentPackages.find(p => p.id === packageId);
    if (!selectedPackage) {
      console.log(`❌ Error: Package with ID ${packageId} not found`);
      return res.status(404).json({ 
        success: false,
        message: `Package with ID ${packageId} not found` 
      });
    }
    
    console.log(`Selected package: ${selectedPackage.name} ($${selectedPackage.price})`);
    
    // Determine the success and cancel URLs
    const host = req.headers.host || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const successUrl = `${baseUrl}/payment-verify?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pricing`;
    
    console.log('Success URL:', successUrl);
    console.log('Cancel URL:', cancelUrl);
    
    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: selectedPackage.name,
              description: selectedPackage.description,
            },
            unit_amount: Math.round(selectedPackage.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        package_id: packageId,
        package_name: selectedPackage.name,
        credits: selectedPackage.credits.toString(),
        is_yearly: selectedPackage.is_yearly ? 'true' : 'false',
      }
    });
    
    console.log('✅ Created Stripe checkout session:', session.id);
    
    // Return the session ID and URL
    return res.status(200).json({
      success: true,
      session_id: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('❌ Payment Checkout: Error creating checkout session', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating checkout session: ' + error.message
    });
  }
});

// Catch-all route to serve the frontend for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ STRIPE_PUBLIC_KEY available: ${Boolean(process.env.VITE_STRIPE_PUBLIC_KEY)}`);
  console.log(`✅ STRIPE_SECRET_KEY available: ${Boolean(process.env.STRIPE_SECRET_KEY)}`);
  
  // Display Stripe mode (test vs live)
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')) {
    console.log('⚠️ Running Stripe in TEST mode - no real payments will be processed');
  } else if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')) {
    console.log('🔴 Running Stripe in LIVE mode - REAL payments will be processed');
  }
});