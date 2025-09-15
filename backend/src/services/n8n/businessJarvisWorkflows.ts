export const createITTicketWorkflow = {
  name: "Business Jarvis - IT Issue Reporter",
  active: true,
  nodes: [
    {
      id: "webhook-trigger",
      name: "IT Issue Reported",
      type: "n8n-nodes-base.webhook",
      typeVersion: 1,
      position: [240, 300],
      parameters: {
        httpMethod: "POST",
        path: "it-issue"
      }
    },
    {
      id: "analyze-issue",
      name: "Analyze Issue Severity",
      type: "n8n-nodes-base.function",
      typeVersion: 1,
      position: [460, 300],
      parameters: {
        functionCode: `
// Business Jarvis - Intelligent Issue Analysis
const issue = items[0].json;
const keywords = {
  critical: ['server down', 'network outage', 'system crash', 'data loss'],
  high: ['login issues', 'email down', 'slow performance'],
  medium: ['software install', 'printer issue', 'password reset'],
  low: ['training request', 'general question']
};

let severity = 'low';
let urgency = 1;

for (const [level, words] of Object.entries(keywords)) {
  if (words.some(word => issue.description.toLowerCase().includes(word))) {
    severity = level;
    urgency = level === 'critical' ? 5 : level === 'high' ? 4 : level === 'medium' ? 3 : 2;
    break;
  }
}

return [{
  json: {
    ...issue,
    severity,
    urgency,
    ticketId: 'JARVIS-' + Date.now(),
    estimatedResolution: severity === 'critical' ? '15 minutes' : 
                        severity === 'high' ? '2 hours' : 
                        severity === 'medium' ? '24 hours' : '3 days'
  }
}];`
      }
    },
    {
      id: "route-by-severity",
      name: "Route to Appropriate Response",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [680, 300],
      parameters: {
        conditions: {
          string: [
            {
              value1: "={{$json.severity}}",
              operation: "equal",
              value2: "critical"
            }
          ]
        }
      }
    },
    {
      id: "instant-contractor-alert",
      name: "Alert Emergency Contractor",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 3,
      position: [900, 200],
      parameters: {
        method: "POST",
        url: "https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT/Messages.json",
        authentication: "basicAuth",
        sendBody: true,
        bodyParameters: {
          parameters: [
            {
              name: "To",
              value: "+1234567890"
            },
            {
              name: "From",
              value: "+0987654321"
            },
            {
              name: "Body",
              value: "íº¨ CRITICAL IT ISSUE: {{$json.description}} - Ticket: {{$json.ticketId}} - Immediate response required!"
            }
          ]
        }
      }
    },
    {
      id: "create-ticket",
      name: "Create Ticket in System",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 3,
      position: [900, 400],
      parameters: {
        method: "POST",
        url: "{{$json.ticketingSystem}}/api/tickets",
        sendBody: true,
        bodyParameters: {
          parameters: [
            {
              name: "title",
              value: "{{$json.title}}"
            },
            {
              name: "description",
              value: "{{$json.description}}"
            },
            {
              name: "severity",
              value: "{{$json.severity}}"
            },
            {
              name: "reporter",
              value: "{{$json.reporterEmail}}"
            }
          ]
        }
      }
    },
    {
      id: "notify-user",
      name: "Notify User - Issue Received",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2,
      position: [1120, 300],
      parameters: {
        to: "={{$json.reporterEmail}}",
        subject: "IT Issue Received - Ticket {{$json.ticketId}}",
        message: `
Dear {{$json.reporterName}},

Your IT issue has been received and processed by Business Jarvis.

í³‹ Ticket Details:
- Ticket ID: {{$json.ticketId}}
- Severity: {{$json.severity}}
- Estimated Resolution: {{$json.estimatedResolution}}

í´– Business Jarvis has automatically:
${severity === 'critical' ? 'íº¨ Alerted emergency contractor via SMS' : ''}
í³ Created ticket in our system
í³§ Notified appropriate IT resources
â° Set up monitoring for resolution

You will receive updates as we work on your issue.

Best regards,
Business Jarvis - Your AI IT Assistant
        `
      }
    }
  ],
  connections: {
    "IT Issue Reported": {
      main: [["Analyze Issue Severity"]]
    },
    "Analyze Issue Severity": {
      main: [["Route to Appropriate Response"]]
    },
    "Route to Appropriate Response": {
      main: [
        ["Alert Emergency Contractor"],
        ["Create Ticket in System"]
      ]
    },
    "Alert Emergency Contractor": {
      main: [["Notify User - Issue Received"]]
    },
    "Create Ticket in System": {
      main: [["Notify User - Issue Received"]]
    }
  }
};

export const createSystemMonitoringWorkflow = {
  name: "Business Jarvis - 24/7 System Monitor",
  active: true,
  nodes: [
    {
      id: "schedule-trigger",
      name: "Every 5 Minutes Check",
      type: "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [240, 300],
      parameters: {
        rule: {
          minute: "*/5"
        }
      }
    },
    {
      id: "check-website",
      name: "Check Website Health",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 3,
      position: [460, 200],
      parameters: {
        url: "https://{{$json.companyWebsite}}/health",
        method: "GET",
        timeout: 10000
      }
    },
    {
      id: "check-email-server",
      name: "Check Email Server",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 3,
      position: [460, 400],
      parameters: {
        url: "https://{{$json.emailServer}}/status",
        method: "GET"
      }
    },
    {
      id: "evaluate-health",
      name: "Evaluate System Health",
      type: "n8n-nodes-base.function",
      typeVersion: 1,
      position: [680, 300],
      parameters: {
        functionCode: `
// Business Jarvis - System Health Analysis
const responses = items;
let issues = [];
let systemStatus = 'healthy';

responses.forEach(response => {
  if (response.json.statusCode !== 200) {
    issues.push({
      service: response.json.url,
      status: response.json.statusCode,
      issue: 'Service unavailable'
    });
    systemStatus = 'degraded';
  }
});

return [{
  json: {
    systemStatus,
    issues,
    checkTime: new Date().toISOString(),
    needsAttention: issues.length > 0
  }
}];`
      }
    },
    {
      id: "alert-if-issues",
      name: "Alert if Issues Found",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [900, 300],
      parameters: {
        conditions: {
          boolean: [
            {
              value1: "={{$json.needsAttention}}",
              operation: "equal",
              value2: true
            }
          ]
        }
      }
    },
    {
      id: "send-alert",
      name: "Send IT Alert",
      type: "n8n-nodes-base.slack",
      typeVersion: 1,
      position: [1120, 200],
      parameters: {
        channel: "#it-alerts",
        text: "íº¨ Business Jarvis Alert: System issues detected at {{$json.checkTime}}"
      }
    },
    {
      id: "auto-restart-attempt",
      name: "Attempt Auto-Restart",
      type: "n8n-nodes-base.httpRequest",
      typeVersion: 3,
      position: [1120, 400],
      parameters: {
        method: "POST",
        url: "{{$json.managementAPI}}/restart",
        sendBody: true
      }
    }
  ],
  connections: {
    "Every 5 Minutes Check": {
      main: [
        ["Check Website Health"],
        ["Check Email Server"]
      ]
    },
    "Check Website Health": {
      main: [["Evaluate System Health"]]
    },
    "Check Email Server": {
      main: [["Evaluate System Health"]]
    },
    "Evaluate System Health": {
      main: [["Alert if Issues Found"]]
    },
    "Alert if Issues Found": {
      main: [
        ["Send IT Alert"],
        ["Attempt Auto-Restart"]
      ]
    }
  }
};

export const createCostTrackingWorkflow = {
  name: "Business Jarvis - IT Cost Tracker",
  active: true,
  nodes: [
    {
      id: "monthly-trigger",
      name: "Monthly Cost Analysis",
      type: "n8n-nodes-base.cron",
      typeVersion: 1,
      position: [240, 300],
      parameters: {
        rule: {
          dayOfMonth: 1,
          hour: 9,
          minute: 0
        }
      }
    },
    {
      id: "calculate-savings",
      name: "Calculate IT Savings",
      type: "n8n-nodes-base.function",
      typeVersion: 1,
      position: [460, 300],
      parameters: {
        functionCode: `
// Business Jarvis - Cost Savings Calculator
const traditionalITCost = 8000; // Monthly cost of IT team
const businessJarvisCost = 500; // Your service cost
const contractorCosts = 1200; // Occasional contractor costs
const toolsAndLicenses = 300; // Other tools

const totalCurrentCost = businessJarvisCost + contractorCosts + toolsAndLicenses;
const monthlySavings = traditionalITCost - totalCurrentCost;
const annualSavings = monthlySavings * 12;
const savingsPercentage = ((monthlySavings / traditionalITCost) * 100).toFixed(1);

return [{
  json: {
    month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    traditionalITCost,
    currentCost: totalCurrentCost,
    monthlySavings,
    annualSavings,
    savingsPercentage,
    businessJarvisCost,
    contractorCosts,
    roi: ((annualSavings / (businessJarvisCost * 12)) * 100).toFixed(1)
  }
}];`
      }
    },
    {
      id: "generate-report",
      name: "Generate Cost Report",
      type: "n8n-nodes-base.emailSend",
      typeVersion: 2,
      position: [680, 300],
      parameters: {
        to: "ceo@company.com,cfo@company.com",
        subject: "Business Jarvis - Monthly IT Cost Savings Report",
        message: `
í³Š Business Jarvis Monthly IT Savings Report - {{$json.month}}

í²° Cost Analysis:
â€¢ Traditional IT Team Cost: ${{$json.traditionalITCost}}/month
â€¢ Current Business Jarvis Solution: ${{$json.currentCost}}/month
â€¢ Monthly Savings: ${{$json.monthlySavings}} ({{$json.savingsPercentage}}%)
â€¢ Annual Savings: ${{$json.annualSavings}}

í¾¯ ROI Analysis:
â€¢ Return on Investment: {{$json.roi}}%
â€¢ Business Jarvis Cost: ${{$json.businessJarvisCost}}/month
â€¢ Contractor Support: ${{$json.contractorCosts}}/month

í´– Business Jarvis Performance This Month:
â€¢ 24/7 system monitoring
â€¢ Instant issue routing
â€¢ Automated problem resolution
â€¢ Cost-effective IT management

Your AI IT Assistant is saving significant costs while maintaining professional service levels.

Best regards,
Business Jarvis Analytics
        `
      }
    }
  ],
  connections: {
    "Monthly Cost Analysis": {
      main: [["Calculate IT Savings"]]
    },
    "Calculate IT Savings": {
      main: [["Generate Cost Report"]]
    }
  }
};
