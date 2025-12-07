export type NotificationType = 
  | 'APPLICATION_SUBMITTED'
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'APPLICATION_REVIEWED'
  | 'COMMENT_ADDED'
  | 'COMMENT_MENTION'
  | 'DOCUMENT_VERIFIED'
  | 'BULK_ACTION_COMPLETED'
  | 'DAILY_SUMMARY'
  | 'WEEKLY_REPORT'
  | 'SLA_WARNING'
  | 'SYSTEM_ALERT';

export interface EmailTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  body: string;
  variables: string[];
  isActive: boolean;
}

export interface NotificationPreferences {
  userId: string;
  email: string;
  enabledTypes: NotificationType[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string;   // "08:00"
  };
  channels: {
    email: boolean;
    inApp: boolean;
    slack: boolean;
  };
}

export interface QueuedNotification {
  id: string;
  userId: string;
  type: NotificationType;
  subject: string;
  body: string;
  data: Record<string, any>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  scheduledFor: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  error?: string;
}

class NotificationService {
  private templates: EmailTemplate[] = [];
  private preferences: Map<string, NotificationPreferences> = new Map();
  private queue: QueuedNotification[] = [];

  constructor() {
    this.loadData();
    this.initDefaultTemplates();
  }

  private loadData() {
    if (typeof window === 'undefined' || !localStorage) return;
    // Load templates
    const storedTemplates = localStorage.getItem('emailTemplates');
    if (storedTemplates) {
      try {
        this.templates = JSON.parse(storedTemplates);
      } catch (error) {
        console.error('Failed to load email templates:', error);
      }
    }

    // Load preferences
    const storedPreferences = localStorage.getItem('notificationPreferences');
    if (storedPreferences) {
      try {
        const prefs = JSON.parse(storedPreferences);
        this.preferences = new Map(prefs);
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      }
    }

    // Load queue
    const storedQueue = localStorage.getItem('notificationQueue');
    if (storedQueue) {
      try {
        const queue = JSON.parse(storedQueue);
        this.queue = queue.map((item: any) => ({
          ...item,
          scheduledFor: new Date(item.scheduledFor),
          sentAt: item.sentAt ? new Date(item.sentAt) : undefined,
        }));
      } catch (error) {
        console.error('Failed to load notification queue:', error);
      }
    }
  }

  private saveData() {
    if (typeof window === 'undefined' || !localStorage) return;
    try {
      localStorage.setItem('emailTemplates', JSON.stringify(this.templates));
      localStorage.setItem('notificationPreferences', JSON.stringify(Array.from(this.preferences.entries())));
      localStorage.setItem('notificationQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save notification data:', error);
    }
  }

  private initDefaultTemplates() {
    if (this.templates.length === 0) {
      this.templates = [
        {
          id: 'TPL-001',
          name: 'Application Approved',
          type: 'APPLICATION_APPROVED',
          subject: 'Application {{applicationId}} Approved',
          body: `
            <h2>Application Approved</h2>
            <p>The application {{applicationId}} for {{businessName}} has been approved.</p>
            <p><strong>Approved by:</strong> {{approvedBy}}</p>
            <p><strong>Date:</strong> {{date}}</p>
            <p><strong>Notes:</strong> {{notes}}</p>
          `,
          variables: ['applicationId', 'businessName', 'approvedBy', 'date', 'notes'],
          isActive: true,
        },
        {
          id: 'TPL-002',
          name: 'New Application Submitted',
          type: 'APPLICATION_SUBMITTED',
          subject: 'New Application: {{businessName}}',
          body: `
            <h2>New Application Submitted</h2>
            <p>A new application has been submitted and requires review.</p>
            <p><strong>Business:</strong> {{businessName}}</p>
            <p><strong>Application ID:</strong> {{applicationId}}</p>
            <p><strong>Risk Score:</strong> {{riskScore}}</p>
            <p><strong>Invoice Value:</strong> {{invoiceValue}}</p>
            <a href="{{reviewUrl}}">Review Application</a>
          `,
          variables: ['applicationId', 'businessName', 'riskScore', 'invoiceValue', 'reviewUrl'],
          isActive: true,
        },
        {
          id: 'TPL-003',
          name: 'Daily Summary',
          type: 'DAILY_SUMMARY',
          subject: 'Daily Summary - {{date}}',
          body: `
            <h2>Daily Activity Summary</h2>
            <p>Here's your daily summary for {{date}}:</p>
            <ul>
              <li>New Applications: {{newApplications}}</li>
              <li>Approved: {{approved}}</li>
              <li>Rejected: {{rejected}}</li>
              <li>Pending Review: {{pending}}</li>
            </ul>
            <p><strong>Total Invoice Value:</strong> {{totalValue}}</p>
          `,
          variables: ['date', 'newApplications', 'approved', 'rejected', 'pending', 'totalValue'],
          isActive: true,
        },
      ];
      this.saveData();
    }
  }

  // Queue a notification
  queueNotification(
    userId: string,
    type: NotificationType,
    data: Record<string, any>,
    priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
  ): string {
    const template = this.templates.find(t => t.type === type && t.isActive);
    if (!template) {
      console.warn(`No active template found for notification type: ${type}`);
      return '';
    }

    const preferences = this.preferences.get(userId);
    if (!preferences || !preferences.enabledTypes.includes(type)) {
      console.log(`Notifications disabled for user ${userId} and type ${type}`);
      return '';
    }

    // Process template variables
    let subject = template.subject;
    let body = template.body;
    
    template.variables.forEach(variable => {
      const value = data[variable] || '';
      subject = subject.replace(`{{${variable}}}`, value);
      body = body.replace(`{{${variable}}}`, value);
    });

    // Calculate scheduled time based on preferences
    let scheduledFor = new Date();
    
    if (preferences.frequency === 'hourly') {
      scheduledFor.setHours(scheduledFor.getHours() + 1, 0, 0, 0);
    } else if (preferences.frequency === 'daily') {
      scheduledFor.setDate(scheduledFor.getDate() + 1);
      scheduledFor.setHours(9, 0, 0, 0);
    } else if (preferences.frequency === 'weekly') {
      scheduledFor.setDate(scheduledFor.getDate() + (7 - scheduledFor.getDay()));
      scheduledFor.setHours(9, 0, 0, 0);
    }

    // Check quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(preferences.quietHours.start.split(':')[0]);
      const endHour = parseInt(preferences.quietHours.end.split(':')[0]);
      
      if (currentHour >= startHour || currentHour < endHour) {
        scheduledFor.setHours(endHour, 0, 0, 0);
      }
    }

    const notification: QueuedNotification = {
      id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId,
      type,
      subject,
      body,
      data,
      priority,
      scheduledFor,
      status: 'pending',
      attempts: 0,
    };

    this.queue.push(notification);
    this.saveData();
    
    // Simulate sending for immediate notifications
    if (preferences.frequency === 'immediate') {
      this.processQueue();
    }
    
    return notification.id;
  }

  // Process pending notifications
  processQueue(): number {
    const now = new Date();
    const pending = this.queue.filter(
      n => n.status === 'pending' && n.scheduledFor <= now
    );

    let processed = 0;
    
    pending.forEach(notification => {
      try {
        // Simulate sending email
        console.log(`Sending email to user ${notification.userId}:`);
        console.log(`Subject: ${notification.subject}`);
        console.log(`Priority: ${notification.priority}`);
        
        // Mark as sent
        notification.status = 'sent';
        notification.sentAt = new Date();
        notification.attempts++;
        
        processed++;
      } catch (error) {
        notification.status = 'failed';
        notification.attempts++;
        notification.error = String(error);
        
        // Retry logic
        if (notification.attempts < 3) {
          notification.status = 'pending';
          notification.scheduledFor = new Date(Date.now() + 5 * 60 * 1000); // Retry in 5 minutes
        }
      }
    });

    this.saveData();
    return processed;
  }

  // User preference management
  getUserPreferences(userId: string): NotificationPreferences {
    return this.preferences.get(userId) || {
      userId,
      email: '',
      enabledTypes: [
        'APPLICATION_APPROVED',
        'APPLICATION_REJECTED',
        'COMMENT_MENTION',
        'SLA_WARNING',
      ],
      frequency: 'immediate',
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
      channels: {
        email: true,
        inApp: true,
        slack: false,
      },
    };
  }

  updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): void {
    const current = this.getUserPreferences(userId);
    const updated = { ...current, ...preferences, userId };
    this.preferences.set(userId, updated);
    this.saveData();
  }

  // Template management
  getTemplates(): EmailTemplate[] {
    return [...this.templates];
  }

  updateTemplate(templateId: string, updates: Partial<EmailTemplate>): boolean {
    const index = this.templates.findIndex(t => t.id === templateId);
    
    if (index !== -1) {
      this.templates[index] = { ...this.templates[index], ...updates };
      this.saveData();
      return true;
    }
    
    return false;
  }

  // Analytics
  getNotificationStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return {
      total: this.queue.length,
      pending: this.queue.filter(n => n.status === 'pending').length,
      sent: this.queue.filter(n => n.status === 'sent').length,
      failed: this.queue.filter(n => n.status === 'failed').length,
      todaysSent: this.queue.filter(
        n => n.status === 'sent' && n.sentAt && n.sentAt >= today
      ).length,
      weeklyStats: this.queue.filter(
        n => n.sentAt && n.sentAt >= lastWeek
      ).reduce((acc, n) => {
        const day = n.sentAt!.toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}

export const notificationService = new NotificationService();
