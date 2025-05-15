/**
 * Port Redirection Server for iMagenWiz
 * 
 * This script creates a simple Express server on port 3000 that redirects
 * all requests to the main application running on port 5000.
 * 
 * Usage: node port-redirect-3000.mjs
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

// Create an Express app
const app = express();

// Configure Flask backend URL
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// Generic proxy middleware configuration
const proxyConfig = {
  target: FLASK_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Proxy] ${req.method} ${req.url}`);
    
    // If there's a body, properly stream it
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Proxy] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[Proxy] Error:', err);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
};

// Setup specific blog API proxy middleware with fallback support
const blogApiProxy = createProxyMiddleware({
  ...proxyConfig,
  onError: (err, req, res) => {
    console.error('[Blog API Proxy] Error:', err);
    
    // Fallback to mock data if the Flask backend is unavailable
    if (req.url.startsWith('/api/cms/blog') && req.method === 'GET') {
      console.log('[Blog API Proxy] Using fallback mock data for blog API');
      provideMockBlogData(req, res);
    } else {
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});

// Apply the specialized blog API proxy middleware
app.use('/api/cms/blog*', blogApiProxy);

// Apply generic proxy for all other API routes
app.use('/api', createProxyMiddleware(proxyConfig));

// Fallback function to provide mock blog data when the backend is unavailable
function provideMockBlogData(req, res) {
  try {
    // Parse query parameters
    const language = req.query.language || 'en';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const tag = req.query.tag;
    const search = req.query.search;
    
    console.log(`[Mock Blog API] Parameters: language=${language}, page=${page}, limit=${limit}, tag=${tag}, search=${search}`);

    // Handle specific blog post by slug
    if (req.path.startsWith('/api/cms/blog/') && req.path !== '/api/cms/blog/') {
      const slug = req.path.substring('/api/cms/blog/'.length);
      return provideMockBlogPostBySlug(slug, language, res);
    }
    
    // Create mock blog posts data for list view
    const posts = [
      {
        id: 1,
        slug: 'getting-started',
        featured_image: '/images/blog/getting-started.jpg',
        author_id: 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        tags: [{ id: 1, name: 'Tutorial', slug: 'tutorial' }],
        translation: {
          title: 'Getting Started with iMagenWiz',
          content: '<p>Learn how to remove backgrounds from your images quickly with our powerful AI tool.</p><h2>Introduction</h2><p>iMagenWiz makes it easy to remove backgrounds from any image in seconds.</p>',
          excerpt: 'Learn how to remove backgrounds from your images quickly with our powerful AI tool.',
          language_code: language
        }
      },
      {
        id: 2,
        slug: 'advanced-techniques',
        featured_image: '/images/blog/advanced-techniques.jpg',
        author_id: 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        tags: [{ id: 2, name: 'Advanced', slug: 'advanced' }],
        translation: {
          title: 'Advanced Background Removal Techniques',
          content: '<p>Take your image editing to the next level with these advanced techniques.</p><h2>Fine Tuning</h2><p>Learn how to handle complex edges and transparent objects.</p>',
          excerpt: 'Take your image editing to the next level with these advanced techniques.',
          language_code: language
        }
      },
      {
        id: 3,
        slug: 'batch-processing',
        featured_image: '/images/blog/batch-processing.jpg',
        author_id: 1,
        status: 'published',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
        tags: [{ id: 3, name: 'Productivity', slug: 'productivity' }],
        translation: {
          title: 'Batch Processing with iMagenWiz',
          content: '<p>Process multiple images at once to save time on your projects.</p><h2>How It Works</h2><p>Our batch processing feature lets you upload and process multiple images with just a few clicks.</p>',
          excerpt: 'Process multiple images at once to save time on your projects.',
          language_code: language
        }
      }
    ];
    
    // Apply filter by tag if specified
    let filteredPosts = posts;
    if (tag) {
      filteredPosts = posts.filter(post => 
        post.tags.some(t => t.slug === tag || t.name.toLowerCase() === tag.toLowerCase())
      );
    }
    
    // Apply search if specified
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.translation.title.toLowerCase().includes(searchLower) || 
        post.translation.content.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Prepare response
    const response = {
      posts: paginatedPosts,
      total_pages: Math.ceil(filteredPosts.length / limit),
      pagination: {
        total: filteredPosts.length,
        page: page,
        per_page: limit,
        pages: Math.ceil(filteredPosts.length / limit)
      }
    };
    
    // Send response
    res.status(200).json(response);
    console.log(`[Mock Blog API] Successfully sent ${paginatedPosts.length} posts`);
    
  } catch (error) {
    console.error('[Mock Blog API] Error generating mock data:', error);
    res.status(500).json({ 
      error: 'Failed to generate mock blog data',
      message: error.message
    });
  }
}

// Fallback function to provide mock blog post by slug
function provideMockBlogPostBySlug(slug, language, res) {
  console.log(`[Mock Blog API] Providing mock data for blog post: ${slug}`);
  
  const mockPosts = {
    'getting-started': {
      id: 1,
      slug: 'getting-started',
      featured_image: '/images/blog/getting-started.jpg',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      author: { id: 1, name: 'Admin User', avatar: null },
      tags: [{ id: 1, name: 'Tutorial', slug: 'tutorial' }],
      title: 'Getting Started with iMagenWiz',
      content: '<p>Learn how to remove backgrounds from your images quickly with our powerful AI tool.</p><h2>Introduction</h2><p>iMagenWiz makes it easy to remove backgrounds from any image in seconds.</p>',
      excerpt: 'Learn how to remove backgrounds from your images quickly with our powerful AI tool.'
    },
    'advanced-techniques': {
      id: 2,
      slug: 'advanced-techniques',
      featured_image: '/images/blog/advanced-techniques.jpg',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      author: { id: 1, name: 'Admin User', avatar: null },
      tags: [{ id: 2, name: 'Advanced', slug: 'advanced' }],
      title: 'Advanced Background Removal Techniques',
      content: '<p>Take your image editing to the next level with these advanced techniques.</p><h2>Fine Tuning</h2><p>Learn how to handle complex edges and transparent objects.</p>',
      excerpt: 'Take your image editing to the next level with these advanced techniques.'
    },
    'batch-processing': {
      id: 3,
      slug: 'batch-processing',
      featured_image: '/images/blog/batch-processing.jpg',
      status: 'published',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published_at: new Date().toISOString(),
      author: { id: 1, name: 'Admin User', avatar: null },
      tags: [{ id: 3, name: 'Productivity', slug: 'productivity' }],
      title: 'Batch Processing with iMagenWiz',
      content: '<p>Process multiple images at once to save time on your projects.</p><h2>How It Works</h2><p>Our batch processing feature lets you upload and process multiple images with just a few clicks.</p>',
      excerpt: 'Process multiple images at once to save time on your projects.'
    }
  };
  
  if (mockPosts[slug]) {
    const post = mockPosts[slug];
    
    // Generate related posts (all except current)
    const relatedPosts = Object.values(mockPosts)
      .filter(p => p.slug !== slug)
      .map(p => ({
        id: p.id,
        slug: p.slug,
        featured_image: p.featured_image,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        published_at: p.published_at,
        translation: {
          title: p.title,
          excerpt: p.excerpt,
          language_code: language
        },
        tags: p.tags
      }));
    
    // Send response in the expected format
    res.status(200).json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        meta_description: post.excerpt,
        featured_image: post.featured_image,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        author: post.author,
        tags: post.tags
      },
      related_posts: relatedPosts.slice(0, 2),
      available_languages: [
        { code: 'en', name: 'English', is_default: true },
        { code: 'es', name: 'Spanish', is_default: false },
        { code: 'fr', name: 'French', is_default: false }
      ],
      current_language: language
    });
    console.log(`[Mock Blog API] Successfully sent mock post: ${slug}`);
  } else {
    res.status(404).json({ error: 'Blog post not found' });
    console.log(`[Mock Blog API] Post not found: ${slug}`);
  }
}
  
  // Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://0.0.0.0:${PORT}/`);
  console.log(`Forwarding API requests to ${FLASK_BACKEND_URL}`);
  console.log(`Blog API path has enhanced handling with fallback support`);
});