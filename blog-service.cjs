/**
 * Simplified Blog API Service
 * 
 * A focused server that only handles blog-related API endpoints
 * with better error handling and debugging
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

// Create Express app
const app = express();

// Configure middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enhanced logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Request started`);
  
  // Add response finished listener
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Response: ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// MySQL Database Configuration - using the remote database
const dbConfig = {
  host: '8.130.113.102',
  user: 'root',
  password: 'Ir%86241992',
  database: 'mat_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Create a connection pool
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('MySQL connection pool created successfully');
} catch (error) {
  console.error('Error creating MySQL connection pool:', error.message);
}

// Test database connection immediately
async function testDatabaseConnection() {
  if (!pool) {
    console.error('Database pool not initialized');
    return false;
  }
  
  try {
    console.log('Testing database connection...');
    const connection = await pool.getConnection();
    console.log('Database connection successful!');
    
    // Test a simple query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('Test query successful:', result);
    
    // Release the connection back to the pool
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  }
}

// Test connection at startup
testDatabaseConnection();

// BLOG API ENDPOINTS

// Helper function to generate excerpt from HTML content
function generateExcerpt(htmlContent, length = 150) {
  if (!htmlContent) return '';
  
  // Strip HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, '');
  
  // Trim to specified length
  if (textContent.length <= length) {
    return textContent;
  }
  
  return textContent.substring(0, length) + '...';
}

// GET /api/cms/blog - List blog posts
app.get('/api/cms/blog', async (req, res) => {
  try {
    // Parse query parameters
    const language = req.query.language || 'en';
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const tag = req.query.tag;
    const search = req.query.search;
    
    console.log(`Blog listing request: language=${language}, page=${page}, limit=${limit}, tag=${tag}, search=${search}`);
    
    if (!pool) {
      console.warn('Database connection not available, serving mock data');
      return serveMockBlogListing(req, res);
    }

    try {
      // Construct base query - we know that cms_posts doesn't have excerpt column
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
      
      const params = [language];
      
      // Add tag filter if specified
      if (tag) {
        query += `
          AND p.id IN (
            SELECT post_id FROM cms_post_tags pt
            INNER JOIN cms_tags t ON pt.tag_id = t.id
            WHERE t.slug = ?
          )
        `;
        params.push(tag);
      }
      
      // Add search filter if specified
      if (search) {
        query += `
          AND (
            t.title LIKE ? 
            OR t.content LIKE ?
          )
        `;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern);
      }
      
      // Get total count for pagination
      const [countResult] = await pool.query(`SELECT COUNT(*) as total FROM (${query}) as countQuery`, params);
      const total = countResult[0].total;
      
      // Add pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      
      // Execute final query
      console.log('Executing blog posts query...');
      const [posts] = await pool.query(query, params);
      console.log(`Retrieved ${posts.length} posts from database`);
      
      // Process posts to add missing fields
      const processedPosts = await Promise.all(posts.map(async (post) => {
        try {
          // Get tags for this post
          const [tags] = await pool.query(`
            SELECT t.id, t.name, t.slug
            FROM cms_tags t
            INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
          `, [post.id]);
          
          // Generate excerpt from content (since it's not in the database)
          const excerpt = generateExcerpt(post.content);
          
          return {
            id: post.id,
            slug: post.slug,
            featured_image: post.featured_image || null,
            author_id: post.author_id,
            status: post.status,
            created_at: post.created_at,
            updated_at: post.updated_at,
            published_at: post.published_at,
            tags: tags || [],
            translation: {
              title: post.title,
              content: post.content,
              excerpt: excerpt,
              language_code: post.language_code
            }
          };
        } catch (err) {
          console.error(`Error processing post ID ${post.id}:`, err);
          // Return basic post even if tags fail
          return {
            id: post.id,
            slug: post.slug,
            featured_image: post.featured_image || null,
            author_id: post.author_id,
            status: post.status,
            created_at: post.created_at,
            updated_at: post.updated_at,
            published_at: post.published_at,
            tags: [],
            translation: {
              title: post.title,
              content: post.content,
              excerpt: generateExcerpt(post.content),
              language_code: post.language_code
            }
          };
        }
      }));
      
      // Prepare response
      const response = {
        posts: processedPosts,
        total_pages: Math.ceil(total / limit),
        pagination: {
          total: total,
          page: page,
          per_page: limit,
          pages: Math.ceil(total / limit)
        }
      };
      
      console.log('Successfully returning blog posts');
      return res.json(response);
    } catch (dbError) {
      console.error('Database error when fetching blog posts:', dbError);
      console.error(dbError.stack);
      console.warn('Falling back to mock blog data');
      return serveMockBlogListing(req, res);
    }
  } catch (error) {
    console.error('Unhandled error in blog listing API:', error);
    console.error(error.stack);
    return res.status(500).json({
      error: 'Failed to fetch blog data',
      message: error.message
    });
  }
});

// GET /api/cms/blog/:slug - Get single blog post
app.get('/api/cms/blog/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    const language = req.query.language || 'en';
    
    console.log(`Blog post request: slug=${slug}, language=${language}`);
    
    if (!pool) {
      console.warn('Database connection not available, serving mock data');
      return serveMockBlogPost(slug, language, res);
    }
    
    try {
      // Get post with translation
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
        console.log(`Post not found: ${slug}`);
        return serveMockBlogPost(slug, language, res);
      }
      
      const post = posts[0];
      console.log(`Found post: ${post.title}`);
      
      // Generate excerpt from content
      const excerpt = generateExcerpt(post.content);
      
      // Get the post author
      let author = { id: post.author_id, name: 'iMagenWiz Team', avatar: null };
      try {
        const [authors] = await pool.query(`
          SELECT id, name, avatar FROM cms_authors WHERE id = ?
        `, [post.author_id]);
        
        if (authors.length > 0) {
          author = authors[0];
        }
      } catch (err) {
        console.warn('Error fetching author, using default:', err.message);
      }
      
      // Get tags for the post
      let tags = [];
      try {
        const [tagResults] = await pool.query(`
          SELECT t.id, t.name, t.slug
          FROM cms_tags t
          INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
          WHERE pt.post_id = ?
        `, [post.id]);
        tags = tagResults;
      } catch (err) {
        console.warn('Error fetching tags:', err.message);
      }
      
      // Get available languages for this post
      let languages = [{ code: language, name: 'English', is_default: true }];
      try {
        const [languageResults] = await pool.query(`
          SELECT l.code, l.name, l.is_default
          FROM cms_languages l
          INNER JOIN cms_post_translations t ON l.code = t.language_code
          WHERE t.post_id = ?
        `, [post.id]);
        
        if (languageResults.length > 0) {
          languages = languageResults;
        }
      } catch (err) {
        console.warn('Error fetching languages:', err.message);
      }
      
      // Get related posts (same tag, different post)
      let relatedPosts = [];
      try {
        const [relatedResults] = await pool.query(`
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
        
        relatedPosts = await Promise.all(relatedResults.map(async (relatedPost) => {
          // Get tags for related post
          let relatedTags = [];
          try {
            const [tagResults] = await pool.query(`
              SELECT t.id, t.name, t.slug
              FROM cms_tags t
              INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
              WHERE pt.post_id = ?
            `, [relatedPost.id]);
            relatedTags = tagResults;
          } catch (err) {
            console.warn(`Error fetching tags for related post ${relatedPost.id}:`, err.message);
          }
          
          // Generate excerpt from content
          const relatedExcerpt = generateExcerpt(relatedPost.content);
          
          return {
            id: relatedPost.id,
            slug: relatedPost.slug,
            featured_image: relatedPost.featured_image || null,
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
      } catch (err) {
        console.warn('Error fetching related posts:', err.message);
      }
      
      // Format final response
      const response = {
        post: {
          id: post.id,
          slug: post.slug,
          title: post.title,
          content: post.content,
          excerpt: excerpt,
          meta_description: excerpt,
          featured_image: post.featured_image || null,
          created_at: post.created_at,
          updated_at: post.updated_at,
          published_at: post.published_at,
          author: author,
          tags: tags
        },
        related_posts: relatedPosts,
        available_languages: languages,
        current_language: language
      };
      
      console.log('Successfully returning blog post');
      return res.json(response);
    } catch (dbError) {
      console.error('Database error when fetching blog post:', dbError);
      console.error(dbError.stack);
      console.warn('Falling back to mock blog post data');
      return serveMockBlogPost(slug, language, res);
    }
  } catch (error) {
    console.error('Unhandled error in blog post API:', error);
    console.error(error.stack);
    return res.status(500).json({
      error: 'Failed to fetch blog post',
      message: error.message
    });
  }
});

// GET /api/cms/tags - Get all tags
app.get('/api/cms/tags', async (req, res) => {
  try {
    console.log('Tags request received');
    
    if (!pool) {
      console.warn('Database connection not available, serving mock data');
      return serveMockTags(res);
    }
    
    try {
      // Get all tags with post count
      const [tags] = await pool.query(`
        SELECT t.id, t.name, t.slug, COUNT(pt.post_id) as count
        FROM cms_tags t
        LEFT JOIN cms_post_tags pt ON t.id = pt.tag_id
        GROUP BY t.id
        ORDER BY count DESC
      `);
      
      console.log(`Successfully retrieved ${tags.length} tags`);
      return res.json({ tags });
    } catch (dbError) {
      console.error('Database error when fetching tags:', dbError);
      console.error(dbError.stack);
      console.warn('Falling back to mock tags data');
      return serveMockTags(res);
    }
  } catch (error) {
    console.error('Unhandled error in tags API:', error);
    console.error(error.stack);
    return res.status(500).json({
      error: 'Failed to fetch tags',
      message: error.message
    });
  }
});

// MOCK DATA HANDLERS

// Serve mock blog listing
function serveMockBlogListing(req, res) {
  const language = req.query.language || 'en';
  const page = parseInt(req.query.page || '1');
  const limit = parseInt(req.query.limit || '10');
  
  console.log(`Serving mock blog listing: language=${language}, page=${page}, limit=${limit}`);
  
  // Mock blog posts
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
  
  // Prepare response
  const response = {
    posts: posts,
    total_pages: 1,
    pagination: {
      total: posts.length,
      page: page,
      per_page: limit,
      pages: 1
    }
  };
  
  console.log('Returning mock blog data');
  return res.json(response);
}

// Serve mock blog post
function serveMockBlogPost(slug, language, res) {
  console.log(`Serving mock blog post: ${slug}, language=${language}`);
  
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
    
    // Send response
    const response = {
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
    };
    
    return res.json(response);
  } else {
    return res.status(404).json({ error: 'Blog post not found' });
  }
}

// Serve mock tags
function serveMockTags(res) {
  console.log('Serving mock tags');
  
  const tags = [
    { id: 1, name: 'Tutorial', slug: 'tutorial', count: 1 },
    { id: 2, name: 'Advanced', slug: 'advanced', count: 1 },
    { id: 3, name: 'Productivity', slug: 'productivity', count: 1 },
    { id: 4, name: 'AI Technology', slug: 'ai-technology', count: 2 },
    { id: 5, name: 'Background Removal', slug: 'background-removal', count: 2 }
  ];
  
  return res.json({ tags });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: pool ? 'connected' : 'disconnected',
    endpoints: ['/api/cms/blog', '/api/cms/blog/:slug', '/api/cms/tags']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: err.message
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Blog API Server running at http://0.0.0.0:${PORT}/`);
  console.log(`Database connection: ${pool ? 'ACTIVE' : 'INACTIVE (will use mock data)'}`);
  console.log(`Available endpoints:`);
  console.log(`  Blog: /api/cms/blog, /api/cms/blog/:slug, /api/cms/tags`);
  console.log(`  Health: /api/health`);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
  console.error(err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
  process.exit(1);
}); 