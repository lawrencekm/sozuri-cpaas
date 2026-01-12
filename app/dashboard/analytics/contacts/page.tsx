import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessagingAnalytics } from '@/components/metrics/messaging-analytics'

export default function AnalyticsContactsPage() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contacts Analytics</h1>
          <p className="text-muted-foreground">Segment growth, engagement, and deliverability</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Key contact metrics and trends</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Reuse messaging analytics as a placeholder until contact-specific charts exist */}
            <MessagingAnalytics />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


