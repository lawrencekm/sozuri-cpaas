"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Layers, MessageCircle, Plus, Sparkles,
  TrendingDown, TrendingUp,
  ArrowUp, AlertTriangle, RefreshCw, ArrowRight,
  MessagesSquare, BarChart3, Users, CheckCircle2,
  Clock, ChevronRight, MoreHorizontal, Trash2
} from "lucide-react"
import { SMSLogo, WhatsAppLogo, RCSLogo, VoiceLogo } from "@/components/channel-logos"
import { handleError, ErrorType } from "@/lib/error-handler"
import { ErrorBoundary } from "@/components/error-handling/error-boundary"
import dynamic from 'next/dynamic'
import { getTimeBasedGreeting } from "@/lib/greeting-utils"
import { useSession } from "next-auth/react";

// Add CSS for background grid pattern
import "@/styles/dashboard-patterns.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CampaignCard } from "@/components/dashboard/campaign-card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { projectsAPI, campaignsAPI, campaignTemplatesAPI, Project as ApiProject, Campaign as ApiCampaign, CampaignTemplate } from "@/lib/api"

// Lazy load chart components for better performance

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
      <CardContent className="p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
                {icon}
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
            </div>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              ) : (
                <>
                  <p className="text-2xl font-bold text-foreground">
                    {value}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1 ${
                      trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {change}
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Import ProjectCard component and types
import { ProjectCard, toCardProject, Project } from "@/components/dashboard/project-card"

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
      icon: (
        <Image
          src="/images/messaging.svg"
          alt="Messaging"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
      description: "Manage all messaging channels",
    },
    {
      title: "Voice",
      href: "/dashboard/voice",
      icon: (
        <Image
          src="/images/voice.svg"
          alt="Voice"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
      description: "Manage voice calls and IVR",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: (
        <Image
          src="/images/analytics.svg"
          alt="Analytics"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
      description: "View performance metrics",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: (
        <Image
          src="/images/contacts.svg"
          alt="Contacts"
          width={20}
          height={20}
          className="h-5 w-5"
        />
      ),
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
  const [projects, setProjects] = useState<Project[]>([])
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([])
  const [templates, setTemplates] = useState<CampaignTemplate[]>([])
  // Determine if the user is new by checking backend status once session is available
  const [isNewUser, setIsNewUser] = useState<boolean>(false)

  const { data: session } = useSession();
  const userInfo = {
    name: session?.user?.name || "",
    companyName: session?.user?.company || "",
    userRole: session?.user?.role || ""
  };

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        if (!session?.user?.id) return;
        const res = await fetch(`/api/users/${session.user.id}/status`);
        if (!res.ok) throw new Error('Failed to fetch user status');
        const data = await res.json();
        setIsNewUser(Boolean(data?.isNewUser));
      } catch (e) {
        // Fail closed: if status check fails, do not block dashboard; treat as returning user
        setIsNewUser(false);
      }
    };
    fetchUserStatus();
  }, [session?.user?.id]);

  const [metrics, setMetrics] = useState({
    ai: {
      accuracy: 0,
      predictions: 0,
      optimizations: 0
    }
  })

  const [error, setError] = useState<Error | null>(null)
  const [currentTime, setCurrentTime] = useState<string>('')





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
    // Set initial time and update every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }

    updateTime() // Set initial time
    const timeInterval = setInterval(updateTime, 60000) // Update every minute

    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch projects, campaigns, and templates in parallel
        const [projectsData, campaignsData] = await Promise.all([
          projectsAPI.getAll(),
          campaignsAPI.getAll(),
        ])

        const mappedProjects = (projectsData || []).map(p => toCardProject({
          ...p,
          type: p.accountType || 'marketing'
        }))
        setProjects(mappedProjects)
        setCampaigns(campaignsData || [])

        if ((projectsData?.length || 0) > 0) {
          try {
            // Aggregate templates from all user projects
            const templatePromises = projectsData.map(project => 
              campaignTemplatesAPI.getAll(project.id).catch(() => [])
            )
            const templateArrays = await Promise.all(templatePromises)
            const allTemplates = templateArrays.flat()
            setTemplates(allTemplates || [])
          } catch (_) {
            setTemplates([])
          }
        } else {
          setTemplates([])
        }

        setMetrics({
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
          {/* Streamlined Welcome Section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/90 to-accent/90 text-white">
            <div className="absolute inset-0 bg-grid-white animate-subtle-move [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]"></div>
            <div className="relative z-10 p-8">


              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold tracking-tight">{getTimeBasedGreeting(userInfo.name)}</h1>
                  <p className="mt-2 text-white/80 text-lg">
                    {isNewUser
                      ? "Welcome to your communication hub. Let's get you started."
                      : "Your communication platform is ready. Here's today's overview."}
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
                  </div>
                </div>

                {/* Simplified status indicators */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">All Systems Operational</div>
                      <div className="text-xs text-white/70">5 channels active</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Getting Started Guide - Only for new users */}
          {isNewUser && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div>

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

          {/* What's New - Simplified for returning users */}
          {!isNewUser && (
            <div className="mb-8">
              <div className="bg-gradient-to-r from-accent/5 to-transparent p-6 rounded-xl border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                      <Sparkles className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">New AI-Powered Campaign Optimization</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Automatically optimize your campaigns for better performance</p>
                    </div>
                  </div>
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



          {/* Suggested Next Steps removed */}

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
          
          {/* Projects & Resources Section  */}
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
                          <ProjectCard 
                            key={i}
                            project={{
                              id: `loading-${i}`,
                              name: '',
                              description: '',
                              type: '',
                              stats: {
                                campaigns: 0,
                                messages: 0,
                                engagement: 0,
                                successRate: 0
                              }
                            }}
                            isLoading={true}
                            variant="default"
                          />
                        ))}
                      </div>
                    ) : projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onView={handleProjectSelect}
                            variant="default"
                          />
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
                    {isLoading ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-5 w-1/2 bg-muted rounded mb-3"></div>
                            <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                            <div className="h-8 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : campaigns.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {campaigns.slice(0, 6).map((campaign) => (
                          <CampaignCard key={campaign.id} campaign={campaign} />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                          Create and manage your communication campaigns across multiple channels
                        </p>
                        <Button asChild className="rounded-lg">
                          <Link href="/dashboard/campaigns">Manage Campaigns</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="templates" className="m-0">
                    {isLoading ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="border rounded-lg p-4 animate-pulse">
                            <div className="h-5 w-2/3 bg-muted rounded mb-3"></div>
                            <div className="h-4 w-1/2 bg-muted rounded mb-2"></div>
                            <div className="h-8 bg-muted rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : templates.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {templates.slice(0, 6).map((t) => (
                          <Card key={t.id} className="dashboard-card">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg">{t.name}</CardTitle>
                              <CardDescription className="line-clamp-1">{t.type} • {t.channel.toUpperCase()}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-5 text-sm">
                              <div className="line-clamp-2 text-muted-foreground">{t.content}</div>
                            </CardContent>
                            <CardFooter>
                              <Button asChild variant="ghost" size="sm" className="w-full rounded-lg">
                                <Link href="/dashboard/messaging/templates">Manage Templates</Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <MessageCircle className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No templates yet</h3>
                        <p className="text-sm text-muted-foreground max-w-md mb-6">
                          Create reusable message templates for consistent communication
                        </p>
                        <Button asChild className="rounded-lg">
                          <Link href="/dashboard/messaging/templates">Manage Templates</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>
            </Card>
          </div>





          {/* AI Recommendations */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">AI Insights</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Smart recommendations to improve performance</p>
              </div>
              <Link
                href="/dashboard/ai-suggestions"
                className="text-sm text-primary hover:bg-primary/5 flex items-center px-3 py-1.5 rounded-md transition-colors"
              >
                View all insights
                <ArrowUp className="ml-1 h-3 w-3 rotate-45" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
