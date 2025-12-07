export type AuditAction = 
  | 'APPLICATION_APPROVED'
  | 'APPLICATION_REJECTED'
  | 'APPLICATION_REVIEWED'
  | 'DOCUMENT_VERIFIED'
  | 'DOCUMENT_REJECTED'
  | 'BULK_ACTION'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'EXPORT_DATA'
  | 'FILTER_APPLIED'
  | 'NOTE_ADDED'
  | 'STATUS_CHANGED';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  targetType: 'application' | 'document' | 'user' | 'system';
  targetId?: string;
  targetName?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];

  constructor() {
    // Load existing logs from localStorage
    this.loadLogs();
  }

  private loadLogs() {
    if (typeof window !== 'undefined' && localStorage) {
      const stored = localStorage.getItem('auditLogs');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          this.logs = parsed.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
        } catch (error) {
          console.error('Failed to load audit logs:', error);
        }
      }
    }
  }

  private saveLogs() {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        localStorage.setItem('auditLogs', JSON.stringify(this.logs));
      } catch (error) {
        console.error('Failed to save audit logs:', error);
      }
    }
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `AUDIT-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date(),
    };
    
    this.logs.unshift(newEntry);
    
    // Keep only last 1000 entries
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000);
    }
    
    this.saveLogs();
  }

  getLogs(filters?: {
    userId?: string;
    action?: AuditAction;
    targetType?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let filtered = [...this.logs];
    
    if (filters) {
      if (filters.userId) {
        filtered = filtered.filter(log => log.userId === filters.userId);
      }
      if (filters.action) {
        filtered = filtered.filter(log => log.action === filters.action);
      }
      if (filters.targetType) {
        filtered = filtered.filter(log => log.targetType === filters.targetType);
      }
      if (filters.startDate) {
        filtered = filtered.filter(log => log.timestamp >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter(log => log.timestamp <= filters.endDate!);
      }
      if (filters.limit) {
        filtered = filtered.slice(0, filters.limit);
      }
    }
    
    return filtered;
  }

  getStats() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setDate(lastMonth.getDate() - 30);
    
    return {
      total: this.logs.length,
      today: this.logs.filter(log => log.timestamp >= today).length,
      yesterday: this.logs.filter(log => 
        log.timestamp >= yesterday && log.timestamp < today
      ).length,
      lastWeek: this.logs.filter(log => log.timestamp >= lastWeek).length,
      lastMonth: this.logs.filter(log => log.timestamp >= lastMonth).length,
      byAction: this.groupByAction(),
      byUser: this.groupByUser(),
      recentActivity: this.logs.slice(0, 10),
    };
  }

  private groupByAction(): Record<AuditAction, number> {
    const grouped: Partial<Record<AuditAction, number>> = {};
    
    this.logs.forEach(log => {
      grouped[log.action] = (grouped[log.action] || 0) + 1;
    });
    
    return grouped as Record<AuditAction, number>;
  }

  private groupByUser(): Array<{ userId: string; userName: string; count: number }> {
    const userMap = new Map<string, { userName: string; count: number }>();
    
    this.logs.forEach(log => {
      if (!userMap.has(log.userId)) {
        userMap.set(log.userId, { userName: log.userName, count: 0 });
      }
      userMap.get(log.userId)!.count++;
    });
    
    return Array.from(userMap.entries())
      .map(([userId, data]) => ({ userId, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  clear() {
    this.logs = [];
    this.saveLogs();
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const auditLog = new AuditLogService();
