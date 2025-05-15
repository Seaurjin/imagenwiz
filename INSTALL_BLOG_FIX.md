# Installing the Blog API Fix

This guide explains how to install and use the Blog API fix for iMagenWiz.

## Prerequisites

- Node.js 14+ installed
- npm or yarn package manager
- Access to the iMagenWiz source code

## Installation Steps

### 1. Install Required Dependencies

```bash
# In the project root directory
npm install http-proxy-middleware express axios
```

### 2. Integrate the Blog API Proxy

You have two options to integrate the proxy:

#### Option A: Use as a Standalone Proxy Server

1. Copy the `blog-api-fix.js` file to your project root directory.

2. Start the proxy server:
   ```bash
   node blog-api-fix.js
   ```

3. Configure your frontend to connect to this proxy (usually on port 3000).

#### Option B: Integrate into Existing Proxy

1. If you already have an Express server or proxy, import the blog-api-fix module:

   ```javascript
   // In your existing proxy/server file
   const blogApiRouter = require('./blog-api-fix');
   
   // Mount the blog API router at the appropriate path
   app.use('/', blogApiRouter);
   ```

2. Restart your existing proxy server.

### 3. Configure Environment Variables (Optional)

You can customize the behavior by setting environment variables:

```bash
# Set Flask backend URL (if different from localhost:5000)
export FLASK_BACKEND_URL=http://your-flask-server:5000

# Set proxy port (if using standalone mode)
export PORT=3000
```

### 4. Test the Blog API

After installing and starting the proxy, test that it's working:

```bash
# Using curl
curl http://localhost:3000/api/cms/blog

# Or open in browser
# http://localhost:3000/api/cms/blog
```

You should see a JSON response with blog posts.

## Troubleshooting

### 1. CORS Issues

If you encounter CORS issues, make sure your Express server includes proper CORS headers:

```javascript
const cors = require('cors');
app.use(cors());
```

### 2. Connection Refused

If you see "Connection Refused" errors:
- Ensure the Flask backend is running
- Check that the FLASK_BACKEND_URL points to the correct server
- Verify network connectivity between the proxy and Flask server

### 3. Missing Dependencies

If you see errors about missing modules, install the required dependencies:

```bash
npm install http-proxy-middleware express axios cors
```

### 4. Proxy Returns 404 for Blog Posts

If the proxy returns 404 for blog posts:
- Verify the Flask server has the blog routes implemented
- Check the MySQL database has blog content
- Make sure the proxy routes are correctly configured

## Testing with Mock Data

The proxy includes fallback mock data that will be used if the Flask backend is unavailable.

To force using mock data (for testing), you can temporarily modify the `blog-api-fix.js` file:

```javascript
// Find this line:
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:5000';

// Change to a non-existent server:
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || 'http://localhost:9999';
```

This will cause the proxy to fail connecting to the Flask backend and use the mock data instead.

## Additional Configuration

### Custom Image Paths

If your blog post images are stored in a different location, modify the mock data:

```javascript
// In blog-api-fix.js, find:
featured_image: '/images/blog/getting-started.jpg',

// Change to your image path:
featured_image: '/static/uploads/blog/getting-started.jpg',
```

### Adding More Mock Posts

To add more mock posts, extend the `posts` array in the `provideMockBlogData` function and the `mockPosts` object in the `provideMockBlogPostBySlug` function. 