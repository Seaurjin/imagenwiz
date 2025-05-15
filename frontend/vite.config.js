import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables from .env file
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_PORT || '3000'), // Frontend will run on 3000
      strictPort: true, // Ensure it uses port 3000 or fails
      proxy: {
        // Auth API proxy - direct to the main Python backend
        '/api/auth': {
          target: env.VITE_API_PROXY || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Auth request:', req.method, req.url, '->', proxyReq.path);
            });
          }
        },
        // Specific rule for AI content generation - direct to Python backend
        '/api/cms/posts/generate-content': {
          target: env.VITE_API_PROXY || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] AI Generate Content request:', req.method, req.url, '->', proxyReq.path);
            });
             proxy.on('error', (err, _req, _res) => {
              console.log('[Vite Proxy] AI Generate Content proxy error', err);
            });
          }
        },
        // CMS Posts CRUD (Create, Update, Delete) and related actions like auto-translate - direct to Python backend
        '/api/cms/posts': { // This will catch /api/cms/posts, /api/cms/posts/12, /api/cms/posts/12/auto-translate etc.
          target: env.VITE_API_PROXY || 'http://localhost:5001', 
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] CMS Posts & Actions request (to Python):', req.method, req.url, '->', proxyReq.path);
            });
             proxy.on('error', (err, _req, _res) => {
              console.error('[Vite Proxy] CMS Posts & Actions proxy error:', err);
            });
          }
        },
        // CMS/Blog API proxy (for other /api/cms/* like /api/cms/blog, /api/cms/tags) - to blog proxy node service
        '/api/cms': {
          target: env.VITE_BLOG_PROXY || 'http://localhost:4002',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Other CMS/Blog request (to Blog Proxy):', req.method, req.url, '->', proxyReq.path);
            });
          }
        },
        // All other /api calls - direct to Python backend
        '/api': {
          target: env.VITE_API_PROXY || 'http://localhost:5001',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Generic API request:', req.method, req.url, '->', proxyReq.path);
            });
          }
        }
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      rollupOptions: {
        input: path.resolve(__dirname, 'index.html')
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
