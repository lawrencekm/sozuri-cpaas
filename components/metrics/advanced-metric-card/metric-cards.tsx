"use client"

import { useState } from "react"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  BarChart4
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

export type MetricTrend = "up" | "down" | "neutral"
export type MetricStatus = "good" | "warning" | "critical" | "neutral"

export interface AdvancedMetricProps {
  title: string
  value: string | number
  previousValue?: string | number
  change?: string | number
  trend?: MetricTrend
  status?: MetricStatus
  description?: string
  infoTooltip?: string
  icon?: React.ReactNode
  footer?: React.ReactNode
  detailsLink?: string
  showProgress?: boolean
  progressValue?: number
  isLoading?: boolean
  className?: string
}

export function AdvancedMetricCard({
  title,
  value,
  previousValue,
  change,
  trend = "neutral",
  status = "neutral",
  description,
  infoTooltip,
  icon,
  footer,
  detailsLink,
  showProgress = false,
  progressValue = 0,
  isLoading = false,
  className,
}: AdvancedMetricProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  // Determine trend icon and color
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className={`h-4 w-4 ${status === "good" ? "text-green-500" : "text-red-500"}`} />
      case "down":
        return <ArrowDownRight className={`h-4 w-4 ${status === "good" ? "text-green-500" : "text-red-500"}`} />
      default:
        return null
    }
  }

  // Determine background color based on status
  const getBackgroundColor = () => {
    switch (status) {
      case "good":
        return "bg-green-50 dark:bg-green-950/20"
      case "warning":
        return "bg-amber-50 dark:bg-amber-950/20"
      case "critical":
        return "bg-red-50 dark:bg-red-950/20"
      default:
        return ""
    }
  }

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 ${isHovered ? "shadow-md" : ""} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {infoTooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">{infoTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          {icon && <div className={`${getStatusColor()}`}>{icon}</div>}
        </div>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{value}</div>
              {change && (
                <div className="flex items-center text-xs font-medium">
                  {getTrendIcon()}
                  <span className={trend === "up" ? (status === "good" ? "text-green-500" : "text-red-500") : (status === "good" ? "text-green-500" : "text-red-500")}>
                    {change}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
        
        {showProgress && (
          <div className="mt-3">
            <Progress value={progressValue} className="h-1" />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        )}
      </CardContent>
      
      {(footer || detailsLink) && (
        <CardFooter className={`border-t px-6 py-3 ${getBackgroundColor()}`}>
          {footer ? (
            footer
          ) : detailsLink ? (
            <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
              <Link href={detailsLink}>
                View Details
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : null}
        </CardFooter>
      )}
    </Card>
  )
}

// Predefined metric cards for common CPaaS metrics
export function DeliveryRateMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // Determine status based on delivery rate
  const getStatus = (): MetricStatus => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue >= 98) return "good"
    if (numValue >= 95) return "warning"
    return "critical"
  }

  return (
    <AdvancedMetricCard
      title="Delivery Rate"
      value={value}
      change={change}
      trend={trend}
      status={getStatus()}
      description="Percentage of messages successfully delivered"
      infoTooltip="The percentage of messages that were successfully delivered to recipients out of all messages sent."
      icon={<CheckCircle2 className="h-4 w-4" />}
      detailsLink={detailsLink}
      showProgress={true}
      progressValue={typeof value === 'string' ? parseFloat(value) : Number(value)}
      isLoading={isLoading}
    />
  )
}

export function LatencyMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // Determine status based on latency (ms)
  const getStatus = (): MetricStatus => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue <= 100) return "good"
    if (numValue <= 300) return "warning"
    return "critical"
  }

  return (
    <AdvancedMetricCard
      title="Average Latency"
      value={`${value} ms`}
      change={change}
      trend={trend === "up" ? "down" : "up"} // Invert trend for latency (lower is better)
      status={getStatus()}
      description="Average message delivery time"
      infoTooltip="The average time it takes for a message to be delivered from the moment it's sent."
      icon={<Clock className="h-4 w-4" />}
      detailsLink={detailsLink}
      isLoading={isLoading}
    />
  )
}

export function ErrorRateMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // Determine status based on error rate
  const getStatus = (): MetricStatus => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue <= 1) return "good"
    if (numValue <= 5) return "warning"
    return "critical"
  }

  return (
    <AdvancedMetricCard
      title="Error Rate"
      value={`${value}%`}
      change={change}
      trend={trend === "up" ? "down" : "up"} // Invert trend for error rate (lower is better)
      status={getStatus()}
      description="Percentage of failed messages"
      infoTooltip="The percentage of messages that failed to be delivered out of all messages sent."
      icon={<AlertTriangle className="h-4 w-4" />}
      detailsLink={detailsLink}
      isLoading={isLoading}
    />
  )
}

export function ThroughputMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // For throughput, higher is better
  const getStatus = (): MetricStatus => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue >= 150) return "good"
    if (numValue >= 100) return "warning"
    return "neutral"
  }

  return (
    <AdvancedMetricCard
      title="Throughput"
      value={value}
      change={change}
      trend={trend}
      status={getStatus()}
      description="Messages per second"
      infoTooltip="The number of messages that can be processed per second."
      icon={<Zap className="h-4 w-4" />}
      detailsLink={detailsLink}
      isLoading={isLoading}
    />
  )
}

export function CostMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // For cost, lower is better
  return (
    <AdvancedMetricCard
      title="Avg. Cost per Message"
      value={typeof value === 'number' ? `$${value.toFixed(4)}` : value}
      change={change}
      trend={trend === "up" ? "down" : "up"} // Invert trend for cost (lower is better)
      status={trend === "up" ? "warning" : "good"}
      description="Average cost per message sent"
      infoTooltip="The average cost incurred per message across all channels."
      icon={<DollarSign className="h-4 w-4" />}
      detailsLink={detailsLink}
      isLoading={isLoading}
    />
  )
}

export function ConversionRateMetricCard({
  value,
  change,
  trend,
  detailsLink,
  isLoading,
}: {
  value: string | number
  change?: string | number
  trend?: MetricTrend
  detailsLink?: string
  isLoading?: boolean
}) {
  // Determine status based on conversion rate
  const getStatus = (): MetricStatus => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (numValue >= 10) return "good"
    if (numValue >= 5) return "warning" 
    return "critical"
  }

  return (
    <AdvancedMetricCard
      title="Conversion Rate"
      value={`${value}%`}
      change={change}
      trend={trend}
      status={getStatus()}
      description="Message-to-action conversion rate"
      infoTooltip="The percentage of recipients who performed the desired action after receiving a message."
      icon={<BarChart4 className="h-4 w-4" />}
      detailsLink={detailsLink}
      showProgress={true}
      progressValue={typeof value === 'string' ? parseFloat(value) : Number(value)}
      isLoading={isLoading}
    />
  )
} 