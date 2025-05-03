"use client"

import { useState, useEffect } from "react"
import { 
  Check, 
  ChevronRight, 
  ChevronDown, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  ExternalLink,
  FileText,
  Rocket,
  Zap
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ProgressChecklist } from "./progress-checklist"

interface ChecklistItem {
  id: string
  title: string
  description: string
  link: string
  estimatedTime: string
  priority: "high" | "medium" | "low"
  category: "setup" | "integration" | "optimization" | "security"
  completed: boolean
  documentationLink?: string
}

export function EnterpriseChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "api-key",
      title: "Create API Keys",
      description: "Generate secure API keys for your integration",
      link: "/dashboard/api-keys",
      estimatedTime: "2 min",
      priority: "high",
      category: "setup",
      completed: false,
      documentationLink: "/dashboard/developers/api-keys"
    },
    {
      id: "webhook-setup",
      title: "Configure Webhooks",
      description: "Set up webhooks for real-time event notifications",
      link: "/dashboard/webhooks",
      estimatedTime: "5 min",
      priority: "high",
      category: "integration",
      completed: false,
      documentationLink: "/dashboard/developers/webhooks"
    },
    {
      id: "messaging-templates",
      title: "Create Message Templates",
      description: "Set up reusable templates for consistent messaging",
      link: "/dashboard/messaging/templates",
      estimatedTime: "10 min",
      priority: "medium",
      category: "setup",
      completed: false,
      documentationLink: "/dashboard/developers/templates"
    },
    {
      id: "security-settings",
      title: "Security Configuration",
      description: "Review and enhance your account security settings",
      link: "/dashboard/settings/security",
      estimatedTime: "7 min",
      priority: "high",
      category: "security",
      completed: false,
      documentationLink: "/dashboard/developers/security"
    },
    {
      id: "contact-import",
      title: "Import Contacts",
      description: "Upload your contact database to the platform",
      link: "/dashboard/contacts/import",
      estimatedTime: "8 min",
      priority: "medium",
      category: "setup",
      completed: false,
      documentationLink: "/dashboard/developers/contacts"
    },
    {
      id: "test-integration",
      title: "Test API Integration",
      description: "Verify your integration is working correctly",
      link: "/dashboard/developers/api-console",
      estimatedTime: "15 min",
      priority: "medium",
      category: "integration",
      completed: false,
      documentationLink: "/dashboard/developers/testing"
    },
    {
      id: "analytics-setup",
      title: "Configure Analytics",
      description: "Set up custom dashboards and reports",
      link: "/dashboard/analytics/settings",
      estimatedTime: "12 min",
      priority: "low",
      category: "optimization",
      completed: false,
      documentationLink: "/dashboard/developers/analytics"
    },
    {
      id: "team-members",
      title: "Add Team Members",
      description: "Invite colleagues to collaborate on the platform",
      link: "/dashboard/settings/team",
      estimatedTime: "5 min",
      priority: "medium",
      category: "setup",
      completed: false,
      documentationLink: "/dashboard/developers/team-management"
    }
  ])
  
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["setup", "integration", "security", "optimization"])
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    // Load completed items from localStorage
    const savedCompletedItems = localStorage.getItem('completedChecklistItems')
    if (savedCompletedItems) {
      const completedIds = JSON.parse(savedCompletedItems) as string[]
      setItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          completed: completedIds.includes(item.id)
        }))
      )
    }
  }, [])

  const toggleItemCompletion = (id: string) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
      
      // Save to localStorage
      const completedIds = newItems.filter(item => item.completed).map(item => item.id)
      localStorage.setItem('completedChecklistItems', JSON.stringify(completedIds))
      
      return newItems
    })
  }

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const filteredItems = items.filter(item => {
    if (filter === "all") return true
    if (filter === "completed") return item.completed
    if (filter === "pending") return !item.completed
    if (filter === "high-priority") return item.priority === "high" && !item.completed
    return true
  })

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const categoryLabels: Record<string, { title: string, icon: React.ReactNode }> = {
    setup: { 
      title: "Initial Setup", 
      icon: <Rocket className="h-4 w-4" /> 
    },
    integration: { 
      title: "Integration", 
      icon: <Zap className="h-4 w-4" /> 
    },
    security: { 
      title: "Security", 
      icon: <AlertCircle className="h-4 w-4" /> 
    },
    optimization: { 
      title: "Optimization", 
      icon: <ChevronRight className="h-4 w-4" /> 
    }
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <CardTitle>Enterprise Implementation Checklist</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            {completedCount}/{totalCount} Completed
          </Badge>
        </div>
        <CardDescription>
          Complete these tasks to fully implement the SOZURI CPaaS platform
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-xs text-muted-foreground">{completionPercentage}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Quick Status</h4>
            <ProgressChecklist 
              items={items.map(item => ({
                id: item.id,
                label: item.title,
                completed: item.completed
              }))}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Implementation Tasks</h3>
          <div className="flex items-center gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "pending" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setFilter("pending")}
            >
              Pending
            </Button>
            <Button 
              variant={filter === "high-priority" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setFilter("high-priority")}
            >
              High Priority
            </Button>
            <Button 
              variant={filter === "completed" ? "default" : "outline"} 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setFilter("completed")}
            >
              Completed
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
            <Collapsible 
              key={category} 
              open={expandedCategories.includes(category)}
              onOpenChange={() => toggleCategory(category)}
              className="border rounded-md overflow-hidden"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-muted/50 hover:bg-muted">
                <div className="flex items-center gap-2">
                  {categoryLabels[category]?.icon}
                  <span className="font-medium">{categoryLabels[category]?.title || category}</span>
                  <Badge variant="outline" className="ml-2 font-normal text-xs">
                    {categoryItems.filter(item => item.completed).length}/{categoryItems.length}
                  </Badge>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${
                  expandedCategories.includes(category) ? "transform rotate-180" : ""
                }`} />
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="divide-y">
                  {categoryItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-start p-3 gap-3 ${
                        item.completed ? 'bg-muted/30' : ''
                      }`}
                    >
                      <div className="flex-shrink-0 pt-0.5">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => toggleItemCompletion(item.id)}
                                className="focus:outline-none"
                              >
                                {item.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <Circle className="h-5 w-5 text-muted-foreground" />
                                )}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as {item.completed ? 'incomplete' : 'complete'}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className={`font-medium ${item.completed ? 'text-muted-foreground line-through' : ''}`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
                          </div>
                          
                          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                            {item.priority === "high" && !item.completed && (
                              <Badge variant="destructive" className="font-normal text-xs">High Priority</Badge>
                            )}
                            <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.estimatedTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-2">
                          {item.documentationLink && (
                            <Button 
                              variant="link" 
                              size="sm" 
                              className="h-auto p-0 text-xs"
                              asChild
                            >
                              <Link href={item.documentationLink} className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                Documentation
                              </Link>
                            </Button>
                          )}
                          
                          <Button 
                            size="sm" 
                            variant={item.completed ? "outline" : "default"}
                            className={`h-7 text-xs ${item.completed ? 'opacity-70' : ''}`}
                            asChild
                          >
                            <Link href={item.link}>
                              {item.completed ? 'View' : 'Start Task'}
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-3 border-t">
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link href="/dashboard/developers" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Implementation Guide
          </Link>
        </Button>
        
        <Button 
          size="sm"
          asChild
        >
          <Link href="/dashboard/support" className="flex items-center gap-1">
            Need Help?
            <ExternalLink className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
