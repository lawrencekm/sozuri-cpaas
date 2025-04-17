"use client"

import { useState, useEffect } from "react"
import { Check, ChevronRight, MessageCircle, Rocket, Settings, X } from "lucide-react"
import { motion } from "framer-motion"
import { useWalkthrough } from "./tooltip-walkthrough"
import { Button } from "@/components/ui/button"
import type { WalkthroughStep } from "./tooltip-walkthrough"

export function GuidedTour() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)

  const { startWalkthrough } = useWalkthrough()

  const steps = [
    {
      title: "Create API Key",
      description: "Generate your first API key to start integrating",
      icon: <Rocket className="h-5 w-5" />,
      target: "/dashboard/api-keys"
    },
    {
      title: "Send First Message",
      description: "Learn how to send messages through our API",
      icon: <MessageCircle className="h-5 w-5" />,
      target: "/dashboard/messaging"
    },
    {
      title: "Configure Settings",
      description: "Set up your account preferences",
      icon: <Settings className="h-5 w-5" />,
      target: "/dashboard/settings"
    }
  ]

  const walkthroughSteps: WalkthroughStep[] = [
    {
      target: '#create-api-key-button',
      title: "API Key Creation",
      content: "Start here to generate your first API key for integration",
      position: "right"
    },
    {
      target: '#messaging-nav-item',
      title: "Messaging Hub",
      content: "Access all messaging channels and campaign tools here",
      position: "right"
    }
  ]

  useEffect(() => {
    const hasCompleted = localStorage.getItem('onboardingComplete')
    setIsOpen(!hasCompleted)
  }, [])

  const handleFinish = () => {
    localStorage.setItem('onboardingComplete', 'true')
    setIsOpen(false)
    startWalkthrough(walkthroughSteps)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 w-80 rounded-lg border bg-background p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Getting Started Guide</h3>
        <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-start gap-3">
            <div className={`p-2 rounded-md ${index <= currentStep ? 'bg-primary text-white' : 'bg-muted'}`}>
              {index < currentStep ? <Check className="h-4 w-4" /> : step.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              {index === currentStep && (
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    if (currentStep < steps.length - 1) {
                      setCurrentStep(prev => prev + 1)
                    } else {
                      handleFinish()
                    }
                  }}
                >
                  {currentStep < steps.length - 1 ? "Next Step" : "Finish"} 
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
} 