import { NodeExecutor, WorkflowNode, ExecutionContext } from '../types';

export class TransformExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { operation, field, value } = node.config;

    console.log(`í´„ Transforming data: ${operation}`);

    switch (operation) {
      case 'set':
        context.variables[field] = value;
        break;
      case 'concat':
        context.variables[field] = (context.variables[field] || '') + value;
        break;
      case 'increment':
        context.variables[field] = (context.variables[field] || 0) + (value || 1);
        break;
      default:
        throw new Error(`Unknown transform operation: ${operation}`);
    }

    return context.variables;
  }
}
