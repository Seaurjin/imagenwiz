/**
 * Environment Variable Loading Test Script
 * 
 * This script verifies that our services properly load environment variables
 * from .env files. It helps identify any remaining hardcoded values.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Test root .env loading
console.log('=== TESTING ROOT .ENV LOADING ===');
dotenv.config({ path: '.env' });
console.log('BACKEND_PORT:', process.env.BACKEND_PORT);
console.log('PROXY_PORT:', process.env.PROXY_PORT);
console.log('FRONTEND_PORT:', process.env.FRONTEND_PORT);
console.log('BLOG_PROXY_PORT:', process.env.BLOG_PROXY_PORT);
console.log('AUTH_PROXY_PORT:', process.env.AUTH_PROXY_PORT);
console.log('UNIFIED_SERVER_PORT:', process.env.UNIFIED_SERVER_PORT);

// Test frontend .env loading
console.log('\n=== TESTING FRONTEND .ENV LOADING ===');
dotenv.config({ path: 'frontend/.env', override: true });
console.log('VITE_PORT:', process.env.VITE_PORT);
console.log('VITE_API_PROXY:', process.env.VITE_API_PROXY);
console.log('VITE_AUTH_PROXY:', process.env.VITE_AUTH_PROXY);
console.log('VITE_BLOG_PROXY:', process.env.VITE_BLOG_PROXY);
console.log('VITE_IMAGE_PROCESSING_API:', process.env.VITE_IMAGE_PROCESSING_API);
console.log('VITE_STRIPE_PUBLISHABLE_KEY:', process.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Key exists (not showing for security)' : 'Missing');

// Test if the proxy configs are properly using environment variables
console.log('\n=== TESTING BACKEND CONFIG ===');
try {
  // Simulate backend startup to check if it uses environment variables
  const runPy = fs.readFileSync('backend/run.py', 'utf8');
  if (runPy.includes('port = int(os.environ.get(\'BACKEND_PORT\', 5000))')) {
    console.log('✅ backend/run.py: Properly using BACKEND_PORT environment variable');
  } else {
    console.log('❌ backend/run.py: Not using BACKEND_PORT environment variable correctly');
  }

  const initPy = fs.readFileSync('backend/app/__init__.py', 'utf8');
  if (initPy.includes('frontend_port = os.environ.get(\'FRONTEND_PORT\', \'3000\')')) {
    console.log('✅ backend/app/__init__.py: Properly using FRONTEND_PORT environment variable');
  } else {
    console.log('❌ backend/app/__init__.py: Not using FRONTEND_PORT environment variable correctly');
  }
} catch (error) {
  console.error('Error checking backend config:', error.message);
}

// Test if the blog proxy config is properly using environment variables
console.log('\n=== TESTING BLOG PROXY CONFIG ===');
try {
  const blogProxy = fs.readFileSync('blog-api-proxy-with-db.cjs', 'utf8');
  if (blogProxy.includes('const PORT = process.env.BLOG_PROXY_PORT || process.env.PORT || 3002')) {
    console.log('✅ blog-api-proxy-with-db.cjs: Properly using BLOG_PROXY_PORT environment variable');
  } else {
    console.log('❌ blog-api-proxy-with-db.cjs: Not using BLOG_PROXY_PORT environment variable correctly');
  }
} catch (error) {
  console.error('Error checking blog proxy config:', error.message);
}

// Test if the unified server config is properly using environment variables
console.log('\n=== TESTING UNIFIED SERVER CONFIG ===');
try {
  const unifiedServer = fs.readFileSync('unified-server.cjs', 'utf8');
  if (unifiedServer.includes('const PORT = process.env.UNIFIED_SERVER_PORT || process.env.PORT || 3002')) {
    console.log('✅ unified-server.cjs: Properly using UNIFIED_SERVER_PORT environment variable');
  } else {
    console.log('❌ unified-server.cjs: Not using UNIFIED_SERVER_PORT environment variable correctly');
  }
} catch (error) {
  console.error('Error checking unified server config:', error.message);
}

// Test if Vite config properly uses environment variables
console.log('\n=== TESTING VITE CONFIG ===');
try {
  const viteConfig = fs.readFileSync('frontend/vite.config.js', 'utf8');
  if (viteConfig.includes('port: parseInt(env.VITE_PORT || \'3000\')')) {
    console.log('✅ frontend/vite.config.js: Properly using VITE_PORT environment variable');
  } else {
    console.log('❌ frontend/vite.config.js: Not using VITE_PORT environment variable correctly');
  }

  if (viteConfig.includes('target: env.VITE_AUTH_PROXY || \'http://localhost:3003\'')) {
    console.log('✅ frontend/vite.config.js: Properly using VITE_AUTH_PROXY environment variable');
  } else {
    console.log('❌ frontend/vite.config.js: Not using VITE_AUTH_PROXY environment variable correctly');
  }

  if (viteConfig.includes('target: env.VITE_BLOG_PROXY || \'http://localhost:3002\'')) {
    console.log('✅ frontend/vite.config.js: Properly using VITE_BLOG_PROXY environment variable');
  } else {
    console.log('❌ frontend/vite.config.js: Not using VITE_BLOG_PROXY environment variable correctly');
  }

  if (viteConfig.includes('target: env.VITE_API_PROXY || \'http://localhost:5000\'')) {
    console.log('✅ frontend/vite.config.js: Properly using VITE_API_PROXY environment variable');
  } else {
    console.log('❌ frontend/vite.config.js: Not using VITE_API_PROXY environment variable correctly');
  }
} catch (error) {
  console.error('Error checking Vite config:', error.message);
}

// Check for service dependencies
console.log('\n=== TESTING PORT AVAILABILITY ===');
const { execSync } = require('child_process');
try {
  const netstatOutput = execSync('netstat -an | grep LISTEN').toString();
  
  const usedPorts = [3000, 3001, 3002, 3003, 5000].map(port => {
    const isInUse = netstatOutput.includes(`:${port} `);
    return { port, inUse: isInUse };
  });
  
  usedPorts.forEach(({ port, inUse }) => {
    console.log(`Port ${port}: ${inUse ? '❌ In use (may cause conflicts)' : '✅ Available'}`);
  });
} catch (error) {
  console.error('Error checking port availability:', error.message);
}

console.log('\n=== TESTING COMPLETED ==='); 