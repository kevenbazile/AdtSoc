import axios from 'axios';

export class N8nService {
  private n8nUrl: string;

  constructor() {
    // Use environment variable or default for Docker setup
    this.n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
  }

  // Wait for n8n to be ready
  async waitForN8n(maxAttempts = 30): Promise<void> {
    console.log(`��� Connecting to n8n at ${this.n8nUrl}...`);
    
    for (let i = 0; i < maxAttempts; i++) {
      try {
        await axios.get(`${this.n8nUrl}/rest/active-workflows`);
        console.log('✅ Connected to n8n successfully!');
        return;
      } catch (error) {
        console.log(`⏳ Waiting for n8n... (${i + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    throw new Error('Failed to connect to n8n service');
  }

  // Create workflow in n8n
  async createWorkflow(workflowData: any): Promise<string> {
    try {
      const response = await axios.post(`${this.n8nUrl}/rest/workflows`, workflowData);
      console.log('✅ Workflow created in n8n:', response.data.id);
      return response.data.id;
    } catch (error) {
      console.error('❌ Failed to create workflow in n8n:', error);
      throw error;
    }
  }

  // Execute workflow in n8n
  async executeWorkflow(workflowId: string, inputData?: any): Promise<any> {
    try {
      // First activate the workflow
      await axios.post(`${this.n8nUrl}/rest/workflows/${workflowId}/activate`);

      // Then execute it
      const response = await axios.post(
        `${this.n8nUrl}/rest/workflows/${workflowId}/execute`,
        { workflowData: inputData || {} }
      );

      console.log('✅ Workflow executed in n8n');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to execute workflow in n8n:', error);
      throw error;
    }
  }

  // Get workflow executions
  async getWorkflowExecutions(workflowId: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `${this.n8nUrl}/rest/executions?filter={"workflowId":"${workflowId}"}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Failed to get executions:', error);
      return [];
    }
  }

  // Get all workflows
  async getWorkflows(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.n8nUrl}/rest/workflows`);
      return response.data.data || [];
    } catch (error) {
      console.error('❌ Failed to get workflows:', error);
      return [];
    }
  }

  // Create sample workflow in n8n format
  async createSampleN8nWorkflow(): Promise<string> {
    const sampleWorkflow = {
      name: 'Tech Match Enterprise Sample',
      active: false,
      nodes: [
        {
          id: 'trigger',
          name: 'Manual Trigger',
          type: 'n8n-nodes-base.manualTrigger',
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: 'http-request',
          name: 'Fetch Data',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 3,
          position: [460, 300],
          parameters: {
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            method: 'GET'
          }
        },
        {
          id: 'set-data',
          name: 'Process Response',
          type: 'n8n-nodes-base.set',
          typeVersion: 2,
          position: [680, 300],
          parameters: {
            values: {
              string: [
                {
                  name: 'processedAt',
                  value: '={{new Date().toISOString()}}'
                },
                {
                  name: 'title',
                  value: '={{$json["title"]}}'
                },
                {
                  name: 'status',
                  value: 'processed_by_techmatch'
                }
              ]
            }
          }
        }
      ],
      connections: {
        'Manual Trigger': {
          main: [[{ node: 'Fetch Data', type: 'main', index: 0 }]]
        },
        'Fetch Data': {
          main: [[{ node: 'Process Response', type: 'main', index: 0 }]]
        }
      }
    };

    return await this.createWorkflow(sampleWorkflow);
  }

  // Get n8n editor URL
  getEditorUrl(workflowId?: string): string {
    const baseUrl = this.n8nUrl.replace('http://n8n:', 'http://localhost:');
    return workflowId ? `${baseUrl}/workflow/${workflowId}` : baseUrl;
  }
}

// Singleton instance
export const n8nService = new N8nService();
