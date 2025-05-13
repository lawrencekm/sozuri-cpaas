"use client"

import type React from "react"
import { useState, useEffect, Suspense, lazy } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Layers, MessageCircle, Phone, Plus, Sparkles, TrendingDown, TrendingUp, Users, BarChart as BarChartIcon, Clock, Mail, ArrowUp, AlertTriangle, RefreshCw, Menu } from "lucide-react"
import { handleError, ErrorType } from "@/lib/error-handler"
import { ErrorBoundary } from "@/components/error-handling/error-boundary"
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import dynamic from 'next/dynamic'

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

// Import chart components
import { 
  DeliveryRateMetricCard,
  LatencyMetricCard,
  ErrorRateMetricCard,
  ThroughputMetricCard
} from '@/components/metrics/advanced-metric-card/metric-cards'

// Lazy load heavy components
const EnhancedEmptyState = dynamic(
  () => import('@/components/onboarding/enhanced-empty-state').then(mod => ({ default: mod.EnhancedEmptyState })),
  {
    loading: () => <div className="h-[600px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

const WelcomeDashboard = dynamic(
  () => import('@/components/onboarding/welcome-dashboard').then(mod => ({ default: mod.WelcomeDashboard })),
  {
    loading: () => <div className="h-[600px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

// Lazy load chart components
// Dynamic imports for other components

// Lazy load other components
const PageHierarchy = dynamic(
  () => import('@/components/navigation/page-hierarchy').then(mod => ({ default: mod.PageHierarchy })),
  {
    loading: () => <div className="h-[200px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

const AISuggestionsCard = dynamic(
  () => import('@/components/dashboard/ai-suggestions-card').then(mod => ({ default: mod.AISuggestionsCard })),
  {
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

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
    <Card variant="interactive" className="animate-slide-up">
      <CardContent padded="md">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} text-white shadow-sm`}>
                {icon}
              </div>
              <p className="text-sm font-medium">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {value}
                  </p>
                  <div
                    className={`flex items-center gap-0.5 text-xs font-medium rounded-full px-2 py-0.5 ${
                      trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {change}
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
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
      <Card variant="default" className="animate-pulse">
        <CardHeader className="pb-2" withBackground>
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </CardHeader>
        <CardContent padded="md">
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
        <CardFooter withBorder>
          <div className="h-9 w-full animate-pulse rounded bg-muted"></div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card variant="interactive" className="animate-slide-up overflow-hidden">
      <CardHeader className="pb-2" withBackground>
        <CardTitle size="lg">{project.name}</CardTitle>
        <CardDescription truncate>{project.description}</CardDescription>
      </CardHeader>
      <CardContent padded="md">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-muted-foreground text-xs">Campaigns</p>
            <p className="font-medium text-base">{project.campaigns}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-muted-foreground text-xs">Messages</p>
            <p className="font-medium text-base">{project.messages}</p>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-muted-foreground text-xs">Engagement</p>
            <p className="font-medium text-base">{project.engagement}%</p>
          </div>
        </div>
      </CardContent>
      <CardFooter withBorder align="center">
        <Button variant="default" size="sm" className="w-full" onClick={() => onSelect(project)}>
          <Layers className="mr-2 h-4 w-4" />
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
      //
      // if (!response.ok) {
      //   const errorData = await response.json().catch(() => ({}));
      //   throw new Error(errorData.message || 'Failed to create project');
      // }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOpen(false)
      router.refresh()
    } catch (error) {
      // Use centralized error handler
      handleError(error, ErrorType.API, {
        toastMessage: "Failed to create project. Please try again.",
        context: {
          formData,
          source: 'NewProjectDialog.handleSubmit'
        }
      })
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
          <div className="grid gap-4 py-4 px-2 sm:px-4">
            <div className="grid gap-2 w-full max-w-[500px] mx-auto">
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
            <div className="grid gap-2 w-full max-w-[500px] mx-auto">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your project"
              />
            </div>
            <div className="grid gap-2 w-full max-w-[500px] mx-auto">
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
    <Card variant="glass" className="animate-slide-up">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2" withBorder>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Activity className="h-4 w-4" />
          </div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <div className="bg-accent/10 text-accent text-xs font-medium px-2 py-1 rounded-full">
          AI Powered
        </div>
      </CardHeader>
      <CardContent padded="md">
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-lg flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
            <span className="text-sm font-medium bg-success/10 text-success px-2 py-0.5 rounded-full">{metrics.accuracy}%</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <span className="text-xs text-muted-foreground block mb-1">AI Predictions</span>
              <span className="text-lg font-medium">{metrics.predictions}</span>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <span className="text-xs text-muted-foreground block mb-1">Optimizations</span>
              <span className="text-lg font-medium">{metrics.optimizations}</span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Accuracy</span>
              <span className="text-xs font-medium">{metrics.accuracy}%</span>
            </div>
            <Progress value={metrics.accuracy} className="h-1.5 rounded-full bg-muted/50" indicatorClassName="bg-gradient-to-r from-accent to-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// This function is now imported from components/dashboard/ai-suggestions-card.tsx

// Animation styles are now defined in global CSS

// Client-side only chart component
const ClientSideChart = ({ data }: { data: Array<{ name: string; messages: number }> }) => {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Only import recharts on the client
    import('@/components/dashboard/chart-wrapper').then(mod => {
      setComponent(() => mod.default);
    });
  }, []);

  if (!Component) {
    return <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />;
  }

  return <Component data={data} />;
};

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
    deliveryRate: { value: "0", change: "0%", trend: "up" as const },
    latency: { value: "0", change: "0ms", trend: "down" as const },
    errorRate: { value: "0", change: "0%", trend: "down" as const },
    throughput: { value: "0", change: "0/sec", trend: "up" as const },
    ai: {
      accuracy: 0,
      predictions: 0,
      optimizations: 0
    }
  })

  const [error, setError] = useState<Error | null>(null)

  // Sample chart data
  const chartData = [
    { name: "Jan", messages: 1200 },
    { name: "Feb", messages: 1900 },
    { name: "Mar", messages: 3000 },
    { name: "Apr", messages: 2780 },
    { name: "May", messages: 4890 },
    { name: "Jun", messages: 3390 },
    { name: "Jul", messages: 4490 },
    { name: "Aug", messages: 5000 },
    { name: "Sep", messages: 4300 },
    { name: "Oct", messages: 6780 },
    { name: "Nov", messages: 8900 },
    { name: "Dec", messages: 7800 },
  ]

  useEffect(() => {
    // Fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Replace with actual API calls
        // const projectsResponse = await fetch('/api/projects');
        // const metricsResponse = await fetch('/api/metrics');
        //
        // if (!projectsResponse.ok) {
        //   const errorData = await projectsResponse.json().catch(() => ({}));
        //   throw new Error(errorData.message || 'Failed to fetch projects');
        // }
        //
        // if (!metricsResponse.ok) {
        //   const errorData = await metricsResponse.json().catch(() => ({}));
        //   throw new Error(errorData.message || 'Failed to fetch metrics');
        // }
        //
        // const projectsData = await projectsResponse.json();
        // const metricsData = await metricsResponse.json();

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Placeholder empty data
        setProjects([])
        setMetrics({
          deliveryRate: { value: "0", change: "0%", trend: "up" },
          latency: { value: "0", change: "0ms", trend: "down" },
          errorRate: { value: "0", change: "0%", trend: "down" },
          throughput: { value: "0", change: "0/sec", trend: "up" },
          ai: {
            accuracy: 0,
            predictions: 0,
            optimizations: 0
          }
        })
        setError(null)
      } catch (error: any) {
        setError(error instanceof Error ? error : new Error('An unexpected error occurred'))

        // Use centralized error handler
        handleError(error, ErrorType.API, {
          toastMessage: "Failed to load dashboard data",
          context: { source: 'Dashboard.fetchDashboardData' }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleProjectSelect = (project: any) => {
    router.push(`/dashboard/projects/${project.id}`)
  }

  // Show error UI if there was a problem loading dashboard data
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Failed to load dashboard data</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {error.message || 'An unexpected error occurred'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <ErrorBoundary>
        <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-accent p-4 sm:p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-6 animate-gradient-move">
          <div className="w-full md:w-[60%] animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20 flex items-center">
                <div className="status-dot active mr-2"></div>
                Enterprise Platform
              </div>
              <div className="bg-accent/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10 flex items-center">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Powered
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
              Welcome back, <span className="text-white/90">Escobar</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base md:text-lg font-medium mb-6 max-w-xl">
              Streamline your communications with enterprise-grade messaging solutions and AI-powered insights
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button size="lg" className="bg-white text-primary font-semibold shadow-md hover:bg-white/90 transition-colors">
                <MessageCircle className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-colors">
                <Layers className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
              <Button size="lg" variant="outline" className="bg-accent/20 backdrop-blur-md border-accent/30 text-white hover:bg-accent/30 transition-colors" asChild>
                <Link href="/dashboard/ai-suggestions">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Suggestions
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center animate-pulse-subtle">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl"></div>
              <BarChartIcon className="h-24 w-24 text-white mb-2 relative z-10" />
            </div>
            <span className="text-white/80 text-sm font-medium">Enterprise Communications</span>
          </div>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute left-1/4 bottom-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl opacity-60 pointer-events-none" />
        </div>

        {/* Key Performance Metrics */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Key Performance Metrics</h2>
          <p className="text-muted-foreground mb-4">Real-time communication performance indicators</p>

          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
              ))}
            </div>
          }>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
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
          </Suspense>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
        <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />}>
          <AISuggestionsCard />
        </Suspense>

        {/* Navigation Hierarchy */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Quick Navigation</h2>
          <p className="text-muted-foreground mb-4">Access key platform features</p>
          <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-muted rounded-lg" />}>
            <PageHierarchy />
          </Suspense>
        </div>

        {/* Analytics Chart Section */}
        <div className="my-10">
          <div className="bg-card rounded-2xl p-8 shadow-xl mb-8 border border-border flex flex-col">
            <div className="flex items-center mb-4">
              <BarChartIcon className="h-6 w-6 text-primary mr-2" aria-label="Chart Icon" />
              <h2 className="text-lg font-semibold tracking-tight">Monthly Message Volume</h2>
            </div>
            <div className="w-full h-[200px] sm:h-[300px] md:h-[400px]">
              <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />}>
                <ClientSideChart data={chartData} />
              </Suspense>
            </div>
          </div>
        </div>
        </div>
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="w-full flex flex-col sm:flex-row h-auto">
            <TabsTrigger value="projects" className="w-full sm:w-auto">Projects</TabsTrigger>
            <TabsTrigger value="campaigns" className="w-full sm:w-auto">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics" className="w-full sm:w-auto">Analytics</TabsTrigger>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      </ErrorBoundary>
      {/*mobile menu toggle button */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="lg" className="rounded-full p-3 shadow-lg">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </DashboardLayout>
  );
}
