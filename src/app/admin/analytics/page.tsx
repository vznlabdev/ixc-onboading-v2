'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Calendar,
  ChevronDown,
  Bell,
  LogOut,
  User,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

// Mock data for charts
const applicationTrends = [
  { date: 'Jan 1', submitted: 12, approved: 8, rejected: 2, pending: 2 },
  { date: 'Jan 2', submitted: 15, approved: 10, rejected: 3, pending: 2 },
  { date: 'Jan 3', submitted: 18, approved: 14, rejected: 2, pending: 2 },
  { date: 'Jan 4', submitted: 22, approved: 16, rejected: 4, pending: 2 },
  { date: 'Jan 5', submitted: 25, approved: 18, rejected: 5, pending: 2 },
  { date: 'Jan 6', submitted: 20, approved: 15, rejected: 3, pending: 2 },
  { date: 'Jan 7', submitted: 28, approved: 20, rejected: 5, pending: 3 },
  { date: 'Jan 8', submitted: 32, approved: 24, rejected: 6, pending: 2 },
  { date: 'Jan 9', submitted: 30, approved: 22, rejected: 5, pending: 3 },
  { date: 'Jan 10', submitted: 35, approved: 26, rejected: 6, pending: 3 },
];

const riskDistribution = [
  { range: '0-20', count: 2, percentage: 5 },
  { range: '21-40', count: 3, percentage: 8 },
  { range: '41-60', count: 8, percentage: 20 },
  { range: '61-80', count: 15, percentage: 37 },
  { range: '81-100', count: 12, percentage: 30 },
];

const statusDistribution = [
  { name: 'Approved', value: 38, percentage: 47.5 },
  { name: 'Pending', value: 16, percentage: 20 },
  { name: 'Under Review', value: 12, percentage: 15 },
  { name: 'Rejected', value: 14, percentage: 17.5 },
];

const revenueProjections = [
  { month: 'Jan', actual: 1.2, projected: 1.1, invoiceValue: 2.5 },
  { month: 'Feb', actual: 1.5, projected: 1.4, invoiceValue: 3.2 },
  { month: 'Mar', actual: 1.8, projected: 1.7, invoiceValue: 3.8 },
  { month: 'Apr', actual: 2.1, projected: 2.2, invoiceValue: 4.5 },
  { month: 'May', actual: 2.4, projected: 2.5, invoiceValue: 5.1 },
  { month: 'Jun', actual: null, projected: 2.8, invoiceValue: 5.8 },
];

const processingTimeData = [
  { day: 'Mon', avgHours: 18 },
  { day: 'Tue', avgHours: 22 },
  { day: 'Wed', avgHours: 16 },
  { day: 'Thu', avgHours: 24 },
  { day: 'Fri', avgHours: 20 },
  { day: 'Sat', avgHours: 28 },
  { day: 'Sun', avgHours: 32 },
];

const topRejectionReasons = [
  { reason: 'Insufficient Documentation', count: 8, percentage: 32 },
  { reason: 'Low Risk Score', count: 6, percentage: 24 },
  { reason: 'Business History', count: 5, percentage: 20 },
  { reason: 'Financial Concerns', count: 4, percentage: 16 },
  { reason: 'Other', count: 2, percentage: 8 },
];

const COLORS = {
  primary: '#000000',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  gray: '#6b7280',
};

const pieColors = [COLORS.success, COLORS.warning, COLORS.info, COLORS.danger];

export default function AnalyticsPage() {
  const router = useRouter();
  const { adminUser, signOut, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [dateRange, setDateRange] = useState('last7days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-black mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
                <h1 className="font-semibold text-black">Analytics Dashboard</h1>
              </div>
              
              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => router.push('/admin/dashboard')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Applications
                </button>
                <button className="text-sm font-medium text-black">Analytics</button>
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
              {/* Date Range Selector */}
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40 h-9">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button variant="outline" size="sm" className="h-9">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>

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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs font-medium">12%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">87%</p>
                <p className="text-xs text-gray-600">Approval Rate</p>
                <p className="text-xs text-gray-500 mt-1">vs 75% last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-center gap-1 text-red-600">
                  <ArrowDown className="w-3 h-3" />
                  <span className="text-xs font-medium">8%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">22h</p>
                <p className="text-xs text-gray-600">Avg Processing Time</p>
                <p className="text-xs text-gray-500 mt-1">vs 20h last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs font-medium">25%</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">$2.4M</p>
                <p className="text-xs text-gray-600">Revenue Generated</p>
                <p className="text-xs text-gray-500 mt-1">vs $1.9M last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <ArrowUp className="w-3 h-3" />
                  <span className="text-xs font-medium">5</span>
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">78</p>
                <p className="text-xs text-gray-600">Avg Risk Score</p>
                <p className="text-xs text-gray-500 mt-1">vs 73 last period</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Application Trends */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Application Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-32 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={applicationTrends}>
                  <defs>
                    <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="submitted"
                    stroke={COLORS.primary}
                    fillOpacity={1}
                    fill="url(#colorSubmitted)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="approved"
                    stroke={COLORS.success}
                    fillOpacity={1}
                    fill="url(#colorApproved)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Score Distribution */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Risk Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {riskDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={
                          index < 2 ? COLORS.danger : 
                          index < 3 ? COLORS.warning : 
                          COLORS.success
                        } 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Projections */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Revenue Projections</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    stroke={COLORS.primary} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.primary, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="projected" 
                    stroke={COLORS.gray} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: COLORS.gray, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="invoiceValue" 
                    stroke={COLORS.success} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.success, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution Pie Chart */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Application Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width="60%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1">
                  {statusDistribution.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: pieColors[index] }}
                        />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-black">{item.value}</span>
                        <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Average Processing Time */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Average Processing Time by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={processingTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#999" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#999" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgHours" fill={COLORS.info} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Rejection Reasons */}
          <Card className="border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Top Rejection Reasons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRejectionReasons.map((reason, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{reason.reason}</span>
                      <span className="text-sm font-medium text-black">{reason.count} ({reason.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-gray-800 to-gray-600 h-2 rounded-full transition-all"
                        style={{ width: `${reason.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
