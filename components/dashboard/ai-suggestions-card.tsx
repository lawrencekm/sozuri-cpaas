"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Sparkles,
  Clock,
  MessageCircle,
  Users,
  Settings
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Suggestion {
  id: number
  title: string
  message: string
  action: string
  actionLink: string
  category: string
  impact: "high" | "medium" | "low"
  timeToImplement: string
}

export function AISuggestionsCard() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Mock suggestions data
  const mockSuggestions = useMemo<Suggestion[]>(() => [
    {
      id: 1,
      title: "Optimize Send Time",
      message: "Sending messages between 2-4 PM could increase open rates by up to 23%.",
      action: "View Analysis",
      actionLink: "/dashboard/ai-suggestions",
      category: "timing",
      impact: "high",
      timeToImplement: "5 min"
    },
    {
      id: 2,
      title: "Re-engage Dormant Customers",
      message: "1,247 customers haven't engaged in 60 days. A targeted campaign could recover 15%.",
      action: "Create Campaign",
      actionLink: "/dashboard/ai-suggestions",
      category: "audience",
      impact: "high",
      timeToImplement: "15 min"
    },
    {
      id: 3,
      title: "Optimize Message Length",
      message: "Messages with 50-100 characters have 24% higher response rates than longer ones.",
      action: "Review Templates",
      actionLink: "/dashboard/ai-suggestions",
      category: "optimization",
      impact: "medium",
      timeToImplement: "10 min"
    }
  ], [])

  useEffect(() => {
    let isMounted = true; // Mounted flag
    const fetchSuggestions = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        if (isMounted) {
          setSuggestions(mockSuggestions)
        }
      } catch (error) {
        if (isMounted) { // Also check before logging if it involves component state
          console.error("Error fetching suggestions:", error)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSuggestions()

    return () => {
      isMounted = false; // Cleanup function to set flag on unmount
    };
  // If mockSuggestions is not stable (e.g., defined inside component or passed as prop without memo), add it to dependency array.
  // For this specific case, mockSuggestions is defined outside and is stable.
  }, [mockSuggestions])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "timing":
        return <Clock className="h-4 w-4" />
      case "audience":
        return <Users className="h-4 w-4" />
      case "optimization":
        return <Settings className="h-4 w-4" />
      default:
        return <MessageCircle className="h-4 w-4" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "low":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="col-span-3 border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>AI Suggestions</CardTitle>
          </div>
          <Badge variant="outline" className="font-normal">
            {suggestions.length} new
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md border animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-muted rounded mb-2"></div>
                  <div className="h-3 w-full bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : suggestions.length > 0 ? (
          <div className="space-y-3">
            {suggestions.slice(0, 2).map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-start gap-3 p-3 rounded-md border hover:bg-muted/30 transition-colors"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                  <Lightbulb className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          {getCategoryIcon(suggestion.category)}
                          <span className="capitalize">{suggestion.category}</span>
                        </Badge>
                        <Badge className={`${getImpactColor(suggestion.impact)} text-xs`}>
                          {suggestion.impact === "high" ? "High Impact" :
                           suggestion.impact === "medium" ? "Medium Impact" : "Low Impact"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      asChild
                    >
                      <Link href={suggestion.actionLink}>
                        {suggestion.action}
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium mb-1">No suggestions yet</h3>
            <p className="text-xs text-muted-foreground mb-4">
              We're analyzing your data to generate personalized suggestions
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 border-t">
        <Button
          variant="link"
          size="sm"
          className="ml-auto"
          asChild
        >
          <Link href="/dashboard/ai-suggestions" className="flex items-center gap-1">
            View All Suggestions
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
