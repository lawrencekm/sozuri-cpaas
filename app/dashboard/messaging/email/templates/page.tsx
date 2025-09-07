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
  Mail,
  FileText,
  Calendar
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

// Mock email templates data
const emailTemplates = [
  {
    id: "1",
    name: "Welcome Series - Day 1",
    subject: "Welcome to {{company_name}}! Let's get started",
    type: "Transactional",
    category: "Onboarding",
    lastModified: "2024-01-20",
    usage: 156,
    status: "active",
    preview: "Welcome to our platform! We're excited to have you join our community...",
    tags: ["welcome", "onboarding", "new-user"]
  },
  {
    id: "2",
    name: "Monthly Newsletter Template",
    subject: "{{company_name}} Monthly Update - {{month}} {{year}}",
    type: "Marketing",
    category: "Newsletter",
    lastModified: "2024-01-18",
    usage: 89,
    status: "active",
    preview: "Here's what's new this month at {{company_name}}...",
    tags: ["newsletter", "monthly", "updates"]
  },
  {
    id: "3",
    name: "Order Confirmation",
    subject: "Your order #{{order_id}} is confirmed",
    type: "Transactional",
    category: "E-commerce",
    lastModified: "2024-01-19",
    usage: 234,
    status: "active",
    preview: "Thank you for your order! We've received your payment and are processing...",
    tags: ["order", "confirmation", "ecommerce"]
  },
  {
    id: "4",
    name: "Password Reset",
    subject: "Reset your {{company_name}} password",
    type: "Transactional",
    category: "Security",
    lastModified: "2024-01-17",
    usage: 67,
    status: "active",
    preview: "We received a request to reset your password. Click the link below...",
    tags: ["password", "reset", "security"]
  },
  {
    id: "5",
    name: "Abandoned Cart Recovery",
    subject: "Don't forget your items at {{company_name}}",
    type: "Marketing",
    category: "E-commerce",
    lastModified: "2024-01-16",
    usage: 123,
    status: "active",
    preview: "You left some great items in your cart. Complete your purchase now...",
    tags: ["cart", "recovery", "ecommerce"]
  },
  {
    id: "6",
    name: "Event Invitation",
    subject: "You're invited to {{event_name}}",
    type: "Marketing",
    category: "Events",
    lastModified: "2024-01-15",
    usage: 45,
    status: "draft",
    preview: "Join us for an exclusive event. We'd love to have you there...",
    tags: ["event", "invitation", "exclusive"]
  }
]

export default function EmailTemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Filter templates based on search and filters
  const filteredTemplates = emailTemplates.filter(template => {
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = selectedType === "all" || template.type.toLowerCase() === selectedType.toLowerCase()
    const matchesCategory = selectedCategory === "all" || template.category.toLowerCase() === selectedCategory.toLowerCase()
    
    return matchesSearch && matchesType && matchesCategory
  })

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "transactional": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "marketing": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "automated": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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

  const handleTemplateAction = (action: string, templateId: string) => {
    switch (action) {
      case "edit":
        router.push(`/dashboard/messaging/email/templates/${templateId}/edit`)
        break
      case "preview":
        console.log("Preview template:", templateId)
        break
      case "duplicate":
        console.log("Duplicate template:", templateId)
        break
      case "delete":
        console.log("Delete template:", templateId)
        break
      default:
        break
    }
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/email")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
              <p className="text-muted-foreground">Create and manage reusable email templates</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard/messaging/email/templates/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Template Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="transactional">Transactional</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="automated">Automated</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="e-commerce">E-commerce</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="events">Events</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Templates Grid */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" variants={staggerContainer}>
          {filteredTemplates.length === 0 ? (
            <motion.div className="col-span-full text-center py-12" variants={fadeIn}>
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery || selectedType !== "all" || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first email template to get started"
                }
              </p>
              <Button onClick={() => router.push("/dashboard/messaging/email/templates/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </motion.div>
          ) : (
            filteredTemplates.map((template) => (
              <motion.div key={template.id} variants={fadeIn}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base mb-1">{template.name}</CardTitle>
                        <CardDescription className="text-sm">{template.subject}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTemplateAction("edit", template.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTemplateAction("preview", template.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTemplateAction("duplicate", template.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleTemplateAction("delete", template.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className={getTypeColor(template.type)}>
                        {template.type}
                      </Badge>
                      <Badge variant="outline" className={getStatusColor(template.status)}>
                        {template.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {template.preview}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {template.usage} uses
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(template.lastModified)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Template Stats */}
        {filteredTemplates.length > 0 && (
          <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{filteredTemplates.length}</div>
                <p className="text-xs text-muted-foreground">Total Templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {filteredTemplates.filter(t => t.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground">Active Templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {filteredTemplates.reduce((sum, t) => sum + t.usage, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total Usage</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">
                  {Math.round(filteredTemplates.reduce((sum, t) => sum + t.usage, 0) / filteredTemplates.length)}
                </div>
                <p className="text-xs text-muted-foreground">Avg. Usage</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}
