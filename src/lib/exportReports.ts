import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Application } from './mockApplications';

export type ReportType = 'pdf' | 'excel' | 'csv';
export type ReportFormat = 'summary' | 'detailed' | 'financial' | 'analytics';

interface ReportOptions {
  title?: string;
  dateRange?: { from: Date; to: Date };
  includeCharts?: boolean;
  includeComments?: boolean;
  includeAuditLog?: boolean;
  groupBy?: 'status' | 'date' | 'businessType' | 'industry';
}

class ExportReportsService {
  
  // Generate PDF Report
  async generatePDF(
    data: Application[],
    format: ReportFormat = 'summary',
    options: ReportOptions = {}
  ): Promise<Blob> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Add header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(options.title || 'Application Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;

    // Add date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString();
    pdf.text(`Generated: ${dateStr}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Add summary stats
    if (format === 'summary' || format === 'detailed') {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Statistics', margin, yPosition);
      yPosition += 8;

      const stats = this.calculateStats(data);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const statLines = [
        `Total Applications: ${stats.total}`,
        `Approved: ${stats.approved} (${stats.approvalRate}%)`,
        `Rejected: ${stats.rejected} (${stats.rejectionRate}%)`,
        `Pending: ${stats.pending}`,
        `Under Review: ${stats.underReview}`,
        `Total Invoice Value: $${stats.totalInvoiceValue.toLocaleString()}`,
        `Average Risk Score: ${stats.avgRiskScore}`,
      ];

      statLines.forEach(line => {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
      yPosition += 10;
    }

    // Add applications table
    if (format === 'detailed') {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Applications Detail', margin, yPosition);
      yPosition += 8;

      // Table headers
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      const headers = ['ID', 'Business', 'Status', 'Risk', 'Value', 'Date'];
      const columnWidths = [25, 45, 25, 15, 30, 35];
      let xPosition = margin;

      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });
      yPosition += 5;

      // Table rows
      pdf.setFont('helvetica', 'normal');
      data.slice(0, 20).forEach(app => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        xPosition = margin;
        const row = [
          app.id.substring(0, 10),
          app.businessName.substring(0, 20),
          app.status,
          app.riskScore?.toString() || 'N/A',
          `$${(app.totalInvoiceAmount / 1000).toFixed(0)}k`,
          new Date(app.submittedAt).toLocaleDateString(),
        ];

        row.forEach((cell, index) => {
          pdf.text(cell, xPosition, yPosition);
          xPosition += columnWidths[index];
        });
        yPosition += 5;
      });
    }

    // Add financial breakdown
    if (format === 'financial') {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Financial Analysis', margin, yPosition);
      yPosition += 8;

      const financial = this.calculateFinancialMetrics(data);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const financialLines = [
        `Total Invoice Value: $${financial.totalValue.toLocaleString()}`,
        `Average Invoice Value: $${financial.avgValue.toLocaleString()}`,
        `Median Invoice Value: $${financial.medianValue.toLocaleString()}`,
        `Largest Application: $${financial.maxValue.toLocaleString()}`,
        `Smallest Application: $${financial.minValue.toLocaleString()}`,
        '',
        'By Status:',
        ...Object.entries(financial.byStatus).map(([status, value]) => 
          `  ${status}: $${value.toLocaleString()}`
        ),
      ];

      financialLines.forEach(line => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      });
    }

    // Convert to blob
    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  }

  // Generate Excel Report
  async generateExcel(
    data: Application[],
    format: ReportFormat = 'detailed',
    options: ReportOptions = {}
  ): Promise<Blob> {
    const workbook = XLSX.utils.book_new();

    // Summary Sheet
    const summaryData = this.prepareSummaryData(data);
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Detailed Applications Sheet
    if (format === 'detailed') {
      const detailedData = data.map(app => ({
        'Application ID': app.id,
        'Business Name': app.businessName,
        'Business Type': app.businessType,
        'Industry': app.industry,
        'EIN': app.ein,
        'Email': app.email,
        'Phone': app.phone || 'N/A',
        'City': app.address.city,
        'State': app.address.state,
        'Status': app.status,
        'Risk Score': app.riskScore || 0,
        'Customers Count': app.customersCount,
        'Bank Connected': app.bankConnected ? 'Yes' : 'No',
        'Bank Name': app.bankName || 'N/A',
        'Invoices Count': app.invoicesCount,
        'Total Invoice Value': app.totalInvoiceAmount,
        'Submitted Date': new Date(app.submittedAt).toLocaleDateString(),
        'Reviewed By': app.reviewedBy || 'N/A',
        'Review Date': app.reviewedAt ? new Date(app.reviewedAt).toLocaleDateString() : 'N/A',
        'Documents Verified': app.documentsVerified ? 'Yes' : 'No',
      }));

      const detailSheet = XLSX.utils.json_to_sheet(detailedData);
      
      // Auto-size columns
      const columnWidths = Object.keys(detailedData[0] || {}).map(key => ({
        wch: Math.max(key.length, ...detailedData.map(row => String(row[key as keyof typeof row]).length))
      }));
      detailSheet['!cols'] = columnWidths;

      XLSX.utils.book_append_sheet(workbook, detailSheet, 'Applications');
    }

    // Financial Analysis Sheet
    if (format === 'financial' || format === 'analytics') {
      const financialData = this.prepareFinancialData(data);
      const financialSheet = XLSX.utils.json_to_sheet(financialData);
      XLSX.utils.book_append_sheet(workbook, financialSheet, 'Financial Analysis');
    }

    // Analytics Sheet
    if (format === 'analytics') {
      const analyticsData = this.prepareAnalyticsData(data);
      const analyticsSheet = XLSX.utils.json_to_sheet(analyticsData);
      XLSX.utils.book_append_sheet(workbook, analyticsSheet, 'Analytics');
    }

    // Export to blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    return blob;
  }

  // Generate CSV Report
  async generateCSV(data: Application[]): Promise<Blob> {
    const csvData = data.map(app => ({
      id: app.id,
      businessName: app.businessName,
      businessType: app.businessType,
      industry: app.industry,
      email: app.email,
      status: app.status,
      riskScore: app.riskScore || 0,
      totalInvoiceAmount: app.totalInvoiceAmount,
      submittedAt: new Date(app.submittedAt).toISOString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    return new Blob([csv], { type: 'text/csv' });
  }

  // Helper methods
  private calculateStats(data: Application[]) {
    const total = data.length;
    const approved = data.filter(app => app.status === 'approved').length;
    const rejected = data.filter(app => app.status === 'rejected').length;
    const pending = data.filter(app => app.status === 'pending').length;
    const underReview = data.filter(app => app.status === 'under_review').length;
    
    const totalInvoiceValue = data.reduce((sum, app) => sum + app.totalInvoiceAmount, 0);
    const avgRiskScore = Math.round(
      data.reduce((sum, app) => sum + (app.riskScore || 0), 0) / total
    );
    
    return {
      total,
      approved,
      rejected,
      pending,
      underReview,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      rejectionRate: total > 0 ? Math.round((rejected / total) * 100) : 0,
      totalInvoiceValue,
      avgRiskScore,
    };
  }

  private calculateFinancialMetrics(data: Application[]) {
    const values = data.map(app => app.totalInvoiceAmount);
    const sortedValues = values.sort((a, b) => a - b);
    
    const totalValue = values.reduce((sum, val) => sum + val, 0);
    const avgValue = Math.round(totalValue / values.length);
    const medianValue = sortedValues[Math.floor(sortedValues.length / 2)];
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    
    const byStatus = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + app.totalInvoiceAmount;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalValue,
      avgValue,
      medianValue,
      maxValue,
      minValue,
      byStatus,
    };
  }

  private prepareSummaryData(data: Application[]) {
    const stats = this.calculateStats(data);
    return [
      { Metric: 'Total Applications', Value: stats.total },
      { Metric: 'Approved', Value: stats.approved },
      { Metric: 'Rejected', Value: stats.rejected },
      { Metric: 'Pending', Value: stats.pending },
      { Metric: 'Under Review', Value: stats.underReview },
      { Metric: 'Approval Rate', Value: `${stats.approvalRate}%` },
      { Metric: 'Total Invoice Value', Value: `$${stats.totalInvoiceValue.toLocaleString()}` },
      { Metric: 'Average Risk Score', Value: stats.avgRiskScore },
    ];
  }

  private prepareFinancialData(data: Application[]) {
    const byIndustry = data.reduce((acc, app) => {
      if (!acc[app.industry]) {
        acc[app.industry] = { count: 0, value: 0 };
      }
      acc[app.industry].count++;
      acc[app.industry].value += app.totalInvoiceAmount;
      return acc;
    }, {} as Record<string, { count: number; value: number }>);
    
    return Object.entries(byIndustry).map(([industry, data]) => ({
      Industry: industry,
      'Application Count': data.count,
      'Total Value': `$${data.value.toLocaleString()}`,
      'Average Value': `$${Math.round(data.value / data.count).toLocaleString()}`,
    }));
  }

  private prepareAnalyticsData(data: Application[]) {
    // Group by date
    const byDate = data.reduce((acc, app) => {
      const date = new Date(app.submittedAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { count: 0, value: 0, approved: 0, rejected: 0 };
      }
      acc[date].count++;
      acc[date].value += app.totalInvoiceAmount;
      if (app.status === 'approved') acc[date].approved++;
      if (app.status === 'rejected') acc[date].rejected++;
      return acc;
    }, {} as Record<string, any>);
    
    return Object.entries(byDate).map(([date, data]) => ({
      Date: date,
      'Applications': data.count,
      'Total Value': `$${data.value.toLocaleString()}`,
      'Approved': data.approved,
      'Rejected': data.rejected,
      'Approval Rate': data.count > 0 ? `${Math.round((data.approved / data.count) * 100)}%` : '0%',
    }));
  }

  // Download helper
  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export const exportReportsService = new ExportReportsService();
