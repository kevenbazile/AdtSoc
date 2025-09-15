# Business Jarvis Technician Installation Checklist

## Pre-Installation Requirements
- [ ] Customer has Windows Server 2016+ or Windows 10+
- [ ] Administrative access to customer systems
- [ ] Internet connectivity for initial setup
- [ ] Customer contact person available for training

## Installation Steps

### 1. System Assessment (30 minutes)
- [ ] Document customer's current IT infrastructure
- [ ] Identify critical systems for monitoring
- [ ] Note existing security tools and potential conflicts
- [ ] Verify network requirements and firewall settings

### 2. Business Jarvis Installation (45 minutes)
- [ ] Run install-business-jarvis.bat as administrator
- [ ] Verify all services are running correctly
- [ ] Test dashboard access at http://localhost:3000
- [ ] Confirm API connectivity at http://localhost:5000

### 3. Customer Configuration (30 minutes)
- [ ] Run node configure-customer.js
- [ ] Create customer organization and admin account
- [ ] Configure company-specific monitoring thresholds
- [ ] Set up initial workflows for customer's environment

### 4. Monitoring Agent Deployment (60 minutes)
- [ ] Install agents on critical servers
- [ ] Configure monitoring for key applications
- [ ] Set up security alert thresholds
- [ ] Test incident detection and routing

### 5. Integration Setup (45 minutes)
- [ ] Connect to existing ticketing systems (if applicable)
- [ ] Configure contractor routing protocols
- [ ] Set up executive dashboard access
- [ ] Test email and SMS notifications

### 6. Training and Handoff (60 minutes)
- [ ] Train admin users on dashboard navigation
- [ ] Demonstrate incident response procedures
- [ ] Provide emergency contact information
- [ ] Schedule follow-up appointments

## Post-Installation
- [ ] Document installation details in customer file
- [ ] Schedule 1-week follow-up call
- [ ] Provide 24/7 support contact information
- [ ] Set up monthly reporting schedule

## Troubleshooting Common Issues
- **Port conflicts**: Change ports in ecosystem.config.js
- **Database errors**: Verify PostgreSQL/SQLite permissions
- **Agent connectivity**: Check firewall rules and network access
- **Dashboard not loading**: Verify Node.js services are running

## Customer Training Materials
- [ ] Leave printed user manual
- [ ] Provide video training links
- [ ] Set up knowledge base access
- [ ] Configure help desk tickets

## Success Criteria
- [ ] All monitoring agents reporting data
- [ ] Customer can successfully log in and navigate dashboard
- [ ] Test incident generates proper alerts and routing
- [ ] Customer understands escalation procedures
- [ ] Cost savings projections configured and displaying

---
**Installation Time**: 4-5 hours total
**Required Skills**: Windows administration, networking basics, customer service
**Tools Needed**: Laptop with installation package, admin credentials, customer documentation
