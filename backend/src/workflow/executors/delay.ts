import { NodeExecutor, WorkflowNode, ExecutionContext } from '../types';

export class DelayExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { duration = 1000 } = node.config; // Duration in milliseconds

    console.log(`⏰ Delaying execution for ${duration}ms`);
    
    await new Promise(resolve => setTimeout(resolve, duration));
    
    return {
      delayed: duration,
      timestamp: new Date().toISOString()
    };
  }
}
