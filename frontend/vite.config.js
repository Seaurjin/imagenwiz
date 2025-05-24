import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
    port: 3000,
    strictPort: true,
      proxy: {
      // Auth API proxy - direct to the backend
        '/api/auth': {
        target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Auth request:', req.method, req.url, '->', proxyReq.path);
            console.log('[Vite Proxy] Target URL:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('[Vite Proxy] Auth proxy error:', err);
            });
          }
        },
      // Specific rule for AI content generation - direct to backend
        '/api/cms/posts/generate-content': {
        target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] AI Generate Content request:', req.method, req.url, '->', proxyReq.path);
            console.log('[Vite Proxy] Target URL:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
            });
             proxy.on('error', (err, _req, _res) => {
              console.log('[Vite Proxy] AI Generate Content proxy error', err);
            });
          }
        },
      // CMS Posts CRUD (Create, Update, Delete) and related actions like auto-translate - direct to backend
      '/api/cms/posts': {
        target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] CMS Posts & Actions request (to Python):', req.method, req.url, '->', proxyReq.path);
            console.log('[Vite Proxy] Target URL:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
            });
             proxy.on('error', (err, _req, _res) => {
              console.error('[Vite Proxy] CMS Posts & Actions proxy error:', err);
            });
          }
        },
        // CMS/Blog API proxy (for other /api/cms/* like /api/cms/blog, /api/cms/tags) - to blog proxy node service
        '/api/cms': {
        target: 'http://localhost:4002',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Other CMS/Blog request (to Blog Proxy):', req.method, req.url, '->', proxyReq.path);
            console.log('[Vite Proxy] Target URL:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
            });
          }
        },
      // All other /api calls - direct to backend
        '/api': {
        target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('[Vite Proxy] Generic API request:', req.method, req.url, '->', proxyReq.path);
            console.log('[Vite Proxy] Target URL:', proxyReq.protocol + '//' + proxyReq.host + proxyReq.path);
          });
          proxy.on('error', (err, _req, _res) => {
            console.error('[Vite Proxy] Generic API proxy error:', err);
            });
          }
        }
      },
      // SPA fallback - serve index.html for all non-api routes
      fallback: '/index.html'
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
});
