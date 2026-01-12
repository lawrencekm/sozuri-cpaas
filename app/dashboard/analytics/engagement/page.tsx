import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import EngagementAnalytics from '@/components/metrics/engagement-analytics'

export default function AnalyticsEngagementPage() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engagement Analytics</h1>
          <p className="text-muted-foreground">Customer engagement across channels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Engagement trends and breakdowns</CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementAnalytics />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


