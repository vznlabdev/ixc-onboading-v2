'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  Bell,
  LogOut,
  User,
  Key,
  Activity,
} from 'lucide-react';

interface AdminUserData {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'viewer';
  department?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  lastLogin?: Date;
  permissions: {
    canApprove: boolean;
    canReject: boolean;
    canComment: boolean;
    canExport: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
  };
  stats: {
    applicationsReviewed: number;
    applicationsApproved: number;
    applicationsRejected: number;
    avgResponseTime: number; // in hours
  };
}

// Mock data
const mockUsers: AdminUserData[] = [
  {
    id: '1',
    email: 'admin@incoxchange.com',
    name: 'Sarah Anderson',
    role: 'admin',
    department: 'Operations',
    phone: '+1 (555) 123-4567',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-01-16T10:30:00'),
    permissions: {
      canApprove: true,
      canReject: true,
      canComment: true,
      canExport: true,
      canViewAnalytics: true,
      canManageUsers: true,
    },
    stats: {
      applicationsReviewed: 145,
      applicationsApproved: 98,
      applicationsRejected: 47,
      avgResponseTime: 2.4,
    },
  },
  {
    id: '2',
    email: 'reviewer@incoxchange.com',
    name: 'James Wilson',
    role: 'reviewer',
    department: 'Risk Management',
    phone: '+1 (555) 234-5678',
    status: 'active',
    createdAt: new Date('2023-03-22'),
    lastLogin: new Date('2024-01-16T09:15:00'),
    permissions: {
      canApprove: true,
      canReject: true,
      canComment: true,
      canExport: true,
      canViewAnalytics: true,
      canManageUsers: false,
    },
    stats: {
      applicationsReviewed: 89,
      applicationsApproved: 62,
      applicationsRejected: 27,
      avgResponseTime: 3.1,
    },
  },
  {
    id: '3',
    email: 'emily.davis@incoxchange.com',
    name: 'Emily Davis',
    role: 'reviewer',
    department: 'Compliance',
    status: 'active',
    createdAt: new Date('2023-06-10'),
    lastLogin: new Date('2024-01-15T14:22:00'),
    permissions: {
      canApprove: true,
      canReject: false,
      canComment: true,
      canExport: false,
      canViewAnalytics: true,
      canManageUsers: false,
    },
    stats: {
      applicationsReviewed: 56,
      applicationsApproved: 45,
      applicationsRejected: 11,
      avgResponseTime: 4.2,
    },
  },
  {
    id: '4',
    email: 'viewer@incoxchange.com',
    name: 'Michael Chen',
    role: 'viewer',
    department: 'Analytics',
    status: 'inactive',
    createdAt: new Date('2023-09-05'),
    lastLogin: new Date('2024-01-10T11:00:00'),
    permissions: {
      canApprove: false,
      canReject: false,
      canComment: false,
      canExport: true,
      canViewAnalytics: true,
      canManageUsers: false,
    },
    stats: {
      applicationsReviewed: 0,
      applicationsApproved: 0,
      applicationsRejected: 0,
      avgResponseTime: 0,
    },
  },
];

export default function UserManagementPage() {
  const router = useRouter();
  const { adminUser, signOut, isAdminAuthenticated, isLoading } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserData[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<AdminUserData[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  
  // New user form
  const [newUser, setNewUser] = useState<{
    email: string;
    name: string;
    role: 'admin' | 'reviewer' | 'viewer';
    department: string;
    phone: string;
  }>({
    email: '',
    name: '',
    role: 'viewer',
    department: '',
    phone: '',
  });

  useEffect(() => {
    if (!isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAdminAuthenticated, isLoading, router]);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, statusFilter, users]);

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleAddUser = () => {
    const user: AdminUserData = {
      id: `USER-${Date.now()}`,
      ...newUser,
      status: 'active',
      createdAt: new Date(),
      permissions: {
        canApprove: newUser.role !== 'viewer',
        canReject: newUser.role === 'admin' || newUser.role === 'reviewer',
        canComment: true,
        canExport: true,
        canViewAnalytics: true,
        canManageUsers: newUser.role === 'admin',
      },
      stats: {
        applicationsReviewed: 0,
        applicationsApproved: 0,
        applicationsRejected: 0,
        avgResponseTime: 0,
      },
    };

    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({
      email: '',
      name: '',
      role: 'viewer',
      department: '',
      phone: '',
    });
  };

  const handleUpdatePermission = (userId: string, permission: string, value: boolean) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          permissions: {
            ...user.permissions,
            [permission]: value,
          },
        };
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleStatusChange = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return { ...user, status };
      }
      return user;
    }));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      inactive: 'bg-gray-50 text-gray-700 border-gray-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
    };

    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      inactive: <Clock className="w-3 h-3" />,
      suspended: <XCircle className="w-3 h-3" />,
    };

    return (
      <Badge className={`${styles[status as keyof typeof styles]} border`}>
        <span className="flex items-center gap-1">
          {icons[status as keyof typeof icons]}
          {status}
        </span>
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-purple-50 text-purple-700 border-purple-200',
      reviewer: 'bg-blue-50 text-blue-700 border-blue-200',
      viewer: 'bg-gray-50 text-gray-700 border-gray-200',
    };

    return (
      <Badge className={`${styles[role as keyof typeof styles]} border`}>
        <Shield className="w-3 h-3 mr-1" />
        {role}
      </Badge>
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
                <h1 className="font-semibold text-black">User Management</h1>
              </div>
              
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
                <button className="text-sm font-medium text-black">Users</button>
                <button 
                  onClick={() => router.push('/admin/audit')}
                  className="text-sm font-medium text-gray-600 hover:text-black"
                >
                  Audit Log
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={() => setIsAddUserOpen(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">{users.length}</p>
                <p className="text-xs text-gray-600">Total Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-xs text-gray-600">Administrators</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-black">
                  {users.reduce((sum, u) => sum + u.stats.applicationsReviewed, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Reviews</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="reviewer">Reviewer</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredUsers.map(user => (
            <Card key={user.id} className="border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-medium">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-black">{user.name}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </span>
                        {user.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {user.phone}
                          </span>
                        )}
                        {user.department && (
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {user.department}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {user.createdAt.toLocaleDateString()}
                        </span>
                        {user.lastLogin && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Last login {user.lastLogin.toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Permissions */}
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-3">Permissions</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(user.permissions).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-2">
                              <Switch
                                checked={value}
                                onCheckedChange={(checked) => handleUpdatePermission(user.id, key, checked)}
                                disabled={user.id === adminUser?.id}
                              />
                              <label className="text-xs text-gray-600">
                                {key.replace(/^can/, '').replace(/([A-Z])/g, ' $1').trim()}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Reviewed</p>
                          <p className="text-sm font-semibold">{user.stats.applicationsReviewed}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Approved</p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {user.stats.applicationsApproved}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Rejected</p>
                          <p className="text-sm font-semibold text-red-600">
                            {user.stats.applicationsRejected}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Avg Response</p>
                          <p className="text-sm font-semibold">{user.stats.avgResponseTime}h</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                        <CheckCircle className="w-3 h-3 mr-2" />
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'suspended')}>
                        <XCircle className="w-3 h-3 mr-2" />
                        Suspend
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Key className="w-3 h-3 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600"
                        disabled={user.id === adminUser?.id}
                      >
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new admin user account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="john@incoxchange.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="reviewer">Reviewer</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newUser.department}
                onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                placeholder="Operations"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
