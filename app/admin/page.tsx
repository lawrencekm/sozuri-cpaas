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
          permissions: ['read', 'write', 'admin', 'impersonate'],
          balance: 0,
          currency: 'USD'
        },
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

  const handleImpersonate = async (userId: string) => {
    try {
      const response = await authAPI.impersonate(userId)
      
      localStorage.setItem('token', response.token)
      
      setIsImpersonating(true)
      toast.success(`Now impersonating ${response.user.name}`)
      
      window.location.reload()
    } catch (error) {
      console.error('Failed to impersonate user:', error)
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
      
      localStorage.setItem('token', response.token)
      
      setIsImpersonating(false)
      toast.success('Stopped impersonation')
      
      window.location.reload()
    } catch (error) {
      console.error('Failed to stop impersonation:', error)
      setIsImpersonating(false)
      toast.success('Demo: Stopped impersonation')
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users, projects, and system administration</p>
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>View and download system logs</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href="/admin/logs">
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
                <a href="/admin/users">
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
