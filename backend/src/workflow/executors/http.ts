import { NodeExecutor, WorkflowNode, ExecutionContext } from '../types';
import axios from 'axios';

export class HttpExecutor implements NodeExecutor {
  async execute(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    const { method = 'GET', url, headers = {}, body } = node.config;

    console.log(`Ìºê Executing HTTP ${method} request to ${url}`);

    try {
      const response = await axios({
        method,
        url,
        headers,
        data: body
      });

      return {
        status: response.status,
        data: response.data,
        headers: response.headers
      };
    } catch (error: any) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  }
}
