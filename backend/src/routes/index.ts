import express from 'express';
import authRoutes from './auth';
import workflowRoutes from './workflows';

const router = express.Router();

// API routes
router.use('/auth', authRoutes);
router.use('/workflows', workflowRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Tech Match Workflow API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      workflows: '/api/workflows'
    }
  });
});

export default router;
