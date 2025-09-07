"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Plus, 
  Zap, 
  MessageSquare, 
  Clock, 
  Users,
  Mail,
  Phone,
  Bell,
  Calendar,
  Filter,
  Target,
  GitBranch,
  Play
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

// Workflow builder components
const triggerTypes = [
  {
    id: "contact_created",
    name: "Contact Created",
    description: "When a new contact is added to your database",
    icon: Users,
    category: "contact",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "email_opened",
    name: "Email Opened",
    description: "When a contact opens an email",
    icon: Mail,
    category: "engagement",
    color: "bg-green-100 text-green-600"
  },
  {
    id: "link_clicked",
    name: "Link Clicked",
    description: "When a contact clicks a link in your message",
    icon: Target,
    category: "engagement",
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "date_based",
    name: "Date/Time",
    description: "On a specific date or recurring schedule",
    icon: Calendar,
    category: "time",
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "tag_added",
    name: "Tag Added",
    description: "When a specific tag is added to a contact",
    icon: Filter,
    category: "contact",
    color: "bg-pink-100 text-pink-600"
  },
  {
    id: "purchase_made",
    name: "Purchase Made",
    description: "When a contact makes a purchase",
    icon: Zap,
    category: "ecommerce",
    color: "bg-yellow-100 text-yellow-600"
  }
]

const actionTypes = [
  {
    id: "send_email",
    name: "Send Email",
    description: "Send an email message",
    icon: Mail,
    category: "messaging",
    color: "bg-blue-100 text-blue-600"
  },
  {
    id: "send_sms",
    name: "Send SMS",
    description: "Send an SMS message",
    icon: Phone,
    category: "messaging",
    color: "bg-green-100 text-green-600"
  },
  {
    id: "send_push",
    name: "Send Push Notification",
    description: "Send a push notification",
    icon: Bell,
    category: "messaging",
    color: "bg-purple-100 text-purple-600"
  },
  {
    id: "wait",
    name: "Wait",
    description: "Wait for a specified time period",
    icon: Clock,
    category: "flow",
    color: "bg-gray-100 text-gray-600"
  },
  {
    id: "add_tag",
    name: "Add Tag",
    description: "Add a tag to the contact",
    icon: Filter,
    category: "contact",
    color: "bg-orange-100 text-orange-600"
  },
  {
    id: "condition",
    name: "Condition",
    description: "Branch workflow based on conditions",
    icon: GitBranch,
    category: "flow",
    color: "bg-pink-100 text-pink-600"
  }
]

const workflowTemplates = [
  {
    id: "welcome_series",
    name: "Welcome Series",
    description: "5-step onboarding sequence for new customers",
    category: "onboarding",
    steps: 5,
    estimatedTime: "7 days",
    channels: ["email", "sms"],
    conversionRate: "72%"
  },
  {
    id: "abandoned_cart",
    name: "Abandoned Cart Recovery",
    description: "3-step sequence to recover abandoned carts",
    category: "ecommerce",
    steps: 3,
    estimatedTime: "3 days",
    channels: ["email", "push"],
    conversionRate: "28%"
  },
  {
    id: "birthday_campaign",
    name: "Birthday Campaign",
    description: "Automated birthday wishes with offers",
    category: "engagement",
    steps: 2,
    estimatedTime: "1 day",
    channels: ["email", "sms"],
    conversionRate: "85%"
  },
  {
    id: "re_engagement",
    name: "Re-engagement Campaign",
    description: "Win back inactive subscribers",
    category: "retention",
    steps: 4,
    estimatedTime: "14 days",
    channels: ["email"],
    conversionRate: "19%"
  },
  {
    id: "lead_nurturing",
    name: "Lead Nurturing",
    description: "Convert leads into customers",
    category: "sales",
    steps: 7,
    estimatedTime: "30 days",
    channels: ["email", "linkedin"],
    conversionRate: "45%"
  },
  {
    id: "post_purchase",
    name: "Post-Purchase Follow-up",
    description: "Thank customers and request reviews",
    category: "ecommerce",
    steps: 3,
    estimatedTime: "7 days",
    channels: ["email", "sms"],
    conversionRate: "68%"
  }
]

export default function WorkflowBuilderPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("builder")

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "onboarding": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "ecommerce": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "engagement": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "retention": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "sales": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/automations")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Workflow Builder</h1>
              <p className="text-muted-foreground">Create automated messaging workflows with drag-and-drop builder</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard/automations/workflows/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Start Building
          </Button>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
              <TabsTrigger value="triggers">Triggers & Actions</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6 mt-6">
              {/* Workflow Canvas */}
              <Card>
                <CardHeader>
                  <CardTitle>Visual Workflow Builder</CardTitle>
                  <CardDescription>
                    Drag and drop components to build your automation workflow
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[400px] border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/10">
                    <div className="text-center">
                      <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Interactive Workflow Canvas</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        This would be the drag-and-drop workflow builder interface
                      </p>
                      <Button onClick={() => router.push("/dashboard/automations/workflows/new")}>
                        <Play className="mr-2 h-4 w-4" />
                        Start Building Workflow
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start Guide */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">How to Build Workflows</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        1
                      </div>
                      <div>
                        <p className="text-sm font-medium">Choose a Trigger</p>
                        <p className="text-xs text-muted-foreground">Select what starts your workflow</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        2
                      </div>
                      <div>
                        <p className="text-sm font-medium">Add Actions</p>
                        <p className="text-xs text-muted-foreground">Define what happens next</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        3
                      </div>
                      <div>
                        <p className="text-sm font-medium">Set Conditions</p>
                        <p className="text-xs text-muted-foreground">Add logic and branching</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                        4
                      </div>
                      <div>
                        <p className="text-sm font-medium">Test & Activate</p>
                        <p className="text-xs text-muted-foreground">Test your workflow and go live</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900">Start Simple</p>
                      <p className="text-xs text-blue-700">Begin with basic workflows and add complexity over time</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm font-medium text-green-900">Test Thoroughly</p>
                      <p className="text-xs text-green-700">Always test workflows before activating them</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-purple-900">Monitor Performance</p>
                      <p className="text-xs text-purple-700">Track metrics and optimize based on results</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="triggers" className="space-y-6 mt-6">
              {/* Triggers */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Triggers</CardTitle>
                  <CardDescription>Events that can start your automation workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {triggerTypes.map((trigger) => {
                      const IconComponent = trigger.icon
                      return (
                        <div key={trigger.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${trigger.color} mb-3`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium mb-1">{trigger.name}</h3>
                          <p className="text-sm text-muted-foreground">{trigger.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {trigger.category}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Actions</CardTitle>
                  <CardDescription>Actions you can perform in your workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {actionTypes.map((action) => {
                      const IconComponent = action.icon
                      return (
                        <div key={action.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${action.color} mb-3`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <h3 className="font-medium mb-1">{action.name}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {action.category}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6 mt-6">
              {/* Workflow Templates */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Templates</CardTitle>
                  <CardDescription>Pre-built workflows for common use cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {workflowTemplates.map((template) => (
                      <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                              <CardDescription className="text-sm">{template.description}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="secondary" className={getCategoryColor(template.category)}>
                            {template.category.toUpperCase()}
                          </Badge>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Steps</p>
                                <p className="font-medium">{template.steps}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Duration</p>
                                <p className="font-medium">{template.estimatedTime}</p>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Channels</p>
                              <div className="flex gap-1">
                                {template.channels.map((channel, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {channel}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Avg. Conversion</p>
                                <p className="text-sm font-medium">{template.conversionRate}</p>
                              </div>
                              <Button 
                                size="sm" 
                                onClick={() => router.push(`/dashboard/automations/workflows/new?template=${template.id}`)}
                              >
                                Use Template
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
