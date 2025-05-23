"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { useApi, useCampaign } from "@/hooks/use-api"
import { campaignsAPI } from "@/lib/api"

export default function EditCampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const unwrappedParams = use(params)
  const { id } = unwrappedParams
  const { data: campaignData, isLoading: isLoadingCampaign } = useCampaign(id)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel: "",
    status: "",
    content: ""
  })

  const { execute: updateCampaign, isLoading } = useApi(campaignsAPI.update, {
    successMessage: "Campaign updated successfully",
    onSuccess: () => {
      router.push(`/dashboard/campaigns/${id}`)
    }
  })

  // Update form data when campaign data is loaded
  useEffect(() => {
    if (campaignData) {
      setFormData({
        name: campaignData.name,
        description: campaignData.description || "",
        channel: campaignData.channel || "",
        status: campaignData.status || "",
        content: campaignData.content || ""
      })
    } else {
      // Fallback to sample data if API call fails
      const sampleCampaign = {
        id,
        name: "Welcome Message",
        description: "Initial welcome message sent to new customers",
        channel: "sms",
        status: "active",
        content: "Welcome to our service! We're excited to have you on board. Reply HELP for assistance or STOP to unsubscribe.",
      }

      setFormData({
        name: sampleCampaign.name,
        description: sampleCampaign.description,
        channel: sampleCampaign.channel,
        status: sampleCampaign.status,
        content: sampleCampaign.content
      })
    }
  }, [id, campaignData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateCampaign(id, formData)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/campaigns/${id}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Campaign</h1>
            <p className="text-muted-foreground">Update campaign details and content</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Basic information about your campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter campaign description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="channel">Channel</Label>
                    <Select
                      value={formData.channel}
                      onValueChange={(value) => handleSelectChange("channel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="voice">Voice</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="rcs">RCS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Content</CardTitle>
                <CardDescription>Message content to be sent to recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="content">Message Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Enter message content"
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can use variables like {"{name}"}, {"{date}"}, etc. which will be replaced with actual values when sent.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
