export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface Application {
  id: string;
  businessName: string;
  businessType: string;
  industry: string;
  ein: string;
  email: string;
  phone?: string;
  address: {
    street?: string;
    city: string;
    state: string;
    zip?: string;
  };
  customersCount: number;
  bankConnected: boolean;
  bankName?: string;
  invoicesCount: number;
  totalInvoiceAmount: number;
  submittedAt: Date;
  status: ApplicationStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  riskScore?: number;
  documentsVerified: boolean;
}

// Generate mock applications
export const mockApplications: Application[] = [
  {
    id: 'APP-001',
    businessName: 'TechStart Solutions',
    businessType: 'LLC',
    industry: 'Technology',
    ein: '12-3456789',
    email: 'finance@techstart.com',
    phone: '(555) 123-4567',
    address: {
      street: '123 Innovation Way',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
    },
    customersCount: 12,
    bankConnected: true,
    bankName: 'Chase Business',
    invoicesCount: 8,
    totalInvoiceAmount: 125000,
    submittedAt: new Date('2024-01-15T10:30:00'),
    status: 'under_review',
    riskScore: 82,
    documentsVerified: true,
  },
  {
    id: 'APP-002',
    businessName: 'GreenField Construction',
    businessType: 'Corporation',
    industry: 'Construction',
    ein: '98-7654321',
    email: 'accounting@greenfield.com',
    phone: '(555) 987-6543',
    address: {
      street: '456 Builder Ave',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
    },
    customersCount: 25,
    bankConnected: true,
    bankName: 'Bank of America',
    invoicesCount: 15,
    totalInvoiceAmount: 450000,
    submittedAt: new Date('2024-01-14T14:20:00'),
    status: 'pending',
    riskScore: 75,
    documentsVerified: true,
  },
  {
    id: 'APP-003',
    businessName: 'Healthcare Plus',
    businessType: 'LLC',
    industry: 'Healthcare',
    ein: '45-6789012',
    email: 'billing@healthcareplus.com',
    address: {
      city: 'New York',
      state: 'NY',
    },
    customersCount: 8,
    bankConnected: true,
    bankName: 'Wells Fargo',
    invoicesCount: 6,
    totalInvoiceAmount: 75000,
    submittedAt: new Date('2024-01-13T09:15:00'),
    status: 'approved',
    reviewedBy: 'Sarah Anderson',
    reviewedAt: new Date('2024-01-14T11:30:00'),
    riskScore: 88,
    documentsVerified: true,
  },
  {
    id: 'APP-004',
    businessName: 'Retail Express',
    businessType: 'Sole Proprietor',
    industry: 'Retail',
    ein: '67-8901234',
    email: 'owner@retailexpress.com',
    address: {
      city: 'Chicago',
      state: 'IL',
    },
    customersCount: 3,
    bankConnected: false,
    invoicesCount: 2,
    totalInvoiceAmount: 15000,
    submittedAt: new Date('2024-01-12T16:45:00'),
    status: 'rejected',
    reviewedBy: 'James Wilson',
    reviewedAt: new Date('2024-01-13T10:00:00'),
    notes: 'Insufficient business history and documentation',
    riskScore: 42,
    documentsVerified: false,
  },
  {
    id: 'APP-005',
    businessName: 'Digital Marketing Pro',
    businessType: 'LLC',
    industry: 'Marketing',
    ein: '34-5678901',
    email: 'team@digitalmarketingpro.com',
    phone: '(555) 234-5678',
    address: {
      street: '789 Creative Blvd',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90028',
    },
    customersCount: 18,
    bankConnected: true,
    bankName: 'Silicon Valley Bank',
    invoicesCount: 10,
    totalInvoiceAmount: 95000,
    submittedAt: new Date('2024-01-16T11:00:00'),
    status: 'pending',
    riskScore: 78,
    documentsVerified: true,
  },
  {
    id: 'APP-006',
    businessName: 'Supply Chain Solutions',
    businessType: 'Corporation',
    industry: 'Logistics',
    ein: '56-7890123',
    email: 'ops@supplychain.com',
    phone: '(555) 345-6789',
    address: {
      street: '321 Logistics Park',
      city: 'Dallas',
      state: 'TX',
      zip: '75201',
    },
    customersCount: 42,
    bankConnected: true,
    bankName: 'JP Morgan Chase',
    invoicesCount: 28,
    totalInvoiceAmount: 680000,
    submittedAt: new Date('2024-01-11T08:30:00'),
    status: 'approved',
    reviewedBy: 'Sarah Anderson',
    reviewedAt: new Date('2024-01-12T14:15:00'),
    riskScore: 91,
    documentsVerified: true,
  },
  {
    id: 'APP-007',
    businessName: 'Fresh Foods Co',
    businessType: 'LLC',
    industry: 'Food & Beverage',
    ein: '78-9012345',
    email: 'accounts@freshfoods.com',
    address: {
      city: 'Seattle',
      state: 'WA',
    },
    customersCount: 15,
    bankConnected: true,
    bankName: 'US Bank',
    invoicesCount: 12,
    totalInvoiceAmount: 145000,
    submittedAt: new Date('2024-01-16T13:20:00'),
    status: 'under_review',
    riskScore: 73,
    documentsVerified: true,
  },
  {
    id: 'APP-008',
    businessName: 'Property Management Plus',
    businessType: 'Corporation',
    industry: 'Real Estate',
    ein: '89-0123456',
    email: 'admin@pmplus.com',
    phone: '(555) 456-7890',
    address: {
      street: '555 Estate Drive',
      city: 'Miami',
      state: 'FL',
      zip: '33101',
    },
    customersCount: 35,
    bankConnected: true,
    bankName: 'PNC Bank',
    invoicesCount: 20,
    totalInvoiceAmount: 320000,
    submittedAt: new Date('2024-01-10T15:45:00'),
    status: 'approved',
    reviewedBy: 'James Wilson',
    reviewedAt: new Date('2024-01-11T09:30:00'),
    riskScore: 86,
    documentsVerified: true,
  },
];

// Helper functions for application management
export const getApplicationById = (id: string): Application | undefined => {
  return mockApplications.find(app => app.id === id);
};

export const getApplicationsByStatus = (status: ApplicationStatus): Application[] => {
  return mockApplications.filter(app => app.status === status);
};

export const getApplicationStats = () => {
  const total = mockApplications.length;
  const pending = mockApplications.filter(app => app.status === 'pending').length;
  const underReview = mockApplications.filter(app => app.status === 'under_review').length;
  const approved = mockApplications.filter(app => app.status === 'approved').length;
  const rejected = mockApplications.filter(app => app.status === 'rejected').length;
  
  const totalInvoiceValue = mockApplications.reduce((sum, app) => sum + app.totalInvoiceAmount, 0);
  const averageRiskScore = mockApplications.reduce((sum, app) => sum + (app.riskScore || 0), 0) / total;
  
  return {
    total,
    pending,
    underReview,
    approved,
    rejected,
    totalInvoiceValue,
    averageRiskScore: Math.round(averageRiskScore),
    approvalRate: Math.round((approved / total) * 100),
  };
};
