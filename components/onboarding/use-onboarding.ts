import { useState, useEffect } from "react"
import type { OnboardingStep } from "./types"

interface UseOnboardingOptions {
  storageKey: string
  steps: OnboardingStep[]
}

export function useOnboarding({ storageKey, steps }: UseOnboardingOptions) {
  const [isOpen, setIsOpen] = useState(true)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("setup")
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    // Load completed steps from localStorage
    const savedCompletedSteps = localStorage.getItem(`${storageKey}_completed_steps`)
    if (savedCompletedSteps) {
      setCompletedSteps(JSON.parse(savedCompletedSteps))
    }
    
    // Check if onboarding should be shown
    const hasCompletedOnboarding = localStorage.getItem(`${storageKey}_complete`)
    setIsOpen(!hasCompletedOnboarding)
  }, [storageKey])

  const markStepComplete = (stepId: string) => {
    const newCompletedSteps = [...completedSteps, stepId]
    setCompletedSteps(newCompletedSteps)
    localStorage.setItem(`${storageKey}_completed_steps`, JSON.stringify(newCompletedSteps))
  }

  const completeOnboarding = () => {
    localStorage.setItem(`${storageKey}_complete`, 'true')
    setIsOpen(false)
  }

  const skipOnboarding = () => {
    setIsOpen(false)
  }

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  // Get filtered steps by category
  const filteredSteps = steps.filter(step => !step.category || step.category === activeCategory)
  
  // Calculate completion percentage
  const completionPercentage = Math.round((completedSteps.length / steps.length) * 100)
  
  // Get recommended steps that aren't completed yet
  const recommendedSteps = steps
    .filter(step => step.recommended && !completedSteps.includes(step.id))
    .slice(0, 3)

  return {
    isOpen,
    setIsOpen,
    completedSteps,
    isMinimized,
    activeCategory,
    setActiveCategory,
    filteredSteps,
    recommendedSteps,
    completionPercentage,
    markStepComplete,
    completeOnboarding,
    skipOnboarding,
    toggleMinimized
  }
} 