import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all workflow routes
router.use(authenticateToken);

// Get all workflows for the user's organization
router.get('/', async (req, res) => {
  try {
    const workflows = await prisma.workflow.findMany({
      where: { organizationId: req.user!.organizationId },
      include: {
        runs: {
          take: 5,
          orderBy: { startedAt: 'desc' }
        }
      }
    });
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new workflow
router.post('/', async (req, res) => {
  try {
    const { name, description, definition } = req.body;

    if (!name || !definition) {
      return res.status(400).json({ error: 'Name and definition are required' });
    }

    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        definition: JSON.stringify(definition),
        organizationId: req.user!.organizationId
      }
    });

    res.status(201).json(workflow);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Execute a workflow (Business Jarvis demo simulation)
router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    // Create workflow run record
    const workflowRun = await prisma.workflowRun.create({
      data: {
        workflowId: id,
        userId: req.user!.userId,
        status: 'RUNNING',
        input: input ? JSON.stringify(input) : null
      }
    });

    // Simulate Business Jarvis processing
    console.log('í´– Business Jarvis analyzing issue...');
    
    // Simulate processing time for demo effect
    setTimeout(async () => {
      try {
        await prisma.workflowRun.update({
          where: { id: workflowRun.id },
          data: {
            status: 'COMPLETED',
            output: JSON.stringify({
              severity: 'critical',
              ticketId: `JARVIS-${Date.now()}`,
              contractorAlerted: true,
              userNotified: true,
              responseTime: '< 30 seconds',
              estimatedResolution: '15 minutes',
              costSavings: {
                traditionalIT: '$500 emergency call',
                businessJarvis: '$50 automated response',
                savings: '$450 per incident'
              },
              autoActions: [
                'í³± Emergency contractor SMS sent to +1-555-IT-HELP',
                'í¾« Support ticket #JARVIS-' + Date.now() + ' created',
                'í³§ User notification sent to ' + (input?.userEmail || 'user@company.com'),
                'í²° Cost tracked: $50 vs $500 traditional response',
                'í³Š Executive dashboard updated with incident metrics'
              ],
              businessJarvisAdvantages: [
                'âš¡ 30x faster than traditional IT response',
                'í²° 90% cost reduction vs hiring IT staff',
                'í¼™ 24/7 coverage vs 9-5 business hours',
                'í¾¯ Intelligent routing vs random assignment'
              ]
            }),
            finishedAt: new Date()
          }
        });
        console.log('âœ… Business Jarvis completed workflow execution');
      } catch (updateError) {
        console.error('Error updating workflow run:', updateError);
      }
    }, 2000);

    res.json({ 
      runId: workflowRun.id, 
      status: 'started',
      message: 'Business Jarvis is analyzing and processing your request...',
      estimatedCompletion: '< 30 seconds'
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get workflow execution history
router.get('/:id/runs', async (req, res) => {
  try {
    const { id } = req.params;
    const runs = await prisma.workflowRun.findMany({
      where: { workflowId: id },
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { startedAt: 'desc' }
    });
    res.json(runs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create Business Jarvis sample workflow (for demo)
router.post('/sample', async (req, res) => {
  try {
    const sampleDefinition = {
      id: 'business-jarvis-it-assistant',
      name: 'Business Jarvis - IT Team Replacement',
      type: 'business-jarvis',
      description: 'AI-powered IT issue analysis and contractor routing system',
      features: [
        'í´– Intelligent severity analysis using AI',
        'í³± Emergency contractor SMS alerts',
        'í¾« Automatic support ticket creation',
        'í³§ Real-time user notification system',
        'í²° Cost tracking and ROI optimization',
        'í³Š Executive dashboard with real-time metrics'
      ],
      costComparison: {
        traditionalIT: {
          monthlyStaff: '$8,000',
          emergencyCalls: '$500 per incident',
          tools: '$1,000',
          total: '$11,000+/month'
        },
        businessJarvis: {
          platform: '$800',
          contractors: '$1,200 (as needed)',
          tools: '$200',
          total: '$2,200/month'
        },
        savings: {
          monthly: '$8,800',
          annual: '$105,600',
          roi: '480% in first year'
        }
      },
      performance: {
        responseTime: '< 30 seconds',
        availability: '24/7/365',
        accuracy: '99.9%',
        customerSatisfaction: '4.9/5 stars'
      }
    };

    const workflow = await prisma.workflow.create({
      data: {
        name: 'Business Jarvis - IT Team Replacement Demo',
        description: 'AI-powered IT assistant that replaces expensive IT teams. Like ADT for your business IT - 24/7 protection at a fraction of the cost.',
        definition: JSON.stringify(sampleDefinition),
        organizationId: req.user!.organizationId
      }
    });

    res.status(201).json(workflow);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
