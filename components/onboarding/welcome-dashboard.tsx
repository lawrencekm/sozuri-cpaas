"use client"

import { useState, useEffect } from "react"
import { 
  ArrowRight, 
  BarChart3, 
  MessageCircle, 
  Phone, 
  Users, 
  Webhook, 
  Zap, 
  FileText, 
  Rocket, 
  Clock, 
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface QuickStartItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  href: string
  estimatedTime: string
  completed: boolean
}

interface RecommendedResource {
  id: string
  title: string
  description: string
  type: "guide" | "video" | "doc" | "webinar"
  href: string
  icon: React.ReactNode
}

export function WelcomeDashboard({ 
  userName = "John", 
  companyName = "Acme Corp",
  userRole = "Administrator",
  userAvatar = ""
}) {
  const [quickStartItems, setQuickStartItems] = useState<QuickStartItem[]>([
    {
      id: "api-key",
      title: "Create API Keys",
      description: "Generate secure API keys for your integration",
      icon: <Zap className="h-5 w-5" />,
      href: "/dashboard/api-keys",
      estimatedTime: "2 min",
      completed: false
    },
    {
      id: "send-message",
      title: "Send First Message",
      description: "Send a test message through any channel",
      icon: <MessageCircle className="h-5 w-5" />,
      href: "/dashboard/messaging",
      estimatedTime: "3 min",
      completed: false
    },
    {
      id: "setup-webhook",
      title: "Configure Webhook",
      description: "Set up your first webhook endpoint",
      icon: <Webhook className="h-5 w-5" />,
      href: "/dashboard/webhooks",
      estimatedTime: "5 min",
      completed: false
    },
    {
      id: "explore-analytics",
      title: "Explore Analytics",
      description: "View your messaging performance metrics",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/dashboard/analytics",
      estimatedTime: "4 min",
      completed: false
    }
  ])

  const recommendedResources: RecommendedResource[] = [
    {
      id: "getting-started",
      title: "Getting Started Guide",
      description: "A comprehensive guide to setting up your account",
      type: "guide",
      href: "/dashboard/developers/guides/getting-started",
      icon: <Rocket className="h-5 w-5" />
    },
    {
      id: "api-overview",
      title: "API Documentation",
      description: "Complete reference for our REST API",
      type: "doc",
      href: "/dashboard/developers/api-reference",
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: "integration-webinar",
      title: "Integration Best Practices",
      description: "Learn how to integrate our platform efficiently",
      type: "webinar",
      href: "/dashboard/developers/webinars/integration",
      icon: <Zap className="h-5 w-5" />
    }
  ]

  useEffect(() => {
    // Load completed items from localStorage
    const savedCompletedItems = localStorage.getItem('completedQuickStartItems')
    if (savedCompletedItems) {
      const completedIds = JSON.parse(savedCompletedItems) as string[]
      setQuickStartItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          completed: completedIds.includes(item.id)
        }))
      )
    }
  }, [])

  const toggleItemCompletion = (id: string) => {
    setQuickStartItems(prevItems => {
      const newItems = prevItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
      
      // Save to localStorage
      const completedIds = newItems.filter(item => item.completed).map(item => item.id)
      localStorage.setItem('completedQuickStartItems', JSON.stringify(completedIds))
      
      return newItems
    })
  }

  const completedCount = quickStartItems.filter(item => item.completed).length
  const totalCount = quickStartItems.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  // Get current time to personalize greeting
  const currentHour = new Date().getHours()
  let greeting = "Good morning"
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon"
  } else if (currentHour >= 18) {
    greeting = "Good evening"
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {greeting}, {userName}
            </h1>
            <p className="text-muted-foreground">
              {userRole} at {companyName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings/profile" className="flex items-center gap-1">
              Complete Profile
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/developers" className="flex items-center gap-1">
              View Documentation
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <CardTitle>Quick Start Guide</CardTitle>
              </div>
              <Badge variant="outline" className="font-normal">
                {completedCount}/{totalCount} Completed
              </Badge>
            </div>
            <CardDescription>
              Complete these tasks to get started with the platform
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-xs text-muted-foreground">{completionPercentage}% Complete</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            <div className="space-y-4">
              {quickStartItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex items-start gap-3 p-3 rounded-md border ${
                    item.completed ? 'bg-muted/30 border-primary/20' : 'hover:bg-muted/30'
                  }`}
                >
                  <button
                    onClick={() => toggleItemCompletion(item.id)}
                    className="flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center border border-primary/30 bg-primary/5 text-primary"
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      item.icon
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-medium ${item.completed ? 'text-muted-foreground' : ''}`}>
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      
                      <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.estimatedTime}
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Button 
                        size="sm" 
                        variant={item.completed ? "outline" : "default"}
                        className={`h-7 text-xs ${item.completed ? 'opacity-70' : ''}`}
                        asChild
                      >
                        <Link href={item.href}>
                          {item.completed ? 'View' : 'Start'}
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="pt-3 border-t">
            <Button 
              variant="link" 
              className="ml-auto"
              asChild
            >
              <Link href="/dashboard/developers/guides" className="flex items-center gap-1">
                View All Guides
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="border shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle>Recommended Resources</CardTitle>
            </div>
            <CardDescription>
              Helpful resources to maximize your platform experience
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-3">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="guides">Guides</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
                <TabsTrigger value="webinars">Webinars</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {recommendedResources.map((resource) => (
                  <Link 
                    key={resource.id} 
                    href={resource.href}
                    className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                      {resource.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{resource.title}</h4>
                            <Badge variant="outline" className="font-normal text-xs">
                              {resource.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{resource.description}</p>
                        </div>
                        
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  </Link>
                ))}
              </TabsContent>
              
              <TabsContent value="guides" className="space-y-4">
                {recommendedResources
                  .filter(resource => resource.type === 'guide')
                  .map((resource) => (
                    <Link 
                      key={resource.id} 
                      href={resource.href}
                      className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                        {resource.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </TabsContent>
              
              {/* Similar content for other tabs */}
              <TabsContent value="docs" className="space-y-4">
                {recommendedResources
                  .filter(resource => resource.type === 'doc')
                  .map((resource) => (
                    <Link 
                      key={resource.id} 
                      href={resource.href}
                      className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                        {resource.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </TabsContent>
              
              <TabsContent value="webinars" className="space-y-4">
                {recommendedResources
                  .filter(resource => resource.type === 'webinar')
                  .map((resource) => (
                    <Link 
                      key={resource.id} 
                      href={resource.href}
                      className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center bg-primary/10 text-primary">
                        {resource.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">{resource.description}</p>
                          </div>
                          
                          <ChevronRight className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="pt-3 border-t">
            <Button 
              variant="link" 
              className="ml-auto"
              asChild
            >
              <Link href="/dashboard/developers" className="flex items-center gap-1">
                View All Resources
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="border shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Platform Features</CardTitle>
          </div>
          <CardDescription>
            Explore the key capabilities of the SOZURI CPaaS platform
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-start p-4 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-md bg-primary/10 text-primary mb-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Messaging</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send SMS, WhatsApp, Viber, and RCS messages from a unified platform
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-auto"
                asChild
              >
                <Link href="/dashboard/messaging">
                  Explore Messaging
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-4 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-md bg-primary/10 text-primary mb-3">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Voice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Build interactive voice experiences and automated call flows
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-auto"
                asChild
              >
                <Link href="/dashboard/voice">
                  Explore Voice
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-col items-start p-4 rounded-lg border hover:bg-muted/30 transition-colors">
              <div className="p-2 rounded-md bg-primary/10 text-primary mb-3">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-1">Analytics</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Track performance metrics and gain insights into your communications
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-auto"
                asChild
              >
                <Link href="/dashboard/analytics">
                  Explore Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
