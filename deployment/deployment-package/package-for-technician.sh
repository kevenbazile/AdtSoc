#!/bin/bash

echo "Creating Business Jarvis Technician Deployment Package..."

# Create the complete package structure
mkdir -p technician-package/app

# Copy application files
cp -r ../backend technician-package/app/
cp -r ../frontend technician-package/app/

# Remove development files
rm -rf technician-package/app/backend/node_modules
rm -rf technician-package/app/frontend/node_modules
rm -rf technician-package/app/backend/.git
rm -rf technician-package/app/frontend/.git

# Copy deployment scripts
cp install-business-jarvis.bat technician-package/
cp ecosystem.config.js technician-package/app/
cp configure-customer.js technician-package/
cp install-monitoring-agent.ps1 technician-package/
cp TECHNICIAN_CHECKLIST.md technician-package/

# Create technician instructions
cat > technician-package/README.txt << 'README'
BUSINESS JARVIS TECHNICIAN DEPLOYMENT PACKAGE
============================================

This package contains everything needed to install Business Jarvis
at customer sites.

INSTALLATION STEPS:
1. Copy this entire folder to customer system
2. Run install-business-jarvis.bat as Administrator
3. Run configure-customer.js to set up customer account
4. Follow TECHNICIAN_CHECKLIST.md for complete deployment

PACKAGE CONTENTS:
- app/ - Complete Business Jarvis application
- install-business-jarvis.bat - Main installer
- configure-customer.js - Customer setup script
- install-monitoring-agent.ps1 - Agent installer
- TECHNICIAN_CHECKLIST.md - Step-by-step guide

SUPPORT:
- Technical Support: 1-800-JARVIS-1
- Emergency Hotline: 1-800-JARVIS-911
- Documentation: docs.businessjarvis.com
README

echo "âœ… Technician package created in technician-package/"
echo "í³¦ Package is ready for field deployment"
echo "í²¼ Technicians can now install Business Jarvis at customer sites"
