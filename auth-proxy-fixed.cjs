/**
 * Fixed Blog and Auth API Proxy
 * 
 * This script handles both blog API and authentication correctly
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios = require('axios');
const mysql = require('mysql2/promise');

// Create an Express app
const app = express();

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add this right after app creation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Request received: ${req.method} ${req.url}`);
  next();
});

// Configure Flask backend URL
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || '8.130.113.102',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Ir%86241992',
  database: process.env.DB_NAME || 'mat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Create a connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('MySQL connection pool created successfully');
} catch (error) {
  console.error('Error creating MySQL connection pool:', error.message);
}

// Add CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// ================ AUTHENTICATION ENDPOINTS ================

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
  const { username, password } = req.body;
  
  console.log(`[Auth API] Login attempt: username=${username}, password=${password}`);
  
  // Find user
  const user = users.find(u => 
    (u.username === username || u.email === username) && 
    u.password === password
  );
  
  if (user) {
    // Generate mock token
    const token = `mock_token_${Date.now()}_${user.id}`;
    
    console.log(`[Auth API] Login successful for user: ${username}`);
    
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
  console.log(`[Auth API] Login failed for user: ${username}`);
  return res.status(401).json({
    success: false,
    message: 'Invalid username or password'
  });
});

// User profile endpoint
app.get('/api/auth/user', (req, res) => {
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
  
  console.log(`[Auth API] User profile requested, returning data for: ${user.username}`);
  
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  });
});

// Register endpoint
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  console.log(`[Auth API] Registration attempt: username=${username}, email=${email}`);
  
  // Check if user already exists
  if (users.some(u => u.username === username || u.email === email)) {
    console.log(`[Auth API] Registration failed: User already exists: ${username}`);
    return res.status(400).json({
      success: false,
      message: 'User already exists with that username or email'
    });
  }
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    email: email || `${username}@example.com`,
    password,
    role: 'user'
  };
  
  // Add to mock database
  users.push(newUser);
  
  // Generate token
  const token = `mock_token_${Date.now()}_${newUser.id}`;
  
  console.log(`[Auth API] Registration successful for user: ${username}`);
  
  // Return success response
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    },
    access_token: token,
    token_type: 'Bearer'
  });
});

// ================ BLOG ENDPOINTS ================

// Fetch blog posts from the database
async function getBlogPostsFromDB(language = 'en', page = 1, limit = 10, tag = null, search = null) {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    // Start building the query
    let query = `
      SELECT 
        p.id, 
        p.slug, 
        p.featured_image, 
        p.author_id, 
        p.status, 
        p.created_at, 
        p.updated_at, 
        p.published_at,
        t.title,
        t.content,
        t.language_code
      FROM cms_posts p
      INNER JOIN cms_post_translations t ON p.id = t.post_id
      WHERE p.status = 'published'
      AND t.language_code = ?
    `;

    const queryParams = [language];

    // Add tag filter if specified
    if (tag) {
      query += `
        AND p.id IN (
          SELECT post_id FROM cms_post_tags pt
          INNER JOIN cms_tags t ON pt.tag_id = t.id
          WHERE t.slug = ?
        )
      `;
      queryParams.push(tag);
    }

    // Add search filter if specified
    if (search) {
      query += `
        AND (
          t.title LIKE ?
          OR t.content LIKE ?
        )
      `;
      const searchParam = `%${search}%`;
      queryParams.push(searchParam, searchParam);
    }

    // Count total before pagination
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM (${query}) as countQuery`,
      queryParams
    );
    
    const total = countResult[0].total;

    // Add pagination
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    // Execute the query
    const [posts] = await pool.query(query, queryParams);

    // Fetch the tags for each post
    const postsWithTags = await Promise.all(posts.map(async (post) => {
      const [tags] = await pool.query(`
        SELECT t.id, t.name, t.slug
        FROM cms_tags t
        INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `, [post.id]);

      // Generate an excerpt from the content
      const excerpt = post.content 
        ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        : '';

      return {
        id: post.id,
        slug: post.slug,
        featured_image: post.featured_image,
        author_id: post.author_id,
        status: post.status,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        tags: tags,
        translation: {
          title: post.title,
          content: post.content,
          excerpt: excerpt,
          language_code: post.language_code
        }
      };
    }));

    // Calculate pagination information
    const totalPages = Math.ceil(total / limit);

    return {
      posts: postsWithTags,
      total_pages: totalPages,
      pagination: {
        total: total,
        page: parseInt(page),
        per_page: parseInt(limit),
        pages: totalPages
      }
    };
  } catch (error) {
    console.error('Error fetching blog posts from database:', error);
    throw error;
  }
}

// Fetch a single blog post by slug from the database
async function getBlogPostBySlugFromDB(slug, language = 'en') {
  if (!pool) {
    throw new Error('Database connection not available');
  }

  try {
    // Get the post with its translation - remove t.excerpt, t.meta_description
    const [posts] = await pool.query(`
      SELECT 
        p.id, 
        p.slug, 
        p.featured_image, 
        p.author_id, 
        p.status, 
        p.created_at, 
        p.updated_at, 
        p.published_at,
        t.title,
        t.content,
        t.language_code
      FROM cms_posts p
      INNER JOIN cms_post_translations t ON p.id = t.post_id
      WHERE p.slug = ? AND t.language_code = ? AND p.status = 'published'
      LIMIT 1
    `, [slug, language]);

    if (posts.length === 0) {
      return null;
    }

    const post = posts[0];
    
    // Generate an excerpt from the content
    const excerpt = post.content 
      ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
      : '';
    
    // Get the post author
    const [authors] = await pool.query(`
      SELECT id, name, avatar FROM cms_authors WHERE id = ?
    `, [post.author_id]);
    
    // Get tags for the post
    const [tags] = await pool.query(`
      SELECT t.id, t.name, t.slug
      FROM cms_tags t
      INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [post.id]);
    
    // Get available languages for this post
    const [languages] = await pool.query(`
      SELECT l.code, l.name, l.is_default
      FROM cms_languages l
      INNER JOIN cms_post_translations t ON l.code = t.language_code
      WHERE t.post_id = ?
    `, [post.id]);
    
    // Get related posts (same tag, different post)
    const [relatedPosts] = await pool.query(`
      SELECT DISTINCT 
        p.id, 
        p.slug, 
        p.featured_image, 
        p.status, 
        p.created_at, 
        p.updated_at, 
        p.published_at,
        t.title,
        t.content,
        t.language_code
      FROM cms_posts p
      INNER JOIN cms_post_translations t ON p.id = t.post_id
      INNER JOIN cms_post_tags pt1 ON p.id = pt1.post_id
      INNER JOIN cms_post_tags pt2 ON pt1.tag_id = pt2.tag_id
      WHERE pt2.post_id = ? AND p.id != ? AND p.status = 'published' AND t.language_code = ?
      LIMIT 2
    `, [post.id, post.id, language]);
    
    // Format related posts
    const formattedRelatedPosts = await Promise.all(relatedPosts.map(async (relatedPost) => {
      const [relatedTags] = await pool.query(`
        SELECT t.id, t.name, t.slug
        FROM cms_tags t
        INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `, [relatedPost.id]);
      
      // Generate an excerpt from the content
      const relatedExcerpt = relatedPost.content 
        ? relatedPost.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
        : '';
      
      return {
        id: relatedPost.id,
        slug: relatedPost.slug,
        featured_image: relatedPost.featured_image,
        status: relatedPost.status,
        created_at: relatedPost.created_at,
        updated_at: relatedPost.updated_at,
        published_at: relatedPost.published_at,
        tags: relatedTags,
        translation: {
          title: relatedPost.title,
          excerpt: relatedExcerpt,
          language_code: relatedPost.language_code
        }
      };
    }));
    
    // Format final response
    return {
      post: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: excerpt,
        meta_description: excerpt, // Use excerpt as meta_description
        featured_image: post.featured_image,
        created_at: post.created_at,
        updated_at: post.updated_at,
        published_at: post.published_at,
        author: authors.length > 0 ? authors[0] : { id: post.author_id, name: 'Unknown Author', avatar: null },
        tags: tags
      },
      related_posts: formattedRelatedPosts,
      available_languages: languages,
      current_language: language
    };
  } catch (error) {
    console.error('Error fetching blog post by slug:', error);
    throw error;
  }
}

// Blog listing endpoint - try database first, fallback to mock data
app.get('/api/cms/blog', async (req, res) => {
  // Parse query parameters
  const language = req.query.language || 'en';
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  const tag = req.query.tag;
  const search = req.query.search;

  console.log(`[Blog API] Fetching posts with params: language=${language}, page=${page}, limit=${limit}, tag=${tag}, search=${search}`);

  try {
    // Try to get posts from database first
    if (pool) {
      try {
        const result = await getBlogPostsFromDB(language, page, limit, tag, search);
        console.log(`[DB Blog API] Successfully retrieved ${result.posts.length} posts from database`);
        return res.status(200).json(result);
      } catch (dbError) {
        console.error('[DB Blog API] Error fetching from database, falling back to mock data:', dbError);
        // If database query fails, continue to mock data
      }
    }

    // Fallback to mock data
    console.log('[Blog API] Using mock data as fallback');
    provideMockBlogData(req, res);
  } catch (error) {
    console.error('[Blog API] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog data',
      message: error.message
    });
  }
});

// Blog post by slug endpoint - try database first, fallback to mock data
app.get('/api/cms/blog/:slug', async (req, res) => {
  const slug = req.params.slug;
  const language = req.query.language || 'en';

  console.log(`[Blog API] Fetching post by slug: ${slug}, language: ${language}`);

  try {
    // Try to get post from database first
    if (pool) {
      try {
        const result = await getBlogPostBySlugFromDB(slug, language);
        if (result) {
          console.log(`[DB Blog API] Successfully retrieved post from database: ${slug}`);
          return res.status(200).json(result);
        }
        // If post not found in database, try mock data
        console.log(`[DB Blog API] Post not found in database: ${slug}, falling back to mock data`);
      } catch (dbError) {
        console.error('[DB Blog API] Error fetching from database, falling back to mock data:', dbError);
        // If database query fails, continue to mock data
      }
    }

    // Fallback to mock data
    console.log('[Blog API] Using mock data as fallback');
    provideMockBlogPostBySlug(slug, language, res);
  } catch (error) {
    console.error('[Blog API] Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch blog post',
      message: error.message
    });
  }
});

// ========================== AUTHENTICATION PROXY ==========================
// Configure auth proxy with correct path handling
const authProxyConfig = {
  target: FLASK_BACKEND_URL,
  changeOrigin: true,
  // The key fix: preserve the /api prefix when forwarding to the Flask backend
  pathRewrite: (path, req) => {
    return path; // Don't modify the path - keep /api/auth/... as is
  },
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Auth Proxy] ${req.method} ${req.url} → ${FLASK_BACKEND_URL}${req.url}`);
    
    // If there's a body, properly stream it
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[Auth Proxy] Response: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('[Auth Proxy] Error:', err);
    res.status(500).json({ error: 'Auth proxy error', message: err.message });
  }
};

// Apply auth proxy specifically to /api/auth/* paths
app.use('/api/auth', createProxyMiddleware(authProxyConfig));

// ========================== BLOG API IMPLEMENTATION ==========================
// (The rest of the blog API implementation remains unchanged)

// Fallback function to provide mock blog data when the database is unavailable
function provideMockBlogData(req, res) {
  try {
    // Parse query parameters
    const language = req.query.language || 'en';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const tag = req.query.tag;
    const search = req.query.search;
    
    console.log(`[Mock Blog API] Parameters: language=${language}, page=${page}, limit=${limit}, tag=${tag}, search=${search}`);
    
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

// Add this after the app creation
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  console.error(err.stack);
});

// Add this at the end of the file, before starting the server
app.use((err, req, res, next) => {
  console.error('[ERROR MIDDLEWARE]', err);
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fixed Blog & Auth Proxy Server running at http://0.0.0.0:${PORT}/`);
  console.log(`Database connection: ${pool ? 'ACTIVE' : 'INACTIVE'}`);
  console.log(`Authentication requests proxied to ${FLASK_BACKEND_URL}`);
}); 