"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Layers, MessageCircle, Phone, Plus, Sparkles, TrendingDown, TrendingUp, Users, BarChart as BarChartIcon, Clock, Mail, ArrowUp } from "lucide-react"

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
import { EnhancedEmptyState } from "@/components/onboarding/enhanced-empty-state"
import { WelcomeDashboard } from "@/components/onboarding/welcome-dashboard"
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PageHierarchy } from "@/components/navigation/page-hierarchy";
import {
  DeliveryRateMetricCard,
  LatencyMetricCard,
  ErrorRateMetricCard,
  ThroughputMetricCard
} from "@/components/metrics/advanced-metric-card";
import { AISuggestionsCard } from "@/components/dashboard/ai-suggestions-card";

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

function AIMetricsCard({
  title,
  metrics,
  isLoading = false
}: {
  title: string;
  metrics: {
    accuracy: number;
    predictions: number;
    optimizations: number;
  };
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Activity className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
            <span className="text-sm font-medium">{metrics.accuracy}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI Predictions</span>
            <span className="text-sm font-medium">{metrics.predictions}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Optimizations</span>
            <span className="text-sm font-medium">{metrics.optimizations}</span>
          </div>
          <Progress value={metrics.accuracy} className="h-1" />
        </div>
      </CardContent>
    </Card>
  );
}

// This function is now imported from components/dashboard/ai-suggestions-card.tsx

// Animation styles are now defined in global CSS


export default function Dashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [isNewUser, setIsNewUser] = useState(false) // Set to true to show the enhanced empty state

  // Check if this is a new user with no data
  if (isNewUser) {
    return (
      <DashboardLayout>
        <EnhancedEmptyState />
      </DashboardLayout>
    )
  }

  // Check if this is a returning user who needs the welcome dashboard
  const showWelcomeDashboard = false; // Set to true to show the welcome dashboard
  if (showWelcomeDashboard) {
    return (
      <DashboardLayout>
        <WelcomeDashboard
          userName="John Doe"
          companyName="Acme Corporation"
          userRole="Platform Administrator"
        />
      </DashboardLayout>
    )
  }

  const [metrics, setMetrics] = useState({
    messages: { value: "0", change: "0%", trend: "up" as const },
    calls: { value: "0", change: "0%", trend: "up" as const },
    deliveryRate: { value: "0%", change: "0%", trend: "up" as const },
    contacts: { value: "0", change: "0%", trend: "up" as const },
    ai: {                                                    // Add the ai metrics object
      accuracy: 95,
      predictions: 1234,
      optimizations: 156
    }
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
          ai: {                                                    // Add the ai metrics object
            accuracy: 95,
            predictions: 1234,
            optimizations: 156
          }
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
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/90 to-blue-400/80 p-8 shadow-lg flex flex-col md:flex-row items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center">
              Welcome back, <span className="ml-2 text-blue-100">Enterprise User</span>
              <span className="ml-4 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-blue-100 border border-white/20">AI FIRST</span>
            </h1>
            <p className="text-blue-100 text-lg font-medium mb-4">Powering intelligent SMS communications with automation and insight</p>
            <div className="flex gap-3 mt-2">
              <Button size="lg" className="bg-white text-blue-700 font-semibold shadow-md hover:bg-blue-50">Send SMS</Button>
              <Button size="lg" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/10">New Campaign</Button>
              <Button size="lg" variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/10" asChild>
                <Link href="/dashboard/ai-suggestions">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggestions
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center">
            <BarChartIcon className="h-20 w-20 text-white/70 mb-2" />
            <span className="text-blue-100 text-xs">AI-Powered Messaging</span>
          </div>
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-2xl opacity-60 pointer-events-none" />
        </div>

        {/* Key Performance Metrics */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Key Performance Metrics</h2>
          <p className="text-muted-foreground mb-4">Real-time communication performance indicators</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DeliveryRateMetricCard
              value="98.7"
              change="+1.2%"
              trend="up"
              detailsLink="/dashboard/analytics?metric=delivery-rate"
              isLoading={isLoading}
            />
            <LatencyMetricCard
              value="87"
              change="-5ms"
              trend="down"
              detailsLink="/dashboard/analytics?metric=latency"
              isLoading={isLoading}
            />
            <ErrorRateMetricCard
              value="0.8"
              change="-0.3%"
              trend="down"
              detailsLink="/dashboard/analytics?metric=error-rate"
              isLoading={isLoading}
            />
            <ThroughputMetricCard
              value="156"
              change="+12/sec"
              trend="up"
              detailsLink="/dashboard/analytics?metric=throughput"
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid md:grid-cols-3 gap-6 mb-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" aria-label="Total Messages" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24,234</div>
              <div className="flex items-center text-xs text-muted-foreground mt-2">
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" aria-label="Upward Trend" />
                12.3% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" aria-label="Active Services" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5/8</div>
              <div className="mt-2">
                <Progress value={62} className="h-2" />
              </div>
            </CardContent>
          </Card>
          <AIMetricsCard
            title="AI Performance"
            metrics={metrics.ai}
            isLoading={isLoading}
          />
        </div>

        {/* AI Suggestions */}
        <AISuggestionsCard />

        {/* Navigation Hierarchy */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Quick Navigation</h2>
          <p className="text-muted-foreground mb-4">Access key platform features</p>
          <PageHierarchy />
        </div>

        {/* Analytics Chart Section */}
        <div className="my-10">
          <div className="bg-card rounded-2xl p-8 shadow-xl mb-8 border border-border flex flex-col">
            <div className="flex items-center mb-4">
              <BarChartIcon className="h-6 w-6 text-primary mr-2" aria-label="Chart Icon" />
              <h2 className="text-lg font-semibold tracking-tight">Monthly Message Volume</h2>
            </div>
            <div className="w-full h-60">
              <ResponsiveContainer width="100%" height="100%">
                <ReBarChart
                  data={[
                { name: 'Jan', messages: 4000 },
                { name: 'Feb', messages: 3000 },
                { name: 'Mar', messages: 5000 },
                { name: 'Apr', messages: 4780 },
                { name: 'May', messages: 5890 },
                { name: 'Jun', messages: 4390 },
                { name: 'Jul', messages: 4490 },
              ]}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{data.messages}</span>
                            <span className="text-xs text-muted-foreground">Messages</span>
                          </div>
                          {data.aiInsight && (
                            <div className="flex flex-col">
                              <span className="text-xs text-blue-500">AI Insight:</span>
                              <span className="text-xs">{data.aiInsight}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="messages" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
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
                <div className="flex h-[300px] items-center justify-center rounded-2xl border border-blue-100 bg-white/60 shadow-sm">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Layers className="h-10 w-10 text-blue-400/70" />
                    <h3 className="mt-4 text-lg font-semibold text-blue-900 flex items-center gap-2">Campaign Management <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">AI</span></h3>
                    <p className="mt-2 text-sm text-blue-700/80">Create and manage your communication campaigns</p>
                    <Button className="mt-4 bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700" asChild>
                      <Link href="/dashboard/campaigns">Manage Campaigns</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="pt-4">
                <div className="flex h-[300px] items-center justify-center rounded-2xl border border-blue-100 bg-white/60 shadow-sm">
                  <div className="flex flex-col items-center justify-center text-center">
                    <BarChart3 className="h-10 w-10 text-blue-400/70" />
                    <h3 className="mt-4 text-lg font-semibold text-blue-900 flex items-center gap-2">Performance Analytics <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">AI</span></h3>
                    <p className="mt-2 text-sm text-blue-700/80">
                      View detailed metrics and insights for your communications
                    </p>
                    <Button className="mt-4 bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700" asChild>
                      <Link href="/dashboard/analytics?tab=real-time">View Analytics</Link>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DashboardLayout>
    );
  }
