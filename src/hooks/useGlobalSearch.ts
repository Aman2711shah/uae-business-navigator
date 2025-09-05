import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { growthServices } from '@/data/growthData';

// Service categories from Services page
const serviceCategories = [
  {
    title: "Company Formation & Licensing",
    services: [
      { name: "Trade License Application & Renewals", description: "Complete trade license processing and renewals" },
      { name: "Name Reservation & Initial Approvals", description: "Business name registration and approval" },
      { name: "Drafting & Notarization of MOA/LSA Agreements", description: "Legal document preparation and notarization" },
      { name: "Chamber of Commerce Registration", description: "Registration with local chamber of commerce" },
      { name: "DED & Free Zone License Processes", description: "Department of Economic Development licensing" }
    ]
  },
  {
    title: "Immigration & Visa Services",
    services: [
      { name: "Establishment Card Application/Renewal", description: "Company establishment card processing" },
      { name: "Investor/Partner Visa Processing", description: "Investor and partner visa applications" },
      { name: "Employment Visa Processing", description: "Work permit and employment visa services" },
      { name: "Family Visa (Dependent) Applications", description: "Dependent family member visa processing" },
      { name: "Visa Cancellation & Status Change", description: "Visa cancellation and status modification services" },
      { name: "Emirates ID Application & Renewal", description: "Emirates ID processing and renewals" },
      { name: "Medical Test Appointment & Follow-Up", description: "Medical examination coordination" },
      { name: "Labour Contract Preparation & Submission", description: "Employment contract processing" }
    ]
  },
  {
    title: "Government Liaison & Approvals",
    services: [
      { name: "Coordination with MOHRE, GDRFA, DED, MOFA", description: "Government department coordination" },
      { name: "Document Clearance with Government Departments", description: "Official document processing" },
      { name: "Municipality Approvals & Permits", description: "Local authority permits and approvals" },
      { name: "Health Authority Licensing (DHA/DOH/MOH)", description: "Health sector licensing and permits" }
    ]
  },
  {
    title: "Attestation & Legalization",
    services: [
      { name: "Attestation of Educational, Commercial & POA Documents", description: "Document attestation services" },
      { name: "MOFA Attestation", description: "Ministry of Foreign Affairs attestation" },
      { name: "Consulate/Embassy Legalization", description: "Diplomatic legalization services" },
      { name: "Legal Translation & Notarization Support", description: "Translation and notarization services" }
    ]
  },
  {
    title: "Corporate Compliance",
    services: [
      { name: "Labour Card & WPS Setup", description: "Labour card and wage protection system setup" },
      { name: "Company Immigration & Labour File Opening", description: "Immigration and labour file establishment" },
      { name: "GOSI Registration (if applicable)", description: "General Organization for Social Insurance registration" },
      { name: "Renewal Reminders & Compliance Tracking", description: "Compliance monitoring and renewal tracking" },
      { name: "E-Signature Card Application", description: "Digital signature card processing" }
    ]
  },
  {
    title: "Accounting & Bookkeeping",
    services: [
      { name: "Monthly & Quarterly Bookkeeping", description: "Regular bookkeeping and financial record maintenance" },
      { name: "Financial Statement Preparation", description: "Comprehensive financial statement preparation" },
      { name: "Management Reporting", description: "Management reports and financial analysis" },
      { name: "IFRS-Compliant Accounting", description: "International financial reporting standards compliance" }
    ]
  },
  {
    title: "Taxation Services",
    services: [
      { name: "VAT Registration & Deregistration", description: "Value Added Tax registration services" },
      { name: "VAT Return Filing & Compliance", description: "VAT return preparation and filing" },
      { name: "VAT Advisory & Health Checks", description: "VAT consultation and compliance review" },
      { name: "Corporate Tax Registration", description: "Corporate tax registration and setup" },
      { name: "CT Return Filing & Advisory", description: "Corporate tax return filing and advice" },
      { name: "QFZP/Exempt Status Planning", description: "Qualifying free zone person status planning" },
      { name: "Tax Structuring & Optimization", description: "Tax planning and optimization strategies" }
    ]
  },
  {
    title: "Payroll & HR Compliance",
    services: [
      { name: "Payroll Processing & Payslip Generation", description: "Complete payroll management services" },
      { name: "WPS Compliance & Reporting", description: "Wage Protection System compliance" },
      { name: "Employee Expense Management", description: "Employee expense tracking and management" },
      { name: "HR Policy & Leave Tracking Systems", description: "HR policy development and leave management" }
    ]
  },
  {
    title: "Audit & Assurance",
    services: [
      { name: "External Audit Coordination", description: "External audit coordination and support" },
      { name: "Internal Audit & Risk Reviews", description: "Internal audit and risk assessment services" },
      { name: "Statutory Compliance Reviews", description: "Regulatory compliance audits" },
      { name: "Agreed-Upon Procedures (AUP)", description: "Agreed-upon procedures engagements" }
    ]
  },
  {
    title: "Regulatory Compliance & Filings",
    services: [
      { name: "ESR, UBO & AML Reporting", description: "Economic substance, beneficial ownership, and anti-money laundering reporting" },
      { name: "Economic Substance Notifications & Reports", description: "Economic substance regulation compliance" },
      { name: "Corporate Governance Support", description: "Corporate governance advisory and support" },
      { name: "Annual License Renewal Support", description: "License renewal coordination and support" }
    ]
  },
  {
    title: "Advisory & Strategic Consulting",
    services: [
      { name: "Cross-Border Tax Advisory", description: "International tax planning and advisory" },
      { name: "Transfer Pricing Support", description: "Transfer pricing documentation and compliance" },
      { name: "M&A Due Diligence & Valuation", description: "Mergers and acquisitions due diligence" },
      { name: "CFO & Virtual Finance Office Services", description: "Outsourced CFO and finance office services" }
    ]
  },
  {
    title: "Other Support Services",
    services: [
      { name: "Typing Center Services", description: "Document typing and processing services" },
      { name: "Courier Coordination for Documents", description: "Document delivery and courier services" },
      { name: "Assistance with Fines, Penalties & Dispute Resolution", description: "Fine resolution and dispute handling" },
      { name: "Vehicle Registration & Renewal", description: "Vehicle registration and renewal services" },
      { name: "Tenancy Contract Registration (Ejari)", description: "Tenancy contract registration services" },
      { name: "Bank Account Opening Support", description: "Bank account opening assistance" },
      { name: "Health Insurance Registration", description: "Health insurance registration support" }
    ]
  }
];

export interface SearchResult {
  name: string;
  description: string;
  tab: 'Services' | 'Growth';
  category?: string;
  route: string;
}

export const useGlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Combine all searchable data
  const searchData = useMemo(() => {
    const services: SearchResult[] = [];

    // Add services from Services tab
    serviceCategories.forEach(category => {
      category.services.forEach(service => {
        services.push({
          name: service.name,
          description: service.description,
          tab: 'Services',
          category: category.title,
          route: getServiceRoute(service.name, category.title)
        });
      });
    });

    // Add services from Growth tab
    growthServices.forEach(service => {
      services.push({
        name: service.title,
        description: service.description,
        tab: 'Growth',
        route: `/growth-service/${generateSlug(service.title)}`
      });
    });

    return services;
  }, []);

  // Fuse.js configuration for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(searchData, {
      keys: ['name', 'description', 'category'],
      threshold: 0.4, // Lower = more strict, Higher = more fuzzy
      includeScore: true,
      minMatchCharLength: 2
    });
  }, [searchData]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const results = fuse.search(searchTerm);
    return results.map(result => result.item).slice(0, 8); // Limit to 8 results
  }, [searchTerm, fuse]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    hasResults: searchResults.length > 0
  };
};

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function getServiceRoute(serviceName: string, categoryTitle: string): string {
  // Map categories to their routes
  const categoryMap: { [key: string]: string } = {
    "Company Formation & Licensing": "company-formation",
    "Immigration & Visa Services": "visa-immigration", 
    "Government Liaison & Approvals": "government-liaison-approvals",
    "Attestation & Legalization": "attestation-legalization",
    "Corporate Compliance": "corporate-compliance",
    "Accounting & Bookkeeping": "accounting-bookkeeping",
    "Taxation Services": "taxation-services",
    "Payroll & HR Compliance": "payroll-hr-compliance",
    "Audit & Assurance": "audit-assurance",
    "Regulatory Compliance & Filings": "regulatory-compliance-filings",
    "Advisory & Strategic Consulting": "advisory-strategic-consulting",
    "Other Support Services": "other-support-services"
  };
  
  const categoryId = categoryMap[categoryTitle];
  return categoryId ? `/service-category/${categoryId}` : '/services';
}