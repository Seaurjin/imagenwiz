/**
 * Blog API Database Connection Test (CommonJS version)
 */

const mysql = require('mysql2/promise');

async function main() {
  // Log system info
  console.log('Node.js version:', process.version);
  console.log('Platform:', process.platform);
  
  // Database configuration
  const dbConfig = {
    host: '8.130.113.102',
    user: 'root',
    password: 'Ir%86241992',
    database: 'mat_db',
    connectTimeout: 10000 // 10 seconds
  };
  
  console.log('\nAttempting to connect to MySQL database...');
  console.log('Host:', dbConfig.host);
  console.log('Database:', dbConfig.database);
  
  try {
    // Create a connection
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection established successfully!');
    
    try {
      // Test simple query
      const [rows] = await connection.execute('SELECT 1 AS test');
      console.log('✅ Simple query test successful:', rows);
      
      // Test table existence
      console.log('\nChecking for required tables...');
      const [tables] = await connection.execute(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = ?
        AND table_name IN ('cms_posts', 'cms_post_translations', 'cms_tags', 'cms_post_tags', 'cms_languages', 'cms_authors')
      `, [dbConfig.database]);
      
      console.log(`Found ${tables.length} of 6 required tables:`);
      const foundTables = tables.map(t => t.table_name);
      console.log(foundTables);
      
      const requiredTables = ['cms_posts', 'cms_post_translations', 'cms_tags', 'cms_post_tags', 'cms_languages', 'cms_authors'];
      const missingTables = requiredTables.filter(t => !foundTables.includes(t));
      
      if (missingTables.length > 0) {
        console.log('❌ Missing tables:', missingTables);
      } else {
        console.log('✅ All required tables exist');
      }
      
      // Check if there are blog posts
      console.log('\nChecking for blog posts...');
      try {
        const [posts] = await connection.execute(`
          SELECT 
            p.id, 
            p.slug, 
            p.status,
            t.title,
            t.language_code
          FROM cms_posts p
          INNER JOIN cms_post_translations t ON p.id = t.post_id
          WHERE p.status = 'published'
          LIMIT 5
        `);
        
        console.log(`✅ Found ${posts.length} published blog posts`);
        if (posts.length > 0) {
          console.log('Sample post:');
          console.log(posts[0]);
        }
      } catch (error) {
        console.error('❌ Error querying blog posts:', error.message);
      }
      
      // Test the actual query used in the blog-api-proxy-with-db.cjs
      console.log('\nTesting blog listing query...');
      try {
        // Parameters
        const language = 'en';
        const page = 1;
        const limit = 10;
        
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
            t.excerpt,
            t.language_code
          FROM cms_posts p
          INNER JOIN cms_post_translations t ON p.id = t.post_id
          WHERE p.status = 'published'
          AND t.language_code = ?
        `;
        
        const queryParams = [language];
        
        // Count total
        const [countResult] = await connection.query(
          `SELECT COUNT(*) as total FROM (${query}) as countQuery`,
          queryParams
        );
        
        const total = countResult[0].total;
        console.log(`✅ Count query successful: ${total} posts total`);
        
        // Add pagination
        const offset = (page - 1) * limit;
        query += ` LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));
        
        // Execute main query
        const [posts] = await connection.query(query, queryParams);
        console.log(`✅ Main query successful: Retrieved ${posts.length} posts`);
        
        // Try to fetch tags for the first post (if any)
        if (posts.length > 0) {
          const firstPost = posts[0];
          const [tags] = await connection.query(`
            SELECT t.id, t.name, t.slug
            FROM cms_tags t
            INNER JOIN cms_post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
          `, [firstPost.id]);
          
          console.log(`✅ Tags query successful: Post ID ${firstPost.id} has ${tags.length} tags`);
        }
      } catch (error) {
        console.error('❌ Error executing blog listing query:', error.message);
        console.error(error);
      }
    } finally {
      await connection.end();
      console.log('\nConnection closed');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error(error);
  }
}

main().catch(console.error); 