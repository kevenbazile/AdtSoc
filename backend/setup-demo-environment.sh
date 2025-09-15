#!/bin/bash

echo "� Setting Up Business Jarvis Demo Environment"
echo "============================================="
echo ""

echo "1. � Installing required packages..."
cd backend
npm install n8n @n8n/client-oauth2 n8n-workflow n8n-core

echo ""
echo "2. � Creating Business Jarvis demo workflows..."

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
          name: "� Analyze Issue Severity",
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
                  value: "� Critical issue detected - Emergency contractor alerted"
                }
              ]
            }
          }
        },
        {
          id: "emergency-sms",
          name: "� Alert Emergency Contractor",
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
          name: "� Create Support Ticket",
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
          name: "✅ Notify User - Issue Received",
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
                  value: "✅ Business Jarvis processing complete"
                }
              ]
            }
          }
        }
      ],
      connections: {
        "IT Issue Reported": {
          main: [["� Analyze Issue Severity"]]
        },
        "� Analyze Issue Severity": {
          main: [
            ["� Alert Emergency Contractor"],
            ["� Create Support Ticket"]
          ]
        },
        "� Alert Emergency Contractor": {
          main: [["✅ Notify User - Issue Received"]]
        },
        "� Create Support Ticket": {
          main: [["✅ Notify User - Issue Received"]]
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
          name: "⏰ Every 5 Minutes Check",
          type: "n8n-nodes-base.manualTrigger",
          typeVersion: 1,
          position: [240, 300],
          parameters: {}
        },
        {
          id: "system-health",
          name: "� Check System Health",
          type: "n8n-nodes-base.set",
          typeVersion: 2,
          position: [460, 300],
          parameters: {
            values: {
              string: [
                {
                  name: "websiteStatus",
                  value: "✅ Online (Response: 150ms)"
                },
                {
                  name: "emailStatus", 
                  value: "✅ Online (Queue: 0 messages)"
                },
                {
                  name: "databaseStatus",
                  value: "✅ Online (Latency: 5ms)"
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
          name: "� Auto-Healing Actions",
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
          name: "� Cost Analysis",
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
        "⏰ Every 5 Minutes Check": {
          main: [["� Check System Health"]]
        },
        "� Check System Health": {
          main: [["� Auto-Healing Actions"]]
        },
        "� Auto-Healing Actions": {
          main: [["� Cost Analysis"]]
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
echo "3. � Demo environment ready!"
echo ""
echo "� To record your Business Jarvis demo:"
echo ""
echo "1. Start backend: npm run dev"
echo "2. Start frontend: cd ../frontend && npm run dev" 
echo "3. Visit: http://localhost:3000"
echo "4. Register new account with company name"
echo "5. Click 'Create Sample n8n Workflow'"
echo "6. Show the Business Jarvis workflows"
echo "7. Execute workflows and demonstrate automation"
echo ""
echo "�� Demo Script Points:"
echo "• Problem: SMBs spending $50K-200K on IT"
echo "• Solution: Business Jarvis replaces IT team"
echo "• Like ADT for business IT systems"
echo "• Show live workflow execution"
echo "• Demonstrate cost savings ($90K annually)"
echo ""
echo "� Camera/Recording Tips:"
echo "• Use OBS Studio or Loom for screen recording"
echo "• Record at 1920x1080 resolution"
echo "• Have talking points ready"
echo "• Practice the demo flow first"
echo "• Show both dashboard and n8n editor"
echo ""
echo "� Ready to create your Business Jarvis demo video!"
