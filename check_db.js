import mysql from 'mysql2/promise';

async function main() {
  // Database configuration
  const dbConfig = {
    host: '8.130.113.102',
    user: 'root',
    password: 'Ir%86241992',
    database: 'mat_db'
  };

  console.log('Connecting to MySQL database...');
  let connection;
  
  try {
    // Create a connection
    connection = await mysql.createConnection(dbConfig);
    console.log('Connection established successfully!');

    // Test query to get blog posts
    console.log('\nFetching blog posts...');
    const [rows] = await connection.execute(`
      SELECT 
        p.id, 
        p.slug, 
        p.status,
        t.title,
        t.language_code
      FROM cms_posts p
      INNER JOIN cms_post_translations t ON p.id = t.post_id
      WHERE p.status = 'published'
      LIMIT 10
    `);

    console.log(`\nFound ${rows.length} blog posts:`);
    rows.forEach(post => {
      console.log(`- ID: ${post.id}, Title: ${post.title}, Lang: ${post.language_code}, Slug: ${post.slug}`);
    });

    // Check available languages
    console.log('\nFetching available languages...');
    const [languages] = await connection.execute(`
      SELECT code, name, is_default 
      FROM cms_languages
    `);

    console.log(`\nFound ${languages.length} languages:`);
    languages.forEach(lang => {
      console.log(`- ${lang.code}: ${lang.name}${lang.is_default ? ' (default)' : ''}`);
    });

    // Check post tags
    console.log('\nFetching tags...');
    const [tags] = await connection.execute(`
      SELECT id, name, slug
      FROM cms_tags
    `);

    console.log(`\nFound ${tags.length} tags:`);
    tags.forEach(tag => {
      console.log(`- ${tag.id}: ${tag.name} (${tag.slug})`);
    });

  } catch (error) {
    console.error('Database error:', error);
  } finally {
    if (connection) {
      console.log('\nClosing database connection...');
      await connection.end();
    }
  }
}

main().catch(console.error); 