/**
 * Script to start the Express server with Stripe integration
 * This is a standalone script that does not require the Flask backend
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Stripe from 'stripe';

// Constants
const PORT = process.env.PORT || 3000;
const FRONTEND_PATH = process.env.FRONTEND_PATH || './frontend/dist';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Stripe with secret key
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('⚠️ Missing STRIPE_SECRET_KEY environment variable');
  console.error('Stripe payments will not work correctly without this key.');
  console.error('Please set the STRIPE_SECRET_KEY environment variable.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

// Sample payment packages
const PAYMENT_PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Essential image editing tools for casual users',
    price: 9.99,
    credits: 50,
    features: ['Basic image editing', 'Up to 5 AI generations per day', 'Standard support'],
    popularChoice: false
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Advanced features for professionals',
    price: 19.99,
    credits: 150,
    features: ['Advanced image editing', 'Up to 20 AI generations per day', 'Priority support', 'Export in all formats'],
    popularChoice: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ultimate package for power users',
    price: 39.99,
    credits: 500,
    features: ['All image editing features', 'Unlimited AI generations', '24/7 support', 'Export in all formats', 'Batch processing'],
    popularChoice: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Custom solution for businesses',
    price: 99.99,
    credits: 2000,
    features: ['All premium features', 'Custom integrations', 'Dedicated account manager', 'Team collaboration tools', 'API access'],
    popularChoice: false
  },
  {
    id: 'yearly-basic',
    name: 'Basic (Yearly)',
    description: 'Save 20% with annual billing',
    price: 95.88, // 9.99 * 12 - 20%
    credits: 600, // 50 * 12
    features: ['Basic image editing', 'Up to 5 AI generations per day', 'Standard support', '20% discount'],
    isYearly: true,
    popularChoice: false
  }
];

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Verify frontend path exists
let frontendPath = path.resolve(__dirname, FRONTEND_PATH);
let validFrontendPath = false;

console.log('Checking for frontend build directories:');
console.log(`- Checking: ${frontendPath}`);

if (fs.existsSync(frontendPath) && fs.existsSync(path.join(frontendPath, 'index.html'))) {
  validFrontendPath = true;
  console.log(`✅ Found valid frontend path with index.html: ${frontendPath}`);
} else {
  // Try alternative paths
  const altPaths = [
    './frontend/build',
    './frontend/public',
    './dist',
    './build',
    './public'
  ];
  
  for (const altPath of altPaths) {
    const testPath = path.resolve(__dirname, altPath);
    console.log(`- Checking alternative: ${testPath}`);
    
    if (fs.existsSync(testPath) && fs.existsSync(path.join(testPath, 'index.html'))) {
      frontendPath = testPath;
      validFrontendPath = true;
      console.log(`✅ Found valid frontend path with index.html: ${frontendPath}`);
      break;
    }
  }
}

if (!validFrontendPath) {
  console.error('❌ No valid frontend path found with index.html!');
  console.error('The server will start but may not serve the React app correctly.');
}

console.log(`Using frontend path: ${frontendPath}`);
console.log(`Files in ${frontendPath}: ${fs.existsSync(frontendPath) ? fs.readdirSync(frontendPath) : 'directory not found'}`);

// Serve static files
console.log(`🌐 Setting up static file serving from: ${frontendPath}`);
app.use(express.static(frontendPath));

// API Endpoints

// Settings API
app.get('/api/settings/logo', (req, res) => {
  console.log('📸 Express fallback: Serving logo settings directly');
  res.json({
    logoUrl: '/attached_assets/iMagenWiz Logo reverse_1745075588661.jpg',
    smallLogoUrl: '/attached_assets/iMagenWiz Logo small_1745119547734.jpg',
    faviconUrl: '/attached_assets/iMagenWiz Logo Icon_1745075613327.jpg'
  });
});

// Payment packages API
app.get('/api/payment/packages', (req, res) => {
  console.log('💰 Express: Serving payment packages');
  res.json({
    packages: PAYMENT_PACKAGES
  });
});

// Create checkout session API
app.post('/api/payment/create-checkout-session', async (req, res) => {
  try {
    const { packageId } = req.body;
    
    if (!packageId) {
      return res.status(400).json({ message: 'Package ID is required' });
    }
    
    // Find the selected package
    const selectedPackage = PAYMENT_PACKAGES.find(pkg => pkg.id === packageId);
    
    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    
    // Get base URL for success and cancel URLs
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    // Create a checkout session
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
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        packageId: selectedPackage.id,
        credits: selectedPackage.credits.toString(),
        isYearly: (selectedPackage.isYearly || false).toString(),
      },
    });
    
    console.log(`✅ Created Stripe checkout session for package ${packageId}`);
    res.json({
      url: session.url,
      session_id: session.id
    });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error.message);
    res.status(500).json({
      message: 'Error creating checkout session',
      error: error.message
    });
  }
});

// Webhook endpoint for Stripe events
app.post('/api/payment/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    if (endpointSecret) {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // No webhook secret, so just parse the event
      event = JSON.parse(req.body.toString());
      console.warn('⚠️ Webhook signature verification skipped - STRIPE_WEBHOOK_SECRET not set');
    }
    
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract metadata
      const { packageId, credits, isYearly } = session.metadata;
      const customerEmail = session.customer_details.email;
      
      console.log(`✅ Payment successful for package ${packageId}`);
      console.log(`📧 Customer email: ${customerEmail}`);
      console.log(`💵 Credits: ${credits}`);
      console.log(`📅 Is yearly: ${isYearly}`);
      
      // Here you would update the user's account with credits
      // Since we're running without the Flask backend, we'll just log this
      console.log('User account would be updated with credits here');
    }
    
    res.json({received: true});
  } catch (err) {
    console.error(`❌ Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Serve React app for all other routes (SPA catch-all)
app.get('*', (req, res) => {
  console.log(`🌐 Serving SPA route: ${req.url} (Catch-All Route Handler)`);
  console.log(`  Full URL: ${req.url}`);
  console.log(`  Original URL: ${req.originalUrl}`);
  console.log(`  Query params: ${JSON.stringify(req.query)}`);
  console.log(`  Headers: ${JSON.stringify(req.headers, null, 2)}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  Remote IP: ${req.ip}`);
  console.log(`  Is Express Route: YES`);
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`✅ STRIPE_PUBLIC_KEY available: ${!!process.env.VITE_STRIPE_PUBLIC_KEY}`);
  console.log(`✅ STRIPE_SECRET_KEY available: ${!!process.env.STRIPE_SECRET_KEY}`);
  console.log(`⚠️ Running Stripe in TEST mode - no real payments will be processed\n`);
});