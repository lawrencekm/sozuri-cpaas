"use client"

import { useState, useEffect } from "react"
import { 
  ArrowRight, 
  X, 
  MessageCircle, 
  BarChart3, 
  Users, 
  Webhook, 
  Settings, 
  Layers, 
  Zap, 
  Phone, 
  Info
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

interface TourStep {
  id: string
  title: string
  description: string
  image: string
  features: {
    title: string
    description: string
    icon: React.ReactNode
  }[]
  cta: {
    label: string
    href: string
  }
}

export function ProductTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    const tourCompleted = localStorage.getItem('productTourCompleted')
    setHasSeenTour(!!tourCompleted)
    setIsOpen(!tourCompleted)
  }, [])

  const handleComplete = () => {
    localStorage.setItem('productTourCompleted', 'true')
    setIsOpen(false)
  }

  const tourSteps: TourStep[] = [
    {
      id: "messaging",
      title: "Unified Messaging Platform",
      description: "Connect with your customers across multiple channels from a single platform. Send SMS, WhatsApp, Viber, and RCS messages with consistent delivery and tracking.",
      image: "/images/tour/messaging-platform.jpg",
      features: [
        {
          title: "Multi-Channel Messaging",
          description: "Send messages across SMS, WhatsApp, Viber, and RCS",
          icon: <MessageCircle className="h-5 w-5" />
        },
        {
          title: "Template Management",
          description: "Create and manage reusable message templates",
          icon: <Layers className="h-5 w-5" />
        },
        {
          title: "Delivery Tracking",
          description: "Monitor message delivery status in real-time",
          icon: <Zap className="h-5 w-5" />
        }
      ],
      cta: {
        label: "Explore Messaging",
        href: "/dashboard/messaging"
      }
    },
    {
      id: "voice",
      title: "Enterprise Voice Solutions",
      description: "Build interactive voice experiences with our programmable voice API. Create IVR systems, voice bots, and automated call flows to enhance customer engagement.",
      image: "/images/tour/voice-platform.jpg",
      features: [
        {
          title: "Programmable Voice",
          description: "Create custom voice applications and IVR systems",
          icon: <Phone className="h-5 w-5" />
        },
        {
          title: "Call Tracking",
          description: "Monitor call quality, duration, and outcomes",
          icon: <BarChart3 className="h-5 w-5" />
        },
        {
          title: "Voice Transcription",
          description: "Convert voice to text for analysis and records",
          icon: <MessageCircle className="h-5 w-5" />
        }
      ],
      cta: {
        label: "Explore Voice",
        href: "/dashboard/voice"
      }
    },
    {
      id: "analytics",
      title: "Advanced Analytics & Insights",
      description: "Gain valuable insights into your communication performance with detailed analytics. Track delivery rates, engagement metrics, and optimize your messaging strategy.",
      image: "/images/tour/analytics-platform.jpg",
      features: [
        {
          title: "Real-time Dashboards",
          description: "Monitor key metrics in real-time with customizable views",
          icon: <BarChart3 className="h-5 w-5" />
        },
        {
          title: "Performance Reports",
          description: "Generate detailed reports on message performance",
          icon: <Layers className="h-5 w-5" />
        },
        {
          title: "AI-Powered Insights",
          description: "Get intelligent recommendations to improve engagement",
          icon: <Zap className="h-5 w-5" />
        }
      ],
      cta: {
        label: "Explore Analytics",
        href: "/dashboard/analytics"
      }
    },
    {
      id: "integration",
      title: "Seamless Integration",
      description: "Integrate our platform with your existing systems using our comprehensive API and webhooks. Connect to CRM, marketing automation, and customer service platforms.",
      image: "/images/tour/integration-platform.jpg",
      features: [
        {
          title: "RESTful API",
          description: "Integrate with our platform using standard REST APIs",
          icon: <Webhook className="h-5 w-5" />
        },
        {
          title: "Webhooks",
          description: "Receive real-time notifications for events",
          icon: <Zap className="h-5 w-5" />
        },
        {
          title: "SDK Libraries",
          description: "Use our libraries for popular programming languages",
          icon: <Layers className="h-5 w-5" />
        }
      ],
      cta: {
        label: "Explore Integration",
        href: "/dashboard/developers"
      }
    }
  ]

  if (!isOpen || hasSeenTour) return null

  const currentTourStep = tourSteps[currentStep]
  const progress = ((currentStep + 1) / tourSteps.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl mx-auto p-6"
        >
          <Card className="border shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gradient-to-br from-primary/90 to-primary/70 text-primary-foreground p-8 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                    {currentStep + 1} of {tourSteps.length}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/20 h-8 w-8" 
                    onClick={handleComplete}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">{currentTourStep.title}</h2>
                  <p className="text-white/90 mb-6">{currentTourStep.description}</p>
                  
                  <div className="space-y-4">
                    {currentTourStep.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 bg-white/20 rounded-full">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{feature.title}</h3>
                          <p className="text-sm text-white/80">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="outline" 
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                    asChild
                  >
                    <Link href={currentTourStep.cta.href}>
                      {currentTourStep.cta.label}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">SOZURI CPaaS Platform</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade communication platform for global businesses
                  </p>
                </div>
                
                <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden">
                  {/* In a real implementation, you would use actual images here */}
                  <div className="w-full h-full flex items-center justify-center bg-primary/10">
                    <Info className="h-8 w-8 text-primary/40" />
                    <span className="ml-2 text-primary/40">Feature Preview Image</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {tourSteps.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2.5 h-2.5 rounded-full ${
                            index === currentStep ? 'bg-primary' : 'bg-muted'
                          }`}
                          onClick={() => setCurrentStep(index)}
                        />
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                      >
                        Previous
                      </Button>
                      
                      {currentStep < tourSteps.length - 1 ? (
                        <Button 
                          size="sm" 
                          onClick={() => setCurrentStep(Math.min(tourSteps.length - 1, currentStep + 1))}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={handleComplete}
                        >
                          Get Started
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Progress value={progress} className="h-1" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
