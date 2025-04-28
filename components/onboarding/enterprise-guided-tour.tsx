"use client"

import { useState, useEffect } from "react"
import { 
  Check, 
  ChevronRight, 
  MessageCircle, 
  Rocket, 
  Settings, 
  X, 
  BarChart3, 
  Users, 
  Key, 
  FileText, 
  Code, 
  Zap, 
  Layers,
  ExternalLink
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWalkthrough } from "./tooltip-walkthrough"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import type { WalkthroughStep } from "./tooltip-walkthrough"

interface GuidedTourStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  target: string
  category: "setup" | "integration" | "analytics"
  estimatedTime: string
  completed?: boolean
  recommended?: boolean
  documentationLink?: string
}

export function EnterpriseGuidedTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("setup")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isMinimized, setIsMinimized] = useState(false)

  const { startWalkthrough } = useWalkthrough()

  const steps: GuidedTourStep[] = [
    {
      id: "api-key",
      title: "Generate API Keys",
      description: "Create secure API keys for your integration",
      icon: <Key className="h-5 w-5" />,
      target: "/dashboard/api-keys",
      category: "setup",
      estimatedTime: "2 min",
      recommended: true,
      documentationLink: "/dashboard/developers/api-keys"
    },
    {
      id: "messaging-setup",
      title: "Configure Messaging",
      description: "Set up your messaging channels and templates",
      icon: <MessageCircle className="h-5 w-5" />,
      target: "/dashboard/messaging",
      category: "setup",
      estimatedTime: "5 min",
      recommended: true,
      documentationLink: "/dashboard/developers/messaging"
    },
    {
      id: "account-settings",
      title: "Account Settings",
      description: "Complete your account profile and preferences",
      icon: <Settings className="h-5 w-5" />,
      target: "/dashboard/settings",
      category: "setup",
      estimatedTime: "3 min",
      documentationLink: "/dashboard/developers/account"
    },
    {
      id: "webhook-setup",
      title: "Configure Webhooks",
      description: "Set up webhooks for real-time event notifications",
      icon: <Zap className="h-5 w-5" />,
      target: "/dashboard/webhooks",
      category: "integration",
      estimatedTime: "7 min",
      documentationLink: "/dashboard/developers/webhooks"
    },
    {
      id: "code-examples",
      title: "Explore Code Examples",
      description: "View sample code for common integration scenarios",
      icon: <Code className="h-5 w-5" />,
      target: "/dashboard/developers/examples",
      category: "integration",
      estimatedTime: "10 min",
      documentationLink: "/dashboard/developers/examples"
    },
    {
      id: "test-api",
      title: "Test API Endpoints",
      description: "Try out API endpoints in an interactive console",
      icon: <Rocket className="h-5 w-5" />,
      target: "/dashboard/developers/api-console",
      category: "integration",
      estimatedTime: "8 min",
      documentationLink: "/dashboard/developers/api-reference"
    },
    {
      id: "analytics-dashboard",
      title: "Explore Analytics",
      description: "Discover insights from your communication data",
      icon: <BarChart3 className="h-5 w-5" />,
      target: "/dashboard/analytics",
      category: "analytics",
      estimatedTime: "5 min",
      documentationLink: "/dashboard/developers/analytics"
    },
    {
      id: "contact-management",
      title: "Manage Contacts",
      description: "Import and organize your contact database",
      icon: <Users className="h-5 w-5" />,
      target: "/dashboard/contacts",
      category: "analytics",
      estimatedTime: "6 min",
      documentationLink: "/dashboard/developers/contacts"
    },
    {
      id: "project-setup",
      title: "Create First Project",
      description: "Organize your communications with projects",
      icon: <Layers className="h-5 w-5" />,
      target: "/dashboard/projects",
      category: "analytics",
      estimatedTime: "4 min",
      documentationLink: "/dashboard/developers/projects"
    }
  ]

  const walkthroughSteps: WalkthroughStep[] = [
    {
      target: '#create-api-key-button',
      title: "API Key Creation",
      content: "Generate your first API key to authenticate your integration requests",
      position: "right"
    },
    {
      target: '#messaging-nav-item',
      title: "Messaging Hub",
      content: "Configure and manage all your messaging channels from this central location",
      position: "right"
    },
    {
      target: '#analytics-nav-item',
      title: "Analytics Dashboard",
      content: "Monitor performance metrics and gain insights into your communications",
      position: "right"
    }
  ]

  useEffect(() => {
    // Load completed steps from localStorage
    const savedCompletedSteps = localStorage.getItem('completedOnboardingSteps')
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps))
    }
    
    // Check if onboarding should be shown
    const hasCompletedOnboarding = localStorage.getItem('onboardingComplete')
    setIsOpen(!hasCompletedOnboarding)
  }, [])

  const handleStepComplete = (stepId: string) => {
    const newCompletedSteps = [...completedSteps, stepId]
    setCompletedSteps(newCompletedSteps)
    localStorage.setItem('completedOnboardingSteps', JSON.stringify(newCompletedSteps))
  }

  const handleFinish = () => {
    localStorage.setItem('onboardingComplete', 'true')
    setIsOpen(false)
    startWalkthrough(walkthroughSteps)
  }

  const filteredSteps = steps.filter(step => step.category === activeCategory)
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)
  
  // Get recommended steps that aren't completed yet
  const recommendedSteps = steps
    .filter(step => step.recommended && !completedSteps.includes(step.id))
    .slice(0, 3)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'w-auto' : 'w-[420px]'} rounded-lg border bg-background shadow-xl`}
      >
        {isMinimized ? (
          <div className="p-3 flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={() => setIsMinimized(false)}
            >
              <Rocket className="h-4 w-4 text-primary" />
              <span className="font-medium">Getting Started Guide</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {completionPercentage}%
              </span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Enterprise Onboarding</h3>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {completionPercentage}% Complete
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsMinimized(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-xs text-muted-foreground">{completedSteps.length}/{steps.length} Tasks</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              
              {recommendedSteps.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Recommended Next Steps</h4>
                  <div className="space-y-2">
                    {recommendedSteps.map((step) => (
                      <div 
                        key={step.id}
                        className="flex items-center justify-between p-2 rounded-md border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                            {step.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{step.title}</p>
                            <p className="text-xs text-muted-foreground">{step.estimatedTime}</p>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          asChild
                        >
                          <Link href={step.target}>
                            Start
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <Tabs defaultValue="setup" value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="setup">Setup</TabsTrigger>
                  <TabsTrigger value="integration">Integration</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeCategory} className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {filteredSteps.map((step) => (
                    <div 
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        completedSteps.includes(step.id) 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'hover:bg-accent/50'
                      }`}
                    >
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
                        completedSteps.includes(step.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {completedSteps.includes(step.id) ? (
                          <Check className="h-5 w-5" />
                        ) : (
                          step.icon
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${completedSteps.includes(step.id) ? 'text-muted-foreground' : ''}`}>
                            {step.title}
                          </h4>
                          <span className="text-xs text-muted-foreground">{step.estimatedTime}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            {step.documentationLink && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="h-auto p-0 text-xs"
                                asChild
                              >
                                <Link href={step.documentationLink} className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Docs
                                </Link>
                              </Button>
                            )}
                          </div>
                          
                          {completedSteps.includes(step.id) ? (
                            <span className="text-xs text-primary flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="h-7 text-xs"
                              asChild
                            >
                              <Link href={step.target}>
                                Start Task
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link href="/dashboard/developers" className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Documentation
                  </Link>
                </Button>
                
                <Button 
                  size="sm"
                  onClick={handleFinish}
                  className="flex items-center gap-1"
                >
                  {completedSteps.length === steps.length ? (
                    <>
                      <Check className="h-4 w-4" />
                      Complete Onboarding
                    </>
                  ) : (
                    <>
                      Remind Me Later
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
