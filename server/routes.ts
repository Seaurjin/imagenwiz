import express from 'express';
import { storage } from './storage';
import { 
  users, processingJobs, payments, settings, languages,
  insertUserSchema, insertProcessingJobSchema, insertPaymentSchema, 
  insertLanguageSchema, insertSettingSchema
} from '@shared/schema';
import bcrypt from 'bcrypt';
import * as z from 'zod';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development';

// Authentication middleware
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    
    const user = await storage.getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin middleware
const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Forbidden' });
  }
};

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth routes
router.post('/auth/register', async (req, res) => {
  try {
    const data = insertUserSchema.parse(req.body);
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(data.username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const existingEmail = await storage.getUserByEmail(data.email);
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    // Create user
    const user = await storage.createUser({
      ...data,
      password: hashedPassword
    });
    
    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json({
      user: userWithoutPassword,
      access_token: token
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', JSON.stringify({...req.body, password: '***'}));
    
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      console.log('Login error: Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Get user
    console.log('Looking up user:', username);
    const user = await storage.getUserByUsername(username);
    if (!user) {
      console.log('Login error: User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('User found, checking password');
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login error: Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Password valid, creating token');
    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log('Login successful for user:', username);
    res.status(200).json({
      user: userWithoutPassword,
      access_token: token
    });
  } catch (error) {
    console.error('Login error - DETAILED:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// Processing job routes
router.post('/processing-jobs', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const data = insertProcessingJobSchema.parse(req.body);
    
    // Check if user has enough credits
    if (user.credits <= 0) {
      return res.status(400).json({ error: 'Insufficient credits' });
    }
    
    // Create processing job
    const job = await storage.createProcessingJob({
      ...data,
      userId: user.id
    });
    
    // Deduct 1 credit for the job
    await storage.updateUserCredits(user.id, user.credits - 1);
    
    res.status(201).json(job);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/processing-jobs', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const jobs = await storage.getProcessingJobsByUser(user.id);
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/processing-jobs/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    const job = await storage.getProcessingJob(parseInt(id));
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if job belongs to user
    if (job.userId !== user.id && user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment routes
router.post('/payments', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const data = insertPaymentSchema.parse(req.body);
    
    // Create payment record
    const payment = await storage.createPayment({
      ...data,
      userId: user.id
    });
    
    // If payment status is completed, add credits to user
    if (payment.status === 'completed') {
      await storage.updateUserCredits(user.id, user.credits + payment.credits);
    }
    
    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User routes
router.get('/auth/user', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    // Remove sensitive data
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Special admin setup endpoint for initial configuration
// WARNING: In production, this should be secured or removed after initial setup
router.post('/auth/setup-admin', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    
    // Update the user's role to admin
    const updatedUser = await storage.updateUserRole(user.id, 'admin');
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({ 
      message: 'User has been set up as admin', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error setting up admin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user role to admin
router.post('/auth/make-admin', authenticate, requireAdmin, async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    // Get user by username
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user role to admin
    const updatedUser = await storage.updateUserRole(user.id, 'admin');
    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user role' });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({ 
      message: 'User updated to admin', 
      user: userWithoutPassword 
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CMS endpoints
router.get('/cms/blog', authenticate, async (req, res) => {
  try {
    // Mock data for CMS blog posts
    const posts = [
      {
        id: 1,
        title: 'Getting Started with iMagenWiz',
        excerpt: 'Learn how to remove backgrounds from your images quickly.',
        content: 'Full content here...',
        slug: 'getting-started',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Advanced Background Removal Techniques',
        excerpt: 'Tips and tricks for perfect background removal.',
        content: 'Full content here...',
        slug: 'advanced-techniques',
        createdAt: new Date().toISOString()
      }
    ];
    
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/cms/tags', authenticate, async (req, res) => {
  try {
    // Mock data for CMS tags
    const tags = [
      { id: 1, name: 'Tutorial' },
      { id: 2, name: 'Advanced' },
      { id: 3, name: 'Beginner' }
    ];
    
    res.status(200).json(tags);
  } catch (error) {
    console.error('Error fetching CMS tags:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/payments', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const payments = await storage.getPaymentsByUser(user.id);
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Payment history endpoint
router.get('/payment/history', authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    
    try {
      const payments = await storage.getPaymentsByUser(user.id);
      res.status(200).json({ history: payments });
    } catch (dbError) {
      console.error('Database error when fetching payment history:', dbError);
      
      // Provide mock data if the table doesn't exist
      const mockPayments = [
        {
          id: 1,
          userId: user.id,
          amount: 1999,
          credits: 100,
          status: 'completed',
          planType: 'lite',
          isYearly: false,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        },
        {
          id: 2,
          userId: user.id,
          amount: 4999,
          credits: 500,
          status: 'completed',
          planType: 'pro',
          isYearly: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        }
      ];
      
      res.status(200).json({ history: mockPayments });
    }
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Language routes
router.get('/languages', async (req, res) => {
  try {
    const languages = await storage.getLanguages();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/languages/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const language = await storage.getLanguage(code);
    
    if (!language) {
      return res.status(404).json({ error: 'Language not found' });
    }
    
    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/languages', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = insertLanguageSchema.parse(req.body);
    
    // Check if language already exists
    const existingLanguage = await storage.getLanguage(data.code);
    if (existingLanguage) {
      return res.status(400).json({ error: 'Language already exists' });
    }
    
    const language = await storage.createLanguage(data);
    res.status(201).json(language);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Settings routes
router.get('/settings', async (req, res) => {
  try {
    const settings = await storage.getSettings();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await storage.getSetting(key);
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/settings', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = insertSettingSchema.parse(req.body);
    
    // Check if setting already exists
    const existingSetting = await storage.getSetting(data.key);
    if (existingSetting) {
      // Update instead
      const updated = await storage.updateSetting(data.key, data.value || '');
      return res.status(200).json(updated);
    }
    
    // Create new setting
    const setting = await storage.createSetting(data);
    res.status(201).json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Settings logo endpoint (special case for UI)
router.get('/settings/logo', async (req, res) => {
  try {
    const logo = await storage.getSetting('logo');
    
    if (!logo || !logo.value) {
      // Return default logo or empty response
      return res.status(200).json({ 
        darkLogo: null,
        lightLogo: null 
      });
    }
    
    try {
      // Logo value might be a JSON string with dark/light variants
      const logoData = JSON.parse(logo.value);
      res.status(200).json(logoData);
    } catch (e) {
      // If not JSON, assume it's a single logo URL
      res.status(200).json({ 
        darkLogo: logo.value,
        lightLogo: logo.value 
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;