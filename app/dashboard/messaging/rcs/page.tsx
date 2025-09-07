"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  MessageSquare, 
  Send, 
  Calendar, 
  Users, 
  FileText, 
  Settings, 
  Plus,
  TrendingUp,
  Eye,
  MousePointer,
  Image,
  Video,
  MapPin,
  Star
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

// Mock data for RCS campaigns
const rcsCampaigns = [
  {
    id: "1",
    name: "Product Showcase - Rich Cards",
    status: "active",
    type: "Rich Media",
    sent: 2450,
    delivered: 2398,
    opened: 1876,
    clicked: 456,
    interacted: 234,
    openRate: 78.2,
    clickRate: 18.6,
    deliveryRate: 97.9,
    createdAt: "2024-01-15",
    lastSent: "2024-01-20T10:30:00Z",
    mediaType: "carousel"
  },
  {
    id: "2", 
    name: "Location-Based Offers",
    status: "completed",
    type: "Location",
    sent: 1820,
    delivered: 1756,
    opened: 1234,
    clicked: 298,
    interacted: 156,
    openRate: 70.3,
    clickRate: 16.4,
    deliveryRate: 96.5,
    createdAt: "2024-01-01",
    lastSent: "2024-01-01T14:00:00Z",
    mediaType: "location"
  },
  {
    id: "3",
    name: "Interactive Survey Campaign",
    status: "scheduled",
    type: "Interactive",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    interacted: 0,
    openRate: 0,
    clickRate: 0,
    deliveryRate: 0,
    createdAt: "2024-01-18",
    scheduledFor: "2024-01-25T16:00:00Z",
    mediaType: "interactive"
  }
]

// RCS features showcase
const rcsFeatures = [
  {
    icon: Image,
    title: "Rich Media Cards",
    description: "Send images, videos, and carousels",
    usage: 156,
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: MapPin,
    title: "Location Sharing",
    description: "Share locations and maps",
    usage: 89,
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Star,
    title: "Suggested Actions",
    description: "Quick reply buttons and actions",
    usage: 234,
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Video,
    title: "Video Messages",
    description: "Send rich video content",
    usage: 67,
    color: "bg-red-100 text-red-600"
  }
]

export default function RCSDashboard() {
  const router = useRouter()

  // Calculate overall metrics
  const totalSent = rcsCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const totalDelivered = rcsCampaigns.reduce((sum, campaign) => sum + campaign.delivered, 0)
  const totalOpened = rcsCampaigns.reduce((sum, campaign) => sum + campaign.opened, 0)
  const totalInteracted = rcsCampaigns.reduce((sum, campaign) => sum + campaign.interacted, 0)
  
  const avgOpenRate = totalSent > 0 ? (totalOpened / totalSent * 100) : 0
  const avgInteractionRate = totalSent > 0 ? (totalInteracted / totalSent * 100) : 0
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

  const getMediaTypeIcon = (mediaType: string) => {
    switch (mediaType) {
      case "carousel": return Image
      case "location": return MapPin
      case "interactive": return Star
      case "video": return Video
      default: return MessageSquare
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
            <h1 className="text-3xl font-bold tracking-tight">RCS Messaging</h1>
            <p className="text-muted-foreground">Rich Communication Services with interactive features</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/messaging/rcs/rich-cards")}>
              <Image className="mr-2 h-4 w-4" />
              Rich Cards
            </Button>
            <Button variant="outline" onClick={() => router.push("/dashboard/messaging/rcs/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button onClick={() => router.push("/dashboard/messaging/rcs/campaigns/new")}>
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
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgDeliveryRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +3.2% from last month
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
                  +12.4% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interaction Rate</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgInteractionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  +8.7% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* RCS Features */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>RCS Features</CardTitle>
              <CardDescription>Rich Communication Services capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {rcsFeatures.map((feature, index) => {
                  const IconComponent = feature.icon
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${feature.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{feature.title}</p>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{feature.usage} campaigns</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Campaigns */}
        <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
          <motion.div className="md:col-span-2" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Recent RCS Campaigns</CardTitle>
                <CardDescription>Your latest rich messaging campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rcsCampaigns.map((campaign) => {
                    const MediaIcon = getMediaTypeIcon(campaign.mediaType)
                    return (
                      <div
                        key={campaign.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/messaging/rcs/campaigns/${campaign.id}`)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <MediaIcon className="h-5 w-5 text-primary" />
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
                            <span>{((campaign.interacted / Math.max(campaign.sent, 1)) * 100).toFixed(1)}% interacted</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeIn}>
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common RCS messaging tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/messaging/rcs/campaigns/new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/messaging/rcs/rich-cards")}
                >
                  <Image className="mr-2 h-4 w-4" />
                  Design Rich Cards
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/contacts/segments")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Audience
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

            {/* RCS Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle>RCS Capabilities</CardTitle>
                <CardDescription>What makes RCS special</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rich Media Support</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suggested Actions</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Read Receipts</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Typing Indicators</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Location Sharing</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
                <CardDescription>RCS vs traditional messaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="font-medium">+245% vs SMS</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Click-through Rate</span>
                    <span className="font-medium">+180% vs SMS</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span className="font-medium">+156% vs SMS</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
