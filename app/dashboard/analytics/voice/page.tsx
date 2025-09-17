import React from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VoiceAnalytics from '@/components/metrics/voice-analytics'

export default function AnalyticsVoicePage() {
  return (
    <DashboardLayout>
      <div className="p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Analytics</h1>
          <p className="text-muted-foreground">Call volume, success rates, and IVR performance</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Key metrics across your voice channels</CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceAnalytics />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


