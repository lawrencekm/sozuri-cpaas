"use client"

import { BarChart3, Download, Filter } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, lazy } from "react"
import dynamic from 'next/dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { MetricsProvider } from "@/components/metrics/metrics-context"

// Lazy load heavy chart components
const RealTimeDashboard = dynamic(
  () => import('@/components/metrics/real-time-dashboard').then(mod => ({ default: mod.RealTimeDashboard })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="h-[200px] animate-pulse bg-muted rounded-lg" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    ),
    ssr: false // Disable server-side rendering for chart components
  }
)

const CostAnalytics = dynamic(
  () => import('@/components/metrics/cost-analytics').then(mod => ({ default: mod.CostAnalytics })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
      </div>
    ),
    ssr: false
  }
)

const MessagingAnalytics = dynamic(
  () => import('@/components/metrics/messaging-analytics').then(mod => ({ default: mod.MessagingAnalytics })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
      </div>
    ),
    ssr: false
  }
)

const VoiceAnalytics = dynamic(
  () => import('@/components/metrics/voice-analytics').then(mod => ({ default: mod.VoiceAnalytics })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
      </div>
    ),
    ssr: false
  }
)

const EngagementAnalytics = dynamic(
  () => import('@/components/metrics/engagement-analytics').then(mod => ({ default: mod.EngagementAnalytics })),
  {
    loading: () => (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[100px] animate-pulse bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
      </div>
    ),
    ssr: false
  }
)

// Client component that uses the searchParams hook
function AnalyticsContent() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "real-time"
  const metric = searchParams.get("metric")
  const channel = searchParams.get("channel")

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Track and analyze your communication performance</p>
          {metric && <p className="text-sm text-primary mt-1">Viewing: {metric.replace(/-/g, ' ')} {channel ? `for ${channel}` : ''}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue={tab} className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="real-time">Real-Time</TabsTrigger>
              <TabsTrigger value="cost">Cost Analytics</TabsTrigger>
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="voice">Voice</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            {/* Real-Time Dashboard */}
            <TabsContent value="real-time" className="pt-6">
              <RealTimeDashboard />
            </TabsContent>

            {/* Cost Analytics */}
            <TabsContent value="cost" className="pt-6">
              <CostAnalytics />
            </TabsContent>

            {/* Messaging Analytics */}
            <TabsContent value="messaging" className="pt-6">
              <MessagingAnalytics />
            </TabsContent>

            {/* Voice Analytics */}
            <TabsContent value="voice" className="pt-6">
              <VoiceAnalytics />
            </TabsContent>

            {/* Engagement Analytics */}
            <TabsContent value="engagement" className="pt-6">
              <EngagementAnalytics />
            </TabsContent>
          </Tabs>
        </div>
    )
}

// Main page component with Suspense boundary
export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <MetricsProvider>
        <Suspense fallback={
          <div className="flex flex-col space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Track and analyze your communication performance</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
                <Button variant="outline" disabled>
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
            <div className="h-[600px] w-full flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Loading analytics data...</div>
            </div>
          </div>
        }>
          <AnalyticsContent />
        </Suspense>
      </MetricsProvider>
    </DashboardLayout>
  )
}
