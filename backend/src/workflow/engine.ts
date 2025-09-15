import { PrismaClient } from '@prisma/client';
import { WorkflowDefinition, WorkflowNode, ExecutionContext, NodeExecutor } from './types';

const prisma = new PrismaClient();

export class WorkflowEngine {
  private nodeExecutors: Map<string, NodeExecutor> = new Map();

  // Register node executors
  registerExecutor(nodeType: string, executor: NodeExecutor) {
    this.nodeExecutors.set(nodeType, executor);
  }

  // Execute a complete workflow
  async executeWorkflow(workflowId: string, userId: string, input?: any): Promise<string> {
    try {
      // Get workflow definition
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
        include: { organization: true }
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

      // Parse workflow definition
      const definition: WorkflowDefinition = JSON.parse(workflow.definition);
      
      // Create execution context
      const context: ExecutionContext = {
        workflowRunId: workflowRun.id,
        userId,
        organizationId: workflow.organizationId,
        variables: input || {}
      };

      // Execute workflow starting from trigger node IDs (fix: use triggers as string array)
      await this.executeNodes(definition.triggers, definition, context);

      // Update run status
      await prisma.workflowRun.update({
        where: { id: workflowRun.id },
        data: { 
          status: 'COMPLETED',
          finishedAt: new Date()
        }
      });

      return workflowRun.id;

    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw error;
    }
  }

  // Execute a list of nodes (fix: accepts string array of node IDs)
  private async executeNodes(nodeIds: string[], definition: WorkflowDefinition, context: ExecutionContext) {
    for (const nodeId of nodeIds) {
      const node = definition.nodes.find(n => n.id === nodeId);
      if (!node) {
        console.warn(`Node ${nodeId} not found in workflow definition`);
        continue;
      }

      await this.executeNode(node, definition, context);
    }
  }

  // Execute a single node
  private async executeNode(node: WorkflowNode, definition: WorkflowDefinition, context: ExecutionContext) {
    try {
      // Create step record
      const step = await prisma.workflowStep.create({
        data: {
          workflowRunId: context.workflowRunId,
          stepName: node.name,
          status: 'RUNNING',
          input: JSON.stringify(node.config)
        }
      });

      // Get the executor for this node type
      const executor = this.nodeExecutors.get(node.type);
      if (!executor) {
        throw new Error(`No executor found for node type: ${node.type}`);
      }

      // Execute the node
      const result = await executor.execute(node, context);

      // Update step with success
      await prisma.workflowStep.update({
        where: { id: step.id },
        data: {
          status: 'COMPLETED',
          output: JSON.stringify(result),
          finishedAt: new Date()
        }
      });

      // Update context with result
      context.variables[node.id] = result;

      // Execute next nodes (if any)
      if (node.nextNodes && node.nextNodes.length > 0) {
        await this.executeNodes(node.nextNodes, definition, context);
      }

    } catch (error) {
      console.error(`Node execution failed: ${node.name}`, error);
      
      // Update step with failure
      await prisma.workflowStep.update({
        where: { id: context.workflowRunId },
        data: {
          status: 'FAILED',
          error: error instanceof Error ? error.message : String(error),
          finishedAt: new Date()
        }
      });
      
      throw error;
    }
  }
}
