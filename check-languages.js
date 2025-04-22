// Script to check languages from the API
import https from 'https';

const url = 'https://e3d010d3-10b7-4398-916c-9569531b7cb9-00-nzrxz81n08w.kirk.replit.dev/api/cms/languages';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      if (res.statusCode !== 200) {
        console.log(`Status Code: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        return;
      }
      
      const languages = JSON.parse(data);
      console.log(`Number of languages: ${languages.length}`);
      
      if (languages.length > 0) {
        console.log('First 5 languages:');
        for (let i = 0; i < Math.min(5, languages.length); i++) {
          console.log(`- ${languages[i].code}: ${languages[i].name} (Active: ${languages[i].is_active})`);
        }
        
        if (languages.length > 5) {
          console.log('...');
          console.log(`- ${languages[languages.length - 1].code}: ${languages[languages.length - 1].name} (Active: ${languages[languages.length - 1].is_active})`);
        }
      } else {
        console.log('No languages found');
      }
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Raw response:', data);
    }
  });
}).on('error', (error) => {
  console.error('Error making request:', error.message);
});