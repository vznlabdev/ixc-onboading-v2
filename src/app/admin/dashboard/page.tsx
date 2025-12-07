'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { mockApplications, getApplicationStats, Application, ApplicationStatus } from '@/lib/mockApplications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  X,
  Clock,
  TrendingUp,
  FileText,
  DollarSign,
  LogOut,
  User,
  RefreshCw,
  Download,
  Bell,
  FileSearch,
} from 'lucide-react';
import DocumentViewer from '@/components/DocumentViewer';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { adminUser, signOut, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isDocumentViewerOpen, setIsDocumentViewerOpen] = useState(false);
  const [viewingDocumentsForApp, setViewingDocumentsForApp] = useState<string | null>(null);
  const [selectedApplicationIds, setSelectedApplicationIds] = useState<Set<string>>(new Set());
  const [isBulkActionMode, setIsBulkActionMode] = useState(false);

  const stats = getApplicationStats();

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  useEffect(() => {
    let filtered = [...applications];
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredApplications(filtered);
  }, [searchTerm, statusFilter, applications]);

  const handleStatusChange = (appId: string, newStatus: ApplicationStatus, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          status: newStatus,
          reviewedBy: adminUser?.name,
          reviewedAt: new Date(),
          notes: notes || app.notes,
        };
      }
      return app;
    }));
    setIsReviewModalOpen(false);
  };

  const handleSelectApplication = (appId: string) => {
    setSelectedApplicationIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(appId)) {
        newSet.delete(appId);
      } else {
        newSet.add(appId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedApplicationIds.size === filteredApplications.length) {
      setSelectedApplicationIds(new Set());
    } else {
      setSelectedApplicationIds(new Set(filteredApplications.map(app => app.id)));
    }
  };

  const handleBulkAction = (action: 'approve' | 'reject' | 'review' | 'export') => {
    const selectedIds = Array.from(selectedApplicationIds);
    
    switch (action) {
      case 'approve':
        setApplications(prev => prev.map(app => {
          if (selectedIds.includes(app.id)) {
            return {
              ...app,
              status: 'approved' as ApplicationStatus,
              reviewedBy: adminUser?.name,
              reviewedAt: new Date(),
            };
          }
          return app;
        }));
        break;
      case 'reject':
        setApplications(prev => prev.map(app => {
          if (selectedIds.includes(app.id)) {
            return {
              ...app,
              status: 'rejected' as ApplicationStatus,
              reviewedBy: adminUser?.name,
              reviewedAt: new Date(),
            };
          }
          return app;
        }));
        break;
      case 'review':
        setApplications(prev => prev.map(app => {
          if (selectedIds.includes(app.id)) {
            return {
              ...app,
              status: 'under_review' as ApplicationStatus,
              reviewedBy: adminUser?.name,
              reviewedAt: new Date(),
            };
          }
          return app;
        }));
        break;
      case 'export':
        // Export selected applications
        console.log('Exporting applications:', selectedIds);
        break;
    }
    
    setSelectedApplicationIds(new Set());
    setIsBulkActionMode(false);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const styles = {
      pending: 'bg-gray-100 text-gray-700 border-gray-200',
      under_review: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      under_review: <RefreshCw className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    };
    
    return (
      <Badge className={`${styles[status]} border font-medium`}>
        <span className="flex items-center gap-1">
          {icons[status]}
          {status.replace('_', ' ')}
        </span>
      </Badge>
    );
  };

  const getRiskScoreBadge = (score?: number) => {
    if (!score) return null;
    
    const color = score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-yellow-700' : 'text-red-700';
    const bg = score >= 80 ? 'bg-emerald-50' : score >= 60 ? 'bg-yellow-50' : 'bg-red-50';
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bg} ${color}`}>
        Risk: {score}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/incoxchange-logomark.svg"
                  alt="IncoXchange"
                  width={24}
                  height={24}
                />
                <h1 className="font-semibold text-black">Admin Dashboard</h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium text-black">Applications</button>
                <button 
                  onClick={() => router.push('/admin/analytics')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Analytics
                </button>
                <button 
                  onClick={() => router.push('/admin/users')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Users
                </button>
                <button 
                  onClick={() => router.push('/admin/audit')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Audit Log
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-9">
                    <div className="w-7 h-7 rounded-full bg-black flex items-center justify-center text-white text-xs font-medium">
                      {adminUser?.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-medium hidden md:inline">{adminUser?.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-black">{adminUser?.name}</p>
                    <p className="text-xs text-gray-600">{adminUser?.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-700" />
                </div>
                <span className="text-xs text-gray-600">Total</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats.total}</p>
                <p className="text-xs text-gray-600">Applications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-700" />
                </div>
                <Badge className="bg-yellow-50 text-yellow-700 text-xs">
                  {stats.pending + stats.underReview}
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats.pending}</p>
                <p className="text-xs text-gray-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                </div>
                <span className="text-xs text-emerald-700 font-medium">+12%</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats.approvalRate}%</p>
                <p className="text-xs text-gray-600">Approval Rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-xs text-gray-600">Total</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  ${(stats.totalInvoiceValue / 1000000).toFixed(1)}M
                </p>
                <p className="text-xs text-gray-600">Invoice Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Actions Bar */}
        {selectedApplicationIds.size > 0 && (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-black">
                {selectedApplicationIds.size} application{selectedApplicationIds.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('review')}
              >
                Mark as Under Review
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => handleBulkAction('approve')}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Approve Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
                onClick={() => handleBulkAction('reject')}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction('export')}
              >
                <Download className="w-3 h-3 mr-1" />
                Export Selected
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setSelectedApplicationIds(new Set());
                setIsBulkActionMode(false);
              }}
            >
              Cancel
            </Button>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by business name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={isBulkActionMode ? "default" : "outline"}
            className="h-10"
            onClick={() => {
              setIsBulkActionMode(!isBulkActionMode);
              setSelectedApplicationIds(new Set());
            }}
          >
            {isBulkActionMode ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Exit Selection
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Select Multiple
              </>
            )}
          </Button>

          <Button variant="outline" className="h-10">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Applications Table */}
        <Card className="border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  {isBulkActionMode && (
                    <th className="text-left text-xs font-medium text-gray-600 p-4 w-12">
                      <Checkbox
                        checked={selectedApplicationIds.size === filteredApplications.length && filteredApplications.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th className="text-left text-xs font-medium text-gray-600 p-4">ID</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Business</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Status</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Risk Score</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Submitted</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Invoice Value</th>
                  <th className="text-left text-xs font-medium text-gray-600 p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr 
                    key={app.id} 
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      selectedApplicationIds.has(app.id) ? 'bg-gray-50' : ''
                    }`}
                  >
                    {isBulkActionMode && (
                      <td className="p-4 w-12">
                        <Checkbox
                          checked={selectedApplicationIds.has(app.id)}
                          onCheckedChange={() => handleSelectApplication(app.id)}
                        />
                      </td>
                    )}
                    <td className="p-4">
                      <span className="text-sm font-mono text-gray-600">{app.id}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm font-medium text-black">{app.businessName}</p>
                        <p className="text-xs text-gray-600">{app.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="p-4">
                      {getRiskScoreBadge(app.riskScore)}
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(app.submittedAt).toLocaleTimeString()}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-black">
                        ${app.totalInvoiceAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {app.invoicesCount} invoices
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(app);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setViewingDocumentsForApp(app.id);
                            setIsDocumentViewerOpen(true);
                          }}
                        >
                          <FileSearch className="w-3 h-3 mr-1" />
                          Docs
                        </Button>
                        {app.status === 'pending' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, 'under_review')}
                              >
                                Start Review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, 'approved')}
                                className="text-emerald-600"
                              >
                                Quick Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(app.id, 'rejected')}
                                className="text-red-600"
                              >
                                Quick Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Review Modal */}
      {isReviewModalOpen && selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => setIsReviewModalOpen(false)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Document Viewer */}
      {isDocumentViewerOpen && viewingDocumentsForApp && (
        <DocumentViewer
          applicationId={viewingDocumentsForApp}
          documents={[]}
          onClose={() => {
            setIsDocumentViewerOpen(false);
            setViewingDocumentsForApp(null);
          }}
          onVerify={(docId) => {
            // Handle document verification
            console.log('Document verified:', docId);
          }}
          onReject={(docId, reason) => {
            // Handle document rejection
            console.log('Document rejected:', docId, reason);
          }}
        />
      )}
    </div>
  );
}

// Review Modal Component
function ApplicationReviewModal({
  application,
  onClose,
  onStatusChange,
}: {
  application: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus, notes?: string) => void;
}) {
  const [notes, setNotes] = useState(application.notes || '');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-black">Application Review</h2>
              <p className="text-sm text-gray-600 mt-1">{application.id}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-black">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Business Information */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Business Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Business Name</p>
                <p className="text-sm text-black font-medium">{application.businessName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Business Type</p>
                <p className="text-sm text-black">{application.businessType}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Industry</p>
                <p className="text-sm text-black">{application.industry}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">EIN</p>
                <p className="text-sm text-black font-mono">{application.ein}</p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Financial Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Invoice Value</p>
                <p className="text-sm text-black font-medium">
                  ${application.totalInvoiceAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Number of Invoices</p>
                <p className="text-sm text-black">{application.invoicesCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Number of Customers</p>
                <p className="text-sm text-black">{application.customersCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Bank Connection</p>
                <p className="text-sm text-black">
                  {application.bankConnected ? `Connected (${application.bankName})` : 'Not Connected'}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Risk Assessment</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Risk Score</span>
                  <span className="text-sm font-medium text-black">{application.riskScore}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      application.riskScore! >= 80
                        ? 'bg-emerald-500'
                        : application.riskScore! >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${application.riskScore}%` }}
                  />
                </div>
              </div>
              <Badge className={`${application.documentsVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                Documents {application.documentsVerified ? 'Verified' : 'Not Verified'}
              </Badge>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-3">Review Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this application..."
              className="w-full h-24 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            {application.status === 'pending' && (
              <Button
                variant="outline"
                onClick={() => onStatusChange(application.id, 'under_review', notes)}
              >
                Mark Under Review
              </Button>
            )}
            <Button
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => onStatusChange(application.id, 'rejected', notes)}
            >
              Reject
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onStatusChange(application.id, 'approved', notes)}
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
