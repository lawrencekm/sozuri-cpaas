"use client"

import { useState } from "react"
import { ArrowRight, X, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import { TourFeatureCard, FeaturePreview } from "./ui-components"
import { productTourSteps } from "./data"
import { useOnboardingPreferences } from "@/hooks/use-onboarding-preferences"

export function ProductTour() {
  const [currentStep, setCurrentStep] = useState(0)

  // Use our new preferences hook for persistence and "remind later" functionality
  const {
    shouldShowOnboarding,
    completeOnboarding,
    remindLater
  } = useOnboardingPreferences({
    storageKey: 'product_tour_preferences',
    remindLaterDays: 7 // Remind after 7 days
  })

  const handleComplete = () => {
    completeOnboarding()
  }

  const handleRemindLater = () => {
    remindLater()
  }

  if (!shouldShowOnboarding) return null

  const currentTourStep = productTourSteps[currentStep]
  const progress = ((currentStep + 1) / productTourSteps.length) * 100

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
                    {currentStep + 1} of {productTourSteps.length}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                      onClick={handleRemindLater}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Later
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20 h-8 w-8"
                      onClick={handleComplete}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-3">{currentTourStep.title}</h2>
                  <p className="text-white/90 mb-6">{currentTourStep.description}</p>

                  <div className="space-y-4">
                    {currentTourStep.features.map((feature, index) => (
                      <TourFeatureCard key={index} feature={feature} />
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
                  <h3 className="text-xl font-bold mb-2">SOZURI</h3>
                  <p className="text-muted-foreground">
                    Enterprise-grade communication platform for global businesses
                  </p>
                </div>

                <FeaturePreview image={currentTourStep.image} altText={currentTourStep.title} />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      {productTourSteps.map((_, index) => (
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

                      {currentStep < productTourSteps.length - 1 ? (
                        <Button
                          size="sm"
                          onClick={() => setCurrentStep(Math.min(productTourSteps.length - 1, currentStep + 1))}
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
