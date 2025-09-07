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
  UserPlus,
  Calendar,
  Tag,
  Download,
  Upload
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

// Mock contact groups data
const contactGroups = [
  {
    id: "1",
    name: "Premium Customers",
    description: "High-value customers with premium subscriptions",
    memberCount: 1250,
    type: "manual",
    status: "active",
    createdAt: "2024-01-15",
    lastUpdated: "2024-01-20T10:30:00Z",
    tags: ["premium", "high-value", "subscription"],
    campaignsUsed: 18,
    owner: "Marketing Team",
    color: "#8B5CF6"
  },
  {
    id: "2",
    name: "Beta Testers",
    description: "Users participating in beta testing programs",
    memberCount: 340,
    type: "manual",
    status: "active",
    createdAt: "2024-01-10",
    lastUpdated: "2024-01-19T14:20:00Z",
    tags: ["beta", "testing", "feedback"],
    campaignsUsed: 7,
    owner: "Product Team",
    color: "#10B981"
  },
  {
    id: "3",
    name: "Newsletter Subscribers",
    description: "Contacts subscribed to weekly newsletter",
    memberCount: 5670,
    type: "subscription",
    status: "active",
    createdAt: "2024-01-08",
    lastUpdated: "2024-01-20T08:15:00Z",
    tags: ["newsletter", "content", "weekly"],
    campaignsUsed: 25,
    owner: "Content Team",
    color: "#3B82F6"
  },
  {
    id: "4",
    name: "Event Attendees - Q1 2024",
    description: "Contacts who attended Q1 events",
    memberCount: 890,
    type: "event",
    status: "active",
    createdAt: "2024-01-05",
    lastUpdated: "2024-01-18T16:45:00Z",
    tags: ["events", "q1-2024", "attendees"],
    campaignsUsed: 12,
    owner: "Events Team",
    color: "#F59E0B"
  },
  {
    id: "5",
    name: "Support VIPs",
    description: "Customers requiring priority support",
    memberCount: 156,
    type: "support",
    status: "active",
    createdAt: "2024-01-12",
    lastUpdated: "2024-01-17T11:30:00Z",
    tags: ["support", "vip", "priority"],
    campaignsUsed: 4,
    owner: "Support Team",
    color: "#EF4444"
  },
  {
    id: "6",
    name: "Inactive Contacts",
    description: "Contacts marked for re-engagement",
    memberCount: 2340,
    type: "manual",
    status: "paused",
    createdAt: "2024-01-01",
    lastUpdated: "2024-01-15T09:00:00Z",
    tags: ["inactive", "re-engagement", "cleanup"],
    campaignsUsed: 3,
    owner: "Marketing Team",
    color: "#6B7280"
  }
]

export default function ContactGroupsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Filter groups based on search and filters
  const filteredGroups = contactGroups.filter(group => {
    const matchesSearch = searchQuery === "" || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      group.owner.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === "all" || group.type === selectedType
    const matchesStatus = selectedStatus === "all" || group.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "paused": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "manual": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "subscription": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      case "event": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "support": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
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

  const handleGroupAction = (action: string, groupId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/contacts/groups/${groupId}/edit`)
        break
      case "view":
        router.push(`/dashboard/contacts/groups/${groupId}`)
        break
      case "add-members":
        router.push(`/dashboard/contacts/groups/${groupId}/members/add`)
        break
      case "export":
        console.log("Export group:", groupId)
        break
      case "duplicate":
        console.log("Duplicate group:", groupId)
        break
      case "delete":
        console.log("Delete group:", groupId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const totalMembers = filteredGroups.reduce((sum, group) => sum + group.memberCount, 0)
  const totalCampaigns = filteredGroups.reduce((sum, group) => sum + group.campaignsUsed, 0)

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
              <h1 className="text-3xl font-bold tracking-tight">Contact Groups</h1>
              <p className="text-muted-foreground">Organize contacts into static groups for targeted messaging</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/contacts/groups/import")}>
              <Upload className="mr-2 h-4 w-4" />
              Import Group
            </Button>
            <Button onClick={() => router.push("/dashboard/contacts/groups/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{filteredGroups.length}</div>
              <p className="text-xs text-muted-foreground">Total Groups</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalMembers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">Campaigns Used</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {filteredGroups.filter(g => g.status === "active").length}
              </div>
              <p className="text-xs text-muted-foreground">Active Groups</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Group Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="support">Support</SelectItem>
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
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Groups Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
          {filteredGroups.length === 0 ? (
            <motion.div className="col-span-full text-center py-12" variants={fadeIn}>
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No groups found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedType !== "all" || selectedStatus !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first contact group to get started"
                }
              </p>
              <Button onClick={() => router.push("/dashboard/contacts/groups/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </motion.div>
          ) : (
            filteredGroups.map((group) => (
              <motion.div key={group.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: group.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base mb-1 truncate">{group.name}</CardTitle>
                          <CardDescription className="text-sm">{group.description}</CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleGroupAction("view", group.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Members
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGroupAction("add-members", group.id)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Members
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGroupAction("edit", group.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGroupAction("export", group.id)}>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleGroupAction("duplicate", group.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleGroupAction("delete", group.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={getTypeColor(group.type)}>
                        {group.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(group.status)}>
                        {group.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{group.memberCount.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">members</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{group.campaignsUsed} campaigns</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Updated {formatDate(group.lastUpdated)}</span>
                        </div>
                        <span>{group.owner}</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {group.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.tags.length - 3}
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

        {/* Quick Actions */}
        {filteredGroups.length > 0 && (
          <motion.div className="grid gap-4 md:grid-cols-2" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Common group management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/contacts/groups/bulk-actions")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Bulk Group Actions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/contacts/groups/merge")}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Merge Groups
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push("/dashboard/contacts/groups/export-all")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export All Groups
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Group Types</CardTitle>
                <CardDescription>Different ways to organize contacts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Manual Groups</span>
                  <Badge variant="secondary" className={getTypeColor("manual")}>
                    {contactGroups.filter(g => g.type === "manual").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Subscription Groups</span>
                  <Badge variant="secondary" className={getTypeColor("subscription")}>
                    {contactGroups.filter(g => g.type === "subscription").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Event Groups</span>
                  <Badge variant="secondary" className={getTypeColor("event")}>
                    {contactGroups.filter(g => g.type === "event").length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Support Groups</span>
                  <Badge variant="secondary" className={getTypeColor("support")}>
                    {contactGroups.filter(g => g.type === "support").length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
