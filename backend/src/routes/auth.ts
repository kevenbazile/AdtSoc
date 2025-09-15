import express from 'express';
import { AuthService } from '../services/authService';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt with data:', req.body);
    
    const { email, name, password, organizationName } = req.body;

    if (!email || !name || !password) {
      console.log('Missing required fields:', { email: !!email, name: !!name, password: !!password });
      return res.status(400).json({ error: 'Email, name, and password are required' });
    }

    console.log('Attempting to register user:', { email, name, organizationName });
    
    const result = await AuthService.register({
      email,
      name,
      password,
      organizationName
    });

    console.log('Registration successful:', result.user.email);
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed',
      details: error.code || 'Unknown error'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
});

export default router;
