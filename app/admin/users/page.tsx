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
import { adminAPI, type User } from "@/lib/api"
import {
  Users,
  Search,
  Eye,
  Settings,
  Plus,
  DollarSign
} from "lucide-react"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [topupAmount, setTopupAmount] = useState('')
  const [topupLoading, setTopupLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllUsers({
        search: searchQuery,
        role: roleFilter && roleFilter !== 'all' ? roleFilter : undefined
      })
      setUsers(response.users)
    } catch (error) {
      console.error('Failed to load users:', error)

      const mockUsers: User[] = [
        {
          id: 'user_2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-01-16T09:15:00Z',
          last_login: '2024-01-20T13:45:00Z',
          company: 'Tech Solutions Inc',
          permissions: ['read', 'write'],
          balance: 250.75,
          currency: 'USD',
          project_id: 'proj_1'
        },
        {
          id: 'user_3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'user',
          status: 'active',
          created_at: '2024-01-17T11:20:00Z',
          last_login: '2024-01-20T12:30:00Z',
          company: 'Marketing Agency',
          permissions: ['read', 'write'],
          balance: 89.50,
          currency: 'USD',
          project_id: 'proj_2'
        }
      ]

      setUsers(mockUsers)
      toast.error('Using demo data - API connection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTopup = async (userId: string, amount: number) => {
    try {
      setTopupLoading(true)
      const response = await adminAPI.topupUserCredit(userId, amount)

      setUsers(users.map(user =>
        user.id === userId
          ? { ...user, balance: response.balance }
          : user
      ))

      toast.success(`Successfully added $${amount} to user account`)
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
    const matchesRole = !roleFilter || roleFilter === 'all' || user.role === roleFilter
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts, credits, and permissions</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all user accounts</CardDescription>
          </CardHeader>
          <CardContent>
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
                  <SelectItem value="all">All Roles</SelectItem>
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
                                        onClick={() => handleTopup(user.id, parseFloat(topupAmount))}
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
                                      <strong>Balance:</strong> ${(selectedUser.balance || 0).toFixed(2)}
                                    </div>
                                    <div>
                                      <strong>Project ID:</strong> {selectedUser.project_id || 'None'}
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
      </div>
    </DashboardLayout>
  )
}
