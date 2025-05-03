import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function NewWebhookPage() {
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
              <h1 className="text-2xl font-bold tracking-tight">Create New Webhook</h1>
              <p className="text-muted-foreground">Set up a new endpoint for event notifications.</p>
           </div>
         </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Enter the details for your new webhook</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" placeholder="https://your-service.com/webhook" />
            </div>
            <div className="grid gap-2">
              <Label>Events</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="event-message-sent" />
                <Label htmlFor="event-message-sent">Message Sent</Label>
              </div>
              <div className="flex items-center space-x-2">
                 <Checkbox id="event-message-delivered" />
                 <Label htmlFor="event-message-delivered">Message Delivered</Label>
              </div>
              <div className="flex items-center space-x-2">
                 <Checkbox id="event-message-failed" />
                 <Label htmlFor="event-message-failed">Message Failed</Label>
              </div>
              {/* Add more events as needed */}
            </div>
            <Button>Create Webhook</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 