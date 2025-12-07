export interface FilterCriteria {
  searchTerm?: string;
  status?: string[];
  riskScoreMin?: number;
  riskScoreMax?: number;
  invoiceValueMin?: number;
  invoiceValueMax?: number;
  dateFrom?: Date;
  dateTo?: Date;
  businessType?: string[];
  industry?: string[];
  bankConnected?: boolean;
  documentsVerified?: boolean;
  reviewedBy?: string[];
  customersCountMin?: number;
  customersCountMax?: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  criteria: FilterCriteria;
  userId: string;
  isPublic: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  color?: string;
  icon?: string;
}

class FilterPresetsService {
  private presets: FilterPreset[] = [];

  constructor() {
    this.loadPresets();
    this.initDefaultPresets();
  }

  private loadPresets() {
    if (typeof window === 'undefined' || !localStorage) return;
    const stored = localStorage.getItem('filterPresets');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.presets = parsed.map((preset: any) => ({
          ...preset,
          createdAt: new Date(preset.createdAt),
          updatedAt: new Date(preset.updatedAt),
        }));
      } catch (error) {
        console.error('Failed to load filter presets:', error);
      }
    }
  }

  private savePresets() {
    if (typeof window === 'undefined' || !localStorage) return;
    try {
      localStorage.setItem('filterPresets', JSON.stringify(this.presets));
    } catch (error) {
      console.error('Failed to save filter presets:', error);
    }
  }

  private initDefaultPresets() {
    if (this.presets.length === 0) {
      const now = new Date();
      this.presets = [
        {
          id: 'PRESET-HIGH-RISK',
          name: 'High Risk Applications',
          description: 'Applications with risk score below 60',
          criteria: {
            riskScoreMin: 0,
            riskScoreMax: 60,
          },
          userId: 'system',
          isPublic: true,
          isDefault: true,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          color: 'red',
          icon: 'alert-circle',
        },
        {
          id: 'PRESET-HIGH-VALUE',
          name: 'High Value',
          description: 'Applications with invoice value over $100,000',
          criteria: {
            invoiceValueMin: 100000,
          },
          userId: 'system',
          isPublic: true,
          isDefault: true,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          color: 'green',
          icon: 'dollar-sign',
        },
        {
          id: 'PRESET-PENDING-REVIEW',
          name: 'Pending Review',
          description: 'Applications awaiting review',
          criteria: {
            status: ['pending', 'under_review'],
          },
          userId: 'system',
          isPublic: true,
          isDefault: true,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          color: 'yellow',
          icon: 'clock',
        },
        {
          id: 'PRESET-THIS-WEEK',
          name: 'This Week',
          description: 'Applications submitted this week',
          criteria: {
            dateFrom: new Date(now.setDate(now.getDate() - 7)),
            dateTo: new Date(),
          },
          userId: 'system',
          isPublic: true,
          isDefault: true,
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          color: 'blue',
          icon: 'calendar',
        },
      ];
      this.savePresets();
    }
  }

  // Create a new preset
  createPreset(
    name: string,
    criteria: FilterCriteria,
    userId: string,
    options?: {
      description?: string;
      isPublic?: boolean;
      color?: string;
      icon?: string;
    }
  ): FilterPreset {
    const now = new Date();
    const preset: FilterPreset = {
      id: `PRESET-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      description: options?.description,
      criteria,
      userId,
      isPublic: options?.isPublic || false,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      color: options?.color,
      icon: options?.icon,
    };

    this.presets.push(preset);
    this.savePresets();

    return preset;
  }

  // Update a preset
  updatePreset(presetId: string, updates: Partial<FilterPreset>): boolean {
    const index = this.presets.findIndex(p => p.id === presetId);

    if (index !== -1) {
      this.presets[index] = {
        ...this.presets[index],
        ...updates,
        updatedAt: new Date(),
      };
      this.savePresets();
      return true;
    }

    return false;
  }

  // Delete a preset
  deletePreset(presetId: string, userId: string): boolean {
    const preset = this.presets.find(p => p.id === presetId);

    if (preset && !preset.isDefault && (preset.userId === userId || userId === 'admin')) {
      const index = this.presets.indexOf(preset);
      this.presets.splice(index, 1);
      this.savePresets();
      return true;
    }

    return false;
  }

  // Get presets for a user
  getUserPresets(userId: string): FilterPreset[] {
    return this.presets.filter(
      p => p.isPublic || p.userId === userId || p.isDefault
    );
  }

  // Apply a preset (track usage)
  applyPreset(presetId: string): FilterCriteria | null {
    const preset = this.presets.find(p => p.id === presetId);

    if (preset) {
      preset.usageCount++;
      this.savePresets();
      return { ...preset.criteria };
    }

    return null;
  }

  // Get most used presets
  getMostUsedPresets(limit: number = 5): FilterPreset[] {
    return [...this.presets]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  // Build filter function from criteria
  buildFilterFunction(criteria: FilterCriteria): (item: any) => boolean {
    return (item: any) => {
      // Search term
      if (criteria.searchTerm) {
        const term = criteria.searchTerm.toLowerCase();
        const searchFields = [
          item.businessName,
          item.email,
          item.id,
          item.industry,
        ].filter(Boolean).map(f => f.toLowerCase());

        if (!searchFields.some(field => field.includes(term))) {
          return false;
        }
      }

      // Status filter
      if (criteria.status && criteria.status.length > 0) {
        if (!criteria.status.includes(item.status)) {
          return false;
        }
      }

      // Risk score range
      if (criteria.riskScoreMin !== undefined && item.riskScore < criteria.riskScoreMin) {
        return false;
      }
      if (criteria.riskScoreMax !== undefined && item.riskScore > criteria.riskScoreMax) {
        return false;
      }

      // Invoice value range
      if (criteria.invoiceValueMin !== undefined && item.totalInvoiceAmount < criteria.invoiceValueMin) {
        return false;
      }
      if (criteria.invoiceValueMax !== undefined && item.totalInvoiceAmount > criteria.invoiceValueMax) {
        return false;
      }

      // Date range
      if (criteria.dateFrom && new Date(item.submittedAt) < criteria.dateFrom) {
        return false;
      }
      if (criteria.dateTo && new Date(item.submittedAt) > criteria.dateTo) {
        return false;
      }

      // Business type
      if (criteria.businessType && criteria.businessType.length > 0) {
        if (!criteria.businessType.includes(item.businessType)) {
          return false;
        }
      }

      // Industry
      if (criteria.industry && criteria.industry.length > 0) {
        if (!criteria.industry.includes(item.industry)) {
          return false;
        }
      }

      // Bank connected
      if (criteria.bankConnected !== undefined && item.bankConnected !== criteria.bankConnected) {
        return false;
      }

      // Documents verified
      if (criteria.documentsVerified !== undefined && item.documentsVerified !== criteria.documentsVerified) {
        return false;
      }

      // Reviewed by
      if (criteria.reviewedBy && criteria.reviewedBy.length > 0) {
        if (!criteria.reviewedBy.includes(item.reviewedBy)) {
          return false;
        }
      }

      // Customers count range
      if (criteria.customersCountMin !== undefined && item.customersCount < criteria.customersCountMin) {
        return false;
      }
      if (criteria.customersCountMax !== undefined && item.customersCount > criteria.customersCountMax) {
        return false;
      }

      return true;
    };
  }

  // Export filters as JSON
  exportPresets(userId: string): string {
    const userPresets = this.getUserPresets(userId);
    return JSON.stringify(userPresets, null, 2);
  }

  // Import filters from JSON
  importPresets(jsonData: string, userId: string): number {
    try {
      const imported = JSON.parse(jsonData);
      let count = 0;

      if (Array.isArray(imported)) {
        imported.forEach(preset => {
          if (preset.criteria) {
            this.createPreset(
              preset.name || 'Imported Filter',
              preset.criteria,
              userId,
              {
                description: preset.description,
                isPublic: false,
                color: preset.color,
                icon: preset.icon,
              }
            );
            count++;
          }
        });
      }

      return count;
    } catch (error) {
      console.error('Failed to import presets:', error);
      return 0;
    }
  }
}

export const filterPresetsService = new FilterPresetsService();
