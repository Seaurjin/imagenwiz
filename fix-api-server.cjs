/**
 * API Fix Server
 * 
 * This is a lightweight Express server that provides mock implementations
 * for the missing API endpoints that are returning 404 errors.
 */

const express = require('express');
const app = express();
const cors = require('cors');

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] API Request: ${req.method} ${req.url}`);
  next();
});

// ================== MOCK API ENDPOINTS ==================

// Mock data for matting history
const mockMattingHistory = [
  {
    id: 1,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    image_url: '/static/samples/matting1_result.png',
    original_url: '/static/samples/matting1_original.jpg',
    status: 'completed',
    type: 'background_removal'
  },
  {
    id: 2,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    image_url: '/static/samples/matting2_result.png',
    original_url: '/static/samples/matting2_original.jpg',
    status: 'completed',
    type: 'background_change'
  },
  {
    id: 3,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    image_url: '/static/samples/matting3_result.png',
    original_url: '/static/samples/matting3_original.jpg',
    status: 'completed',
    type: 'background_removal'
  }
];

// Mock data for payment history
const mockPaymentHistory = [
  {
    id: 'pay_1AbCdEfGhIjKlM',
    amount: 9.99,
    currency: 'USD',
    status: 'succeeded',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Monthly Subscription - Basic Plan',
    payment_method: 'visa (****4242)'
  },
  {
    id: 'pay_2BcDeFgHiJkLmN',
    amount: 19.99,
    currency: 'USD',
    status: 'succeeded',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Credit Pack - 100 Credits',
    payment_method: 'mastercard (****5555)'
  },
  {
    id: 'pay_3CdEfGhIjKlMnO',
    amount: 49.99,
    currency: 'USD',
    status: 'succeeded',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    description: 'Monthly Subscription - Pro Plan',
    payment_method: 'visa (****1234)'
  }
];

// Mock data for CMS blog posts
const mockBlogPosts = [
  {
    id: 1,
    title: 'Getting Started with Image Matting',
    slug: 'getting-started-with-image-matting',
    content: 'Image matting is the process of extracting a foreground subject from an image by determining the transparency of each pixel. This guide will help you understand how to use our image matting tools effectively.',
    excerpt: 'Learn the basics of image matting and how to use our tools effectively.',
    featured_image: '/static/uploads/cms/81c5ea8e7cf9421a90fc43f0a28bae4d_Brazuca_-_Screen_3.png',
    author: 'Admin',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    tags: ['tutorial', 'matting']
  },
  {
    id: 2,
    title: 'New Features in iMagenWiz 2.0',
    slug: 'new-features-in-imagenwiz-2-0',
    content: 'We\'re excited to announce the release of iMagenWiz 2.0! This update brings several new features including improved background removal, batch processing, and integration with popular design tools.',
    excerpt: 'Discover the exciting new features in our latest update.',
    featured_image: '/static/uploads/cms/feature_update.jpg',
    author: 'Admin',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    tags: ['announcement', 'feature']
  },
  {
    id: 3,
    title: 'Advanced Techniques for Perfect Cutouts',
    slug: 'advanced-techniques-for-perfect-cutouts',
    content: 'Taking your image matting to the next level requires understanding some advanced techniques. In this article, we cover edge refinement, hair detection, and transparency handling.',
    excerpt: 'Master advanced techniques for perfect image cutouts.',
    featured_image: '/static/uploads/cms/advanced_techniques.jpg',
    author: 'Admin',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'published',
    tags: ['tutorial', 'advanced']
  }
];

// Mock data for CMS tags
const mockTags = [
  { id: 1, name: 'tutorial', slug: 'tutorial', count: 2 },
  { id: 2, name: 'matting', slug: 'matting', count: 1 },
  { id: 3, name: 'announcement', slug: 'announcement', count: 1 },
  { id: 4, name: 'feature', slug: 'feature', count: 1 },
  { id: 5, name: 'advanced', slug: 'advanced', count: 1 }
];

// Settings Logo API endpoint
app.get('/api/settings/logo', (req, res) => {
  console.log('[API Server] Serving settings logo');
  
  // Return a mock logo response
  return res.status(200).json({
    success: true,
    logo: {
      url: '/static/logo/imagenwiz-logo.png',
      alt: 'iMagenWiz Logo'
    }
  });
});

// Matting History API endpoint
app.get('/api/matting/history', (req, res) => {
  console.log('[API Server] Serving matting history');
  
  // Add pagination parameters (optional)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Return mock data
  return res.status(200).json({
    success: true,
    history: mockMattingHistory,
    pagination: {
      total: mockMattingHistory.length,
      page: page,
      limit: limit
    }
  });
});

// Payment History API endpoint
app.get('/api/payment/history', (req, res) => {
  console.log('[API Server] Serving payment history');
  
  // Add pagination parameters (optional)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  // Return mock data
  return res.status(200).json({
    success: true,
    history: mockPaymentHistory,
    pagination: {
      total: mockPaymentHistory.length,
      page: page,
      limit: limit
    }
  });
});

// ================== NEW CMS ENDPOINTS ==================

// Middleware to check admin permissions
const checkAdminPermission = (req, res, next) => {
  // Get authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[API Server] Admin permission denied: No auth token');
    return res.status(401).json({
      success: false,
      message: 'Admin Access Required',
      adminRequired: true
    });
  }
  
  // In a real implementation, we would verify the token and check user role
  // For this mock version, we extract the user ID from the token 
  // Format is mock_token_TIMESTAMP_USERID
  const token = authHeader.split(' ')[1];
  
  try {
    const tokenParts = token.split('_');
    if (tokenParts.length < 4) {
      throw new Error('Invalid token format');
    }
    
    // The last part should be the user ID
    const userId = parseInt(tokenParts[tokenParts.length - 1]);
    
    // Admin is user ID 1
    const isAdmin = (userId === 1);
    
    if (!isAdmin) {
      console.log(`[API Server] Admin permission denied: User ID ${userId} is not an admin`);
      return res.status(403).json({
        success: false,
        message: 'Admin Access Required',
        adminRequired: true,
        adminStatus: 'undefined'
      });
    }
    
    // Admin permission granted
    console.log(`[API Server] Admin permission granted: User ID ${userId} is admin`);
    next();
  } catch (err) {
    console.log(`[API Server] Admin permission denied: Token parsing error - ${err.message}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      adminRequired: true
    });
  }
};

// CMS Blog API endpoint
app.get('/api/cms/blog', checkAdminPermission, (req, res) => {
  console.log('[API Server] Serving CMS blog posts');
  
  // Get query parameters
  const language = req.query.language || 'en';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const tag = req.query.tag;
  const search = req.query.search;
  
  console.log(`[CMS API] Parameters: language=${language}, page=${page}, limit=${limit}, tag=${tag}, search=${search}`);
  
  // Filter posts by tag if provided
  let filteredPosts = [...mockBlogPosts];
  if (tag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
  }
  
  // Filter posts by search term if provided
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) || 
      post.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Return mock data
  return res.status(200).json({
    success: true,
    posts: filteredPosts,
    pagination: {
      total: filteredPosts.length,
      page: page,
      limit: limit
    }
  });
});

// CMS Tags API endpoint
app.get('/api/cms/tags', checkAdminPermission, (req, res) => {
  console.log('[API Server] Serving CMS tags');
  
  // Return mock data
  return res.status(200).json({
    success: true,
    tags: mockTags
  });
});

// Fallback for other CMS routes
app.get('/api/cms/*', checkAdminPermission, (req, res) => {
  console.log(`[API Server] Received request for unmapped CMS endpoint: ${req.path}`);
  
  // Return a generic response
  return res.status(200).json({
    success: true,
    message: 'CMS API endpoint called',
    path: req.path
  });
});

// Also handle /cms/* routes (without /api prefix) that are incorrectly routed
app.get('/cms/*', (req, res) => {
  console.log(`[API Server] Received request for CMS endpoint without /api prefix: ${req.path}`);
  
  // Redirect to proper API path
  const correctedPath = `/api${req.path}`;
  console.log(`[API Server] Redirecting to: ${correctedPath}`);
  
  // Forward to the correct handler
  req.url = correctedPath;
  app._router.handle(req, res);
});

// Generic health check endpoint
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'ok',
    message: 'API server is healthy'
  });
});

// Serve static CMS media files
app.get('/api/uploads/cms/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`[API Server] Serving CMS media file: ${filename}`);
  
  // Return placeholder image data (this would typically serve a real file)
  // For testing purposes, we'll just send a redirect to a placeholder
  res.redirect('/api/images/placeholder-image.svg');
});

// Placeholder image for CMS media
app.get('/api/images/placeholder-image.svg', (req, res) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f0f0f0"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#888888">Image Not Found</text>
  <path d="M200,100 L175,150 L225,150 Z" fill="#888888"/>
  <rect x="175" y="150" width="50" height="50" fill="#888888"/>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Fix Server running at http://0.0.0.0:${PORT}/`);
  console.log('Available endpoints:');
  console.log('- GET /api/settings/logo');
  console.log('- GET /api/matting/history');
  console.log('- GET /api/payment/history');
  console.log('- GET /api/cms/blog');
  console.log('- GET /api/cms/tags');
  console.log('- GET /api/health');
}); 