import { BarChart3, Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track and analyze your communication performance</p>
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Key metrics across all communication channels</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Comprehensive analytics for all your communication channels
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messaging" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Messaging Analytics</CardTitle>
                <CardDescription>Performance metrics for SMS, WhatsApp, Viber, and RCS</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Messaging Performance</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Detailed analytics for your messaging campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="voice" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Voice Analytics</CardTitle>
                <CardDescription>Performance metrics for voice calls and IVR</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Voice Performance</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Detailed analytics for your voice campaigns</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="engagement" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Analytics</CardTitle>
                <CardDescription>User engagement metrics across all channels</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Engagement Metrics</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Detailed analytics for user engagement with your communications
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
