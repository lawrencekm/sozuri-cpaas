"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Users,
  Crown,
  Shield,
  User,
  Mail,
  Phone,
  Calendar,
  Settings,
  UserPlus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Mock team members data
const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@sozuri.com",
    phone: "+1234567890",
    role: "admin",
    department: "Engineering",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinedDate: "2023-01-15",
    lastActive: "2024-01-20T10:30:00Z",
    permissions: ["all"]
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@sozuri.com",
    phone: "+1987654321",
    role: "manager",
    department: "Marketing",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinedDate: "2023-03-20",
    lastActive: "2024-01-20T09:15:00Z",
    permissions: ["campaigns", "contacts", "analytics"]
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@sozuri.com",
    phone: "+1555123456",
    role: "user",
    department: "Sales",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinedDate: "2023-06-10",
    lastActive: "2024-01-20T08:45:00Z",
    permissions: ["campaigns", "contacts"]
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah@sozuri.com",
    phone: "+1777888999",
    role: "user",
    department: "Support",
    status: "inactive",
    avatar: "/api/placeholder/40/40",
    joinedDate: "2023-08-05",
    lastActive: "2024-01-18T16:20:00Z",
    permissions: ["conversations", "contacts"]
  },
  {
    id: "5",
    name: "Alex Brown",
    email: "alex@sozuri.com",
    phone: "+1444555666",
    role: "manager",
    department: "Operations",
    status: "active",
    avatar: "/api/placeholder/40/40",
    joinedDate: "2023-11-12",
    lastActive: "2024-01-20T07:30:00Z",
    permissions: ["automations", "webhooks", "analytics"]
  }
]

const departments = ["All Departments", "Engineering", "Marketing", "Sales", "Support", "Operations"]
const roles = ["All Roles", "admin", "manager", "user"]
const statuses = ["All Status", "active", "inactive", "pending"]

export default function TeamManagementPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [selectedStatus, setSelectedStatus] = useState("All Status")

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = searchQuery === "" || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDepartment = selectedDepartment === "All Departments" || member.department === selectedDepartment
    const matchesRole = selectedRole === "All Roles" || member.role === selectedRole
    const matchesStatus = selectedStatus === "All Status" || member.status === selectedStatus
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "user": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inactive": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return Crown
      case "manager": return Shield
      case "user": return User
      default: return User
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const handleMemberAction = (action: string, memberId: string) => {
    switch (action) {
      case "view":
        router.push(`/dashboard/team/${memberId}`)
        break
      case "edit":
        router.push(`/dashboard/team/${memberId}/edit`)
        break
      case "delete":
        console.log("Delete member:", memberId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter(m => m.status === "active").length
  const adminCount = teamMembers.filter(m => m.role === "admin").length
  const managerCount = teamMembers.filter(m => m.role === "manager").length

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/team/roles")}>
              <Settings className="mr-2 h-4 w-4" />
              Manage Roles
            </Button>
            <Button onClick={() => router.push("/dashboard/team/invite")}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{activeMembers}</div>
              <p className="text-xs text-muted-foreground">Active Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{adminCount}</div>
              <p className="text-xs text-muted-foreground">Administrators</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{managerCount}</div>
              <p className="text-xs text-muted-foreground">Managers</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Team Members Table */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Showing {filteredMembers.length} of {teamMembers.length} team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No team members found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedDepartment !== "All Departments" || selectedRole !== "All Roles" || selectedStatus !== "All Status"
                      ? "Try adjusting your search or filters"
                      : "No team members available"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead className="hidden md:table-cell">Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Last Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMembers.map((member) => {
                      const RoleIcon = getRoleIcon(member.role)
                      return (
                        <TableRow key={member.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleMemberAction("view", member.id)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{member.email}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {member.department}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <RoleIcon className="h-4 w-4" />
                              <Badge variant="secondary" className={getRoleColor(member.role)}>
                                {member.role}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="secondary" className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <div className="text-sm">
                              {formatLastActive(member.lastActive)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleMemberAction("view", member.id)
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleMemberAction("edit", member.id)
                                }}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Member
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMemberAction("delete", member.id)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="grid gap-6 md:grid-cols-3" variants={fadeIn}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/team/permissions")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions
              </CardTitle>
              <CardDescription>Manage user permissions and access levels</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure what team members can access and modify in the platform.
              </p>
              <Button variant="outline" className="w-full">
                Manage Permissions
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/team/activity")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Activity Log
              </CardTitle>
              <CardDescription>View team member activity and audit logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track user actions, login history, and system changes.
              </p>
              <Button variant="outline" className="w-full">
                View Activity
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/team/settings")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Team Settings
              </CardTitle>
              <CardDescription>Configure team-wide settings and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Set up team policies, security settings, and default configurations.
              </p>
              <Button variant="outline" className="w-full">
                Team Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
