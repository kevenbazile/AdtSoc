// Workflow Engine Types
export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'delay' | 'http' | 'email' | 'transform';
  name: string;
  config: Record<string, any>;
  nextNodes?: string[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  triggers: string[]; // Array of node IDs that are triggers
}

export interface ExecutionContext {
  workflowRunId: string;
  userId: string;
  organizationId: string;
  variables: Record<string, any>;
}

export interface NodeExecutor {
  execute(node: WorkflowNode, context: ExecutionContext): Promise<any>;
}
