import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ManageWebhooksPage() {
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
              <h1 className="text-2xl font-bold tracking-tight">Manage Webhooks</h1>
              <p className="text-muted-foreground">View and manage your configured webhooks.</p>
           </div>
         </div>

        <Card>
          <CardHeader>
            <CardTitle>Existing Webhooks</CardTitle>
            <CardDescription>List of your current webhooks</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for webhook list */}
            <p className="text-sm text-muted-foreground">Webhook list will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 