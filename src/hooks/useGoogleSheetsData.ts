import { useState, useEffect } from 'react';
import { BusinessCategory, BusinessService, VisaType, FreezonePackageData } from '@/types/businessSetup';

// Mock data structure - Replace with actual Google Sheets integration
const MOCK_BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'trading',
    name: 'Trading',
    description: 'Import/Export and General Trading',
    services: [
      {
        id: 'general-trading',
        name: 'General Trading',
        category: 'trading',
        standardPrice: 5000,
        premiumPrice: 8000,
        timeline: '7-10 days',
        description: 'General trading license for various products',
        documentRequirements: ['Trade License Application', 'Passport Copies'],
        isRequired: true
      },
      {
        id: 'import-export',
        name: 'Import/Export Trading',
        category: 'trading',
        standardPrice: 6000,
        premiumPrice: 9000,
        timeline: '10-14 days',
        description: 'International import and export operations',
        documentRequirements: ['Import/Export License', 'Chamber of Commerce Certificate'],
        isRequired: false
      }
    ]
  },
  {
    id: 'food-beverages',
    name: 'Food & Beverages',
    description: 'Food and beverage business operations',
    services: [
      {
        id: 'food-trading',
        name: 'Food & Beverages Trading',
        category: 'food-beverages',
        standardPrice: 4500,
        premiumPrice: 7000,
        timeline: '5-7 days',
        description: 'Trading in food and beverage products',
        documentRequirements: ['Health Permit', 'Food Safety Certificate'],
        isRequired: true
      },
      {
        id: 'restaurant',
        name: 'Restaurant Operations',
        category: 'food-beverages',
        standardPrice: 7000,
        premiumPrice: 12000,
        timeline: '14-21 days',
        description: 'Restaurant and food service establishment',
        documentRequirements: ['Municipality Permit', 'Health Department Approval'],
        isRequired: false
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology & IT',
    description: 'Information technology and software services',
    services: [
      {
        id: 'software-development',
        name: 'Software Development',
        category: 'technology',
        standardPrice: 6000,
        premiumPrice: 10000,
        timeline: '7-10 days',
        description: 'Custom software development services',
        documentRequirements: ['Technical Specifications', 'Development Framework'],
        isRequired: true
      },
      {
        id: 'it-consultancy',
        name: 'IT Consultancy',
        category: 'technology',
        standardPrice: 5500,
        premiumPrice: 8500,
        timeline: '5-7 days',
        description: 'Information technology consulting services',
        documentRequirements: ['Professional Certificates', 'Portfolio'],
        isRequired: false
      }
    ]
  },
  {
    id: 'consulting',
    name: 'Consulting Services',
    description: 'Professional consulting and advisory services',
    services: [
      {
        id: 'management-consulting',
        name: 'Management Consulting',
        category: 'consulting',
        standardPrice: 5000,
        premiumPrice: 8000,
        timeline: '5-7 days',
        description: 'Strategic management consulting services',
        documentRequirements: ['Professional Qualifications', 'Experience Certificates'],
        isRequired: true
      },
      {
        id: 'business-consulting',
        name: 'Business Consulting',
        category: 'consulting',
        standardPrice: 4800,
        premiumPrice: 7500,
        timeline: '5-7 days',
        description: 'General business advisory services',
        documentRequirements: ['Business Plan', 'Professional Background'],
        isRequired: false
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Construction',
    description: 'Engineering consultancy and construction services',
    services: [
      {
        id: 'civil-engineering',
        name: 'Civil Engineering Consultancy',
        category: 'engineering',
        standardPrice: 7000,
        premiumPrice: 12000,
        timeline: '10-14 days',
        description: 'Civil engineering design and consultancy',
        documentRequirements: ['Engineering License', 'Professional Certificates'],
        isRequired: true
      },
      {
        id: 'architectural-design',
        name: 'Architectural Design',
        category: 'engineering',
        standardPrice: 6500,
        premiumPrice: 11000,
        timeline: '10-14 days',
        description: 'Architectural design and planning services',
        documentRequirements: ['Architect License', 'Portfolio'],
        isRequired: false
      }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    description: 'Manufacturing and production services',
    services: [
      {
        id: 'electronics-manufacturing',
        name: 'Electronics Manufacturing',
        category: 'manufacturing',
        standardPrice: 8000,
        premiumPrice: 15000,
        timeline: '14-21 days',
        description: 'Electronic devices and components manufacturing',
        documentRequirements: ['Manufacturing License', 'Quality Certificates'],
        isRequired: true
      },
      {
        id: 'textile-manufacturing',
        name: 'Textile Manufacturing',
        category: 'manufacturing',
        standardPrice: 7500,
        premiumPrice: 13000,
        timeline: '14-21 days',
        description: 'Textile and fabric manufacturing',
        documentRequirements: ['Industrial License', 'Environmental Clearance'],
        isRequired: false
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Medical',
    description: 'Medical and healthcare services',
    services: [
      {
        id: 'medical-services',
        name: 'Medical Services',
        category: 'healthcare',
        standardPrice: 8500,
        premiumPrice: 15000,
        timeline: '14-21 days',
        description: 'General medical and healthcare services',
        documentRequirements: ['Medical License', 'Health Department Approval'],
        isRequired: true
      },
      {
        id: 'pharmacy',
        name: 'Pharmacy Operations',
        category: 'healthcare',
        standardPrice: 7000,
        premiumPrice: 12000,
        timeline: '10-14 days',
        description: 'Pharmaceutical retail and services',
        documentRequirements: ['Pharmacy License', 'Pharmacist Certificate'],
        isRequired: false
      }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    description: 'Educational and training services',
    services: [
      {
        id: 'training-services',
        name: 'Training Services',
        category: 'education',
        standardPrice: 4500,
        premiumPrice: 7500,
        timeline: '7-10 days',
        description: 'Professional training and development services',
        documentRequirements: ['Training License', 'Curriculum Details'],
        isRequired: true
      },
      {
        id: 'educational-consulting',
        name: 'Educational Consulting',
        category: 'education',
        standardPrice: 4000,
        premiumPrice: 6500,
        timeline: '5-7 days',
        description: 'Educational consulting and advisory services',
        documentRequirements: ['Educational Qualifications', 'Experience Certificates'],
        isRequired: false
      }
    ]
  },
  {
    id: 'media',
    name: 'Media & Entertainment',
    description: 'Media production and entertainment services',
    services: [
      {
        id: 'media-production',
        name: 'Media Production',
        category: 'media',
        standardPrice: 5500,
        premiumPrice: 9000,
        timeline: '7-10 days',
        description: 'Media content creation and production',
        documentRequirements: ['Media License', 'Content Portfolio'],
        isRequired: true
      },
      {
        id: 'advertising-agency',
        name: 'Advertising Agency',
        category: 'media',
        standardPrice: 5000,
        premiumPrice: 8000,
        timeline: '5-7 days',
        description: 'Advertising and marketing services',
        documentRequirements: ['Agency License', 'Portfolio'],
        isRequired: false
      }
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation & Logistics',
    description: 'Transportation and logistics services',
    services: [
      {
        id: 'logistics',
        name: 'Logistics Services',
        category: 'transportation',
        standardPrice: 6000,
        premiumPrice: 10000,
        timeline: '10-14 days',
        description: 'Logistics and supply chain management',
        documentRequirements: ['Transport License', 'Warehouse Permits'],
        isRequired: true
      },
      {
        id: 'freight-services',
        name: 'Freight Services',
        category: 'transportation',
        standardPrice: 5500,
        premiumPrice: 9000,
        timeline: '7-10 days',
        description: 'Freight forwarding and cargo services',
        documentRequirements: ['Freight License', 'Insurance Documents'],
        isRequired: false
      }
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Property',
    description: 'Real estate and property management',
    services: [
      {
        id: 'real-estate-brokerage',
        name: 'Real Estate Brokerage',
        category: 'real-estate',
        standardPrice: 5000,
        premiumPrice: 8500,
        timeline: '7-10 days',
        description: 'Real estate buying, selling, and leasing services',
        documentRequirements: ['Real Estate License', 'Professional Certificates'],
        isRequired: true
      },
      {
        id: 'property-management',
        name: 'Property Management',
        category: 'real-estate',
        standardPrice: 4500,
        premiumPrice: 7500,
        timeline: '5-7 days',
        description: 'Property management and maintenance services',
        documentRequirements: ['Management License', 'Insurance Papers'],
        isRequired: false
      }
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    description: 'Hotel, tourism and hospitality services',
    services: [
      {
        id: 'hotel-operations',
        name: 'Hotel Operations',
        category: 'hospitality',
        standardPrice: 8000,
        premiumPrice: 15000,
        timeline: '14-21 days',
        description: 'Hotel and accommodation services',
        documentRequirements: ['Hotel License', 'Tourism Department Approval'],
        isRequired: true
      },
      {
        id: 'tourism-services',
        name: 'Tourism Services',
        category: 'hospitality',
        standardPrice: 5500,
        premiumPrice: 9000,
        timeline: '7-10 days',
        description: 'Tourism and travel services',
        documentRequirements: ['Tourism License', 'Travel Agency Permit'],
        isRequired: false
      }
    ]
  },
  {
    id: 'textiles',
    name: 'Textiles & Fashion',
    description: 'Textile and fashion industry services',
    services: [
      {
        id: 'textile-trading',
        name: 'Textile Trading',
        category: 'textiles',
        standardPrice: 4500,
        premiumPrice: 7000,
        timeline: '5-7 days',
        description: 'Textile and fabric trading services',
        documentRequirements: ['Trade License', 'Quality Certificates'],
        isRequired: true
      },
      {
        id: 'fashion-retail',
        name: 'Fashion Retail',
        category: 'textiles',
        standardPrice: 5000,
        premiumPrice: 8000,
        timeline: '7-10 days',
        description: 'Fashion retail and clothing services',
        documentRequirements: ['Retail License', 'Brand Certificates'],
        isRequired: false
      }
    ]
  },
  {
    id: 'financial',
    name: 'Financial Services',
    description: 'Financial and investment services',
    services: [
      {
        id: 'financial-consulting',
        name: 'Financial Consulting',
        category: 'financial',
        standardPrice: 6000,
        premiumPrice: 10000,
        timeline: '7-10 days',
        description: 'Financial planning and investment consulting',
        documentRequirements: ['Financial License', 'Professional Certificates'],
        isRequired: true
      },
      {
        id: 'accounting-services',
        name: 'Accounting Services',
        category: 'financial',
        standardPrice: 4500,
        premiumPrice: 7500,
        timeline: '5-7 days',
        description: 'Accounting and bookkeeping services',
        documentRequirements: ['Accounting License', 'Professional Qualifications'],
        isRequired: false
      }
    ]
  },
  {
    id: 'energy',
    name: 'Energy & Environment',
    description: 'Energy and environmental services',
    services: [
      {
        id: 'renewable-energy',
        name: 'Renewable Energy Consulting',
        category: 'energy',
        standardPrice: 7000,
        premiumPrice: 12000,
        timeline: '10-14 days',
        description: 'Renewable energy systems and consulting',
        documentRequirements: ['Energy License', 'Technical Certificates'],
        isRequired: true
      },
      {
        id: 'environmental-consulting',
        name: 'Environmental Consulting',
        category: 'energy',
        standardPrice: 6000,
        premiumPrice: 10000,
        timeline: '7-10 days',
        description: 'Environmental impact and sustainability consulting',
        documentRequirements: ['Environmental License', 'Professional Certificates'],
        isRequired: false
      }
    ]
  }
];

const MOCK_VISA_TYPES: VisaType[] = [
  {
    id: 'investor',
    name: 'Investor Visa',
    description: 'For business owners and investors',
    price: 3000,
    processingTime: '7-10 days'
  },
  {
    id: 'employee',
    name: 'Employee Visa',
    description: 'For employees and staff members',
    price: 2500,
    processingTime: '5-7 days'
  },
  {
    id: 'dependent',
    name: 'Dependent Visa',
    description: 'For family members',
    price: 2000,
    processingTime: '3-5 days'
  },
  {
    id: 'partner',
    name: 'Partner Visa',
    description: 'For business partners',
    price: 2800,
    processingTime: '7-10 days'
  }
];

export const useGoogleSheetsData = () => {
  const [businessCategories, setBusinessCategories] = useState<BusinessCategory[]>([]);
  const [visaTypes, setVisaTypes] = useState<VisaType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to Google Sheets
    const fetchData = async () => {
      setIsLoading(true);
      
      // In a real implementation, you would:
      // 1. Use Google Sheets API
      // 2. Parse CSV data from the sheets
      // 3. Transform data into the required format
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBusinessCategories(MOCK_BUSINESS_CATEGORIES);
        setVisaTypes(MOCK_VISA_TYPES);
      } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getServicesByCategory = (categoryId: string): BusinessService[] => {
    const category = businessCategories.find(cat => cat.id === categoryId);
    return category?.services || [];
  };

  const calculatePricing = (
    selectedServices: string[],
    shareholders: number,
    visas: number,
    tenure: number,
    entityType: string
  ) => {
    // Mock pricing calculation - replace with actual Google Sheets data
    const services = businessCategories
      .flatMap(cat => cat.services)
      .filter(service => selectedServices.includes(service.id));
    
    const serviceCosts = services.reduce((total, service) => total + service.standardPrice, 0);
    const baseCost = entityType === 'freezone' ? 15000 : 12000;
    const shareholderCost = Math.max(0, shareholders - 1) * 1500;
    const visaCost = visas * 2500;
    const tenureFactor = tenure === 1 ? 1 : tenure === 3 ? 2.8 : 4.5;
    
    const totalPrice = (baseCost + serviceCosts + shareholderCost + visaCost) * tenureFactor;
    
    return {
      basePrice: baseCost * tenureFactor,
      serviceCosts: serviceCosts * tenureFactor,
      visaCosts: visaCost * tenureFactor,
      shareholderCosts: shareholderCost * tenureFactor,
      totalPrice,
      estimatedTimeline: `${Math.max(...services.map(s => parseInt(s.timeline)))} days`
    };
  };

  return {
    businessCategories,
    visaTypes,
    isLoading,
    getServicesByCategory,
    calculatePricing
  };
};