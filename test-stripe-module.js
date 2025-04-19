// Simple script to test the Stripe module
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the stripe.ts file
const stripeTsPath = join(__dirname, 'frontend', 'src', 'lib', 'stripe.ts');

// Read the file content
try {
  const content = readFileSync(stripeTsPath, 'utf8');
  console.log('Stripe.ts file content:');
  console.log(content);
  
  // Check if there's any code throwing an error
  const errorLines = content.split('\n').filter(line => line.includes('throw') && line.includes('Error'));
  if (errorLines.length > 0) {
    console.log('\nFound potential error-throwing lines:');
    errorLines.forEach(line => console.log(`- ${line.trim()}`));
  } else {
    console.log('\nNo explicit error throwing found in the file.');
  }
} catch (error) {
  console.error('Error reading stripe.ts file:', error);
}