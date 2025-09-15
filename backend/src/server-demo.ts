import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import apiRoutes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route with Business Jarvis branding
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Business Jarvis - AI IT Communications Assistant',
    version: '1.0.0',
    features: [
      '� Intelligent IT issue analysis',
      '� Emergency contractor routing', 
      '� 24/7 system monitoring',
      '� Cost tracking & optimization'
    ],
    value_proposition: {
      traditional_it_cost: '$8,000-11,000/month',
      business_jarvis_cost: '$800-2,200/month',
      annual_savings: '$50,000-105,000',
      roi: '300-1,800% in first year',
      response_time: '< 30 seconds',
      availability: '24/7/365'
    },
    demo_mode: true,
    tagline: 'Like ADT for your business IT'
  });
});

// API routes
app.use('/api', apiRoutes);

// Start server without complex n8n initialization
function startServer() {
  app.listen(PORT, () => {
    console.log('� Business Jarvis - AI IT Communications Assistant');
    console.log('===================================================');
    console.log(`� Server running on port ${PORT}`);
    console.log(`� Health check: http://localhost:${PORT}/health`);
    console.log(`� API endpoints: http://localhost:${PORT}/api`);
    console.log(`� Demo mode active - ready for presentation!`);
    console.log('');
    console.log('� Business Jarvis Features:');
    console.log('   � Intelligent IT issue analysis');
    console.log('   � Emergency contractor routing');
    console.log('   � 24/7 system monitoring');
    console.log('   � Cost tracking & optimization');
    console.log('');
    console.log('� Value Proposition:');
    console.log('   • Replace $8K-11K/month IT teams');
    console.log('   • Pay only $800-2,200/month');
    console.log('   • Save $50K-105K annually');
    console.log('   • Get < 30 second response times');
    console.log('');
    console.log('✅ Ready for demo at http://localhost:3000');
  });
}

startServer();

export default app;
