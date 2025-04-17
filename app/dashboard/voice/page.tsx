import { ArrowRight, Phone, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function VoicePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Voice Solutions</h1>
            <p className="text-muted-foreground">Manage voice calls, IVR systems, and voice messaging</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Voice Campaign
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Voice Calls</CardTitle>
              <CardDescription>Make and receive voice calls</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up and manage voice calls for customer service, verification, and notifications.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/voice/calls">
                  Manage Voice Calls <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>IVR Systems</CardTitle>
              <CardDescription>Interactive Voice Response systems</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage IVR flows for automated customer interactions and call routing.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/voice/ivr">
                  Manage IVR <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Voice Messaging</CardTitle>
              <CardDescription>Automated voice messages and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and send automated voice messages to your audience for announcements and alerts.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/voice/messaging">
                  Manage Voice Messages <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Voice Dashboard</CardTitle>
            <CardDescription>Key metrics for your voice communications</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <Phone className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Voice Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View detailed metrics and performance data for your voice communications
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/analytics?channel=voice">View Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
