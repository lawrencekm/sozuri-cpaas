import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WebhookLogsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Webhook delivery attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for log list */}
            <p className="text-sm text-muted-foreground">Webhook logs will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 