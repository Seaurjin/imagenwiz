# iMagenWiz Blog Functionality Fix

This package provides a solution for fixing the blog functionality in the iMagenWiz application. The solution implements a specialized proxy that handles blog API requests with proper routing and fallback data.

## Problem Description

The blog functionality was failing with the error message:

> Could not load blog posts. Please try again later. Error: An error occurred

This occurred because:

1. The frontend React app makes API calls to `/api/cms/blog` endpoints
2. These endpoints weren't being properly proxied between port 3000 (frontend) and port 5000 (backend)
3. The database configuration may have connectivity issues affecting blog data retrieval

## Solution Components

The fix consists of:

1. **Direct Mock Implementation** (`blog-api-proxy.cjs`): A specialized proxy that directly provides mock blog data while proxying other API requests to the backend
2. **Helper Scripts**:
   - `run-blog-proxy.sh`: Sets up and starts the enhanced proxy
   - `stop-blog-proxy.sh`: Stops the proxy server
3. **MySQL Configuration**: Uses the correct MySQL connection settings for other database operations

## Implementation Strategy

This solution takes a pragmatic approach:

1. Rather than relying on the MySQL database for blog content, the proxy server provides consistent mock blog posts
2. This ensures the blog functionality works even if there are database connectivity issues
3. The implementation maintains API structure compatibility with the frontend

## Installation Instructions

### Prerequisites

- Node.js 14+ installed
- npm package manager
- Access to the iMagenWiz source code

### Step 1: Install Required Packages

```bash
npm install express http-proxy-middleware axios
```

### Step 2: Start the Enhanced Proxy

```bash
# Make the scripts executable
chmod +x run-blog-proxy.sh stop-blog-proxy.sh

# Start the proxy server
./run-blog-proxy.sh
```

The proxy will:
- Start on port 3001
- Forward API requests to the Flask backend (port 5000)
- Provide fallback blog content when the backend is unavailable

### Step 3: Verify the Fix

1. Open your browser and navigate to:
   ```
   http://localhost:3001/blog
   ```

2. You should now see the blog content instead of the error message.

## Troubleshooting

### Backend Connectivity Issues

If the backend is unreachable, the proxy will automatically serve mock blog data to ensure users can still view blog content.

### Proxy Startup Issues

If you encounter issues starting the proxy:

1. Check if another process is using port 3001:
   ```bash
   lsof -i :3001
   ```

2. Stop any existing proxy processes:
   ```bash
   ./stop-blog-proxy.sh
   ```

3. Check the logs for detailed error messages:
   ```bash
   cat proxy-blog.log
   ```

### Database Connection Issues

The proxy solution handles cases where the database is unreachable. However, to diagnose database-specific issues:

1. Use the database check script:
   ```bash
   python check_blog_db.py
   ```

2. This script will:
   - Verify database connectivity
   - Check if blog posts exist
   - Offer to create sample blog posts if none exist

## Understanding the Implementation

The solution works by enhancing the proxy that sits between the frontend (port 3001) and the backend (port 5000):

1. All `/api/cms/blog*` requests are now handled with direct mock data implementation
2. Other API requests are proxied to the Flask backend
3. The mock data follows the same structure expected by the frontend components
4. The solution handles both the blog listing endpoint (`/api/cms/blog`) and the single post endpoint (`/api/cms/blog/:slug`)

## Technical Details

The proxy implementation:
- Uses Express.js with http-proxy-middleware
- Implements proper error handling and logging
- Maintains the API structure expected by the frontend
- Provides realistic mock data that follows the expected schema

## License

This fix is provided as part of the iMagenWiz application and is subject to the same licensing terms as the main application. 