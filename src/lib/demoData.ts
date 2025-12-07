import { Application } from './mockApplications';
import { auditLog } from './auditLog';
import { commentsService } from './comments';
import { toast } from 'sonner';

interface DemoDataConfig {
  applicationCount?: number;
  commentCount?: number;
  auditLogCount?: number;
  dateRange?: number; // days
  scenario?: 'high-risk' | 'approved' | 'mixed' | 'rush' | 'realistic';
}

class DemoDataService {
  private readonly STORAGE_KEY = 'demoApplications';
  private readonly EXPIRY_KEY = 'demoDataExpiry';
  private readonly EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.checkExpiry();
    this.ensureInitialData();
  }

  private checkExpiry() {
    if (typeof window === 'undefined' || !localStorage) return;
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (expiry && Date.now() > parseInt(expiry)) {
      this.reset();
    }
  }

  private setExpiry() {
    if (typeof window === 'undefined' || !localStorage) return;
    const expiry = Date.now() + this.EXPIRY_DURATION;
    localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
  }

  private ensureInitialData() {
    const existing = this.getApplications();
    if (existing.length === 0) {
      this.generateScenario('realistic');
    }
  }

  getApplications(): Application[] {
    if (typeof window === 'undefined' || !localStorage) return [];
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load demo applications:', error);
      return [];
    }
  }

  saveApplications(applications: Application[]) {
    if (typeof window === 'undefined' || !localStorage) return;
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(applications));
      this.setExpiry();
    } catch (error) {
      console.error('Failed to save demo applications:', error);
    }
  }

  generateApplications(config: DemoDataConfig = {}): Application[] {
    const {
      applicationCount = 5,
      dateRange = 30,
      scenario = 'mixed',
    } = config;

    const industries = ['Technology', 'Healthcare', 'Retail', 'Construction', 'Manufacturing', 'Finance', 'Education'];
    const businessTypes = ['LLC', 'Corporation', 'Partnership', 'Sole Proprietor'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX'];
    const banks = ['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'US Bank', 'PNC', 'Capital One'];
    
    const businessNames = [
      'TechVision Solutions', 'DataFlow Systems', 'CloudPeak Technologies', 'InnovateLab Inc',
      'GreenLeaf Healthcare', 'MediCare Plus', 'HealthFirst Clinic', 'Wellness Partners',
      'RetailHub Express', 'ShopSmart Solutions', 'MarketPlace Pro', 'Commerce Connect',
      'BuildRight Construction', 'SteelFrame Builders', 'Foundation Works', 'CityScape Development',
      'Precision Manufacturing', 'AutoParts Direct', 'Industrial Solutions', 'Factory Systems',
    ];

    const applications: Application[] = [];

    for (let i = 0; i < applicationCount; i++) {
      const submittedDaysAgo = Math.floor(Math.random() * dateRange);
      const submittedAt = new Date();
      submittedAt.setDate(submittedAt.getDate() - submittedDaysAgo);

      let status: Application['status'] = 'pending';
      let riskScore = 50;

      // Scenario-based status and risk score
      switch (scenario) {
        case 'high-risk':
          riskScore = Math.floor(Math.random() * 40) + 20; // 20-60
          status = Math.random() > 0.7 ? 'rejected' : 'under_review';
          break;
        case 'approved':
          riskScore = Math.floor(Math.random() * 30) + 70; // 70-100
          status = 'approved';
          break;
        case 'rush':
          riskScore = Math.floor(Math.random() * 40) + 60; // 60-100
          status = 'pending';
          submittedAt.setHours(submittedAt.getHours() - Math.floor(Math.random() * 6));
          break;
        case 'realistic':
          riskScore = Math.floor(Math.random() * 50) + 50; // 50-100
          const statusRoll = Math.random();
          if (statusRoll < 0.3) status = 'pending';
          else if (statusRoll < 0.5) status = 'under_review';
          else if (statusRoll < 0.8) status = 'approved';
          else status = 'rejected';
          break;
        default: // mixed
          riskScore = Math.floor(Math.random() * 60) + 40; // 40-100
          const statuses: Application['status'][] = ['pending', 'under_review', 'approved', 'rejected'];
          status = statuses[Math.floor(Math.random() * statuses.length)];
      }

      const businessName = businessNames[Math.floor(Math.random() * businessNames.length)] + ` ${Date.now() % 1000}`;
      const cityIndex = Math.floor(Math.random() * cities.length);

      const app: Application = {
        id: `APP-${Date.now()}-${i}`,
        businessName,
        businessType: businessTypes[Math.floor(Math.random() * businessTypes.length)],
        industry: industries[Math.floor(Math.random() * industries.length)],
        ein: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
        email: businessName.toLowerCase().replace(/\s+/g, '') + '@example.com',
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        address: {
          street: `${Math.floor(Math.random() * 9999) + 1} ${['Main', 'Oak', 'Elm', 'Market', 'Park'][Math.floor(Math.random() * 5)]} Street`,
          city: cities[cityIndex],
          state: states[cityIndex],
          zip: `${Math.floor(Math.random() * 90000) + 10000}`,
        },
        customersCount: Math.floor(Math.random() * 100) + 1,
        bankConnected: Math.random() > 0.2,
        bankName: banks[Math.floor(Math.random() * banks.length)],
        invoicesCount: Math.floor(Math.random() * 50) + 1,
        totalInvoiceAmount: Math.floor(Math.random() * 900000) + 100000,
        submittedAt,
        status,
        riskScore,
        documentsVerified: riskScore > 60,
        reviewedBy: status === 'approved' || status === 'rejected' ? 'Sarah Anderson' : undefined,
        reviewedAt: status === 'approved' || status === 'rejected' ? new Date(submittedAt.getTime() + 24 * 60 * 60 * 1000) : undefined,
        notes: status === 'rejected' ? 'Insufficient documentation or risk score too low' : undefined,
      };

      applications.push(app);
    }

    return applications;
  }

  generateScenario(scenario: DemoDataConfig['scenario'] = 'realistic') {
    const configs: Record<NonNullable<DemoDataConfig['scenario']>, DemoDataConfig> = {
      'high-risk': {
        applicationCount: 10,
        scenario: 'high-risk',
        dateRange: 7,
      },
      'approved': {
        applicationCount: 8,
        scenario: 'approved',
        dateRange: 30,
      },
      'mixed': {
        applicationCount: 15,
        scenario: 'mixed',
        dateRange: 30,
      },
      'rush': {
        applicationCount: 20,
        scenario: 'rush',
        dateRange: 2,
      },
      'realistic': {
        applicationCount: 12,
        scenario: 'realistic',
        dateRange: 45,
      },
    };

    const config = configs[scenario];
    const newApplications = this.generateApplications(config);
    const existing = this.getApplications();
    const combined = [...existing, ...newApplications];
    
    this.saveApplications(combined);
    
    // Generate related data
    this.generateComments(newApplications);
    this.generateAuditLogs(newApplications);
    
    toast.success(`Generated ${scenario} scenario`, {
      description: `${newApplications.length} new applications added`,
    });
    
    return newApplications;
  }

  private generateComments(applications: Application[]) {
    const comments = [
      'Looks good, proceeding with review.',
      'Need additional documentation for verification.',
      'Risk score is concerning, requires further analysis.',
      'All requirements met, recommending approval.',
      'Missing bank statements from last quarter.',
      'Customer references check out positively.',
      'Financial projections seem optimistic.',
      'Previous application history is clean.',
    ];

    applications.slice(0, 5).forEach(app => {
      const commentCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < commentCount; i++) {
        commentsService.addComment({
          applicationId: app.id,
          userId: 'demo-user',
          userName: ['Sarah Anderson', 'James Wilson', 'Emily Davis'][Math.floor(Math.random() * 3)],
          userRole: 'reviewer',
          content: comments[Math.floor(Math.random() * comments.length)],
          isPinned: i === 0 && Math.random() > 0.7,
        });
      }
    });
  }

  private generateAuditLogs(applications: Application[]) {
    applications.forEach(app => {
      // Log application submission
      auditLog.log({
        userId: 'system',
        userName: 'System',
        userRole: 'system',
        action: 'STATUS_CHANGED',
        targetType: 'application',
        targetId: app.id,
        targetName: app.businessName,
        details: { status: app.status },
        status: 'success',
      });

      // Log status changes
      if (app.status === 'approved' || app.status === 'rejected') {
        auditLog.log({
          userId: 'demo-admin',
          userName: app.reviewedBy || 'Admin User',
          userRole: 'admin',
          action: app.status === 'approved' ? 'APPLICATION_APPROVED' : 'APPLICATION_REJECTED',
          targetType: 'application',
          targetId: app.id,
          targetName: app.businessName,
          details: { 
            previousStatus: 'under_review',
            newStatus: app.status,
            riskScore: app.riskScore,
          },
          status: 'success',
        });
      }
    });
  }

  addApplication(application: Application) {
    const applications = this.getApplications();
    applications.push(application);
    this.saveApplications(applications);
    return application;
  }

  updateApplication(id: string, updates: Partial<Application>) {
    const applications = this.getApplications();
    const index = applications.findIndex(app => app.id === id);
    
    if (index !== -1) {
      applications[index] = { ...applications[index], ...updates };
      this.saveApplications(applications);
      return applications[index];
    }
    
    return null;
  }

  deleteApplication(id: string) {
    const applications = this.getApplications();
    const filtered = applications.filter(app => app.id !== id);
    this.saveApplications(filtered);
    return filtered.length < applications.length;
  }

  reset() {
    if (typeof window === 'undefined' || !localStorage) return;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
    localStorage.removeItem('auditLogs');
    localStorage.removeItem('applicationComments');
    localStorage.removeItem('filterPresets');
    localStorage.removeItem('notificationQueue');
    
    // Generate fresh realistic data
    this.generateScenario('realistic');
    
    toast.success('Demo data reset', {
      description: 'Fresh sample data has been generated',
    });
  }

  getTimeUntilReset(): string {
    if (typeof window === 'undefined' || !localStorage) return '24h';
    const expiry = localStorage.getItem(this.EXPIRY_KEY);
    if (!expiry) return '24h';
    
    const remaining = parseInt(expiry) - Date.now();
    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  }
}

export const demoDataService = new DemoDataService();
