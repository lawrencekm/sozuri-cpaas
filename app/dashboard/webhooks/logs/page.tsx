import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WebhookLogsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
         <div className="flex items-center space-x-4">
           <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/webhooks">
                 <ArrowLeft className="h-4 w-4" />
              </Link>
           </Button>
           <div>
              <h1 className="text-2xl font-bold tracking-tight">Webhook Logs</h1>
              <p className="text-muted-foreground">Monitor webhook delivery status and errors.</p>
           </div>
         </div>

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