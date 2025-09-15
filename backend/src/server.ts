import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';
import { WorkflowService } from './services/workflowService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Tech Match Workflow API with n8n integration is running!',
    n8nEditor: 'http://localhost:5678'
  });
});

// API routes
app.use('/api', apiRoutes);

// Initialize and start server
async function startServer() {
  try {
    // Initialize n8n workflow engine
    console.log('Ì¥ß Initializing n8n workflow engine...');
    await WorkflowService.initialize();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Ì∫Ä Server is running on port ${PORT}`);
      console.log(`Ì≥ä Health check: http://localhost:${PORT}/health`);
      console.log(`Ì¥ó API endpoints: http://localhost:${PORT}/api`);
      console.log(`Ìæ® n8n Editor: http://localhost:5678`);
      console.log(`‚úÖ Tech Match Workflow with n8n integration ready!`);
    });
  } catch (error) {
    console.error('‚ùå Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
