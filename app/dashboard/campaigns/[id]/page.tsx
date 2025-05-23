"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Edit, MessageCircle, Phone, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/date-formatter"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { useApi, useCampaign } from "@/hooks/use-api"
import { campaignsAPI } from "@/lib/api"

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { data: campaignData, isLoading, error } = useCampaign(id)

  const { execute: deleteCampaign, isLoading: isDeleting } = useApi(campaignsAPI.delete, {
    successMessage: "Campaign deleted successfully",
    onSuccess: () => {
      router.push("/dashboard/campaigns")
    }
  })

  // Use sample data if API call fails or is loading
  const campaign = campaignData || {
    id,
    name: "Welcome Message",
    description: "Initial welcome message sent to new customers",
    channel: "sms",
    status: "active",
    created: "2023-05-15T10:30:00Z",
    updated: "2023-05-15T10:30:00Z",
    content: "Welcome to our service! We're excited to have you on board. Reply HELP for assistance or STOP to unsubscribe.",
    audience: {
      total: 1245,
      delivered: 1200,
      failed: 45,
      opened: 980,
      clicked: 650
    },
    schedule: {
      type: "one-time",
      sentAt: "2023-05-15T10:30:00Z"
    }
  }

  const handleDelete = async () => {
    await deleteCampaign(id)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/campaigns")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
              <p className="text-muted-foreground">{campaign.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push(`/dashboard/campaigns/${id}/edit`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the campaign and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Channel</p>
                <div className="flex items-center font-medium">
                  {campaign.channel === "sms" && <MessageCircle className="mr-1 h-4 w-4" />}
                  {campaign.channel === "voice" && <Phone className="mr-1 h-4 w-4" />}
                  {campaign.channel?.toUpperCase() || 'N/A'}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={
                  campaign.status === "active" ? "default" :
                  campaign.status === "draft" ? "outline" :
                  campaign.status === "scheduled" ? "secondary" :
                  "destructive"
                }>
                  {campaign.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{campaign.created ? formatDate(campaign.created) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{campaign.updated ? formatDate(campaign.updated) : 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Campaign Content</CardTitle>
              <CardDescription>Message content sent to recipients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border p-4 font-mono text-sm">
                {campaign.content}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Key metrics for this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Total Recipients</p>
                    <p className="text-2xl font-bold">{campaign.audience?.total || 0}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Delivered</p>
                    <p className="text-2xl font-bold">{campaign.audience?.delivered || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.audience?.total ? Math.round(((campaign.audience?.delivered || 0) / campaign.audience.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold">{campaign.audience?.failed || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.audience?.total ? Math.round(((campaign.audience?.failed || 0) / campaign.audience.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-sm text-muted-foreground">Engagement</p>
                    <p className="text-2xl font-bold">{campaign.audience?.opened || 0}</p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.audience?.delivered ? Math.round(((campaign.audience?.opened || 0) / campaign.audience.delivered) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="audience" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Details</CardTitle>
                <CardDescription>Recipients of this campaign</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Audience details will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="schedule" className="space-y-4 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Information</CardTitle>
                <CardDescription>When this campaign was or will be sent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Schedule Type</p>
                    <p className="font-medium capitalize">{campaign.schedule?.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sent At</p>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{campaign.schedule?.sentAt ? formatDate(campaign.schedule.sentAt) : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
