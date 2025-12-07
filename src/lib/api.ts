import { Application, ApplicationStatus } from './mockApplications';
import { auditLog } from './auditLog';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
  retryAttempts: number;
  retryDelay: number;
  mockMode: boolean;
}

class ApiService {
  private config: ApiConfig = {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    retryAttempts: 3,
    retryDelay: 1000,
    mockMode: true, // Use mock mode by default
  };

  private authToken: string | null = null;

  // Set authentication token
  setAuthToken(token: string): void {
    this.authToken = token;
    this.config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Clear authentication
  clearAuth(): void {
    this.authToken = null;
    delete this.config.headers['Authorization'];
  }

  // Generic request method with retry logic
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    if (this.config.mockMode) {
      return this.mockRequest<T>(method, endpoint, data);
    }

    const url = `${this.config.baseUrl}${endpoint}`;
    let attempts = 0;

    while (attempts < this.config.retryAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method,
          headers: this.config.headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
          ...options,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 401) {
            this.clearAuth();
            return {
              success: false,
              error: 'Unauthorized',
              message: 'Please login again',
            };
          }

          if (response.status >= 500 && attempts < this.config.retryAttempts - 1) {
            attempts++;
            await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempts));
            continue;
          }

          const errorData = await response.json();
          return {
            success: false,
            error: errorData.error || 'Request failed',
            message: errorData.message,
          };
        }

        const responseData = await response.json();
        return {
          success: true,
          data: responseData,
        };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return {
            success: false,
            error: 'Request timeout',
            message: 'The request took too long to complete',
          };
        }

        if (attempts < this.config.retryAttempts - 1) {
          attempts++;
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * attempts));
          continue;
        }

        return {
          success: false,
          error: 'Network error',
          message: String(error),
        };
      }
    }

    return {
      success: false,
      error: 'Max retry attempts reached',
    };
  }

  // Mock request for demo mode
  private async mockRequest<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));

    // Mock responses based on endpoint
    if (endpoint.includes('/auth/login')) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: '1',
            email: data?.email,
            name: 'Mock User',
            role: 'admin',
          },
        } as any,
      };
    }

    if (endpoint.includes('/applications') && method === 'GET') {
      const mockApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      return {
        success: true,
        data: {
          items: mockApplications,
          total: mockApplications.length,
          page: 1,
          pageSize: 20,
          hasMore: false,
        } as any,
      };
    }

    if (endpoint.includes('/applications') && method === 'POST') {
      return {
        success: true,
        data: {
          id: `APP-${Date.now()}`,
          ...data,
          createdAt: new Date(),
        } as any,
      };
    }

    // Default mock response
    return {
      success: true,
      data: {} as any,
    };
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<{
    token: string;
    user: any;
  }>> {
    const response = await this.request<any>('POST', '/auth/login', { email, password });
    
    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
      
      // Log the login
      auditLog.log({
        userId: response.data.user.id,
        userName: response.data.user.name,
        userRole: response.data.user.role,
        action: 'USER_LOGIN',
        targetType: 'system',
        details: { email },
        status: 'success',
      });
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('POST', '/auth/logout');
    this.clearAuth();
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request<{ token: string }>('POST', '/auth/refresh');
  }

  // Application endpoints
  async getApplications(params?: {
    page?: number;
    pageSize?: number;
    status?: ApplicationStatus;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<ApiResponse<PaginatedResponse<Application>>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    return this.request<PaginatedResponse<Application>>(
      'GET',
      `/applications?${queryParams.toString()}`
    );
  }

  async getApplication(id: string): Promise<ApiResponse<Application>> {
    return this.request<Application>('GET', `/applications/${id}`);
  }

  async createApplication(data: Partial<Application>): Promise<ApiResponse<Application>> {
    const response = await this.request<Application>('POST', '/applications', data);
    
    if (response.success && response.data) {
      // Log the creation
      auditLog.log({
        userId: 'system',
        userName: 'System',
        userRole: 'system',
        action: 'STATUS_CHANGED',
        targetType: 'application',
        targetId: response.data.id,
        targetName: response.data.businessName,
        details: { businessName: response.data.businessName },
        status: 'success',
      });
    }

    return response;
  }

  async updateApplication(
    id: string,
    data: Partial<Application>
  ): Promise<ApiResponse<Application>> {
    return this.request<Application>('PATCH', `/applications/${id}`, data);
  }

  async approveApplication(
    id: string,
    notes?: string
  ): Promise<ApiResponse<Application>> {
    const response = await this.request<Application>(
      'POST',
      `/applications/${id}/approve`,
      { notes }
    );

    if (response.success) {
      auditLog.log({
        userId: this.authToken || 'unknown',
        userName: 'Current User',
        userRole: 'admin',
        action: 'APPLICATION_APPROVED',
        targetType: 'application',
        targetId: id,
        details: { notes },
        status: 'success',
      });
    }

    return response;
  }

  async rejectApplication(
    id: string,
    reason: string
  ): Promise<ApiResponse<Application>> {
    const response = await this.request<Application>(
      'POST',
      `/applications/${id}/reject`,
      { reason }
    );

    if (response.success) {
      auditLog.log({
        userId: this.authToken || 'unknown',
        userName: 'Current User',
        userRole: 'admin',
        action: 'APPLICATION_REJECTED',
        targetType: 'application',
        targetId: id,
        details: { reason },
        status: 'success',
      });
    }

    return response;
  }

  // Bulk operations
  async bulkApprove(ids: string[]): Promise<ApiResponse<{ updated: number }>> {
    return this.request<{ updated: number }>('POST', '/applications/bulk/approve', { ids });
  }

  async bulkReject(ids: string[], reason: string): Promise<ApiResponse<{ updated: number }>> {
    return this.request<{ updated: number }>('POST', '/applications/bulk/reject', {
      ids,
      reason,
    });
  }

  // Analytics endpoints
  async getAnalytics(params?: {
    startDate?: Date;
    endDate?: Date;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params) {
      if (params.startDate) {
        queryParams.append('startDate', params.startDate.toISOString());
      }
      if (params.endDate) {
        queryParams.append('endDate', params.endDate.toISOString());
      }
      if (params.groupBy) {
        queryParams.append('groupBy', params.groupBy);
      }
    }

    return this.request<any>('GET', `/analytics?${queryParams.toString()}`);
  }

  // Document endpoints
  async uploadDocument(
    applicationId: string,
    file: File
  ): Promise<ApiResponse<{ url: string; id: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicationId', applicationId);

    // For file uploads, we need to modify headers
    const headers = { ...this.config.headers };
    delete headers['Content-Type']; // Let browser set multipart boundary

    return this.request<{ url: string; id: string }>(
      'POST',
      '/documents/upload',
      formData,
      { headers }
    );
  }

  async getDocuments(applicationId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', `/applications/${applicationId}/documents`);
  }

  // User management endpoints
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/users');
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.request<any>('POST', '/users', userData);
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse<any>> {
    return this.request<any>('PATCH', `/users/${userId}`, userData);
  }

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    return this.request<void>('DELETE', `/users/${userId}`);
  }

  // Comments endpoints
  async getComments(applicationId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', `/applications/${applicationId}/comments`);
  }

  async addComment(
    applicationId: string,
    content: string
  ): Promise<ApiResponse<any>> {
    return this.request<any>('POST', `/applications/${applicationId}/comments`, {
      content,
    });
  }

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('GET', '/notifications');
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    return this.request<void>('PATCH', `/notifications/${id}/read`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; version: string }>> {
    return this.request<{ status: string; version: string }>('GET', '/health');
  }

  // Configuration methods
  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  setMockMode(enabled: boolean): void {
    this.config.mockMode = enabled;
  }

  setTimeout(timeout: number): void {
    this.config.timeout = timeout;
  }
}

// Create singleton instance
export const apiService = new ApiService();

// React hooks for API calls
export function useApi() {
  return apiService;
}
