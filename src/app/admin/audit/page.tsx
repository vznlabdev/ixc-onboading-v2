'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { auditLog, type AuditLogEntry, type AuditAction } from '@/lib/auditLog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Activity,
  Calendar,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Filter,
  LogOut,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
  Bell,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  UserCheck,
  UserX,
} from 'lucide-react';

export default function AuditLogPage() {
  const router = useRouter();
  const { adminUser, signOut, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditAction | 'all'>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, actionFilter, userFilter, dateFilter, logs]);

  const loadLogs = () => {
    const allLogs = auditLog.getLogs();
    setLogs(allLogs);
    setStats(auditLog.getStats());
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.targetId?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by action
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    // Filter by user
    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.userId === userFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch (dateFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 30);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(log => log.timestamp >= startDate);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: AuditAction) => {
    const icons: Record<string, React.ReactElement> = {
      'APPLICATION_APPROVED': <CheckCircle className="w-4 h-4 text-emerald-600" />,
      'APPLICATION_REJECTED': <XCircle className="w-4 h-4 text-red-600" />,
      'APPLICATION_REVIEWED': <Eye className="w-4 h-4 text-blue-600" />,
      'USER_LOGIN': <UserCheck className="w-4 h-4 text-green-600" />,
      'USER_LOGOUT': <UserX className="w-4 h-4 text-gray-600" />,
      'BULK_ACTION': <FileText className="w-4 h-4 text-purple-600" />,
      'STATUS_CHANGED': <RefreshCw className="w-4 h-4 text-orange-600" />,
    };
    return icons[action] || <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getActionBadge = (action: AuditAction) => {
    const styles: Record<string, string> = {
      'APPLICATION_APPROVED': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'APPLICATION_REJECTED': 'bg-red-50 text-red-700 border-red-200',
      'APPLICATION_REVIEWED': 'bg-blue-50 text-blue-700 border-blue-200',
      'USER_LOGIN': 'bg-green-50 text-green-700 border-green-200',
      'USER_LOGOUT': 'bg-gray-50 text-gray-700 border-gray-200',
      'BULK_ACTION': 'bg-purple-50 text-purple-700 border-purple-200',
      'STATUS_CHANGED': 'bg-orange-50 text-orange-700 border-orange-200',
    };
    
    return (
      <Badge className={`${styles[action] || 'bg-gray-50 text-gray-700 border-gray-200'} border`}>
        {action.replace(/_/g, ' ').toLowerCase()}
      </Badge>
    );
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  const exportLogs = () => {
    const dataStr = auditLog.export();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `audit-log-${new Date().toISOString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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
                <h1 className="font-semibold text-black">Audit Log</h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Applications
                </button>
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
                <button className="text-sm font-medium text-black">Audit Log</button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={loadLogs}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportLogs}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
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
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <Badge className="bg-blue-50 text-blue-700 text-xs">Total</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats?.total || 0}</p>
                <p className="text-xs text-gray-600">Total Actions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-emerald-600" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 text-xs">24h</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats?.today || 0}</p>
                <p className="text-xs text-gray-600">Today's Actions</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <Badge className="bg-purple-50 text-purple-700 text-xs">Active</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats?.byUser?.length || 0}</p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <Badge className="bg-orange-50 text-orange-700 text-xs">7 days</Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{stats?.lastWeek || 0}</p>
                <p className="text-xs text-gray-600">This Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search by user, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <Select value={actionFilter} onValueChange={(value: any) => setActionFilter(value)}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="APPLICATION_APPROVED">Approvals</SelectItem>
              <SelectItem value="APPLICATION_REJECTED">Rejections</SelectItem>
              <SelectItem value="APPLICATION_REVIEWED">Reviews</SelectItem>
              <SelectItem value="USER_LOGIN">Logins</SelectItem>
              <SelectItem value="BULK_ACTION">Bulk Actions</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Audit Log Table */}
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="p-4 space-y-4">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-black">
                            {log.userName}
                            <span className="text-gray-600 font-normal"> performed </span>
                            {getActionBadge(log.action)}
                          </p>
                          {log.targetName && (
                            <p className="text-xs text-gray-600 mt-1">
                              Target: <span className="font-mono">{log.targetName}</span>
                              {log.targetId && (
                                <span className="text-gray-500"> (ID: {log.targetId})</span>
                              )}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <pre className="font-mono whitespace-pre-wrap">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm">No audit log entries found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
