import { ReactNode } from "react"
import {
  Check,
  CheckCircle2,
  Circle,
  Clock,
  ExternalLink,
  FileText,
  Info
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { TourFeature, OnboardingStep } from "./types"

// Feature Preview Component
export interface FeaturePreviewProps {
  image?: string
  altText?: string
  fallbackText?: string
}

export function FeaturePreview({
  image,
  altText = "Feature preview",
  fallbackText = "Feature Preview Image"
}: FeaturePreviewProps) {
  return (
    <div className="aspect-video bg-muted rounded-lg mb-6 overflow-hidden relative">
      {image ? (
        <Image
          src={image}
          alt={altText}
          fill
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10">
          <Info className="h-8 w-8 text-primary/40" />
          <span className="ml-2 text-primary/40">{fallbackText}</span>
        </div>
      )}
    </div>
  )
}

// Section Header Component
export interface SectionHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function SectionHeader({
  title,
  description,
  icon,
  action
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {action && <div>{action}</div>}
    </div>
  )
}

// Checklist Item Component
export interface ChecklistItemProps {
  id: string
  title: string
  description: string
  link: string
  estimatedTime?: string
  priority?: "high" | "medium" | "low"
  completed: boolean
  documentationLink?: string
  onToggleComplete?: (id: string) => void
}

export function ChecklistItem({
  id,
  title,
  description,
  link,
  estimatedTime,
  priority,
  completed,
  documentationLink,
  onToggleComplete
}: ChecklistItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${
        completed
          ? 'bg-primary/5 border-primary/20'
          : priority === "high"
            ? 'border-orange-200 bg-orange-50/50'
            : 'hover:bg-accent/50'
      }`}
    >
      <button
        onClick={() => onToggleComplete?.(id)}
        className="flex-shrink-0 mt-0.5"
        aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
      >
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-medium ${completed ? 'text-muted-foreground' : ''}`}>
            {title}
          </h4>
          {estimatedTime && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {estimatedTime}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Estimated time to complete</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            {documentationLink && (
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0 text-xs"
                asChild
              >
                <Link href={documentationLink} className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Docs
                </Link>
              </Button>
            )}
          </div>

          <Button
            size="sm"
            variant={completed ? "outline" : "default"}
            className="h-7 text-xs"
            asChild
          >
            <Link href={link} className="flex items-center gap-1">
              {completed ? "View" : "Start"}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Step Card Component
export function StepCard({
  step,
  isCompleted,
  onComplete
}: {
  step: OnboardingStep
  isCompleted: boolean
  onComplete: (stepId: string) => void
}) {
  return (
    <ChecklistItem
      id={step.id}
      title={step.title}
      description={step.description}
      link={step.target}
      estimatedTime={step.estimatedTime}
      completed={isCompleted}
      documentationLink={step.documentationLink}
      onToggleComplete={onComplete}
    />
  )
}

// Tour Feature Card Component
export function TourFeatureCard({ feature }: { feature: TourFeature }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 p-2 bg-white/20 rounded-full">
        {feature.icon}
      </div>
      <div>
        <h3 className="font-medium">{feature.title}</h3>
        <p className="text-sm text-white/80">{feature.description}</p>
      </div>
    </div>
  )
}

// Progress Checklist Component
export function ProgressChecklist({
  items
}: {
  items: { id: string, label: string, completed: boolean }[]
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-3"
        >
          {item.completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5 text-muted-foreground" />
          )}
          <span className={item.completed ? 'text-muted-foreground line-through' : ''}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}