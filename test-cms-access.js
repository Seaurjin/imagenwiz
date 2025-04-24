/**
 * Script to test access to the CMS and verify languages display
 */

import axios from 'axios';

async function testCMSLanguages() {
  try {
    // First get a login token
    console.log('Getting admin login token...');
    const loginResponse = await axios.post('https://e3d010d3-10b7-4398-916c-9569531b7cb9-00-nzrxz81n08w.kirk.replit.dev/api/auth/login', {
      username: 'admin@example.com',
      password: 'Password123!'
    });
    
    if (!loginResponse.data.token) {
      console.error('Failed to get login token');
      return 0;
    }
    
    const token = loginResponse.data.token;
    console.log('Login successful, got token');
    
    // Now test the languages endpoint with authentication
    console.log('Testing CMS languages API with authentication...');
    const response = await axios.get(
      'https://e3d010d3-10b7-4398-916c-9569531b7cb9-00-nzrxz81n08w.kirk.replit.dev/api/cms/languages',
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log(`API returned ${response.data.length} languages:`);
    
    // Print all languages
    response.data.forEach(lang => {
      console.log(`${lang.code}: ${lang.name} ${lang.flag || '(no flag)'}`);
    });
    
    // Return count
    return response.data.length;
  } catch (error) {
    console.error('Error testing CMS:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return 0;
  }
}

// Run the test
testCMSLanguages()
  .then(count => {
    console.log(`\nFound ${count} languages in the API response`);
    if (count === 33) {
      console.log('SUCCESS: All 33 languages are returned from the API!');
    } else {
      console.log(`ISSUE: Only ${count} languages are returned from the API, should be 33`);
    }
  });