const axios = require('axios');

class BusinessJarvisMonitor {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.token = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/api/auth/register`, {
        name: 'Monitor User',
        email: `monitor${Date.now()}@test.com`,
        password: 'monitor123',
        organizationName: 'Monitor Company'
      });
      
      this.token = response.data.token;
      console.log('‚úÖ Authentication successful');
      return true;
    } catch (error) {
      console.log('‚ùå Authentication failed:', error.response?.data || error.message);
      return false;
    }
  }

  async createWorkflow() {
    try {
      const response = await axios.post(`${this.baseURL}/api/workflows/sample`, {}, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      console.log('‚úÖ Workflow created:', response.data.name);
      console.log('Ì≥ã Description:', response.data.description);
      return response.data.id;
    } catch (error) {
      console.log('‚ùå Workflow creation failed:', error.response?.data || error.message);
      return null;
    }
  }

  async executeWorkflow(workflowId) {
    try {
      console.log('Ì∫Ä Executing workflow...');
      const startTime = Date.now();
      
      const response = await axios.post(`${this.baseURL}/api/workflows/${workflowId}/execute`, {
        input: {
          userEmail: 'monitor@test.com',
          issue: 'Critical server outage - monitoring test',
          priority: 'CRITICAL'
        }
      }, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      const executionTime = Date.now() - startTime;
      console.log(`‚ö° Execution initiated in ${executionTime}ms`);
      console.log('Ì≥ä Response:', response.data);
      
      return response.data.runId;
    } catch (error) {
      console.log('‚ùå Workflow execution failed:', error.response?.data || error.message);
      return null;
    }
  }

  async checkExecutionResults(workflowId, runId) {
    try {
      // Wait for execution to complete
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await axios.get(`${this.baseURL}/api/workflows/${workflowId}/runs`, {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      
      const runs = response.data;
      const latestRun = runs.find(run => run.id === runId) || runs[0];
      
      if (latestRun) {
        console.log('Ì≥à Execution Results:');
        console.log(`   Status: ${latestRun.status}`);
        console.log(`   Started: ${latestRun.startedAt}`);
        console.log(`   Finished: ${latestRun.finishedAt}`);
        
        if (latestRun.output) {
          const output = JSON.parse(latestRun.output);
          console.log('Ì¥ñ Business Jarvis Results:');
          console.log(`   Severity: ${output.severity}`);
          console.log(`   Ticket ID: ${output.ticketId}`);
          console.log(`   Response Time: ${output.responseTime}`);
          
          if (output.autoActions) {
            console.log('Ì¥Ñ Auto Actions Performed:');
            output.autoActions.forEach(action => console.log(`   ‚Ä¢ ${action}`));
          }
          
          if (output.costSavings) {
            console.log('Ì≤∞ Cost Analysis:');
            console.log(`   Traditional IT: ${output.costSavings.traditionalIT}`);
            console.log(`   Business Jarvis: ${output.costSavings.businessJarvis}`);
            console.log(`   Savings: ${output.costSavings.savings}`);
          }
        }
      }
    } catch (error) {
      console.log('‚ùå Failed to get execution results:', error.response?.data || error.message);
    }
  }

  async runCompleteTest() {
    console.log('ÌæØ Business Jarvis Complete System Test');
    console.log('======================================');
    console.log('');

    // Test authentication
    const authSuccess = await this.authenticate();
    if (!authSuccess) return;

    // Test workflow creation
    const workflowId = await this.createWorkflow();
    if (!workflowId) return;

    // Test workflow execution
    const runId = await this.executeWorkflow(workflowId);
    if (!runId) return;

    // Check results
    await this.checkExecutionResults(workflowId, runId);

    console.log('');
    console.log('ÌæØ Test Complete!');
    console.log('If you see cost savings and auto actions above, Business Jarvis is working correctly.');
  }
}

// Run the test
const monitor = new BusinessJarvisMonitor();
monitor.runCompleteTest().catch(console.error);
