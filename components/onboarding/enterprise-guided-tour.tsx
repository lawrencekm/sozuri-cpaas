"use client"

import { Check, Rocket, FileText, Clock } from "lucide-react"
import { useWalkthrough } from "./tooltip-walkthrough"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

import { useOnboarding } from "./use-onboarding"
import { OnboardingCard } from "./onboarding-card"
import { StepCard } from "./ui-components"
import { enterpriseOnboardingSteps, defaultWalkthroughSteps } from "./data"
import { useOnboardingPreferences } from "@/hooks/use-onboarding-preferences"

export function EnterpriseGuidedTour() {
  const { startWalkthrough } = useWalkthrough()

  // Use the original onboarding hook for UI state
  const {
    isOpen: isOpenOriginal,
    setIsOpen,
    completedSteps,
    isMinimized,
    activeCategory,
    setActiveCategory,
    filteredSteps,
    recommendedSteps,
    completionPercentage,
    markStepComplete: markStepCompleteOriginal,
    toggleMinimized
  } = useOnboarding({
    storageKey: 'enterprise_onboarding',
    steps: enterpriseOnboardingSteps
  })

  // Use our new preferences hook for persistence and "remind later" functionality
  const {
    shouldShowOnboarding,
    completeOnboarding,
    remindLater,
    completeStep,
    resetOnboarding
  } = useOnboardingPreferences({
    storageKey: 'enterprise_onboarding_preferences',
    remindLaterDays: 7 // Remind after 7 days
  })

  // Combine the two hooks - only show if both conditions are met
  const isOpen = isOpenOriginal && shouldShowOnboarding

  // Override the markStepComplete to update both systems
  const markStepComplete = (stepId: string) => {
    markStepCompleteOriginal(stepId)
    completeStep(stepId)
  }

  const handleFinish = () => {
    completeOnboarding()
    setIsOpen(false)
    startWalkthrough(defaultWalkthroughSteps)
  }

  const handleRemindLater = () => {
    remindLater()
    setIsOpen(false)
  }

  return (
    <OnboardingCard
      isOpen={isOpen}
      isMinimized={isMinimized}
      title="SOZURI Onboarding"
      titleIcon={<Rocket className="h-5 w-5 text-primary" />}
      completionPercentage={completionPercentage}
      onClose={() => setIsOpen(false)}
      onMinimize={toggleMinimized}
      onMaximize={toggleMinimized}
    >
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-xs text-muted-foreground">{completedSteps.length}/{enterpriseOnboardingSteps.length} Tasks</span>
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
              <StepCard
                key={step.id}
                step={step}
                isCompleted={completedSteps.includes(step.id)}
                onComplete={markStepComplete}
              />
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-4 pt-3 border-t">
          <div className="flex gap-2">
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

            {completedSteps.length < enterpriseOnboardingSteps.length && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemindLater}
                className="flex items-center gap-1"
              >
                <Clock className="h-4 w-4" />
                Remind Later
              </Button>
            )}
          </div>

          <Button
            size="sm"
            onClick={handleFinish}
            className="flex items-center gap-1"
          >
            <Check className="h-4 w-4" />
            {completedSteps.length === enterpriseOnboardingSteps.length ? 'Complete Onboarding' : 'Skip for Now'}
          </Button>
        </div>
      </div>
    </OnboardingCard>
  )
}
