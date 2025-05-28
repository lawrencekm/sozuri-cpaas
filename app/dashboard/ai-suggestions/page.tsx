"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatShortDate } from "@/lib/date-formatter"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Lightbulb,
  MessageCircle,
  Rocket,
  Settings,
  Sparkles,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface AISuggestion {
  id: string
  title: string
  description: string
  category: "engagement" | "optimization" | "audience" | "content" | "timing"
  impact: "high" | "medium" | "low"
  timeToImplement: string
  implemented: boolean
  createdAt: string
  metrics?: {
    label: string
    value: string
    change: string
    trend: "up" | "down"
  }[]
  actions: {
    label: string
    href: string
    primary?: boolean
  }[]
}

export default function AISuggestionsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [filter, setFilter] = useState("all")
  const [implementedCount, setImplementedCount] = useState(0)

  // Simulated AI suggestions data
  const mockSuggestions = useMemo<AISuggestion[]>(() => [
    {
      id: "sug-1",
      title: "Optimize Send Time for Higher Engagement",
      description: "Based on your audience's activity patterns, sending messages between 2-4 PM on weekdays could increase open rates by up to 23%. Your current campaigns are primarily sent in the morning when engagement is lower.",
      category: "timing",
      impact: "high",
      timeToImplement: "5 min",
      implemented: false,
      createdAt: "2023-11-15T14:30:00Z",
      metrics: [
        {
          label: "Predicted Open Rate",
          value: "32%",
          change: "+23%",
          trend: "up"
        },
        {
          label: "Predicted Response Rate",
          value: "12%",
          change: "+18%",
          trend: "up"
        }
      ],
      actions: [
        {
          label: "Apply to All Campaigns",
          href: "/dashboard/campaigns/settings",
          primary: true
        },
        {
          label: "View Analysis",
          href: "/dashboard/analytics?metric=timing"
        }
      ]
    },
    {
      id: "sug-2",
      title: "Re-engage Dormant Customers",
      description: "We've identified 1,247 customers who haven't engaged with your messages in the last 60 days. A targeted re-engagement campaign with a special offer could recover up to 15% of these customers.",
      category: "audience",
      impact: "high",
      timeToImplement: "15 min",
      implemented: false,
      createdAt: "2023-11-14T09:15:00Z",
      metrics: [
        {
          label: "Dormant Customers",
          value: "1,247",
          change: "+5%",
          trend: "up"
        },
        {
          label: "Potential Recovery",
          value: "187",
          change: "+15%",
          trend: "up"
        }
      ],
      actions: [
        {
          label: "Create Re-engagement Campaign",
          href: "/dashboard/campaigns/new?template=re-engagement",
          primary: true
        },
        {
          label: "View Dormant Segment",
          href: "/dashboard/contacts?segment=dormant"
        }
      ]
    },
    {
      id: "sug-3",
      title: "Personalize Message Content",
      description: "Messages with personalized content beyond just the recipient's name show 31% higher engagement. Adding purchase history, browsing behavior, or location-based content could significantly improve your campaign performance.",
      category: "content",
      impact: "medium",
      timeToImplement: "30 min",
      implemented: false,
      createdAt: "2023-11-13T16:45:00Z",
      metrics: [
        {
          label: "Engagement Increase",
          value: "31%",
          change: "+31%",
          trend: "up"
        },
        {
          label: "Conversion Impact",
          value: "18%",
          change: "+18%",
          trend: "up"
        }
      ],
      actions: [
        {
          label: "Update Templates",
          href: "/dashboard/messaging/templates",
          primary: true
        },
        {
          label: "View Personalization Guide",
          href: "/dashboard/developers/guides/personalization"
        }
      ]
    },
    {
      id: "sug-4",
      title: "Optimize Message Length",
      description: "Your messages with 50-100 characters have 24% higher response rates than longer messages. Consider shortening your promotional messages to improve engagement.",
      category: "optimization",
      impact: "medium",
      timeToImplement: "10 min",
      implemented: true,
      createdAt: "2023-11-12T11:20:00Z",
      metrics: [
        {
          label: "Response Rate",
          value: "24%",
          change: "+24%",
          trend: "up"
        }
      ],
      actions: [
        {
          label: "Review Templates",
          href: "/dashboard/messaging/templates",
          primary: true
        },
        {
          label: "View Length Analysis",
          href: "/dashboard/analytics?metric=message-length"
        }
      ]
    },
    {
      id: "sug-5",
      title: "Implement Two-Way Messaging",
      description: "Enabling two-way messaging could increase customer satisfaction by 42% and reduce support costs. Your current one-way messaging approach limits customer engagement opportunities.",
      category: "engagement",
      impact: "high",
      timeToImplement: "1 hour",
      implemented: false,
      createdAt: "2023-11-11T14:10:00Z",
      metrics: [
        {
          label: "Customer Satisfaction",
          value: "42%",
          change: "+42%",
          trend: "up"
        },
        {
          label: "Support Cost",
          value: "28%",
          change: "-28%",
          trend: "down"
        }
      ],
      actions: [
        {
          label: "Enable Two-Way Messaging",
          href: "/dashboard/settings/messaging",
          primary: true
        },
        {
          label: "View Implementation Guide",
          href: "/dashboard/developers/guides/two-way-messaging"
        }
      ]
    },
    {
      id: "sug-6",
      title: "Segment Audience by Engagement Level",
      description: "Creating three distinct segments (highly engaged, moderately engaged, and low engagement) could improve overall campaign performance by tailoring message frequency and content to each group.",
      category: "audience",
      impact: "medium",
      timeToImplement: "45 min",
      implemented: true,
      createdAt: "2023-11-10T09:30:00Z",
      metrics: [
        {
          label: "Overall Engagement",
          value: "27%",
          change: "+27%",
          trend: "up"
        }
      ],
      actions: [
        {
          label: "Create Segments",
          href: "/dashboard/contacts/segments",
          primary: true
        },
        {
          label: "View Segmentation Guide",
          href: "/dashboard/developers/guides/segmentation"
        }
      ]
    }
  ], [])

  useEffect(() => {
    // Simulate API call to fetch suggestions
    const fetchSuggestions = async () => {
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setSuggestions(mockSuggestions)
        setImplementedCount(mockSuggestions.filter(s => s.implemented).length)
      } catch (error) {
        console.error("Error fetching AI suggestions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSuggestions()
  }, [mockSuggestions])

  const filteredSuggestions = filter === "all"
    ? suggestions
    : filter === "implemented"
      ? suggestions.filter(s => s.implemented)
      : filter === "pending"
        ? suggestions.filter(s => !s.implemented)
        : suggestions.filter(s => s.category === filter)

  const toggleImplementation = (id: string) => {
    setSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === id
          ? { ...suggestion, implemented: !suggestion.implemented }
          : suggestion
      )
    )

    // Update implemented count
    const updatedSuggestion = suggestions.find(s => s.id === id)
    if (updatedSuggestion) {
      setImplementedCount(prev =>
        updatedSuggestion.implemented ? prev - 1 : prev + 1
      )
    }
  }

  const getCategoryIcon = (category: string) => {
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

  const getImpactColor = (impact: string) => {
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

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">AI Suggestions</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Intelligent recommendations to optimize your communication strategy
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter suggestions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suggestions</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="optimization">Optimization</SelectItem>
                <SelectItem value="audience">Audience</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="timing">Timing</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>

            <Button>
              <Rocket className="mr-2 h-4 w-4" /> Apply All
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suggestions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated daily based on your data
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Implementation Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {suggestions.length > 0
                  ? Math.round((implementedCount / suggestions.length) * 100)
                  : 0}%
              </div>
              <div className="mt-2">
                <Progress
                  value={suggestions.length > 0
                    ? (implementedCount / suggestions.length) * 100
                    : 0}
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Potential Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+27%</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                Engagement improvement potential
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Days Ago</div>
              <p className="text-xs text-muted-foreground mt-1">
                Last data analysis performed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
            <Badge variant="outline" className="font-normal">
              {filteredSuggestions.length} suggestions
            </Badge>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-muted rounded"></div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 w-full bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredSuggestions.length > 0 ? (
            <div className="space-y-6">
              {filteredSuggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className={`border-l-4 ${
                    suggestion.implemented
                      ? "border-l-green-500"
                      : suggestion.impact === "high"
                        ? "border-l-blue-500"
                        : "border-l-orange-500"
                  } transition-all hover:shadow-md`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Lightbulb className={`h-5 w-5 ${
                            suggestion.implemented ? "text-green-500" : "text-primary"
                          }`} />
                          <CardTitle className="text-xl">{suggestion.title}</CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            {getCategoryIcon(suggestion.category)}
                            <span className="capitalize">{suggestion.category}</span>
                          </Badge>
                          <Badge className={getImpactColor(suggestion.impact)}>
                            {suggestion.impact === "high" ? "High Impact" :
                             suggestion.impact === "medium" ? "Medium Impact" : "Low Impact"}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {suggestion.timeToImplement}
                          </Badge>
                          {suggestion.implemented && (
                            <Badge className="bg-green-100 text-green-800">
                              Implemented
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`implement-${suggestion.id}`} className="text-sm">
                            {suggestion.implemented ? "Implemented" : "Mark as implemented"}
                          </Label>
                          <Switch
                            id={`implement-${suggestion.id}`}
                            checked={suggestion.implemented}
                            onCheckedChange={() => toggleImplementation(suggestion.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-muted-foreground">{suggestion.description}</p>

                    {suggestion.metrics && suggestion.metrics.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {suggestion.metrics.map((metric, index) => (
                          <div key={index} className="space-y-1">
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold">{metric.value}</span>
                              <span className={`text-xs font-medium flex items-center ${
                                metric.trend === "up" ? "text-green-500" : "text-red-500"
                              }`}>
                                {metric.trend === "up" ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingUp className="h-3 w-3 mr-1 transform rotate-180" />
                                )}
                                {metric.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 border-t flex justify-between">
                    <div className="text-xs text-muted-foreground">
                      Generated on {formatShortDate(suggestion.createdAt)}
                    </div>
                    <div className="flex gap-2">
                      {suggestion.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.primary ? "default" : "outline"}
                          size="sm"
                          asChild
                        >
                          <Link href={action.href} className="flex items-center gap-1">
                            {action.label}
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No suggestions found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-4">
                  {filter !== "all"
                    ? `No suggestions match the "${filter}" filter. Try changing your filter criteria.`
                    : "We're analyzing your data to generate personalized suggestions. Check back soon!"}
                </p>
                {filter !== "all" && (
                  <Button variant="outline" onClick={() => setFilter("all")}>
                    View All Suggestions
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Impact</CardTitle>
              <CardDescription>
                Projected performance improvements from implementing suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Engagement Rate</span>
                    </div>
                    <span className="text-sm font-medium">+27%</span>
                  </div>
                  <Progress value={27} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Conversion Rate</span>
                    </div>
                    <span className="text-sm font-medium">+18%</span>
                  </div>
                  <Progress value={18} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Audience Growth</span>
                    </div>
                    <span className="text-sm font-medium">+12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Complaint Rate</span>
                    </div>
                    <span className="text-sm font-medium">-15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming AI Analysis</CardTitle>
              <CardDescription>
                Scheduled data analysis and suggestion generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Weekly Campaign Performance</h4>
                    <p className="text-sm text-muted-foreground">
                      Analysis of campaign performance metrics and engagement patterns
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> Tomorrow, 9:00 AM
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Audience Segmentation Review</h4>
                    <p className="text-sm text-muted-foreground">
                      Analysis of audience behavior and segmentation opportunities
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> In 3 days
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg border">
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-full bg-primary/10">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Content Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Analysis of message content and optimization opportunities
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> In 5 days
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
