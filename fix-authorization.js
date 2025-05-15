/**
 * Fix Authorization Script
 * This script adds the auth token to localStorage to ensure admin status is properly recognized
 */

// Admin token - this will be used to provide admin access
const adminToken = {
  access_token: 'mock_token_' + Date.now() + '_1',
  token_type: 'Bearer',
  user: {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    isAdmin: true,      // camelCase version for API compatibility
    is_admin: true,     // snake_case version for frontend components
    admin: true,        // extra field for maximum compatibility
    adminStatus: 'active'
  }
};

// Save the token to localStorage - this is where the frontend app checks for credentials
localStorage.setItem('auth_token', JSON.stringify(adminToken));
console.log('✅ Admin token has been set in localStorage');
console.log('Token:', adminToken.access_token);

// Verify admin user is logged in by checking localStorage
const storedToken = JSON.parse(localStorage.getItem('auth_token') || '{}');
console.log('✅ Verification:', 
  storedToken.user?.is_admin ? 'Admin status is TRUE' : 'Admin status is ' + (storedToken.user?.is_admin || 'undefined'),
  '\n✅ Admin Status:', storedToken.user?.adminStatus || 'undefined'
);

// Instructions for the user
console.log('\n===== INSTRUCTIONS =====');
console.log('1. Run this script in your browser console when on the login page');
console.log('2. After running this script, navigate to the CMS section');
console.log('3. You should now have admin access');
console.log('========================'); 