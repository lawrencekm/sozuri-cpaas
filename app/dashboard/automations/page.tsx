"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Copy,
  Trash2,
  Eye,
  Play,
  Pause,
  Zap,
  Clock,
  Users,
  MessageSquare,
  TrendingUp,
  Calendar,
  Settings
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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

// Mock automation workflows data
const automationWorkflows = [
  {
    id: "1",
    name: "Welcome Series",
    description: "Multi-step onboarding sequence for new customers",
    status: "active",
    type: "onboarding",
    trigger: "contact_created",
    steps: 5,
    enrolled: 1250,
    completed: 892,
    conversionRate: 71.4,
    createdAt: "2024-01-15",
    lastTriggered: "2024-01-20T10:30:00Z",
    channels: ["email", "sms"],
    tags: ["welcome", "onboarding", "multi-channel"]
  },
  {
    id: "2",
    name: "Abandoned Cart Recovery",
    description: "Re-engage customers who left items in cart",
    status: "active", 
    type: "ecommerce",
    trigger: "cart_abandoned",
    steps: 3,
    enrolled: 890,
    completed: 234,
    conversionRate: 26.3,
    createdAt: "2024-01-10",
    lastTriggered: "2024-01-20T16:45:00Z",
    channels: ["email", "push"],
    tags: ["cart", "recovery", "ecommerce"]
  },
  {
    id: "3",
    name: "Birthday Campaign",
    description: "Automated birthday wishes with special offers",
    status: "active",
    type: "engagement",
    trigger: "birthday_date",
    steps: 2,
    enrolled: 156,
    completed: 134,
    conversionRate: 85.9,
    createdAt: "2024-01-08",
    lastTriggered: "2024-01-19T09:00:00Z",
    channels: ["email", "sms"],
    tags: ["birthday", "celebration", "offers"]
  },
  {
    id: "4",
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    status: "paused",
    type: "retention",
    trigger: "inactivity_90_days",
    steps: 4,
    enrolled: 2340,
    completed: 456,
    conversionRate: 19.5,
    createdAt: "2024-01-05",
    lastTriggered: "2024-01-15T14:20:00Z",
    channels: ["email"],
    tags: ["re-engagement", "inactive", "retention"]
  },
  {
    id: "5",
    name: "Post-Purchase Follow-up",
    description: "Thank customers and request reviews",
    status: "active",
    type: "ecommerce",
    trigger: "purchase_completed",
    steps: 3,
    enrolled: 567,
    completed: 423,
    conversionRate: 74.6,
    createdAt: "2024-01-12",
    lastTriggered: "2024-01-20T11:15:00Z",
    channels: ["email", "sms"],
    tags: ["post-purchase", "reviews", "feedback"]
  },
  {
    id: "6",
    name: "Lead Nurturing Sequence",
    description: "Convert leads into customers over time",
    status: "draft",
    type: "lead_nurturing",
    trigger: "lead_captured",
    steps: 7,
    enrolled: 0,
    completed: 0,
    conversionRate: 0,
    createdAt: "2024-01-18",
    lastTriggered: null,
    channels: ["email", "linkedin"],
    tags: ["leads", "nurturing", "conversion"]
  }
]

export default function AutomationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Filter workflows based on search and filters
  const filteredWorkflows = automationWorkflows.filter(workflow => {
    const matchesSearch = searchQuery === "" || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = selectedStatus === "all" || workflow.status === selectedStatus
    const matchesType = selectedType === "all" || workflow.type === selectedType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "onboarding": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "ecommerce": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "engagement": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "retention": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "lead_nurturing": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleWorkflowAction = (action: string, workflowId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/automations/workflows/${workflowId}/edit`)
        break
      case "view":
        router.push(`/dashboard/automations/workflows/${workflowId}`)
        break
      case "duplicate":
        console.log("Duplicate workflow:", workflowId)
        break
      case "pause":
        console.log("Pause workflow:", workflowId)
        break
      case "activate":
        console.log("Activate workflow:", workflowId)
        break
      case "delete":
        console.log("Delete workflow:", workflowId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const totalEnrolled = filteredWorkflows.reduce((sum, workflow) => sum + workflow.enrolled, 0)
  const totalCompleted = filteredWorkflows.reduce((sum, workflow) => sum + workflow.completed, 0)
  const avgConversionRate = filteredWorkflows.length > 0 
    ? filteredWorkflows.reduce((sum, workflow) => sum + workflow.conversionRate, 0) / filteredWorkflows.length 
    : 0

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Automation Workflows</h1>
            <p className="text-muted-foreground">Create and manage automated messaging sequences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/automations/triggers")}>
              <Zap className="mr-2 h-4 w-4" />
              Triggers
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/automations/workflows")}>
              <Settings className="mr-2 h-4 w-4" />
              Workflow Builder
            </Button>
            <Button onClick={() => router.push("/dashboard/automations/workflows/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredWorkflows.length}</div>
              <p className="text-xs text-muted-foreground">Total Workflows</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalEnrolled.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCompleted.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Avg. Conversion Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="retention">Retention</SelectItem>
              <SelectItem value="lead_nurturing">Lead Nurturing</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Workflows List */}
        <motion.div className="space-y-4" variants={staggerContainer}>
          {filteredWorkflows.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeIn}>
              <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No workflows found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedStatus !== "all" || selectedType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first automation workflow to get started"
                }
              </p>
              <Button onClick={() => router.push("/dashboard/automations/workflows/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workflow
              </Button>
            </motion.div>
          ) : (
            filteredWorkflows.map((workflow) => (
              <motion.div key={workflow.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <Badge variant="secondary" className={getStatusColor(workflow.status)}>
                            {workflow.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(workflow.type)}>
                            {workflow.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Steps</p>
                            <p className="text-sm font-medium">{workflow.steps} steps</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Enrolled</p>
                            <p className="text-sm font-medium">{workflow.enrolled.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Completed</p>
                            <p className="text-sm font-medium">{workflow.completed.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{workflow.conversionRate.toFixed(1)}% rate</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Triggered</p>
                            <p className="text-sm font-medium">{formatDate(workflow.lastTriggered)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {workflow.channels.join(", ")}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {workflow.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {workflow.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{workflow.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleWorkflowAction("view", workflow.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          {workflow.status === "active" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleWorkflowAction("pause", workflow.id)}
                            >
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </Button>
                          )}
                          {(workflow.status === "paused" || workflow.status === "draft") && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleWorkflowAction("activate", workflow.id)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Activate
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/analytics/workflows/${workflow.id}`)}
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Analytics
                          </Button>
                        </div>
                      </div>

                      <div className="ml-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleWorkflowAction("edit", workflow.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleWorkflowAction("duplicate", workflow.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleWorkflowAction("delete", workflow.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Workflow Templates */}
        {filteredWorkflows.length > 0 && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Workflow Templates</h3>
                    <p className="text-sm text-muted-foreground">
                      Start with pre-built workflow templates for common use cases.
                    </p>
                  </div>
                  <Button onClick={() => router.push("/dashboard/automations/templates")}>
                    <Zap className="mr-2 h-4 w-4" />
                    Browse Templates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
