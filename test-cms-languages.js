/**
 * Script to test the CMS languages API
 */

import axios from 'axios';

async function testLanguagesAPI() {
  try {
    console.log('Testing CMS languages API...');
    
    // Direct call to the Express server endpoint
    const response = await axios.get('http://localhost:3000/api/cms/languages');
    
    console.log(`API returned ${response.data.length} languages:`);
    
    // Print all languages
    response.data.forEach(lang => {
      console.log(`${lang.code}: ${lang.name} ${lang.flag || '(no flag)'}`);
    });
    
    // Return count
    return response.data.length;
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    return 0;
  }
}

// Run the test
testLanguagesAPI()
  .then(count => {
    console.log(`\nFound ${count} languages in the API response`);
    if (count === 33) {
      console.log('SUCCESS: All 33 languages are returned from the API!');
    } else {
      console.log(`ISSUE: Only ${count} languages are returned from the API, should be 33`);
    }
  });