#!/bin/bash

echo "í¾¬ Setting Up Business Jarvis Demo Environment"
echo "============================================="
echo ""

echo "1. í³¦ Installing required packages..."
cd backend
npm install n8n @n8n/client-oauth2 n8n-workflow n8n-core

echo ""
echo "2. í¾¯ Creating Business Jarvis demo workflows..."

# Add Business Jarvis workflows to the workflow service
cat >> src/services/workflowService.ts << 'DEMO_EOF'

  // Create Business Jarvis IT Issue Reporter
  static async createBusinessJarvisITWorkflow(organizationId: string) {
    const jarvisWorkflow = {
      name: "Business Jarvis - IT Issue Reporter",
      active: true,
      nodes: [
        {
          id: "webhook-trigger",
          name: "IT Issue Reported",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: "analyze-issue",
          name: "í´– Analyze Issue Severity",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "severity",
                  value: "critical"
                },
                {
                  name: "ticketId", 
                  value: "JARVIS-{{Date.now()}}"
                },
                {
                  name: "estimatedResolution",
                  value: "15 minutes"
                },
                {
                  name: "autoResponse",
                  value: "íº¨ Critical issue detected - Emergency contractor alerted"
                }
              ]
            }
          }
        },
        {
          id: "emergency-sms",
          name: "í³± Alert Emergency Contractor",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [680, 200],
          parameters: {
            values: {
              string: [
                {
                  name: "smsStatus",
                  value: "SMS sent to emergency contractor"
                },
                {
                  name: "contractorPhone",
                  value: "+1-555-IT-HELP"
                }
              ]
            }
          }
        },
        {
          id: "create-ticket",
          name: "í¾« Create Support Ticket",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [680, 400],
          parameters: {
            values: {
              string: [
                {
                  name: "ticketCreated",
                  value: "Support ticket created in system"
                },
                {
                  name: "trackingUrl",
                  value: "https://support.company.com/ticket/{{$json.ticketId}}"
                }
              ]
            }
          }
        },
        {
          id: "notify-user",
          name: "âœ… Notify User - Issue Received",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [900, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "userNotified",
                  value: "User notified via email"
                },
                {
                  name: "responseTime",
                  value: "< 30 seconds"
                },
                {
                  name: "status",
                  value: "âœ… Business Jarvis processing complete"
                }
              ]
            }
          }
        }
      ],
      connections: {
        "IT Issue Reported": {
          main: [["í´– Analyze Issue Severity"]]
        },
        "í´– Analyze Issue Severity": {
          main: [
            ["í³± Alert Emergency Contractor"],
            ["í¾« Create Support Ticket"]
          ]
        },
        "í³± Alert Emergency Contractor": {
          main: [["âœ… Notify User - Issue Received"]]
        },
        "í¾« Create Support Ticket": {
          main: [["âœ… Notify User - Issue Received"]]
        }
      }
    };

    const n8nWorkflowId = await n8nService.createWorkflow(jarvisWorkflow);
    
    return await this.createWorkflow({
      name: 'Business Jarvis - IT Issue Reporter',
      description: 'Intelligent IT issue analysis and contractor routing - replaces entire IT help desk',
      organizationId,
      definition: {
        n8nWorkflowId,
        type: 'business-jarvis',
        category: 'IT Team Replacement'
      }
    });
  }

  // Create Business Jarvis System Monitor
  static async createBusinessJarvisMonitorWorkflow(organizationId: string) {
    const monitorWorkflow = {
      name: "Business Jarvis - 24/7 System Monitor",
      active: true,
      nodes: [
        {
          id: "schedule-trigger",
          name: "â° Every 5 Minutes Check",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: "system-health",
          name: "í´ Check System Health",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "websiteStatus",
                  value: "âœ… Online (Response: 150ms)"
                },
                {
                  name: "emailStatus", 
                  value: "âœ… Online (Queue: 0 messages)"
                },
                {
                  name: "databaseStatus",
                  value: "âœ… Online (Latency: 5ms)"
                },
                {
                  name: "lastCheck",
                  value: "{{new Date().toISOString()}}"
                }
              ]
            }
          }
        },
        {
          id: "auto-healing",
          name: "í´§ Auto-Healing Actions",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [680, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "autoActions",
                  value: "Cleared cache, restarted services"
                },
                {
                  name: "performanceOptimization",
                  value: "Memory usage optimized"
                },
                {
                  name: "preventiveMaintenance",
                  value: "Disk cleanup completed"
                }
              ]
            }
          }
        },
        {
          id: "cost-tracking",
          name: "í²° Cost Analysis",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [900, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "traditionalITCost",
                  value: "$8,000/month"
                },
                {
                  name: "businessJarvisCost",
                  value: "$500/month"
                },
                {
                  name: "monthlySavings",
                  value: "$7,500/month"
                },
                {
                  name: "annualSavings",
                  value: "$90,000/year"
                },
                {
                  name: "roi",
                  value: "1,800% ROI"
                }
              ]
            }
          }
        }
      ],
      connections: {
        "â° Every 5 Minutes Check": {
          main: [["í´ Check System Health"]]
        },
        "í´ Check System Health": {
          main: [["í´§ Auto-Healing Actions"]]
        },
        "í´§ Auto-Healing Actions": {
          main: [["í²° Cost Analysis"]]
        }
      }
    };

    const n8nWorkflowId = await n8nService.createWorkflow(monitorWorkflow);
    
    return await this.createWorkflow({
      name: 'Business Jarvis - 24/7 System Monitor',
      description: 'Continuous system monitoring and auto-healing - replaces monitoring team',
      organizationId,
      definition: {
        n8nWorkflowId,
        type: 'business-jarvis',
        category: 'System Monitoring'
      }
    });
  }
DEMO_EOF

echo ""
echo "3. í¾¨ Demo environment ready!"
echo ""
echo "í¾¬ To record your Business Jarvis demo:"
echo ""
echo "1. Start backend: npm run dev"
echo "2. Start frontend: cd ../frontend && npm run dev" 
echo "3. Visit: http://localhost:3000"
echo "4. Register new account with company name"
echo "5. Click 'Create Sample n8n Workflow'"
echo "6. Show the Business Jarvis workflows"
echo "7. Execute workflows and demonstrate automation"
echo ""
echo "ï¿½ï¿½ Demo Script Points:"
echo "â€¢ Problem: SMBs spending $50K-200K on IT"
echo "â€¢ Solution: Business Jarvis replaces IT team"
echo "â€¢ Like ADT for business IT systems"
echo "â€¢ Show live workflow execution"
echo "â€¢ Demonstrate cost savings ($90K annually)"
echo ""
echo "í²¡ Camera/Recording Tips:"
echo "â€¢ Use OBS Studio or Loom for screen recording"
echo "â€¢ Record at 1920x1080 resolution"
echo "â€¢ Have talking points ready"
echo "â€¢ Practice the demo flow first"
echo "â€¢ Show both dashboard and n8n editor"
echo ""
echo "íº€ Ready to create your Business Jarvis demo video!"
