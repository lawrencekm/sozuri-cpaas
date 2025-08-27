"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Calendar, Filter, MoreHorizontal, Plus, Search, SortAsc, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "react-hot-toast"
import * as Sentry from "@sentry/nextjs"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

// New Project Dialog
function NewProjectDialog() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
  })
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/v1/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          // map UI type to an optional accountType if desired
          accountType: formData.type || undefined,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to create project')
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Set up a new communication project to organize your campaigns.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your project"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Project Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing Campaign</SelectItem>
                  <SelectItem value="transactional">Transactional Messages</SelectItem>
                  <SelectItem value="customer-service">Customer Service</SelectItem>
                  <SelectItem value="alerts">Alerts & Notifications</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!formData.name || !formData.type || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Project Card Component
function ProjectCard({ project, isLoading = false }: { project: any; isLoading?: boolean }) {
  const router = useRouter()

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
              <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
            </div>
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-start space-x-4">
            <div className="min-w-[100px] flex-1">
              <div className="h-4 w-full animate-pulse rounded bg-muted"></div>
              <div className="mt-2 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-12 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            </div>
            <div className="h-16 w-16 animate-pulse rounded-full bg-muted"></div>
          </div>
          <div className="mt-4 h-4 w-32 animate-pulse rounded bg-muted"></div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
          <div className="h-9 w-24 animate-pulse rounded bg-muted"></div>
        </CardFooter>
      </Card>
    )
  }

  const typeColors: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    marketing: { 
      bg: "bg-blue-50", 
      text: "text-blue-700",
      icon: "📈"
    },
    transactional: { 
      bg: "bg-green-50", 
      text: "text-green-700",
      icon: "📨"
    },
    "customer-service": { 
      bg: "bg-purple-50", 
      text: "text-purple-700",
      icon: "🎯"
    },
    alerts: { 
      bg: "bg-orange-50", 
      text: "text-orange-700",
      icon: "🔔"
    }
  }

  const typeStyle = typeColors[project.type] || { bg: "bg-gray-50", text: "text-gray-700", icon: "📋" }

  return (
    <Card className="group hover:border-primary/50 hover:shadow-sm transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded-full ${typeStyle.bg} ${typeStyle.text}`}>
                {project.type}
              </span>
            </div>
            <CardDescription className="mt-1 line-clamp-1">{project.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${project.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${project.id}/edit`)}>
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Campaigns</p>
                <p className="font-medium">{project.campaigns}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Messages</p>
                <p className="font-medium">{project.messages.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Success Rate</p>
                <p className="font-medium text-emerald-600">{project.successRate || '100'}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Engagement</p>
                <p className="font-medium">{project.engagement}%</p>
              </div>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" /> 
              Last updated {project.updated}
            </div>
          </div>
          <div className={`flex h-16 w-16 items-center justify-center rounded-full ${typeStyle.bg} ${typeStyle.text} text-2xl`}>
            {typeStyle.icon}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/dashboard/projects/${project.id}/campaigns`)}
        >
          View Campaigns
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/projects/${project.id}`)}
        >
          Project Details
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/v1/projects')
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Failed to fetch projects')
        }
        
        const data = await response.json()

        // Map API to UI fields
        const mapped = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          type: p.accountType || 'marketing',
          campaigns: p._count?.campaigns ?? 0,
          messages: p._count?.messageLogs ?? 0,
          engagement: Math.round(Math.random() * 100), // TODO: Replace with actual engagement data
          successRate: Math.round(95 + Math.random() * 5), // TODO: Replace with actual success rate
          updated: new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
            -Math.round((Date.now() - new Date(p.updatedAt).getTime()) / (1000 * 60 * 60 * 24)),
            'day'
          ),
        }))

        setProjects(mapped)
      } catch (error) {
        console.error('Error fetching projects:', error)
        const message = error instanceof Error ? error.message : 'Failed to load projects'
        setError(message)
        toast.error(message)
        Sentry.captureException(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeTab === "all" || project.type.toLowerCase() === activeTab),
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <NewProjectDialog />
          </div>
          <p className="text-muted-foreground">Manage your communication projects and campaigns</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <SortAsc className="mr-2 h-4 w-4" /> Sort
            </Button>
          </div>
        </div>

        {error ? (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {error}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all" disabled={isLoading}>All Projects</TabsTrigger>
              <TabsTrigger value="marketing" disabled={isLoading}>Marketing</TabsTrigger>
              <TabsTrigger value="transactional" disabled={isLoading}>Transactional</TabsTrigger>
              <TabsTrigger value="customer-service" disabled={isLoading}>Customer Service</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProjectCard key={i} project={{}} isLoading={true} />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Search className="h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No Results Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      No projects match your search criteria
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear Search
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No Projects Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first project to get started with campaigns
                    </p>
                    <div className="mt-4">
                      <NewProjectDialog />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="marketing" className="pt-4">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2].map((i) => (
                    <ProjectCard key={i} project={{}} isLoading={true} />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No Marketing Projects</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first marketing project to get started
                    </p>
                    <div className="mt-4">
                      <NewProjectDialog />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="transactional" className="pt-4">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2].map((i) => (
                    <ProjectCard key={i} project={{}} isLoading={true} />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No Transactional Projects</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first transactional project to get started
                    </p>
                    <div className="mt-4">
                      <NewProjectDialog />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="customer-service" className="pt-4">
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2].map((i) => (
                    <ProjectCard key={i} project={{}} isLoading={true} />
                  ))}
                </div>
              ) : filteredProjects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Plus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No Customer Service Projects</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Create your first customer service project to get started
                    </p>
                    <div className="mt-4">
                      <NewProjectDialog />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
