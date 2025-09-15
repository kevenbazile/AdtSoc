// Business Jarvis Configuration Templates for Technicians

const configTemplates = {
  
  // Template for pharmaceutical companies
  pharmaceutical: {
    securityConfig: {
      industry: "pharmaceutical",
      criticalKeywords: ["manufacturing down", "batch failure", "contamination", "regulatory violation"],
      emergencyThreshold: 25000,
      complianceRequirements: ["FDA", "HIPAA", "GxP"],
      maxDowntime: {
        manufacturing: "30 minutes",
        quality_control: "60 minutes",
        regulatory: "15 minutes"
      }
    },
    costConfig: {
      typicalITStaff: 8,
      avgStaffCost: 12000,
      emergencyRate: 25000,
      toolsCost: 15000
    }
  },
  
  // Template for financial services
  financial: {
    securityConfig: {
      industry: "financial",
      criticalKeywords: ["trading halt", "transaction failure", "data breach", "compliance violation"],
      emergencyThreshold: 100000,
      complianceRequirements: ["SOX", "PCI_DSS", "FFIEC"],
      maxDowntime: {
        trading: "5 minutes",
        customer_data: "15 minutes",
        transaction_processing: "10 minutes"
      }
    },
    costConfig: {
      typicalITStaff: 12,
      avgStaffCost: 15000,
      emergencyRate: 50000,
      toolsCost: 25000
    }
  },
  
  // Template for healthcare
  healthcare: {
    securityConfig: {
      industry: "healthcare", 
      criticalKeywords: ["patient safety", "device malfunction", "data breach", "system outage"],
      emergencyThreshold: 25000,
      complianceRequirements: ["HIPAA", "HITECH", "FDA"],
      maxDowntime: {
        patient_records: "15 minutes",
        medical_devices: "5 minutes",
        imaging: "30 minutes"
      }
    },
    costConfig: {
      typicalITStaff: 6,
      avgStaffCost: 10000,
      emergencyRate: 20000,
      toolsCost: 12000
    }
  },
  
  // Template for manufacturing
  manufacturing: {
    securityConfig: {
      industry: "manufacturing",
      criticalKeywords: ["production halt", "safety incident", "quality failure", "supply disruption"],
      emergencyThreshold: 15000,
      complianceRequirements: ["ISO_27001", "OSHA"],
      maxDowntime: {
        production_line: "60 minutes",
        quality_control: "120 minutes",
        safety_systems: "0 minutes"
      }
    },
    costConfig: {
      typicalITStaff: 5,
      avgStaffCost: 8000,
      emergencyRate: 15000,
      toolsCost: 8000
    }
  }
};

// Function to generate configuration files
function generateConfigForCustomer(industry, customerData) {
  const template = configTemplates[industry];
  if (!template) {
    throw new Error(`No template found for industry: ${industry}`);
  }
  
  return {
    securityConfig: {
      ...template.securityConfig,
      customerName: customerData.name,
      domain: customerData.domain,
      contactEmail: customerData.email,
      implementationDate: new Date().toISOString()
    },
    costConfig: {
      ...template.costConfig,
      actualStaffCount: customerData.actualStaffCount || template.costConfig.typicalITStaff,
      actualStaffCost: customerData.actualStaffCost || template.costConfig.avgStaffCost,
      actualEmergencyRate: customerData.actualEmergencyRate || template.costConfig.emergencyRate
    }
  };
}

module.exports = { configTemplates, generateConfigForCustomer };
