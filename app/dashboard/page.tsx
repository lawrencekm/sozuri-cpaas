"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Layers, MessageCircle, Plus, Sparkles,
  TrendingDown, TrendingUp, BarChart as BarChartIcon,
  Mail, ArrowUp, ArrowDownRight, AlertTriangle, RefreshCw, ArrowRight,
  MessagesSquare, BarChart3, Users, CheckCircle2, Activity,
  Clock, Shield, ChevronRight, Zap
} from "lucide-react"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo, VoiceLogo } from "@/components/channel-logos"
import { handleError, ErrorType } from "@/lib/error-handler"
import { ErrorBoundary } from "@/components/error-handling/error-boundary"
import dynamic from 'next/dynamic'
import { getTimeBasedGreeting } from "@/lib/greeting-utils"

// Add CSS for background grid pattern
import "@/styles/dashboard-patterns.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

const EnhancedEmptyState = dynamic(
  () => import('@/components/onboarding/enhanced-empty-state').then(mod => ({ default: mod.EnhancedEmptyState })),
  {
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

const WelcomeDashboard = dynamic(
  () => import('@/components/onboarding/welcome-dashboard').then(mod => ({ default: mod.WelcomeDashboard })),
  {
    loading: () => <div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

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
    loading: () => <div className="h-[200px] w-full animate-pulse bg-muted rounded-lg" />
  }
)

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
    <Card className="dashboard-card">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${color} text-white`}>
                {icon}
              </div>
              <p className="text-sm font-medium">{title}</p>
            </div>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">
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

function ProjectCard({
  project,
  onSelect,
  isLoading = false,
}: { project: any; onSelect: (project: any) => void; isLoading?: boolean }) {
  if (isLoading) {
    return (
      <Card className="dashboard-card animate-pulse">
        <CardHeader className="pb-2 bg-muted/30">
          <div className="h-6 w-3/4 animate-pulse rounded bg-muted"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
        </CardHeader>
        <CardContent className="p-5">
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
        <CardFooter className="border-t p-4">
          <div className="h-9 w-full animate-pulse rounded bg-muted"></div>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="dashboard-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{project.name}</CardTitle>
        <CardDescription className="line-clamp-1">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-3 gap-3 text-sm">
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
      <CardFooter className="border-t p-4">
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setOpen(false)
      router.refresh()
    } catch (error) {
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
    <Card className="dashboard-card h-full border-accent/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          {title}
        </CardTitle>
        <CardDescription>
          Industry-leading AI-powered communications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Accuracy</span>
                <span className="text-sm font-medium">{metrics.accuracy}%</span>
              </div>
              <Progress value={metrics.accuracy} className="h-1 bg-muted" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <span className="text-xs text-muted-foreground">Predictions</span>
                <p className="text-lg font-semibold">{metrics.predictions}</p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <span className="text-xs text-muted-foreground">Optimizations</span>
                <p className="text-lg font-semibold">{metrics.optimizations}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t">
        <Button variant="ghost" className="w-full text-accent hover:text-accent/80" asChild>
          <Link href="/dashboard/ai-suggestions">
            View AI Suggestions
            <ArrowUp className="ml-2 h-4 w-4 rotate-45" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Client-side only chart component
// Define quick access navigation items
interface QuickAccessItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const hierarchyMap: Record<string, QuickAccessItem[]> = {
  "/dashboard": [
    {
      title: "Messaging",
      href: "/dashboard/messaging",
      icon: <MessagesSquare className="h-5 w-5 text-primary" />,
      description: "Manage all messaging channels",
    },
    {
      title: "Voice",
      href: "/dashboard/voice",
      icon: <VoiceLogo size={20} />,
      description: "Manage voice calls and IVR",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      description: "View performance metrics",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: <Users className="h-5 w-5 text-green-500" />,
      description: "Manage your audience",
    },
  ],
};

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
  // For demo purposes, we'll set this to true to show the new user experience
  // In config our app, this would be determined by checking user metadata
  const [isNewUser, setIsNewUser] = useState(true)

  // This is just for demo purposes to toggle between new and returning user views
  const toggleUserExperience = () => {
    setIsNewUser(!isNewUser)
  }

  // We'll use the EnhancedEmptyState for completely new users who haven't set up anything yet
  if (false) {
    return (
      <DashboardLayout>
        <EnhancedEmptyState />
      </DashboardLayout>
    )
  }

  // Get user information from localStorage or context in a real app
  const [userInfo, setUserInfo] = useState({
    name: "John",
    companyName: "Acme Corporation",
    userRole: "Platform Administrator"
  });

  const showWelcomeDashboard = false;
  if (showWelcomeDashboard) {
    return (
      <DashboardLayout>
        <WelcomeDashboard
          userName={userInfo.name}
          companyName={userInfo.companyName}
          userRole={userInfo.userRole}
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
    const fetchDashboardData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Placeholder empty data
        setProjects([])
        setMetrics({
          deliveryRate: { value: "98.7", change: "+1.2%", trend: "up" },
          latency: { value: "87", change: "-5ms", trend: "down" },
          errorRate: { value: "0.8", change: "-0.3%", trend: "down" },
          throughput: { value: "156", change: "+12/sec", trend: "up" },
          ai: {
            accuracy: 92,
            predictions: 1243,
            optimizations: 87
          }
        })
        setError(null)
      } catch (error: any) {
        setError(error instanceof Error ? error : new Error('An unexpected error occurred'))
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Failed to load dashboard data</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground text-center">
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
          {/* Enhanced Welcome Hero Section */}
          <div className="relative overflow-hidden rounded-xl mb-8 bg-gradient-to-r from-primary/90 to-accent/90 text-white">
            <div className="absolute inset-0 bg-grid-white animate-subtle-move [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
            <div className="relative z-10 p-8">
              {/* Demo toggle for switching between new and returning user views */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs flex items-center gap-2">
                <span className="text-white/80">Demo:</span>
                <button
                  onClick={toggleUserExperience}
                  className={`px-2 py-1 rounded-md transition-colors ${isNewUser ? 'bg-white text-primary font-medium' : 'text-white/70 hover:bg-white/10'}`}
                >
                  New User
                </button>
                <button
                  onClick={toggleUserExperience}
                  className={`px-2 py-1 rounded-md transition-colors ${!isNewUser ? 'bg-white text-primary font-medium' : 'text-white/70 hover:bg-white/10'}`}
                >
                  Returning User
                </button>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold tracking-tight">{getTimeBasedGreeting(userInfo.name)}</h1>
                  <p className="mt-2 text-white/80 text-lg">
                    {isNewUser
                      ? "Welcome to your communication hub. Let's get you started with the basics."
                      : "Your communication platform is ready. Here's what's happening today."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button size="default" variant="default" className="bg-white text-primary hover:bg-white/90 font-medium rounded-lg" asChild>
                      <Link href="/dashboard/messaging">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Send Message
                      </Link>
                    </Button>
                    <Button size="default" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-medium rounded-lg" asChild>
                      <Link href="/dashboard/campaigns/new">
                        <Layers className="mr-2 h-4 w-4" />
                        New Campaign
                      </Link>
                    </Button>
                    {isNewUser && (
                      <Button size="default" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 font-medium rounded-lg" asChild>
                        <Link href="/dashboard/onboarding/tour">
                          <Sparkles className="mr-2 h-4 w-4" />
                          Quick Tour
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/20">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Systems Operational</div>
                        <div className="text-xs text-white/70">Last checked: {new Date().toLocaleTimeString()}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">5 Active Channels</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            <SMSLogo className="h-3 w-3 mr-1" />
                            SMS
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            <WhatsAppLogo className="h-3 w-3 mr-1" />
                            WA
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            <ViberLogo className="h-3 w-3 mr-1" />
                            Viber
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            <RCSLogo className="h-3 w-3 mr-1" />
                            RCS
                          </span>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white">
                            <VoiceLogo className="h-3 w-3 mr-1" />
                            Voice
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">API: Healthy</div>
                        <div className="text-xs text-white/70">99.9% uptime this month</div>
                      </div>
                    </div>
                  </div>

                  {!isNewUser && (
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-white">Recent Activity</h3>
                        <Link href="/dashboard/activity" className="text-xs text-white/70 hover:text-white flex items-center">
                          View All
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">Messages sent today</span>
                          <span className="font-medium text-white">247</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/70">Open rate</span>
                          <span className="font-medium text-white">92.4%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started Guide - Only for new users */}
          {isNewUser && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Getting Started with SOZURI</h2>
                  <p className="text-sm text-muted-foreground">Complete these steps to set up your account</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Complete these steps to get started</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">0</span> of <span>3</span> completed
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                      <div className="h-full bg-primary w-0"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Set Up Messaging</h3>
                    <p className="text-sm text-muted-foreground mb-4">Configure your first messaging channel to start sending communications</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      <span>5 min to complete</span>
                    </div>
                    <Button size="sm" className="mt-auto w-full" asChild>
                      <Link href="/dashboard/messaging">
                        Get Started
                      </Link>
                    </Button>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                      <div className="h-full bg-primary w-0"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Import Contacts</h3>
                    <p className="text-sm text-muted-foreground mb-4">Add your contacts to start building your audience database</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      <span>10 min to complete</span>
                    </div>
                    <Button size="sm" className="mt-auto w-full" asChild>
                      <Link href="/dashboard/contacts">
                        Import Now
                      </Link>
                    </Button>
                  </div>

                  <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                      <div className="h-full bg-primary w-0"></div>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Create First Campaign</h3>
                    <p className="text-sm text-muted-foreground mb-4">Design and schedule your first communication campaign</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Clock className="h-3 w-3" />
                      <span>15 min to complete</span>
                    </div>
                    <Button size="sm" className="mt-auto w-full" asChild>
                      <Link href="/dashboard/campaigns/new">
                        Create Campaign
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/onboarding/guide">
                      <Sparkles className="mr-2 h-4 w-4" />
                      View Complete Onboarding Guide
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* What's New - Only for returning users */}
          {!isNewUser && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">What's New</h2>
                  <p className="text-sm text-muted-foreground">Latest features and improvements</p>
                </div>
                <Link
                  href="/dashboard/whats-new"
                  className="text-sm text-primary hover:bg-primary/5 flex items-center px-3 py-1.5 rounded-md transition-colors"
                >
                  View all updates
                  <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
                </Link>
              </div>
              <div className="bg-gradient-to-r from-accent/5 to-transparent p-4 rounded-xl border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Sparkles className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">New AI-Powered Campaign Optimization</h3>
                    <p className="text-xs text-muted-foreground">Released 2 days ago</p>
                  </div>
                  <Badge className="ml-auto bg-accent/10 text-accent hover:bg-accent/20 border-0">New</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">Our new AI engine analyzes your campaign performance and automatically suggests optimizations to improve engagement and conversion rates.</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/ai-suggestions">
                      Try It Now
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Continue where you left off - Only for returning users */}
          {!isNewUser && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Continue Where You Left Off</h2>
                  <p className="text-sm text-muted-foreground">Your recent projects and activities</p>
                </div>
                <Link
                  href="/dashboard/activity"
                  className="text-sm text-primary hover:bg-primary/5 flex items-center px-3 py-1.5 rounded-md transition-colors"
                >
                  View all activity
                  <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                        </div>
                        <CardTitle className="text-sm font-medium">Summer Promotion Campaign</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Draft
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground">Last edited 2 hours ago</p>
                      <p className="text-xs font-medium">Step 2 of 4</p>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full mb-3">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Next step: Select target audience</p>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/campaigns/draft-123">
                          Continue Editing
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                          <BarChart3 className="h-4 w-4 text-green-500" />
                        </div>
                        <CardTitle className="text-sm font-medium">Spring Sale Campaign</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Updated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground">Updated 30 minutes ago</p>
                      <div className="flex items-center gap-1 text-xs text-success font-medium">
                        <TrendingUp className="h-3 w-3" />
                        <span>+24.8%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-muted/20 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Open Rate</div>
                        <div className="text-sm font-medium">92.4%</div>
                      </div>
                      <div className="bg-muted/20 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Conversions</div>
                        <div className="text-sm font-medium">1,247</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/analytics/campaign-456">
                          View Results
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                          <Users className="h-4 w-4 text-purple-500" />
                        </div>
                        <CardTitle className="text-sm font-medium">VIP Customer Import</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        In Progress
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-muted-foreground">Started 15 minutes ago</p>
                      <p className="text-xs font-medium">78% complete</p>
                    </div>
                    <div className="w-full mb-2">
                      <Progress value={78} className="h-1.5" />
                    </div>
                    <div className="flex items-center justify-between text-xs mb-4">
                      <span className="text-muted-foreground">1,247 of 1,600 contacts</span>
                      <span className="text-muted-foreground">~2 min remaining</span>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/contacts/import-789">
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Suggested Next Steps - Only for new users */}
          {isNewUser && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Suggested Next Steps</h2>
                  <p className="text-sm text-muted-foreground">Recommended actions to explore the platform</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Explore AI-Powered Features</h3>
                        <p className="text-xs text-muted-foreground mb-3">Discover how our AI can help optimize your messaging campaigns and improve engagement.</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
                          <Link href="/dashboard/ai-suggestions">
                            Learn More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-all border-l-4 border-l-accent">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-1">Send Your First Test Message</h3>
                        <p className="text-xs text-muted-foreground mb-3">Try sending a test message to yourself to see how the platform works in real-time.</p>
                        <Button variant="link" size="sm" className="p-0 h-auto text-accent" asChild>
                          <Link href="/dashboard/messaging">
                            Send Test Message
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Quick Access</h2>
                <p className="text-sm text-muted-foreground">Navigate to frequently used sections</p>
              </div>
            </div>
            <Suspense fallback={<div className="h-[200px] w-full animate-pulse bg-muted rounded-lg" />}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {hierarchyMap["/dashboard"]?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative overflow-hidden rounded-xl border bg-card p-5 hover:border-primary hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {item.icon}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Suspense>
          </div>

          {/* Key Performance Metrics */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Performance Metrics</h2>
                <p className="text-sm text-muted-foreground">Real-time communication metrics across all channels</p>
              </div>
              <Link
                href="/dashboard/analytics"
                className="text-sm text-primary hover:bg-primary/5 flex items-center px-3 py-1.5 rounded-md transition-colors"
              >
                View analytics
                <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} variant="flat" className="h-[120px] animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 w-3/4 bg-muted rounded mb-3"></div>
                        <div className="h-6 w-1/2 bg-muted rounded mb-2"></div>
                        <div className="h-3 w-1/3 bg-muted rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              }>
                <Card variant="interactive" className="shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Delivery Rate
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{isLoading ? "..." : `${metrics.deliveryRate.value}%`}</div>
                    <div className="flex items-center text-xs text-success mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>{metrics.deliveryRate.change} from last period</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Success</div>
                          <div className="font-medium">98.7%</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Failed</div>
                          <div className="font-medium">1.3%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="interactive" className="shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Average Latency
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                        <Clock className="h-4 w-4 text-blue-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{isLoading ? "..." : `${metrics.latency.value} ms`}</div>
                    <div className="flex items-center text-xs text-success mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>{metrics.latency.change} from last period</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">SMS</div>
                          <div className="font-medium">65 ms</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">WhatsApp</div>
                          <div className="font-medium">112 ms</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="interactive" className="shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-amber-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Error Rate
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{isLoading ? "..." : `${metrics.errorRate.value}%`}</div>
                    <div className="flex items-center text-xs text-success mt-1">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      <span>{metrics.errorRate.change} from last period</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Network</div>
                          <div className="font-medium">0.3%</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Invalid</div>
                          <div className="font-medium">0.5%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="interactive" className="shadow-md">
                  <CardHeader className="pb-2 bg-gradient-to-r from-purple-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Throughput
                      </CardTitle>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10">
                        <Zap className="h-4 w-4 text-purple-500" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-semibold">{isLoading ? "..." : `${metrics.throughput.value}`}</div>
                    <div className="flex items-center text-xs text-success mt-1">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      <span>{metrics.throughput.change} from last period</span>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Peak</div>
                          <div className="font-medium">210/sec</div>
                        </div>
                        <div className="bg-muted/20 p-2 rounded-lg">
                          <div className="text-muted-foreground">Average</div>
                          <div className="font-medium">156/sec</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Suspense>
            </div>
          </div>

          {/* Analytics Chart Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Message Volume</h2>
                <p className="text-sm text-muted-foreground">Monthly message delivery across all channels</p>
              </div>
              <div className="flex items-center gap-2">
                <Select defaultValue="year">
                  <SelectTrigger className="w-[140px] h-8 text-xs rounded-lg">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last 30 days</SelectItem>
                    <SelectItem value="quarter">Last quarter</SelectItem>
                    <SelectItem value="year">Last 12 months</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Card variant="interactive" className="shadow-md">
              <CardHeader className="px-6 py-4 border-b flex flex-row justify-between items-center bg-muted/10">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary"></span>
                      <span className="text-xs font-medium">Total Messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-success"></span>
                      <span className="text-xs font-medium">Delivery Rate</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium bg-primary/10 px-3 py-1 rounded-full">
                  Total: 56,234
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="w-full h-[300px]">
                  <Suspense fallback={<div className="h-[300px] w-full animate-pulse bg-muted rounded-lg" />}>
                    <ClientSideChart data={chartData} />
                  </Suspense>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Insights Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Platform Insights</h2>
                <p className="text-sm text-muted-foreground">Key metrics and channel performance</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="interactive" className="shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Message Delivery
                    </CardTitle>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">24,234</div>
                  <div className="flex items-center text-xs text-success mt-1">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>12.3% from last month</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/20 p-2 rounded-lg">
                        <div className="text-muted-foreground">Delivered</div>
                        <div className="font-medium">23,945</div>
                      </div>
                      <div className="bg-muted/20 p-2 rounded-lg">
                        <div className="text-muted-foreground">Failed</div>
                        <div className="font-medium">289</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="interactive" className="shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      Active Channels
                    </CardTitle>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                      <BarChartIcon className="h-4 w-4 text-blue-500" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-2xl font-semibold">5</div>
                    <div className="text-xs text-muted-foreground ml-2">of 8 available</div>
                  </div>
                  <div className="mt-2 w-full">
                    <Progress value={62} className="h-1.5" />
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap gap-1.5">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/10 rounded-md">
                        <SMSLogo size={12} />
                        <span className="text-xs font-medium">SMS</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 rounded-md">
                        <WhatsAppLogo size={12} />
                        <span className="text-xs font-medium">WhatsApp</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-100 rounded-md">
                        <ViberLogo size={12} />
                        <span className="text-xs font-medium">Viber</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 rounded-md">
                        <VoiceLogo size={12} />
                        <span className="text-xs font-medium">Voice</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-100 rounded-md">
                        <RCSLogo size={12} />
                        <span className="text-xs font-medium">RCS</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <AIMetricsCard
                title="AI Performance"
                metrics={metrics.ai}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">AI Recommendations</h2>
                <p className="text-sm text-muted-foreground">Smart suggestions to optimize your communications</p>
              </div>
              <Link
                href="/dashboard/ai-suggestions"
                className="text-sm text-primary hover:bg-primary/5 flex items-center px-3 py-1.5 rounded-md transition-colors"
              >
                View all suggestions
                <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
              </Link>
            </div>
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 w-3/4 bg-muted rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-16 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Optimize Send Time Card */}
                <Card className="shadow-md border-l-4 border-l-blue-500 hover:shadow-lg transition-all">
                  <CardHeader className="pb-2 bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                          <Clock className="h-4 w-4 text-blue-500" />
                        </div>
                        <CardTitle className="text-base">Optimize Send Time</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        High Impact
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Sending messages between 2-4 PM could increase open rates by up to 23%.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        5 min to implement
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="outline" size="sm" className="ml-auto" asChild>
                      <Link href="/dashboard/ai-suggestions">
                        View Analysis
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                {/* Re-engage Dormant Customers Card */}
                <Card className="shadow-md border-l-4 border-l-green-500 hover:shadow-lg transition-all">
                  <CardHeader className="pb-2 bg-gradient-to-r from-green-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                          <Users className="h-4 w-4 text-green-500" />
                        </div>
                        <CardTitle className="text-base">Re-engage Dormant Customers</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        High Impact
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      1,247 customers haven't engaged in 60 days. A targeted campaign could recover 15%.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        15 min to implement
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-3">
                    <Button variant="outline" size="sm" className="ml-auto" asChild>
                      <Link href="/dashboard/campaigns/new">
                        Create Campaign
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </Suspense>
          </div>

          {/* Projects & Resources Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Projects & Resources</h2>
                <p className="text-sm text-muted-foreground">Manage your communication projects and assets</p>
              </div>
              <Button size="sm" variant="outline" className="font-medium rounded-lg" asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </Button>
            </div>
            <Card variant="interactive" className="shadow-md">
              <Tabs defaultValue="projects" className="w-full">
                <div className="border-b">
                  <TabsList className="p-0 h-12 bg-transparent border-b-0 rounded-none">
                    <TabsTrigger value="projects" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6">
                      Projects
                    </TabsTrigger>
                    <TabsTrigger value="campaigns" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6">
                      Campaigns
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12 px-6">
                      Templates
                    </TabsTrigger>
                  </TabsList>
                </div>
                <div className="p-6">
                  <TabsContent value="projects" className="m-0">
                    {isLoading ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-5 w-1/2 bg-muted rounded mb-3"></div>
                            <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                              <div className="h-12 bg-muted rounded"></div>
                              <div className="h-12 bg-muted rounded"></div>
                              <div className="h-12 bg-muted rounded"></div>
                            </div>
                            <div className="h-8 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                          <ProjectCard key={project.id} project={project} onSelect={handleProjectSelect} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Layers className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                          Create your first project to organize your communication campaigns and messages
                        </p>
                        <Button className="rounded-lg" asChild>
                          <Link href="/dashboard/projects/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Project
                          </Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="campaigns" className="m-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <MessageCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Campaign Management</h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-6">
                        Create and manage your communication campaigns across multiple channels
                      </p>
                      <Button asChild className="rounded-lg">
                        <Link href="/dashboard/campaigns">Manage Campaigns</Link>
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="templates" className="m-0">
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <MessageCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Message Templates</h3>
                      <p className="text-sm text-muted-foreground max-w-md mb-6">
                        Create reusable message templates for consistent communication
                      </p>
                      <Button asChild className="rounded-lg">
                        <Link href="/dashboard/messaging/templates">Manage Templates</Link>
                      </Button>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>
        </div>
      </ErrorBoundary>

      {/* Mobile action button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full h-14 w-14 shadow-xl bg-gradient-to-r from-primary to-accent text-white hover:shadow-2xl transition-all duration-300" asChild>
          <Link href="/dashboard/messaging">
            <MessageCircle className="h-7 w-7" />
          </Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}
