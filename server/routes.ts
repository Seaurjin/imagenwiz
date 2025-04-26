import express from 'express';
import { storage } from './storage';
import { insertUserSchema, insertBlogPostSchema, insertBlogTranslationSchema, insertLanguageSchema, insertSettingSchema } from '../shared/schema';
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
    if (!user || !user.isAdmin) {
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
      token
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
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    // Get user
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.status(200).json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog routes
router.get('/blog/posts', async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const posts = await storage.getBlogPosts(limit, offset);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/blog/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await storage.getBlogPostBySlug(slug);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Get translations
    const translations = await storage.getBlogTranslations(post.id);
    
    res.status(200).json({
      ...post,
      translations
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/blog/posts', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = insertBlogPostSchema.parse(req.body);
    const post = await storage.createBlogPost(data);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/blog/translations', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = insertBlogTranslationSchema.parse(req.body);
    
    // Check if post exists
    const post = await storage.getBlogPost(data.postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if translation already exists
    const existingTranslation = await storage.getBlogTranslation(data.postId, data.langCode);
    if (existingTranslation) {
      return res.status(400).json({ error: 'Translation already exists' });
    }
    
    const translation = await storage.createBlogTranslation(data);
    res.status(201).json(translation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
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

router.post('/languages', authenticate, requireAdmin, async (req, res) => {
  try {
    const data = insertLanguageSchema.parse(req.body);
    
    // Check if language already exists
    const existingLanguage = await storage.getLanguageByCode(data.code);
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