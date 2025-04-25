/**
 * Test script for Stripe checkout integration
 * This script tests the /api/payment/create-checkout-session endpoint
 */

import fetch from 'node-fetch';

// Mock authentication token
const token = 'test-token';

// Test each package to ensure checkout works properly
const packageIds = [
  'basic',
  'standard',
  'premium',
  'enterprise',
  'yearly-basic'
];

async function testCheckout() {
  console.log('Testing Stripe checkout integration...');
  
  // Test port will be 3000 since that's what our custom script uses
  const baseUrl = 'http://localhost:3000';
  
  // Try to connect to the server first
  try {
    const serverCheck = await fetch(`${baseUrl}/api/payment/packages`);
    if (!serverCheck.ok) {
      console.error(`Server check failed: ${serverCheck.status} ${serverCheck.statusText}`);
      console.error('Make sure the server is running with ./run-with-stripe.sh');
      return;
    }
    
    const packages = await serverCheck.json();
    console.log(`✅ Server is up and running. Found ${packages.packages.length} payment packages`);
  } catch (error) {
    console.error('Failed to connect to server:', error.message);
    console.error('Make sure the server is running with ./run-with-stripe.sh');
    return;
  }
  
  // Test each package ID
  for (const packageId of packageIds) {
    try {
      console.log(`\nTesting checkout for package: ${packageId}`);
      
      const response = await fetch(`${baseUrl}/api/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageId
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Successfully created checkout session for package ${packageId}`);
        console.log(`- Session ID: ${data.session_id}`);
        console.log(`- Checkout URL: ${data.url}`);
      } else {
        console.error(`❌ Failed to create checkout session for package ${packageId}`);
        console.error(`- Status: ${response.status}`);
        console.error(`- Error: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(`❌ Error testing checkout for package ${packageId}:`, error.message);
    }
  }
}

testCheckout().catch(err => {
  console.error('Unhandled error:', err);
});