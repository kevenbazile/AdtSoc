import { NodeExecutor, WorkflowNode, ExecutionContext } from '../types';

export class EmailExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { to, subject, body } = node.config;

    console.log(`í³§ Sending email to ${to}: ${subject}`);
    
    // In production, integrate with SendGrid, AWS SES, etc.
    // For now, we'll simulate the email
    
    return {
      messageId: `msg_${Date.now()}`,
      to,
      subject,
      status: 'sent',
      timestamp: new Date().toISOString()
    };
  }
}
