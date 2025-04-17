"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Layers, MessageCircle, Phone, Plus, TrendingDown, TrendingUp, Users, BarChart, Clock, Mail, ArrowUp } from "lucide-react"

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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Progress } from "@/components/ui/progress"
import { DashboardEmptyState } from "@/components/onboarding/empty-state"

// Define the DashboardCard component
function DashboardCard({
  title,
  value,
  change,
  trend,
  description,
  icon,
  color,
  isLoading = false,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ReactNode
  color: string
  isLoading?: boolean
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold">{value}</p>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                      trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change}
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color} text-white`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Project card component
function ProjectCard({
  project,
  onSelect,
  isLoading = false,
}: { project: any; onSelect: (project: any) => void; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex justify-between text-sm">
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-8 animate-pulse rounded bg-muted"></div>
            </div>
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-8 animate-pulse rounded bg-muted"></div>
            </div>
            <div>
              <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
              <div className="mt-1 h-4 w-8 animate-pulse rounded bg-muted"></div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-9 w-full animate-pulse rounded bg-muted"></div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Campaigns</p>
            <p className="font-medium">{project.campaigns}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Messages</p>
            <p className="font-medium">{project.messages}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Engagement</p>
            <p className="font-medium">{project.engagement}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" onClick={() => onSelect(project)}>
          View Project
        </Button>
      </CardFooter>
    </Card>
  )
}

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
      // Replace with actual API call
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(formData),
      // });

      // if (!response.ok) throw new Error('Failed to create project');

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error creating project:", error)
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

export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [metrics, setMetrics] = useState({
    messages: { value: "0", change: "0%", trend: "up" as const },
    calls: { value: "0", change: "0%", trend: "up" as const },
    deliveryRate: { value: "0%", change: "0%", trend: "up" as const },
    contacts: { value: "0", change: "0%", trend: "up" as const },
  })

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API calls
        // const projectsResponse = await fetch('/api/projects');
        // const metricsResponse = await fetch('/api/metrics');

        // if (!projectsResponse.ok || !metricsResponse.ok) throw new Error('Failed to fetch data');

        // const projectsData = await projectsResponse.json();
        // const metricsData = await metricsResponse.json();

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Placeholder empty data
        setProjects([])
        setMetrics({
          messages: { value: "0", change: "0%", trend: "up" },
          calls: { value: "0", change: "0%", trend: "up" },
          deliveryRate: { value: "0%", change: "0%", trend: "up" },
          contacts: { value: "0", change: "0%", trend: "up" },
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleProjectSelect = (project: any) => {
    router.push(`/dashboard/projects/${project.id}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardEmptyState />
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <NewProjectDialog />
            </div>
            <p className="text-muted-foreground">Monitor your communication performance and manage projects</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24,234</div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  12.3% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5/8</div>
                <div className="mt-2">
                  <Progress value={62} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="projects" className="w-full">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="projects" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Projects</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/projects">View All Projects</Link>
                </Button>
              </div>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <ProjectCard key={i} project={{}} onSelect={() => {}} isLoading={true} />
                  ))}
                </div>
              ) : projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onSelect={handleProjectSelect} />
                  ))}
                </div>
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Layers className="h-10 w-10 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-medium">No Projects Yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Create your first project to get started</p>
                    <div className="mt-4">
                      <NewProjectDialog />
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="campaigns" className="pt-4">
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <Layers className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Campaign Management</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Create and manage your communication campaigns</p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/campaigns">Manage Campaigns</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="pt-4">
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Performance Analytics</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View detailed metrics and insights for your communications
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/dashboard/analytics">View Analytics</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
