import { PrismaClient } from '@prisma/client';
import { n8nService } from './n8n/n8nService';

const prisma = new PrismaClient();

export class WorkflowService {
  // Initialize n8n on startup
  static async initialize() {
    try {
      await n8nService.startN8n();
      console.log('‚úÖ n8n workflow engine initialized');
    } catch (error) {
      console.error('‚ùå Failed to initialize n8n:', error);
    }
  }

  // Create a new workflow (stores in both our DB and n8n)
  static async createWorkflow(data: {
    name: string;
    description?: string;
    organizationId: string;
    definition: any;
  }) {
    try {
      // Create workflow in n8n first
      const n8nWorkflowId = await n8nService.createWorkflow({
        name: data.name,
        active: true,
        nodes: data.definition.nodes || [],
        connections: data.definition.connections || {}
      });

      // Store in our database with n8n ID reference
      const workflow = await prisma.workflow.create({
        data: {
          ...data,
          definition: JSON.stringify({
            ...data.definition,
            n8nWorkflowId
          })
        }
      });

      console.log(`‚úÖ Workflow created: DB ID ${workflow.id}, n8n ID ${n8nWorkflowId}`);
      return workflow;

    } catch (error) {
      console.error('‚ùå Failed to create workflow:', error);
      throw error;
    }
  }

  // Get all workflows for an organization
  static async getWorkflows(organizationId: string) {
    try {
      const workflows = await prisma.workflow.findMany({
        where: { organizationId },
        include: {
          runs: {
            take: 5,
            orderBy: { startedAt: 'desc' }
          }
        }
      });

      // Enhance with n8n data
      const enhancedWorkflows = await Promise.all(
        workflows.map(async (workflow) => {
          try {
            const definition = JSON.parse(workflow.definition);
            const n8nWorkflowId = definition.n8nWorkflowId;
            
            if (n8nWorkflowId) {
              const n8nExecutions = await n8nService.getWorkflowExecutions(n8nWorkflowId);
              return {
                ...workflow,
                n8nExecutions: n8nExecutions.slice(0, 5) // Latest 5 executions
              };
            }
            return workflow;
          } catch (error) {
            console.warn(`Failed to get n8n data for workflow ${workflow.id}`);
            return workflow;
          }
        })
      );

      return enhancedWorkflows;
    } catch (error) {
      console.error('‚ùå Failed to get workflows:', error);
      throw error;
    }
  }

  // Execute a workflow using n8n
  static async executeWorkflow(workflowId: string, userId: string, input?: any) {
    try {
      // Get workflow from our database
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId }
      });

      if (!workflow) {
        throw new Error(`Workflow ${workflowId} not found`);
      }

      // Create workflow run record
      const workflowRun = await prisma.workflowRun.create({
        data: {
          workflowId,
          userId,
          status: 'RUNNING',
          input: input ? JSON.stringify(input) : null
        }
      });

      // Execute in n8n
      const definition = JSON.parse(workflow.definition);
      const n8nWorkflowId = definition.n8nWorkflowId;

      if (!n8nWorkflowId) {
        throw new Error('Workflow not properly configured with n8n');
      }

      console.log(`Ì∫Ä Executing workflow ${workflowId} in n8n (ID: ${n8nWorkflowId})`);
      
      const n8nResult = await n8nService.executeWorkflow(n8nWorkflowId, input);

      // Update run status
      await prisma.workflowRun.update({
        where: { id: workflowRun.id },
        data: {
          status: 'COMPLETED',
          output: JSON.stringify(n8nResult),
          finishedAt: new Date()
        }
      });

      console.log(`‚úÖ Workflow ${workflowId} executed successfully`);
      return workflowRun.id;

    } catch (error) {
      console.error('‚ùå Workflow execution failed:', error);
      throw error;
    }
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

  // Create a sample n8n workflow
  static async createSampleWorkflow(organizationId: string) {
    try {
      console.log('ÌæØ Creating sample n8n workflow...');
      
      // Create the n8n workflow first
      const n8nWorkflowId = await n8nService.createSampleN8nWorkflow();

      // Create corresponding record in our database
      const workflow = await this.createWorkflow({
        name: 'Sample n8n Workflow - HTTP Request',
        description: 'Fetches data from an API and processes it using n8n',
        organizationId,
        definition: {
          n8nWorkflowId,
          type: 'n8n',
          description: 'Sample workflow that makes HTTP request and processes data'
        }
      });

      console.log('‚úÖ Sample n8n workflow created successfully!');
      return workflow;

    } catch (error) {
      console.error('‚ùå Failed to create sample n8n workflow:', error);
      throw error;
    }
  }

  // Get n8n editor URL for workflow
  static getN8nEditorUrl(workflowId: string): string {
    return `http://localhost:5678/workflow/${workflowId}`;
  }
}
