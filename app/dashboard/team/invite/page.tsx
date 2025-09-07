"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { 
  ArrowLeft,
  UserPlus,
  Mail,
  Shield,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { useProjectContext } from "@/lib/contexts/project-context"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

interface ProjectRole {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystemRole: boolean
}

interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export default function InviteMemberPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { currentProject } = useProjectContext()
  
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [customPermissions, setCustomPermissions] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [roles, setRoles] = useState<ProjectRole[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)

  // Load available roles and permissions
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/api/v1/team/roles')
        const data = await response.json()
        
        if (data.success) {
          setRoles(data.data.projectRoles)
          setPermissions(data.data.availablePermissions)
        }
      } catch (error) {
        console.error('Error fetching roles:', error)
      } finally {
        setLoadingRoles(false)
      }
    }

    fetchRoles()
  }, [])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentProject) {
      setError("No project selected")
      return
    }

    if (!email || !selectedRole) {
      setError("Email and role are required")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const selectedRoleData = roles.find(r => r.id === selectedRole)
      const finalPermissions = selectedRole === 'custom' ? customPermissions : selectedRoleData?.permissions || []

      const response = await fetch('/api/v1/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: currentProject.id,
          email: email.toLowerCase().trim(),
          role: selectedRole,
          permissions: finalPermissions,
          message: message.trim()
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Team member invited successfully!")
        setTimeout(() => {
          router.push('/dashboard/team')
        }, 2000)
      } else {
        setError(data.error || 'Failed to invite team member')
      }
    } catch (error) {
      console.error('Error inviting team member:', error)
      setError('An error occurred while sending the invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionToggle = (permissionName: string) => {
    setCustomPermissions(prev => 
      prev.includes(permissionName)
        ? prev.filter(p => p !== permissionName)
        : [...prev, permissionName]
    )
  }

  const getSelectedRolePermissions = () => {
    const selectedRoleData = roles.find(r => r.id === selectedRole)
    return selectedRoleData?.permissions || []
  }

  if (loadingRoles) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div className="max-w-2xl mx-auto space-y-6" initial="hidden" animate="visible" variants={fadeIn}>
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invite Team Member</h1>
            <p className="text-muted-foreground">Add a new member to your project team</p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <Check className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Invitation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Member Details
            </CardTitle>
            <CardDescription>
              Enter the email address and role for the new team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  The user must already have an account with this email address
                </p>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Custom Role</div>
                          <div className="text-xs text-muted-foreground">Define custom permissions</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Permissions Preview */}
              {selectedRole && selectedRole !== 'custom' && (
                <div className="space-y-2">
                  <Label>Role Permissions</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {getSelectedRolePermissions().map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Permissions */}
              {selectedRole === 'custom' && (
                <div className="space-y-2">
                  <Label>Custom Permissions</Label>
                  <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto p-3 border rounded-md">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.name}
                          checked={customPermissions.includes(permission.name)}
                          onCheckedChange={() => handlePermissionToggle(permission.name)}
                        />
                        <Label htmlFor={permission.name} className="flex-1 cursor-pointer">
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {permission.description} ({permission.resource}.{permission.action})
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Welcome Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal welcome message for the new team member..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Invitation...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  )
}
