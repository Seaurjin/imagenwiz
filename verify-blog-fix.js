/**
 * Blog API Verification Script
 * 
 * This script tests the blog API endpoints to verify that the fix is working correctly.
 */

import axios from 'axios';

// Configure the API URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const BLOG_API_URL = `${API_BASE_URL}/api/cms/blog`;

// Helper function to make API requests
async function makeRequest(url, params = {}) {
  try {
    console.log(`Making request to: ${url}`);
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

// Test getting the blog post list
async function testBlogListing() {
  console.log('\n=== Testing Blog Listing API ===');
  const data = await makeRequest(BLOG_API_URL);
  
  if (!data) {
    console.error('❌ Failed to fetch blog listing');
    return false;
  }
  
  console.log(`✅ Successfully fetched blog listing. Found ${data.posts.length} posts`);
  console.log('First post title:', data.posts[0]?.translation?.title || 'N/A');
  return true;
}

// Test getting a specific blog post
async function testBlogPost() {
  console.log('\n=== Testing Individual Blog Post API ===');
  
  // Try to get the "getting-started" post
  const slug = 'getting-started';
  const data = await makeRequest(`${BLOG_API_URL}/${slug}`);
  
  if (!data || !data.post) {
    console.error(`❌ Failed to fetch blog post with slug: ${slug}`);
    return false;
  }
  
  console.log(`✅ Successfully fetched blog post: ${data.post.title}`);
  console.log('Excerpt:', data.post.excerpt);
  console.log('Related posts:', data.related_posts.length);
  return true;
}

// Test filtering blog posts by tag
async function testBlogFiltering() {
  console.log('\n=== Testing Blog Filtering API ===');
  
  // Try to filter by the "tutorial" tag
  const tag = 'tutorial';
  const data = await makeRequest(BLOG_API_URL, { tag });
  
  if (!data) {
    console.error(`❌ Failed to fetch blog posts with tag: ${tag}`);
    return false;
  }
  
  console.log(`✅ Successfully filtered blog posts by tag: ${tag}`);
  console.log(`Found ${data.posts.length} posts with this tag`);
  return true;
}

// Main function to run all tests
async function runTests() {
  console.log('============================');
  console.log('🔍 BLOG API VERIFICATION TESTS');
  console.log('============================');
  console.log(`Testing against API base URL: ${API_BASE_URL}`);
  
  let success = true;
  
  // Run all tests
  success = await testBlogListing() && success;
  success = await testBlogPost() && success;
  success = await testBlogFiltering() && success;
  
  // Print summary
  console.log('\n============================');
  if (success) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('The blog API fix is working correctly.');
  } else {
    console.log('❌ SOME TESTS FAILED!');
    console.log('The blog API fix may not be working correctly.');
  }
  console.log('============================');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 