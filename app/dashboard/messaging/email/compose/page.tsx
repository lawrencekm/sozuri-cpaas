"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Send, 
  Save, 
  Eye, 
  Users, 
  FileText, 
  Calendar,
  Clock,
  Image,
  Link,
  Type,
  Palette
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
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

export default function EmailComposePage() {
  const router = useRouter()
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    fromName: "SOZURI",
    fromEmail: "noreply@sozuri.com",
    replyTo: "",
    preheader: "",
    htmlContent: "",
    textContent: "",
    sendingOption: "now",
    scheduledDate: "",
    scheduledTime: "",
    trackOpens: true,
    trackClicks: true,
    enableUnsubscribe: true
  })

  const [selectedAudience, setSelectedAudience] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("content")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCampaignData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCampaignData(prev => ({
      ...prev,
      [name]: checked
    }))
  }

  const handleSendingOptionChange = (value: string) => {
    setCampaignData(prev => ({
      ...prev,
      sendingOption: value
    }))
  }

  const handleSaveDraft = () => {
    console.log("Saving draft:", campaignData)
    router.push("/dashboard/messaging/email")
  }

  const handleSendCampaign = () => {
    console.log("Sending campaign:", campaignData)
    router.push("/dashboard/messaging/email")
  }

  const handlePreview = () => {
    // Open preview modal or new window
    console.log("Opening preview:", campaignData)
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center gap-2" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/email")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Email Campaign</h1>
            <p className="text-muted-foreground">Design and send professional email campaigns</p>
          </div>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-3" variants={staggerContainer}>
          {/* Main Content */}
          <motion.div className="md:col-span-2 space-y-6" variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Setup</CardTitle>
                <CardDescription>Configure your email campaign details</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4 mt-6">
                    <div className="grid gap-4">
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
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="Enter email subject"
                          value={campaignData.subject}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="preheader">Preheader Text (Optional)</Label>
                        <Input
                          id="preheader"
                          name="preheader"
                          placeholder="Preview text that appears after subject line"
                          value={campaignData.preheader}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fromName">From Name</Label>
                          <Input
                            id="fromName"
                            name="fromName"
                            value={campaignData.fromName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="fromEmail">From Email</Label>
                          <Input
                            id="fromEmail"
                            name="fromEmail"
                            type="email"
                            value={campaignData.fromEmail}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="replyTo">Reply-To Email (Optional)</Label>
                        <Input
                          id="replyTo"
                          name="replyTo"
                          type="email"
                          placeholder="support@sozuri.com"
                          value={campaignData.replyTo}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="design" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Email Content</Label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Use Template
                          </Button>
                          <Button variant="outline" size="sm">
                            <Image className="mr-2 h-4 w-4" alt="" />
                            Add Image
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="htmlContent">HTML Content</Label>
                          <Textarea
                            id="htmlContent"
                            name="htmlContent"
                            placeholder="Enter your HTML email content here..."
                            className="min-h-[300px] font-mono text-sm"
                            value={campaignData.htmlContent}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="textContent">Plain Text Version</Label>
                          <Textarea
                            id="textContent"
                            name="textContent"
                            placeholder="Enter plain text version for email clients that don't support HTML..."
                            className="min-h-[150px]"
                            value={campaignData.textContent}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Type className="mr-2 h-4 w-4" />
                          Text Editor
                        </Button>
                        <Button variant="outline" size="sm">
                          <Palette className="mr-2 h-4 w-4" />
                          Design Tools
                        </Button>
                        <Button variant="outline" size="sm">
                          <Link className="mr-2 h-4 w-4" />
                          Insert Link
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Track Email Opens</Label>
                          <p className="text-sm text-muted-foreground">Monitor when recipients open your emails</p>
                        </div>
                        <Switch
                          checked={campaignData.trackOpens}
                          onCheckedChange={(checked) => handleSwitchChange("trackOpens", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Track Link Clicks</Label>
                          <p className="text-sm text-muted-foreground">Monitor clicks on links in your emails</p>
                        </div>
                        <Switch
                          checked={campaignData.trackClicks}
                          onCheckedChange={(checked) => handleSwitchChange("trackClicks", checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Enable Unsubscribe Link</Label>
                          <p className="text-sm text-muted-foreground">Include unsubscribe link (required by law)</p>
                        </div>
                        <Switch
                          checked={campaignData.enableUnsubscribe}
                          onCheckedChange={(checked) => handleSwitchChange("enableUnsubscribe", checked)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedule" className="space-y-4 mt-6">
                    <div className="space-y-4">
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
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Email Preview</CardTitle>
                <CardDescription>Preview how your email will appear to recipients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-gray-50 min-h-[200px]">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{campaignData.fromName} &lt;{campaignData.fromEmail}&gt;</span>
                      <span className="text-muted-foreground">Now</span>
                    </div>
                    <div className="font-medium">{campaignData.subject || "Subject line will appear here"}</div>
                    {campaignData.preheader && (
                      <div className="text-sm text-muted-foreground">{campaignData.preheader}</div>
                    )}
                  </div>
                  <div className="bg-white rounded border p-4 min-h-[150px]">
                    {campaignData.htmlContent ? (
                      <div dangerouslySetInnerHTML={{ __html: campaignData.htmlContent }} />
                    ) : (
                      <p className="text-muted-foreground">Your email content will appear here</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div className="space-y-6" variants={fadeIn}>
            {/* Audience Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Audience</CardTitle>
                <CardDescription>Select who will receive this email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Select Audience
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Campaign Summary */}
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
                  <p className="text-sm text-muted-foreground">Subject Line</p>
                  <p className="text-sm font-medium">{campaignData.subject || "No subject"}</p>
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

                <div className="flex flex-col gap-2 pt-4">
                  <Button onClick={handlePreview} variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Email
                  </Button>
                  <Button
                    onClick={handleSendCampaign}
                    className="w-full"
                    disabled={!campaignData.name || !campaignData.subject || !selectedAudience}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Send Campaign
                  </Button>
                  <Button onClick={handleSaveDraft} variant="outline" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
