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
  Users,
  Target,
  TrendingUp,
  Calendar,
  RefreshCw,
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

// Mock segments data
const contactSegments = [
  {
    id: "1",
    name: "VIP Customers",
    description: "High-value customers with purchases over $1000",
    contactCount: 1250,
    type: "dynamic",
    status: "active",
    lastUpdated: "2024-01-20T10:30:00Z",
    createdAt: "2024-01-15",
    criteria: [
      { field: "totalPurchases", operator: "greater_than", value: "1000" },
      { field: "status", operator: "equals", value: "active" }
    ],
    tags: ["high-value", "premium", "vip"],
    campaignsUsed: 12,
    conversionRate: 8.5
  },
  {
    id: "2",
    name: "New Subscribers",
    description: "Contacts who joined in the last 30 days",
    contactCount: 890,
    type: "dynamic",
    status: "active",
    lastUpdated: "2024-01-20T08:15:00Z",
    createdAt: "2024-01-10",
    criteria: [
      { field: "createdAt", operator: "last_days", value: "30" },
      { field: "subscribed", operator: "equals", value: "true" }
    ],
    tags: ["new", "onboarding", "welcome"],
    campaignsUsed: 8,
    conversionRate: 12.3
  },
  {
    id: "3",
    name: "Inactive Users",
    description: "Users who haven't engaged in the last 90 days",
    contactCount: 2340,
    type: "dynamic",
    status: "active",
    lastUpdated: "2024-01-19T16:45:00Z",
    createdAt: "2024-01-08",
    criteria: [
      { field: "lastEngagement", operator: "older_than_days", value: "90" },
      { field: "status", operator: "equals", value: "active" }
    ],
    tags: ["inactive", "re-engagement", "churn-risk"],
    campaignsUsed: 5,
    conversionRate: 3.2
  },
  {
    id: "4",
    name: "Location: New York",
    description: "Contacts located in New York area",
    contactCount: 567,
    type: "dynamic",
    status: "active",
    lastUpdated: "2024-01-18T14:20:00Z",
    createdAt: "2024-01-12",
    criteria: [
      { field: "city", operator: "equals", value: "New York" },
      { field: "state", operator: "equals", value: "NY" }
    ],
    tags: ["location", "new-york", "regional"],
    campaignsUsed: 15,
    conversionRate: 6.8
  },
  {
    id: "5",
    name: "Mobile App Users",
    description: "Contacts who have used the mobile app",
    contactCount: 3420,
    type: "dynamic",
    status: "active",
    lastUpdated: "2024-01-17T11:30:00Z",
    createdAt: "2024-01-05",
    criteria: [
      { field: "mobileAppUsage", operator: "greater_than", value: "0" },
      { field: "platform", operator: "contains", value: "mobile" }
    ],
    tags: ["mobile", "app-users", "engaged"],
    campaignsUsed: 22,
    conversionRate: 9.1
  },
  {
    id: "6",
    name: "Birthday This Month",
    description: "Contacts with birthdays in the current month",
    contactCount: 156,
    type: "dynamic",
    status: "paused",
    lastUpdated: "2024-01-16T09:00:00Z",
    createdAt: "2024-01-01",
    criteria: [
      { field: "birthday", operator: "current_month", value: "" }
    ],
    tags: ["birthday", "celebration", "personal"],
    campaignsUsed: 3,
    conversionRate: 15.2
  }
]

export default function ContactSegmentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filter segments based on search and filters
  const filteredSegments = contactSegments.filter(segment => {
    const matchesSearch = searchQuery === "" || 
      segment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      segment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === "all" || segment.type === selectedType
    const matchesStatus = selectedStatus === "all" || segment.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "draft": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dynamic": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "static": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
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

  const handleSegmentAction = (action: string, segmentId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/contacts/segments/${segmentId}/edit`)
        break
      case "view":
        router.push(`/dashboard/contacts/segments/${segmentId}`)
        break
      case "duplicate":
        console.log("Duplicate segment:", segmentId)
        break
      case "refresh":
        console.log("Refresh segment:", segmentId)
        break
      case "delete":
        console.log("Delete segment:", segmentId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const totalContacts = filteredSegments.reduce((sum, segment) => sum + segment.contactCount, 0)
  const avgConversionRate = filteredSegments.length > 0 
    ? filteredSegments.reduce((sum, segment) => sum + segment.conversionRate, 0) / filteredSegments.length 
    : 0

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/contacts")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Contact Segments</h1>
              <p className="text-muted-foreground">Create and manage dynamic contact segments</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard/contacts/segments/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Segment
          </Button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredSegments.length}</div>
              <p className="text-xs text-muted-foreground">Total Segments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalContacts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{avgConversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Avg. Conversion Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {filteredSegments.filter(s => s.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Active Segments</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dynamic">Dynamic</SelectItem>
              <SelectItem value="static">Static</SelectItem>
            </SelectContent>
          </Select>
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
        </motion.div>

        {/* Segments Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
          {filteredSegments.length === 0 ? (
            <motion.div className="col-span-full text-center py-12" variants={fadeIn}>
              <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No segments found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedType !== "all" || selectedStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first contact segment to get started"
                }
              </p>
              <Button onClick={() => router.push("/dashboard/contacts/segments/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Segment
              </Button>
            </motion.div>
          ) : (
            filteredSegments.map((segment) => (
              <motion.div key={segment.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{segment.name}</CardTitle>
                        <CardDescription className="text-sm">{segment.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleSegmentAction("view", segment.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSegmentAction("edit", segment.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSegmentAction("refresh", segment.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSegmentAction("duplicate", segment.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleSegmentAction("delete", segment.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={getTypeColor(segment.type)}>
                        {segment.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(segment.status)}>
                        {segment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{segment.contactCount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">contacts</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{segment.conversionRate}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {formatDate(segment.lastUpdated)}</span>
                        </div>
                        <span>{segment.campaignsUsed} campaigns</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {segment.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {segment.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{segment.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Segment Builder CTA */}
        {filteredSegments.length > 0 && (
          <motion.div variants={fadeIn}>
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Advanced Segment Builder</h3>
                    <p className="text-sm text-muted-foreground">
                      Create complex segments with multiple criteria, behavioral triggers, and real-time updates.
                    </p>
                  </div>
                  <Button onClick={() => router.push("/dashboard/contacts/segments/builder")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Open Builder
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
