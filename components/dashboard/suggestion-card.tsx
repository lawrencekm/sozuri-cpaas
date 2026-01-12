"use client"

import Link from "next/link"
import { Lightbulb, MessageCircle, Users, Settings, Clock, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { formatShortDate } from "@/lib/date-formatter"

export interface SuggestionAction {
  label: string
  href: string
  primary?: boolean
}

export interface SuggestionItem {
  id: string
  title: string
  description: string
  category: "engagement" | "optimization" | "audience" | "content" | "timing"
  impact: "high" | "medium" | "low"
  timeToImplement: string
  implemented: boolean
  createdAt: string
  actions: SuggestionAction[]
}

function getCategoryIcon(category: SuggestionItem["category"]) {
  switch (category) {
    case "engagement":
      return <MessageCircle className="h-4 w-4" />
    case "optimization":
      return <Settings className="h-4 w-4" />
    case "audience":
      return <Users className="h-4 w-4" />
    case "content":
      return <MessageCircle className="h-4 w-4" />
    case "timing":
      return <Clock className="h-4 w-4" />
    default:
      return <Lightbulb className="h-4 w-4" />
  }
}

function getImpactColor(impact: SuggestionItem["impact"]) {
  switch (impact) {
    case "high":
      return "bg-green-100 text-green-800 hover:bg-green-200"
    case "medium":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "low":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export default function SuggestionCard({
  suggestion,
  onToggle,
}: {
  suggestion: SuggestionItem
  onToggle: (id: string) => void
}) {
  return (
    <Card
      className={`h-full overflow-hidden flex flex-col rounded-xl border p-6 gap-4 transition hover:shadow-lg ${
        suggestion.implemented ? "bg-white/60" : "bg-white"
      }`}
    >
      {/* Header: Icon + Title + Toggle */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <Lightbulb
            className={`h-5 w-5 shrink-0 ${
              suggestion.implemented ? "text-green-500" : "text-primary"
            }`}
          />
          <div className="min-w-0 flex-1">
            <div className="text-base font-semibold leading-snug truncate" title={suggestion.title}>
              {suggestion.title}
            </div>
            {/* Chips: Category + Impact */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {getCategoryIcon(suggestion.category)}
                <span className="capitalize text-xs">{suggestion.category}</span>
              </Badge>
              <Badge className={`${getImpactColor(suggestion.impact)} text-xs`}>
                {suggestion.impact === "high"
                  ? "High impact"
                  : suggestion.impact === "medium"
                  ? "Medium impact"
                  : "Low impact"}
              </Badge>
            </div>
          </div>
        </div>

        <Switch
          id={`implement-${suggestion.id}`}
          checked={suggestion.implemented}
          onCheckedChange={() => onToggle(suggestion.id)}
        />
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground break-words">
        {suggestion.description}
      </p>

      {/* Spacer to push footer down for equal-height cards */}
      <div className="flex-1" />

      {/* Footer: Meta + Actions */}
      <div className="pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {formatShortDate(suggestion.createdAt)} • {suggestion.timeToImplement}
          </div>

          <div className="flex-1 flex justify-center sm:justify-center">
            <div className="flex min-w-0 flex-wrap gap-2 justify-center">
              {suggestion.actions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.primary ? "default" : "outline"}
                  className="px-2 py-1 text-xs"
                  asChild
                >
                  <Link href={action.href} className="flex items-center gap-1">
                    {action.label}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}