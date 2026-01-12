"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  TrendingUp,
  Eye,
  MousePointer,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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

// Mock data for email campaigns
const emailCampaigns = [
  {
    id: "1",
    name: "Welcome Series - New Customers",
    status: "active",
    type: "Automated",
    sent: 1250,
    delivered: 1198,
    opened: 456,
    clicked: 89,
    bounced: 12,
    unsubscribed: 3,
    openRate: 38.1,
    clickRate: 7.4,
    deliveryRate: 95.8,
    createdAt: "2024-01-15",
    lastSent: "2024-01-20T10:30:00Z"
  },
  {
    id: "2", 
    name: "Monthly Newsletter - January",
    status: "completed",
    type: "Broadcast",
    sent: 5420,
    delivered: 5234,
    opened: 1876,
    clicked: 234,
    bounced: 186,
    unsubscribed: 15,
    openRate: 35.8,
    clickRate: 4.3,
    deliveryRate: 96.6,
    createdAt: "2024-01-01",
    lastSent: "2024-01-01T09:00:00Z"
  },
  {
    id: "3",
    name: "Product Launch Announcement",
    status: "scheduled",
    type: "Broadcast", 
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0,
    createdAt: "2024-01-18",
    scheduledFor: "2024-01-25T14:00:00Z"
  },
  {
    id: "4",
    name: "Abandoned Cart Recovery",
    status: "active",
    type: "Automated",
    sent: 892,
    delivered: 856,
    opened: 298,
    clicked: 67,
    bounced: 36,
    unsubscribed: 8,
    openRate: 34.8,
    clickRate: 7.8,
    deliveryRate: 96.0,
    createdAt: "2024-01-10",
    lastSent: "2024-01-20T16:45:00Z"
  }
]

// Email templates
const emailTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to {{company_name}}!",
    type: "Transactional",
    lastUsed: "2024-01-20",
    usage: 156
  },
  {
    id: "2", 
    name: "Newsletter Template",
    subject: "{{company_name}} Monthly Update",
    type: "Marketing",
    lastUsed: "2024-01-15",
    usage: 89
  },
  {
    id: "3",
    name: "Order Confirmation",
    subject: "Your order #{{order_id}} is confirmed",
    type: "Transactional", 
    lastUsed: "2024-01-19",
    usage: 234
  }
]

export default function EmailDashboard() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

  // Calculate overall metrics
  const totalSent = emailCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalDelivered = emailCampaigns.reduce((sum, campaign) => sum + campaign.delivered, 0)
  const totalOpened = emailCampaigns.reduce((sum, campaign) => sum + campaign.opened, 0)
  const totalClicked = emailCampaigns.reduce((sum, campaign) => sum + campaign.clicked, 0)
  
  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent * 100) : 0
  const avgClickRate = totalSent > 0 ? (totalClicked / totalSent * 100) : 0
  const avgDeliveryRate = totalSent > 0 ? (totalDelivered / totalSent * 100) : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "scheduled": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "paused": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Marketing</h1>
            <p className="text-muted-foreground">Create, send, and track email campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/messaging/email/templates")}>
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/messaging/email/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => router.push("/dashboard/messaging/email/compose")}>
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          </div>
        </motion.div>

        {/* Metrics Overview */}
        <motion.div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" variants={staggerContainer}>
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDeliveryRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +1.8% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Campaigns */}
        <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
          <motion.div className="md:col-span-2" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Email Campaigns</CardTitle>
                <CardDescription>Your latest email marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emailCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push(`/dashboard/messaging/email/campaigns/${campaign.id}`)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{campaign.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                              {campaign.status.toUpperCase()}
                            </Badge>
                            <span>•</span>
                            <span>{campaign.type}</span>
                            <span>•</span>
                            <span>
                              {campaign.status === "scheduled" && campaign.scheduledFor
                                ? `Scheduled for ${formatDate(campaign.scheduledFor)}`
                                : `Last sent ${formatDate(campaign.lastSent || campaign.createdAt)}`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{campaign.sent.toLocaleString()} sent</p>
                        <div className="flex space-x-4 text-xs text-muted-foreground">
                          <span>{campaign.openRate.toFixed(1)}% opened</span>
                          <span>{campaign.clickRate.toFixed(1)}% clicked</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeIn}>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common email marketing tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/messaging/email/compose")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/messaging/email/templates")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Manage Templates
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/contacts/segments")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Create Segment
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/analytics/messaging")}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Popular Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Templates</CardTitle>
                <CardDescription>Most used email templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{template.usage} uses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
