"use client"

import { useState, useEffect, useCallback } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { adminAPI, type Project } from "@/lib/api"
import {
  FolderOpen,
  Search,
  Eye,
  Trash2,
  DollarSign,
  Users,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getAllProjects({
        search: searchQuery
      })
      setProjects(response.projects)
    } catch (error) {
      console.error('Failed to load projects:', error)

      // Mock projects data
      const mockProjects: Project[] = [
        {
          id: 'proj_1',
          name: 'Marketing Campaign 2024',
          description: 'Main marketing campaign for Q1-Q2 2024',
          campaigns: 15,
          messages: 45000,
          engagement: 92.5,
          created: '2024-01-15T10:30:00Z',
          updated: '2024-01-20T14:22:00Z',
          user_id: 'user_2',
          status: 'active',
          balance: 1250.75,
          currency: 'USD'
        },
        {
          id: 'proj_2',
          name: 'Customer Support Automation',
          description: 'Automated customer support messaging system',
          campaigns: 8,
          messages: 23000,
          engagement: 88.2,
          created: '2024-01-10T09:15:00Z',
          updated: '2024-01-19T16:45:00Z',
          user_id: 'user_3',
          status: 'active',
          balance: 890.50,
          currency: 'USD'
        },
        {
          id: 'proj_3',
          name: 'Product Launch Notifications',
          description: 'Notification system for new product launches',
          campaigns: 3,
          messages: 8500,
          engagement: 95.1,
          created: '2024-01-05T11:20:00Z',
          updated: '2024-01-18T12:30:00Z',
          user_id: 'user_4',
          status: 'inactive',
          balance: 125.25,
          currency: 'USD'
        }
      ]

      setProjects(mockProjects)
      toast.error('Using demo data - API connection failed')
    } finally {
      setLoading(false)
    }
  }, [searchQuery])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  const handleDeleteProject = async (projectId: string) => {
    try {
      setDeleteLoading(true)
      await adminAPI.deleteProject(projectId)

      setProjects(projects.filter(p => p.id !== projectId))
      toast.success('Project deleted successfully')
    } catch (error) {
      console.error('Failed to delete project:', error)
      toast.error('Failed to delete project')
    } finally {
      setDeleteLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
            <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
            <p className="text-muted-foreground">View and manage all user projects</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
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
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {projects.reduce((sum, p) => sum + (p.messages || 0), 0).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${projects.reduce((sum, p) => sum + (p.balance || 0), 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Projects</CardTitle>
            <CardDescription>View and manage all user projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button onClick={loadProjects} variant="outline">
                Refresh
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Campaigns</TableHead>
                    <TableHead>Messages</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        Loading projects...
                      </TableCell>
                    </TableRow>
                  ) : filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        No projects found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{project.campaigns || 0}</TableCell>
                        <TableCell>{(project.messages || 0).toLocaleString()}</TableCell>
                        <TableCell>{project.engagement?.toFixed(1) || 0}%</TableCell>
                        <TableCell className="font-mono">
                          ${(project.balance || 0).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {new Date(project.created).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedProject(project)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Project Details</DialogTitle>
                                  <DialogDescription>
                                    Detailed information for {selectedProject?.name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedProject && (
                                  <div className="space-y-4">
                                    <div><strong>ID:</strong> {selectedProject.id}</div>
                                    <div><strong>Name:</strong> {selectedProject.name}</div>
                                    <div><strong>Description:</strong> {selectedProject.description}</div>
                                    <div><strong>Status:</strong> {selectedProject.status}</div>
                                    <div><strong>User ID:</strong> {selectedProject.user_id}</div>
                                    <div><strong>Campaigns:</strong> {selectedProject.campaigns || 0}</div>
                                    <div><strong>Messages:</strong> {(selectedProject.messages || 0).toLocaleString()}</div>
                                    <div><strong>Engagement:</strong> {selectedProject.engagement?.toFixed(1) || 0}%</div>
                                    <div><strong>Balance:</strong> ${(selectedProject.balance || 0).toFixed(2)}</div>
                                    <div><strong>Created:</strong> {new Date(selectedProject.created).toLocaleString()}</div>
                                    <div><strong>Updated:</strong> {new Date(selectedProject.updated).toLocaleString()}</div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              disabled={deleteLoading}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
