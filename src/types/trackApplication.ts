export interface ApplicationStatus {
  id: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedAt: string;
  lastUpdated: string;
  jurisdictionType: string;
  selectedZone: string;
  packageName: string;
  contactDetails: {
    fullName: string;
    email: string;
    phone: string;
  };
  timeline: {
    step: string;
    status: 'completed' | 'current' | 'pending';
    date?: string;
    description: string;
  }[];
}

export interface RecentApplication {
  id: string;
  jurisdiction: string;
  status: string;
  submittedAt: string;
}