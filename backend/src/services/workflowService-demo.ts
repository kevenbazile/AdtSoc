import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class WorkflowService {
  // Simple initialize without n8n startup issues
  static async initialize() {
    console.log('âœ… Business Jarvis workflow service initialized (Demo Mode)');
  }

  // Create a workflow (simplified for demo)
  static async createWorkflow(data: {
    name: string;
    description?: string;
    organizationId: string;
    definition: any;
  }) {
    const workflow = await prisma.workflow.create({
      data: {
        ...data,
        definition: JSON.stringify(data.definition)
      }
    });

    console.log(`âœ… Workflow created: ${workflow.name}`);
    return workflow;
  }

  // Get all workflows for an organization
  static async getWorkflows(organizationId: string) {
    return await prisma.workflow.findMany({
      where: { organizationId },
      include: {
        runs: {
          take: 5,
          orderBy: { startedAt: 'desc' }
        }
      }
    });
  }

  // Execute a workflow (demo simulation)
  static async executeWorkflow(workflowId: string, userId: string, input?: any) {
    // Create workflow run record
    const workflowRun = await prisma.workflowRun.create({
      data: {
        workflowId,
        userId,
        status: 'RUNNING',
        input: input ? JSON.stringify(input) : null
      }
    });

    // Simulate Business Jarvis processing
    console.log('í´– Business Jarvis analyzing issue...');
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Update run status
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
          autoActions: [
            'í³± Emergency contractor SMS sent',
            'í¾« Support ticket created',
            'í³§ User notification sent',
            'í²° Cost tracked: $50 vs $500 traditional'
          ]
        }),
        finishedAt: new Date()
      }
    });

    console.log(`âœ… Business Jarvis completed processing for workflow ${workflowId}`);
    return workflowRun.id;
  }

  // Get workflow execution history
  static async getWorkflowRuns(workflowId: string) {
    return await prisma.workflowRun.findMany({
      where: { workflowId },
      include: {
        steps: true,
        user: { select: { name: true, email: true } }
      },
      orderBy: { startedAt: 'desc' }
    });
  }

  // Create Business Jarvis sample workflow
  static async createSampleWorkflow(organizationId: string) {
    const sampleDefinition = {
      id: 'business-jarvis-it-assistant',
      name: 'Business Jarvis - IT Issue Reporter',
      type: 'business-jarvis',
      description: 'AI-powered IT issue analysis and contractor routing',
      features: [
        'í´– Intelligent severity analysis',
        'í³± Emergency contractor SMS alerts',
        'í¾« Automatic ticket creation',
        'í³§ User notification system',
        'í²° Cost tracking and optimization',
        'í³Š Real-time dashboard updates'
      ],
      costSavings: {
        traditionalIT: '$8,000/month',
        businessJarvis: '$800/month',
        monthlySavings: '$7,200/month',
        annualSavings: '$86,400/year',
        roi: '1,080% ROI'
      },
      responseTime: '< 30 seconds',
      availability: '24/7/365'
    };

    return await this.createWorkflow({
      name: 'Business Jarvis - IT Team Replacement',
      description: 'AI-powered IT assistant that replaces expensive IT teams with intelligent automation. Like ADT for your business IT.',
      organizationId,
      definition: sampleDefinition
    });
  }
}
