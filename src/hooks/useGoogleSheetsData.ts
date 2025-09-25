import { useState, useEffect } from 'react';
import { BusinessCategory, BusinessService, VisaType, FreezonePackageData } from '@/types/businessSetup';

// Mock data structure - Replace with actual Google Sheets integration
const MOCK_BUSINESS_CATEGORIES: BusinessCategory[] = [
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Professional consulting services',
    services: [
      {
        id: 'business-consulting',
        name: 'Business Consulting',
        category: 'consulting',
        standardPrice: 5000,
        premiumPrice: 8000,
        timeline: '5-7 days',
        description: 'Professional business consulting services',
        documentRequirements: ['Business Plan', 'Financial Statements'],
        isRequired: true
      },
      {
        id: 'management-consulting',
        name: 'Management Consulting',
        category: 'consulting',
        standardPrice: 6000,
        premiumPrice: 9000,
        timeline: '7-10 days',
        description: 'Strategic management consulting',
        documentRequirements: ['Company Profile', 'Management Structure'],
        isRequired: false
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    description: 'Media and entertainment services',
    services: [
      {
        id: 'digital-media',
        name: 'Digital Media Production',
        category: 'media',
        standardPrice: 4500,
        premiumPrice: 7500,
        timeline: '3-5 days',
        description: 'Digital media content creation',
        documentRequirements: ['Portfolio', 'Equipment List'],
        isRequired: true
      },
      {
        id: 'advertising',
        name: 'Advertising Services',
        category: 'media',
        standardPrice: 5500,
        premiumPrice: 8500,
        timeline: '5-7 days',
        description: 'Comprehensive advertising solutions',
        documentRequirements: ['Campaign Strategy', 'Client Portfolio'],
        isRequired: false
      }
    ]
  },
  {
    id: 'retail',
    name: 'Retail',
    description: 'Retail and e-commerce business',
    services: [
      {
        id: 'e-commerce',
        name: 'E-commerce Platform',
        category: 'retail',
        standardPrice: 3500,
        premiumPrice: 6000,
        timeline: '7-10 days',
        description: 'Online retail platform setup',
        documentRequirements: ['Product Catalog', 'Supplier Agreements'],
        isRequired: true
      },
      {
        id: 'retail-store',
        name: 'Physical Retail Store',
        category: 'retail',
        standardPrice: 4000,
        premiumPrice: 7000,
        timeline: '10-14 days',
        description: 'Physical retail establishment',
        documentRequirements: ['Store Layout', 'Inventory Management'],
        isRequired: false
      }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'IT and software services',
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
        id: 'it-support',
        name: 'IT Support Services',
        category: 'technology',
        standardPrice: 3000,
        premiumPrice: 5000,
        timeline: '3-5 days',
        description: 'Technical support and maintenance',
        documentRequirements: ['Service Level Agreement', 'Technical Expertise'],
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