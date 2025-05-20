"use client"

import { useState, useContext, createContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ArrowRight, Clock } from "lucide-react"
import type { WalkthroughStep } from "./types"
import { useOnboardingPreferences } from "@/hooks/use-onboarding-preferences"

type WalkthroughContextType = {
  startWalkthrough: (steps: WalkthroughStep[]) => void
  endWalkthrough: () => void
}

const WalkthroughContext = createContext<WalkthroughContextType>({
  startWalkthrough: () => {},
  endWalkthrough: () => {}
})

export function WalkthroughProvider({ children }: { children: React.ReactNode }) {
  const [steps, setSteps] = useState<WalkthroughStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  // Use our new preferences hook for persistence and "remind later" functionality
  const {
    completeOnboarding,
    remindLater
  } = useOnboardingPreferences({
    storageKey: 'walkthrough_preferences',
    remindLaterDays: 7 // Remind after 7 days
  })

  const startWalkthrough = (newSteps: WalkthroughStep[]) => {
    setSteps(newSteps)
    setCurrentStep(0)
  }

  const endWalkthrough = () => {
    setSteps([])
    setCurrentStep(0)
    completeOnboarding()
  }

  return (
    <WalkthroughContext.Provider value={{ startWalkthrough, endWalkthrough }}>
      {children}
      <AnimatePresence>
        {steps.length > 0 && currentStep < steps.length && (
          <WalkthroughTooltip
            step={steps[currentStep]}
            totalSteps={steps.length}
            currentStep={currentStep}
            onNext={() => setCurrentStep(prev => prev + 1)}
            onClose={endWalkthrough}
          />
        )}
      </AnimatePresence>
    </WalkthroughContext.Provider>
  )
}

function WalkthroughTooltip({
  step,
  totalSteps,
  currentStep,
  onNext,
  onClose
}: {
  step: WalkthroughStep,
  totalSteps: number,
  currentStep: number,
  onNext: () => void,
  onClose: () => void
}) {
  // Use our new preferences hook for the "remind later" functionality
  const { remindLater } = useOnboardingPreferences({
    storageKey: 'walkthrough_tooltip_preferences',
    remindLaterDays: 7 // Remind after 7 days
  })

  const handleRemindLater = () => {
    remindLater()
    onClose()
  }
  const targetElement = document.querySelector(step.target)
  const rect = targetElement?.getBoundingClientRect()

  if (!rect) return null

  const positions = {
    top: { bottom: window.innerHeight - rect.top + 10, left: rect.left + rect.width/2 },
    bottom: { top: rect.bottom + 10, left: rect.left + rect.width/2 },
    left: { top: rect.top + rect.height/2, right: window.innerWidth - rect.left + 10 },
    right: { top: rect.top + rect.height/2, left: rect.right + 10 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed z-[1000] p-4 bg-background rounded-lg border shadow-xl max-w-xs"
      style={positions[step.position || 'bottom']}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">{step.title}</span>
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{step.content}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={handleRemindLater}
          className="text-muted-foreground text-xs flex items-center hover:underline"
        >
          <Clock className="h-3 w-3 mr-1" />
          Remind Later
        </button>
        <button
          onClick={onNext}
          className="text-primary text-sm flex items-center hover:underline"
        >
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </motion.div>
  )
}

export const useWalkthrough = () => useContext(WalkthroughContext)