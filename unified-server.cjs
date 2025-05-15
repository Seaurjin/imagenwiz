/**
 * Unified API Server (CommonJS)
 * 
 * Handles both authentication and blog API endpoints
 */

const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mock users database
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'testuser2',
    password: 'password123',
    email: 'test@example.com',
    role: 'user'
  }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log(`Login attempt: username=${username}, password=${password}`);
    
    // Find user
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );
    
    if (user) {
      // Generate mock token
      const token = `mock_token_${Date.now()}_${user.id}`;
      
      console.log(`Login successful for user: ${username}`);
      
      // Return success response
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        access_token: token,
        token_type: 'Bearer'
      });
    }
    
    // Return error for failed login
    console.log(`Login failed for user: ${username}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// User profile endpoint
app.get('/api/auth/user', (req, res) => {
  try {
    // In a real app, we would verify the token here
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      });
    }
    
    // For this mock version, we'll just return the first user
    const user = users[0];
    
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Mock blog data for blog endpoints
const mockBlogPosts = [
  {
    id: 1,
    slug: 'getting-started',
    featured_image: '/images/blog/getting-started.jpg',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    author: { id: 1, name: 'Admin User', avatar: null },
    tags: [{ id: 1, name: 'Tutorial', slug: 'tutorial' }],
    translation: {
      title: 'Getting Started with iMagenWiz',
      content: '<p>Learn how to remove backgrounds from your images quickly with our powerful AI tool.</p><h2>Introduction</h2><p>iMagenWiz makes it easy to remove backgrounds from any image in seconds.</p>',
      excerpt: 'Learn how to remove backgrounds from your images quickly with our powerful AI tool.',
      language_code: 'en'
    }
  },
  {
    id: 2,
    slug: 'advanced-techniques',
    featured_image: '/images/blog/advanced-techniques.jpg',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    author: { id: 1, name: 'Admin User', avatar: null },
    tags: [{ id: 2, name: 'Advanced', slug: 'advanced' }],
    translation: {
      title: 'Advanced Background Removal Techniques',
      content: '<p>Take your image editing to the next level with these advanced techniques.</p><h2>Fine Tuning</h2><p>Learn how to handle complex edges and transparent objects.</p>',
      excerpt: 'Take your image editing to the next level with these advanced techniques.',
      language_code: 'en'
    }
  },
  {
    id: 3,
    slug: 'batch-processing',
    featured_image: '/images/blog/batch-processing.jpg',
    status: 'published',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: new Date().toISOString(),
    author: { id: 1, name: 'Admin User', avatar: null },
    tags: [{ id: 3, name: 'Productivity', slug: 'productivity' }],
    translation: {
      title: 'Batch Processing with iMagenWiz',
      content: '<p>Process multiple images at once to save time on your projects.</p><h2>How It Works</h2><p>Our batch processing feature lets you upload and process multiple images with just a few clicks.</p>',
      excerpt: 'Process multiple images at once to save time on your projects.',
      language_code: 'en'
    }
  }
];

// Blog posts list endpoint
app.get('/api/cms/blog', (req, res) => {
  try {
    // Parse query parameters
    const language = req.query.language || 'en';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const tag = req.query.tag;
    
    console.log(`Blog API request: language=${language}, page=${page}, limit=${limit}, tag=${tag}`);
    
    // Filter posts by language
    let filteredPosts = mockBlogPosts.map(post => ({
      ...post,
      translation: {
        ...post.translation,
        language_code: language
      }
    }));
    
    // Filter by tag if specified
    if (tag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(t => t.slug === tag)
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
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Blog API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch blog data',
      message: error.message
    });
  }
});

// Single blog post endpoint
app.get('/api/cms/blog/:slug', (req, res) => {
  try {
    const slug = req.params.slug;
    const language = req.query.language || 'en';
    
    console.log(`Blog post request: slug=${slug}, language=${language}`);
    
    // Find post with matching slug
    const post = mockBlogPosts.find(p => p.slug === slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    
    // Get related posts (all except current)
    const relatedPosts = mockBlogPosts
      .filter(p => p.id !== post.id)
      .slice(0, 2)
      .map(p => ({
        id: p.id,
        slug: p.slug,
        featured_image: p.featured_image,
        status: p.status,
        created_at: p.created_at,
        updated_at: p.updated_at,
        published_at: p.published_at,
        translation: {
          title: p.translation.title,
          excerpt: p.translation.excerpt,
          language_code: language
        },
        tags: p.tags
      }));
    
    // Send response
    return res.status(200).json({
      post: {
        id: post.id,
        slug: post.slug,
        title: post.translation.title,
        content: post.translation.content,
        excerpt: post.translation.excerpt,
        meta_description: post.translation.excerpt,
        featured_image: post.featured_image,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        author: post.author,
        tags: post.tags
      },
      related_posts: relatedPosts,
      available_languages: [
        { code: 'en', name: 'English', is_default: true },
        { code: 'es', name: 'Spanish', is_default: false },
        { code: 'fr', name: 'French', is_default: false }
      ],
      current_language: language
    });
  } catch (error) {
    console.error('Blog post API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch blog post',
      message: error.message
    });
  }
});

// Blog tags endpoint
app.get('/api/cms/tags', (req, res) => {
  try {
    const tags = [
      { id: 1, name: 'Tutorial', slug: 'tutorial', count: 1 },
      { id: 2, name: 'Advanced', slug: 'advanced', count: 1 },
      { id: 3, name: 'Productivity', slug: 'productivity', count: 1 }
    ];
    
    return res.status(200).json({ tags });
  } catch (error) {
    console.error('Tags API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch tags',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: ['/api/auth/login', '/api/auth/user'],
      blog: ['/api/cms/blog', '/api/cms/blog/:slug', '/api/cms/tags']
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  });
});

// Start the server
const PORT = process.env.UNIFIED_SERVER_PORT || process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Unified API Server running at http://0.0.0.0:${PORT}/`);
  console.log(`Available routes:`);
  console.log(`  Auth: /api/auth/login, /api/auth/user`);
  console.log(`  Blog: /api/cms/blog, /api/cms/blog/:slug, /api/cms/tags`);
  console.log(`  Health: /api/health`);
}); 