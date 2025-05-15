/**
 * Simple Authentication Server (CommonJS)
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
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error occurred:', err);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error',
    error: err.message 
  });
});

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
  try {
    const { username, password } = req.body;
    
    console.log(`Login attempt: username=${username}, password=${password}`);
    
    // Find user
    const user = users.find(u => 
      (u.username === username || u.email === username) && 
      u.password === password
    );
    
    if (user) {
      // Generate mock token
      const token = `mock_token_${Date.now()}_${user.id}`;
      
      console.log(`Login successful for user: ${username}`);
      
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
    console.log(`Login failed for user: ${username}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// User profile endpoint
app.get('/api/auth/user', (req, res) => {
  try {
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
    
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('User profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth server running at http://0.0.0.0:${PORT}/`);
  console.log(`Available users: ${users.map(u => u.username).join(', ')}`);
}); 