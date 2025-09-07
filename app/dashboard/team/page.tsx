"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
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
  Eye,
  Loader2,
  AlertCircle
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
import { useProjectContext } from "@/lib/contexts/project-context"

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

interface TeamMember {
  id: string
  name: string
  email: string
  mobile?: string
  avatar?: string
  role: string
  permissions: string[]
  status: string
  joinedDate: string
  lastActive: string
  invitedAt: string
  acceptedAt?: string
  isOwner: boolean
  collaborationId?: string
}

interface TeamData {
  teamMembers: TeamMember[]
  totalMembers: number
  activeMembers: number
  pendingInvitations: number
}

const roles = ["All Roles", "owner", "admin", "manager", "editor", "viewer"]
const statuses = ["All Status", "active", "inactive", "pending"]

export default function TeamManagementPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { currentProject } = useProjectContext()
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("All Roles")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  // Load team data
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!currentProject) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/v1/team?projectId=${currentProject.id}`)
        const data = await response.json()
        
        if (data.success) {
          setTeamData(data.data)
        } else {
          setError(data.error || 'Failed to load team data')
        }
      } catch (error) {
        console.error('Error fetching team data:', error)
        setError('An error occurred while loading team data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamData()
  }, [currentProject])

  // Filter team members
  const filteredMembers = teamData?.teamMembers.filter(member => {
    const matchesSearch = searchQuery === "" || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesRole = selectedRole === "All Roles" || member.role === selectedRole
    const matchesStatus = selectedStatus === "All Status" || member.status === selectedStatus
    
    return matchesSearch && matchesRole && matchesStatus
  }) || []

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "admin": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "manager": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "editor": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "viewer": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
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
      case "owner": return Crown
      case "admin": return Shield
      case "manager": return Shield
      case "editor": return Edit
      case "viewer": return Eye
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

  const handleMemberAction = async (action: string, memberId: string) => {
    if (!currentProject) return
    
    switch (action) {
      case "view":
        router.push(`/dashboard/team/${memberId}?projectId=${currentProject.id}`)
        break
      case "edit":
        router.push(`/dashboard/team/${memberId}/edit?projectId=${currentProject.id}`)
        break
      case "remove":
        await handleRemoveMember(memberId)
        break
      default:
        break
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!currentProject || !confirm('Are you sure you want to remove this team member?')) return
    
    try {
      setIsRemoving(memberId)
      const response = await fetch(`/api/v1/team/${memberId}?projectId=${currentProject.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Refresh team data
        const refreshResponse = await fetch(`/api/v1/team?projectId=${currentProject.id}`)
        const refreshData = await refreshResponse.json()
        if (refreshData.success) {
          setTeamData(refreshData.data)
        }
      } else {
        alert(data.error || 'Failed to remove team member')
      }
    } catch (error) {
      console.error('Error removing team member:', error)
      alert('An error occurred while removing the team member')
    } finally {
      setIsRemoving(null)
    }
  }

  // Calculate summary stats
  const totalMembers = teamData?.totalMembers || 0
  const activeMembers = teamData?.activeMembers || 0
  const pendingInvitations = teamData?.pendingInvitations || 0
  const adminCount = teamData?.teamMembers.filter(m => m.role === "admin").length || 0

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
              <div className="text-2xl font-bold text-yellow-600">{pendingInvitations}</div>
              <p className="text-xs text-muted-foreground">Pending Invitations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{adminCount}</div>
              <p className="text-xs text-muted-foreground">Administrators</p>
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
                Showing {filteredMembers.length} of {totalMembers} team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Loading team members...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Error Loading Team</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No team members found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedRole !== "All Roles" || selectedStatus !== "All Status"
                      ? "Try adjusting your search or filters"
                      : "No team members available"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="hidden lg:table-cell">Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Joined</TableHead>
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
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{member.name}</p>
                                  {member.isOwner && (
                                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                                      Owner
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  <span>{member.email}</span>
                                </div>
                              </div>
                            </div>
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
                              {formatDate(member.joinedDate)}
                            </div>
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
                                {!member.isOwner && (
                                  <>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation()
                                      handleMemberAction("edit", member.id)
                                    }}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Role
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleMemberAction("remove", member.id)
                                      }}
                                      className="text-destructive"
                                      disabled={isRemoving === member.id}
                                    >
                                      {isRemoving === member.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="mr-2 h-4 w-4" />
                                      )}
                                      Remove Member
                                    </DropdownMenuItem>
                                  </>
                                )}
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
