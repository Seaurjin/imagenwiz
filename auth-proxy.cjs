/**
 * Auth API Proxy Service
 * 
 * This service handles authentication endpoints on port 3003,
 * which is separate from the blog proxy running on port 3002.
 */

const express = require('express');
const cors = require('cors');

// Create Express app
const app = express();

// Add middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Request logging middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  console.log(`[${new Date().toISOString()}] Auth Request: ${req.method} ${req.url}`);
  next();
});

// Mock users database
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    role: 'admin',
    isAdmin: true,  // Add explicit isAdmin flag for frontend
    is_admin: true  // Add snake_case version for frontend compatibility
  },
  {
    id: 2,
    username: 'testuser2',
    password: 'password123',
    email: 'test@example.com',
    role: 'user',
    isAdmin: false,
    is_admin: false  // Add snake_case version for frontend compatibility
  }
];

// Store active tokens for user lookup
const activeTokens = {};

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
    
    // Store token-user mapping for later lookup
    activeTokens[token] = user.id;
    
    console.log(`[Auth API] Login successful for user: ${username}, role: ${user.role}, isAdmin: ${user.isAdmin}`);
    
    // Return success response with explicit admin status in both formats
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,     // camelCase for API compatibility
        is_admin: user.isAdmin,    // snake_case for frontend compatibility
        admin: user.isAdmin,       // additional admin field for compatibility
        adminStatus: user.isAdmin ? 'active' : 'inactive' // Add adminStatus field
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
  
  // Get token from authorization header
  const token = authHeader.split(' ')[1];
  
  // Find user based on token
  // In a real app we would decode the JWT, but here we use our activeTokens map
  const userId = activeTokens[token];
  let user;
  
  if (userId) {
    user = users.find(u => u.id === userId);
  }
  
  // If no valid user found, fall back to admin for demo purposes
  if (!user) {
    user = users[0]; // Default to admin
    console.log(`[Auth API] Warning: No valid user found for token, defaulting to admin`);
  }
  
  console.log(`[Auth API] User profile requested, returning data for: ${user.username}, role: ${user.role}, isAdmin: ${user.isAdmin}`);
  
  // Return user with explicit admin status in both formats
  return res.status(200).json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,     // camelCase for API compatibility
      is_admin: user.isAdmin,    // snake_case for frontend compatibility
      admin: user.isAdmin,       // additional admin field for compatibility
      adminStatus: user.isAdmin ? 'active' : 'inactive' // Add adminStatus field
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
    role: 'user',
    isAdmin: false,
    is_admin: false  // Add snake_case version for frontend compatibility
  };
  
  // Add to mock database
  users.push(newUser);
  
  // Generate token
  const token = `mock_token_${Date.now()}_${newUser.id}`;
  
  // Store token
  activeTokens[token] = newUser.id;
  
  console.log(`[Auth API] Registration successful for user: ${username}`);
  
  // Return success response with both admin formats
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      isAdmin: newUser.isAdmin,   // camelCase for API compatibility
      is_admin: newUser.isAdmin,  // snake_case for frontend compatibility
      adminStatus: 'inactive'
    },
    access_token: token,
    token_type: 'Bearer'
  });
});

// Start the server
const PORT = process.env.AUTH_PROXY_PORT || process.env.PORT || 3001; // Prioritize AUTH_PROXY_PORT, then PORT, then default to 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth API Server running at http://0.0.0.0:${PORT}/`);
}); 