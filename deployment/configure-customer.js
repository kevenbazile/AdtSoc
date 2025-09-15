const readline = require('readline');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prisma = new PrismaClient();

async function setupCustomer() {
  console.log('\n========================================');
  console.log('Business Jarvis Customer Configuration');
  console.log('========================================\n');

  // Get customer information
  const companyName = await askQuestion('Enter company name: ');
  const adminName = await askQuestion('Enter admin name: ');
  const adminEmail = await askQuestion('Enter admin email: ');
  const adminPassword = await askQuestion('Enter admin password: ');

  try {
    // Create organization
    const organization = await prisma.organization.create({
      data: {
        name: companyName,
        domain: adminEmail.split('@')[1]
      }
    });

    // Create admin user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: adminName,
        hashedPassword,
        role: 'OWNER',
        organizationId: organization.id
      }
    });

    // Create sample workflow
    const sampleWorkflow = await prisma.workflow.create({
      data: {
        name: `${companyName} - Security Monitor`,
        description: 'Enterprise security monitoring and incident response system',
        organizationId: organization.id,
        definition: JSON.stringify({
          monitoring: ['network', 'security', 'performance'],
          alertThresholds: {
            critical: 'immediate',
            high: '30 minutes',
            medium: '4 hours'
          },
          costSavings: {
            traditionalIT: 8000,
            businessJarvis: 800,
            monthlySavings: 7200,
            annualSavings: 86400
          }
        })
      }
    });

    console.log('\n✅ Customer configuration complete!');
    console.log(`Organization: ${organization.name}`);
    console.log(`Admin User: ${user.name} (${user.email})`);
    console.log(`Sample Workflow: ${sampleWorkflow.name}`);
    console.log('\nCustomer can now login at http://localhost:3000');

  } catch (error) {
    console.error('❌ Configuration failed:', error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

setupCustomer();
