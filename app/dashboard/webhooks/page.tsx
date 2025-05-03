import { ArrowRight, Plus, Webhook } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function WebhooksPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Settings</h1>
            <p className="text-muted-foreground">Manage webhooks, API keys, and integrations</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/webhooks/new">
              <Plus className="mr-2 h-4 w-4" /> New Webhook
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Manage event notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up webhooks to receive real-time notifications for message delivery, responses, and other events.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/webhooks/manage">
                  Manage Webhooks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API credentials</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage API keys for integrating SOZURI services with your applications.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/api-keys">
                  Manage API Keys <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>Connect with other platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Integrate SOZURI with CRM systems, marketing platforms, and other third-party services.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/integrations">
                  Manage Integrations <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Webhook Dashboard</CardTitle>
            <CardDescription>Monitor your webhook activity</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <Webhook className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Webhook Activity</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View webhook delivery status, errors, and performance metrics
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/webhooks/logs">View Logs</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
