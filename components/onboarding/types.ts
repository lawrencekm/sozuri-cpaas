import type { ReactNode } from "react"

export interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: ReactNode
  target: string
  category?: string
  estimatedTime?: string
  completed?: boolean
  recommended?: boolean
  documentationLink?: string
}

export interface TourFeature {
  title: string
  description: string
  icon: ReactNode
}

export interface TourStep {
  id: string
  title: string
  description: string
  image: string
  features: TourFeature[]
  cta: {
    label: string
    href: string
  }
}

export interface WalkthroughStep {
  target: string
  title: string
  content: string
  position: "top" | "right" | "bottom" | "left"
} 