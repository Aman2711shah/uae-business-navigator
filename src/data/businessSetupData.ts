import { Building2, Users, Plane, FileText, Calculator, CheckCircle } from "lucide-react";
import { BusinessSetupStep, LegalEntityType } from "@/types/businessSetup";

export const businessActivities = {
  "Trading": [
    "General Trading", "Import/Export", "Wholesale Trading", "Retail Trading", 
    "E-commerce Trading", "Food Trading", "Electronics Trading", "Textile Trading"
  ],
  "Services": [
    "Consulting Services", "IT Services", "Marketing Services", "Legal Services",
    "Accounting Services", "HR Services", "Real Estate Services", "Tourism Services"
  ],
  "Manufacturing": [
    "Food Manufacturing", "Textile Manufacturing", "Electronics Manufacturing",
    "Chemical Manufacturing", "Plastic Manufacturing", "Metal Manufacturing"
  ],
  "Construction": [
    "General Construction", "Civil Engineering", "Interior Design", "Architecture",
    "Project Management", "MEP Services"
  ],
  "Healthcare": [
    "Medical Services", "Dental Services", "Pharmacy", "Medical Equipment",
    "Health Consulting", "Wellness Services"
  ],
  "Education": [
    "Training Services", "Educational Consulting", "Language Training",
    "Professional Development", "Online Education"
  ]
};

export const legalEntityTypes: LegalEntityType[] = [
  { value: "sole", label: "Sole Establishment", description: "Single owner business" },
  { value: "llc", label: "Limited Liability Company (LLC)", description: "Multiple shareholders" },
  { value: "fzc", label: "Free Zone Company (FZC/FZE)", description: "Free zone establishment" },
  { value: "branch", label: "Branch Office", description: "Extension of foreign company" },
  { value: "offshore", label: "Offshore Company", description: "International business" }
];

export const businessSetupSteps: BusinessSetupStep[] = [
  { number: 1, title: "Business Activities", icon: Building2 },
  { number: 2, title: "Shareholders", icon: Users },
  { number: 3, title: "Visa Requirements", icon: Plane },
  { number: 4, title: "Legal Entity", icon: FileText },
  { number: 5, title: "Cost Estimation", icon: Calculator },
  { number: 6, title: "Summary & CTA", icon: CheckCircle }
];