"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, FileText, MessageSquare, Save, Send, Upload, Users } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Template selection dialog
function TemplateSelectionDialog({ onSelect }: { onSelect: (template: any) => void }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (template: any) => {
    onSelect(template)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Choose Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Message Template</DialogTitle>
          <DialogDescription>Choose a template for your SMS campaign</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                id: 1,
                name: "Welcome Message",
                content: "Welcome to {{company}}! We're excited to have you join us.",
                type: "Transactional",
              },
              {
                id: 2,
                name: "Appointment Reminder",
                content: "Reminder: Your appointment is scheduled for {{date}} at {{time}}.",
                type: "Notification",
              },
              {
                id: 3,
                name: "Order Confirmation",
                content: "Your order #{{order_id}} has been confirmed and will be shipped on {{ship_date}}.",
                type: "Transactional",
              },
              {
                id: 4,
                name: "Promotional Offer",
                content: "Special offer for you! Use code {{promo_code}} to get {{discount}}% off your next purchase.",
                type: "Marketing",
              },
            ].map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                onClick={() => handleSelect(template)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs">{template.type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{template.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Audience selection dialog
function AudienceSelectionDialog({ onSelect }: { onSelect: (audience: any) => void }) {
  const [open, setOpen] = useState(false)

  const handleSelect = (audience: any) => {
    onSelect(audience)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" /> Select Audience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Audience</DialogTitle>
          <DialogDescription>Choose the recipients for your SMS campaign</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                id: 1,
                name: "All Customers",
                count: 1245,
                description: "All active customers in your database",
              },
              {
                id: 2,
                name: "New Customers",
                count: 328,
                description: "Customers who joined in the last 30 days",
              },
              {
                id: 3,
                name: "High Value Customers",
                count: 156,
                description: "Customers with lifetime value over $500",
              },
              {
                id: 4,
                name: "Inactive Customers",
                count: 412,
                description: "Customers who haven't made a purchase in 90+ days",
              },
            ].map((audience) => (
              <Card
                key={audience.id}
                className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                onClick={() => handleSelect(audience)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{audience.name}</CardTitle>
                  <CardDescription className="text-xs">{audience.count} recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{audience.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function BulkSmsPage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState({
    name: "",
    message: "",
    scheduledDate: "",
    scheduledTime: "",
    sendingOption: "now",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedAudience, setSelectedAudience] = useState<any>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCampaignData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSendingOptionChange = (value: string) => {
    setCampaignData((prev) => ({
      ...prev,
      sendingOption: value,
    }))
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template)
    setCampaignData((prev) => ({
      ...prev,
      message: template.content,
    }))
  }

  const handleAudienceSelect = (audience: any) => {
    setSelectedAudience(audience)
  }

  const handleSaveDraft = () => {
    // In a real app, you would save this to your backend
    console.log("Saving draft:", { ...campaignData, template: selectedTemplate, audience: selectedAudience })
    router.push("/dashboard/messaging/sms")
  }

  const handleSendCampaign = () => {
    // In a real app, you would send this to your backend
    console.log("Sending campaign:", { ...campaignData, template: selectedTemplate, audience: selectedAudience })
    router.push("/dashboard/messaging/sms")
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center gap-2" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/sms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Bulk SMS Campaign</h1>
            <p className="text-muted-foreground">Send SMS messages to multiple recipients at once</p>
          </div>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
          <motion.div className="md:col-span-2 space-y-6" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Details</CardTitle>
                <CardDescription>Set up your SMS campaign information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter campaign name"
                    value={campaignData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="message">Message Content</Label>
                    <span className="text-xs text-muted-foreground">{campaignData.message.length}/160 characters</span>
                  </div>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Type your message here"
                    value={campaignData.message}
                    onChange={handleInputChange}
                    className="min-h-[120px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Sending Options</Label>
                  <RadioGroup value={campaignData.sendingOption} onValueChange={handleSendingOptionChange}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">Send immediately</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled">Schedule for later</Label>
                    </div>
                  </RadioGroup>
                </div>
                {campaignData.sendingOption === "scheduled" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="scheduledDate">Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="scheduledDate"
                          name="scheduledDate"
                          type="date"
                          className="pl-8"
                          value={campaignData.scheduledDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="scheduledTime">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="scheduledTime"
                          name="scheduledTime"
                          type="time"
                          className="pl-8"
                          value={campaignData.scheduledTime}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview how your message will appear to recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">SOZURI</p>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-sm">{campaignData.message || "Your message preview will appear here"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Delivered • Now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="space-y-6" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>Configure your campaign options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Message Template</Label>
                  {selectedTemplate ? (
                    <div className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{selectedTemplate.name}</p>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(null)}>
                          Change
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{selectedTemplate.type}</p>
                    </div>
                  ) : (
                    <TemplateSelectionDialog onSelect={handleTemplateSelect} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Audience</Label>
                  {selectedAudience ? (
                    <div className="rounded-md border p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{selectedAudience.name}</p>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedAudience(null)}>
                          Change
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{selectedAudience.count} recipients</p>
                    </div>
                  ) : (
                    <AudienceSelectionDialog onSelect={handleAudienceSelect} />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Import Contacts</Label>
                  <div className="rounded-md border border-dashed p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="mt-2 text-sm font-medium">Upload Contact List</p>
                    <p className="text-xs text-muted-foreground">
                      Drag and drop a CSV or Excel file, or click to browse
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse Files
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Summary</CardTitle>
                <CardDescription>Review your campaign details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Campaign Name</p>
                  <p className="text-sm font-medium">{campaignData.name || "Untitled Campaign"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Recipients</p>
                  <p className="text-sm font-medium">
                    {selectedAudience ? `${selectedAudience.count} contacts` : "No audience selected"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Sending Time</p>
                  <p className="text-sm font-medium">
                    {campaignData.sendingOption === "now"
                      ? "Immediately after sending"
                      : campaignData.scheduledDate && campaignData.scheduledTime
                        ? `${campaignData.scheduledDate} at ${campaignData.scheduledTime}`
                        : "Not scheduled"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full"
                  onClick={handleSendCampaign}
                  disabled={!campaignData.message || !selectedAudience}
                >
                  <Send className="mr-2 h-4 w-4" /> Send Campaign
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" /> Save as Draft
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
