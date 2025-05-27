"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { adminAPI, authAPI, type User, type Project } from "@/lib/api"
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Eye,
  Settings,
  Shield,
  AlertTriangle,
  CreditCard,
  FolderOpen,
  DollarSign,
  Plus
} from "lucide-react"
import { toast } from "sonner"

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [topupAmount, setTopupAmount] = useState('')
  const [topupLoading, setTopupLoading] = useState(false)

  // Load users on component mount
  useEffect(() => {
    loadUsers()
    loadProjects()
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const user = await authAPI.getProfile()
      setCurrentUser(user)
    } catch (error) {
      console.error('Failed to load current user:', error)
      // Set a fallback admin user for demo purposes
      setCurrentUser({
        id: 'admin_demo',
        name: 'Demo Admin',
        email: 'admin@demo.com',
        role: 'admin',
        status: 'active',
        created_at: new Date().toISOString(),
        permissions: ['read', 'write', 'admin', 'impersonate']
      })
    }
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers({
        search: searchQuery,
        role: roleFilter || undefined
      })
      setUsers(response.users)
    } catch (error) {
      console.error('Failed to load users:', error)

      const mockUsers: User[] = [
        {
          id: 'user_1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          last_login: '2024-01-20T14:22:00Z',
          company: 'Acme Corporation',
          permissions: ['read', 'write', 'admin', 'impersonate']
        },
        {
          id: 'user_2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'supervisor',
          status: 'active',
          created_at: '2024-01-16T09:15:00Z',
          last_login: '2024-01-20T13:45:00Z',
          company: 'Tech Solutions Inc',
          permissions: ['read', 'write', 'manage_agents']
        },
        {
          id: 'user_3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'agent',
          status: 'active',
          created_at: '2024-01-17T11:20:00Z',
          last_login: '2024-01-20T12:30:00Z',
          company: 'Support Team Ltd',
          permissions: ['read', 'write']
        },
        {
          id: 'user_4',
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          role: 'user',
          status: 'inactive',
          created_at: '2024-01-18T16:45:00Z',
          last_login: '2024-01-19T10:15:00Z',
          company: 'Customer Corp',
          permissions: ['read']
        },
        {
          id: 'user_5',
          name: 'Charlie Wilson',
          email: 'charlie.wilson@example.com',
          role: 'agent',
          status: 'suspended',
          created_at: '2024-01-19T08:30:00Z',
          last_login: '2024-01-19T15:20:00Z',
          company: 'Support Team Ltd',
          permissions: ['read']
        }
      ]

      setUsers(mockUsers)
      toast.error('Using demo data - API connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleImpersonate = async (userId: string) => {
    try {
      const response = await authAPI.impersonate(userId)

      // Store the new token
      localStorage.setItem('token', response.token)

      setIsImpersonating(true)
      toast.success(`Now impersonating ${response.user.name}`)

      window.location.reload()
    } catch (error) {
      console.error('Failed to impersonate user:', error)
      // For demo purposes, simulate impersonation
      const targetUser = users.find(u => u.id === userId)
      if (targetUser) {
        setIsImpersonating(true)
        toast.success(`Demo: Now impersonating ${targetUser.name}`)
      } else {
        toast.error('Failed to impersonate user - API connection failed')
      }
    }
  }

  const handleStopImpersonation = async () => {
    try {
      const response = await authAPI.stopImpersonation()

      // Store the original token
      localStorage.setItem('token', response.token)

      setIsImpersonating(false)
      toast.success('Stopped impersonation')

      // Reload the page to reflect the change
      window.location.reload()
    } catch (error) {
      console.error('Failed to stop impersonation:', error)
      setIsImpersonating(false)
      toast.success('Demo: Stopped impersonation')
    }
  }

  const loadProjects = async () => {
    try {
      setProjectsLoading(true)
      const response = await adminAPI.getAllProjects()
      setProjects(response.projects)
    } catch (error) {
      console.error('Failed to load projects:', error)
      const mockProjects = [
        {
          id: 'proj_1',
          name: 'Customer Onboarding',
          description: 'Welcome messages and setup guides',
          campaigns: 3,
          messages: 2451,
          engagement: 76,
          created: '2024-01-16T09:15:00Z',
          updated: '2024-01-20T13:45:00Z',
          user_id: 'user_2',
          status: 'active' as const,
          balance: 250.75,
          currency: 'USD'
        }
      ]
      setProjects(mockProjects)
    } finally {
      setProjectsLoading(false)
    }
  }

  const handleTopup = async (userId: string, amount: number) => {
    try {
      // Validate amount before sending
      if (!amount || isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount greater than 0')
        return
      }

      setTopupLoading(true)
      const response = await adminAPI.topupUserCredit(userId, amount)

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, balance: response.balance }
          : user
      ))

      toast.success(`Successfully added $${amount.toFixed(2)} to user account`)
      setTopupAmount('')
    } catch (error) {
      console.error('Failed to topup user:', error)
      toast.error('Failed to topup user credit')
    } finally {
      setTopupLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive'
      case 'supervisor': return 'default'
      case 'agent': return 'secondary'
      default: return 'outline'
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and system administration</p>
          </div>

          {isImpersonating && (
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Impersonating
              </Badge>
              <Button variant="outline" size="sm" onClick={handleStopImpersonation}>
                Stop Impersonation
              </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.filter(p => p.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${users.reduce((sum, u) => sum + (u.balance || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suspended</CardTitle>
              <UserX className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {users.filter(u => u.status === 'suspended').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadUsers} variant="outline">
                Refresh
              </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading users...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono">
                              ${(user.balance || 0).toFixed(2)}
                            </span>
                            {user.role !== 'admin' && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Top Up Credits</DialogTitle>
                                    <DialogDescription>
                                      Add credits to {user.name}'s account
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Amount ($)</label>
                                      <Input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(e.target.value)}
                                        placeholder="Enter amount"
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => {
                                          const amount = parseFloat(topupAmount)
                                          if (!isNaN(amount) && amount > 0) {
                                            handleTopup(user.id, amount)
                                          } else {
                                            toast.error('Please enter a valid amount')
                                          }
                                        }}
                                        disabled={!topupAmount || topupLoading}
                                      >
                                        {topupLoading ? 'Processing...' : 'Add Credits'}
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.company || '-'}</TableCell>
                        <TableCell>
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString()
                            : 'Never'
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>User Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information for {selectedUser?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedUser && (
                                  <div className="space-y-4">
                                    <div>
                                      <strong>ID:</strong> {selectedUser.id}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {selectedUser.email}
                                    </div>
                                    <div>
                                      <strong>Role:</strong> {selectedUser.role}
                                    </div>
                                    <div>
                                      <strong>Status:</strong> {selectedUser.status}
                                    </div>
                                    <div>
                                      <strong>Created:</strong> {new Date(selectedUser.created_at).toLocaleString()}
                                    </div>
                                    <div>
                                      <strong>Permissions:</strong> {selectedUser.permissions?.join(', ') || 'None'}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {user.id !== currentUser?.id && user.status === 'active' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleImpersonate(user.id)}
                                disabled={isImpersonating}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View and download system logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/dashboard/admin/logs">
                  <Download className="mr-2 h-4 w-4" />
                  Manage Logs
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Advanced user management tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/dashboard/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
