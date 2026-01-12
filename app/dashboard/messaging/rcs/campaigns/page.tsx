"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
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
  MessageSquare,
  Calendar,
  Users,
  TrendingUp
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

// Mock RCS campaigns data
const rcsCampaigns = [
  {
    id: "1",
    name: "Summer Sale - Rich Product Showcase",
    status: "active",
    type: "Marketing",
    cardType: "carousel",
    sent: 5420,
    delivered: 5234,
    opened: 4187,
    clicked: 1256,
    interacted: 892,
    openRate: 80.0,
    clickRate: 24.0,
    interactionRate: 17.0,
    deliveryRate: 96.6,
    createdAt: "2024-01-15",
    lastSent: "2024-01-20T10:30:00Z",
    audience: "Premium Customers",
    audienceSize: 5420
  },
  {
    id: "2",
    name: "Store Location Finder",
    status: "completed",
    type: "Utility",
    cardType: "location",
    sent: 2890,
    delivered: 2834,
    opened: 2267,
    clicked: 680,
    interacted: 453,
    openRate: 80.0,
    clickRate: 24.0,
    interactionRate: 16.0,
    deliveryRate: 98.1,
    createdAt: "2024-01-10",
    lastSent: "2024-01-15T14:00:00Z",
    audience: "Local Customers",
    audienceSize: 2890
  },
  {
    id: "3",
    name: "Product Launch Announcement",
    status: "scheduled",
    type: "Marketing",
    cardType: "media",
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    interacted: 0,
    openRate: 0,
    clickRate: 0,
    interactionRate: 0,
    deliveryRate: 0,
    createdAt: "2024-01-18",
    scheduledFor: "2024-01-25T16:00:00Z",
    audience: "All Subscribers",
    audienceSize: 12450
  },
  {
    id: "4",
    name: "Customer Feedback Survey",
    status: "paused",
    type: "Survey",
    cardType: "interactive",
    sent: 1250,
    delivered: 1198,
    opened: 958,
    clicked: 287,
    interacted: 234,
    openRate: 80.0,
    clickRate: 24.0,
    interactionRate: 19.5,
    deliveryRate: 95.8,
    createdAt: "2024-01-12",
    lastSent: "2024-01-17T11:00:00Z",
    audience: "Recent Purchasers",
    audienceSize: 1250
  }
]

export default function RCSCampaignsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Filter campaigns based on search and filters
  const filteredCampaigns = rcsCampaigns.filter(campaign => {
    const matchesSearch = searchQuery === "" || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.audience.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || campaign.status === selectedStatus
    const matchesType = selectedType === "all" || campaign.type.toLowerCase() === selectedType.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "scheduled": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "paused": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      case "draft": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "marketing": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "utility": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "survey": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "transactional": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleCampaignAction = (action: string, campaignId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/messaging/rcs/campaigns/${campaignId}/edit`)
        break
      case "view":
        router.push(`/dashboard/messaging/rcs/campaigns/${campaignId}`)
        break
      case "duplicate":
        console.log("Duplicate campaign:", campaignId)
        break
      case "pause":
        console.log("Pause campaign:", campaignId)
        break
      case "resume":
        console.log("Resume campaign:", campaignId)
        break
      case "delete":
        console.log("Delete campaign:", campaignId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const totalSent = filteredCampaigns.reduce((sum, campaign) => sum + campaign.sent, 0)
  const avgOpenRate = filteredCampaigns.length > 0 
    ? filteredCampaigns.reduce((sum, campaign) => sum + campaign.openRate, 0) / filteredCampaigns.length 
    : 0
  const avgInteractionRate = filteredCampaigns.length > 0 
    ? filteredCampaigns.reduce((sum, campaign) => sum + campaign.interactionRate, 0) / filteredCampaigns.length 
    : 0

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/rcs")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">RCS Campaigns</h1>
              <p className="text-muted-foreground">Manage your rich communication campaigns</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard/messaging/rcs/campaigns/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredCampaigns.length}</div>
              <p className="text-xs text-muted-foreground">Total Campaigns</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Messages Sent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Avg. Open Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{avgInteractionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Avg. Interaction Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Campaign Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="survey">Survey</SelectItem>
              <SelectItem value="transactional">Transactional</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Campaigns List */}
        <motion.div className="space-y-4" variants={staggerContainer}>
          {filteredCampaigns.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeIn}>
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedStatus !== "all" || selectedType !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first RCS campaign to get started"
                }
              </p>
              <Button onClick={() => router.push("/dashboard/messaging/rcs/campaigns/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </motion.div>
          ) : (
            filteredCampaigns.map((campaign) => (
              <motion.div key={campaign.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{campaign.name}</h3>
                          <Badge variant="secondary" className={getStatusColor(campaign.status)}>
                            {campaign.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(campaign.type)}>
                            {campaign.type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Audience</p>
                            <p className="text-sm font-medium">{campaign.audience}</p>
                            <p className="text-xs text-muted-foreground">{campaign.audienceSize.toLocaleString()} recipients</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Sent</p>
                            <p className="text-sm font-medium">{campaign.sent.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{campaign.deliveryRate.toFixed(1)}% delivered</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Engagement</p>
                            <p className="text-sm font-medium">{campaign.openRate.toFixed(1)}% opened</p>
                            <p className="text-xs text-muted-foreground">{campaign.interactionRate.toFixed(1)}% interacted</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              {campaign.status === "scheduled" ? "Scheduled" : "Last Sent"}
                            </p>
                            <p className="text-sm font-medium">
                              {campaign.status === "scheduled" && campaign.scheduledFor
                                ? formatDate(campaign.scheduledFor)
                                : formatDate(campaign.lastSent || campaign.createdAt)
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCampaignAction("view", campaign.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          {campaign.status === "active" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction("pause", campaign.id)}
                            >
                              <Pause className="mr-2 h-4 w-4" />
                              Pause
                            </Button>
                          )}
                          {campaign.status === "paused" && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCampaignAction("resume", campaign.id)}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Resume
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => router.push(`/dashboard/analytics/campaigns/${campaign.id}`)}
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
                            <DropdownMenuItem onClick={() => handleCampaignAction("edit", campaign.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleCampaignAction("duplicate", campaign.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleCampaignAction("delete", campaign.id)}
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
      </motion.div>
    </DashboardLayout>
  )
}
