"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, FileText, MessageCircle, MessageSquare, Save, Send, Tag, Upload, Users } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCampaigns } from "@/hooks/use-api"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelect = (template: any) => {
    onSelect(template)
    setOpen(false)
  }

  // SMS templates from the unified templates system - filtered for SMS channel only
  const smsTemplates = [
    {
      id: "builtin-1",
      name: "Welcome Message",
      content: "Welcome to {{company}}! We're excited to have you join us. Your account is now active and ready to use.",
      type: "Transactional",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-2",
      name: "Appointment Reminder",
      content: "Hi {{name}}, this is a reminder that your appointment is scheduled for {{date}} at {{time}}. Please arrive 15 minutes early.",
      type: "Notification",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-3",
      name: "Order Confirmation",
      content: "Thank you for your order! Your order #{{order_id}} has been confirmed and will be shipped on {{ship_date}}. Track your order at {{tracking_url}}",
      type: "Transactional",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-4",
      name: "Promotional Offer",
      content: "🎉 Special offer just for you, {{name}}! Use code {{promo_code}} to get {{discount}}% off your next purchase. Valid until {{expiry_date}}. Shop now!",
      type: "Marketing",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-5",
      name: "Payment Confirmation",
      content: "Payment received! Thank you for your payment of {{amount}} for {{service}}. Your receipt has been sent to {{email}}. Reference: {{ref_number}}",
      type: "Transactional",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-6",
      name: "Event Reminder",
      content: "Don't forget! The {{event_name}} is happening on {{date}} at {{time}}. We look forward to seeing you there!",
      type: "Reminder",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-7",
      name: "Delivery Notification",
      content: "Great news! Your order #{{order_id}} has been delivered to {{address}}. Thank you for choosing {{company}}!",
      type: "Notification",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-8",
      name: "Password Reset",
      content: "Your password reset code is {{reset_code}}. This code will expire in 10 minutes. If you didn't request this, please ignore.",
      type: "Transactional",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-9",
      name: "Survey Request",
      content: "Hi {{name}}, we'd love your feedback! Please take 2 minutes to rate your recent experience: {{survey_link}}",
      type: "Marketing",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-10",
      name: "Account Verification",
      content: "Welcome to {{company}}! Your verification code is {{verification_code}}. Enter this code to complete your account setup.",
      type: "Transactional",
      channel: "sms",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    }
  ]

  // Filter templates based on search query
  const filteredTemplates = smsTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.type.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" /> Choose Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select SMS Template</DialogTitle>
          <DialogDescription>Choose a template for your SMS campaign (SMS templates only)</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4"
            />
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredTemplates.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No templates found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery ? "Try adjusting your search terms" : "No SMS templates available"}
                  </p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
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
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="mt-4">
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
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<any[]>([])
  const [segments, setSegments] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [lists, setLists] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSelect = (audience: any) => {
    onSelect(audience)
    setOpen(false)
  }

  // Fetch audience data when dialog opens
  const fetchAudienceData = async () => {
    if (!open) return
    
    try {
      setIsLoading(true)
      const [contactsRes, segmentsRes, groupsRes, listsRes] = await Promise.all([
        fetch('/api/v1/contacts'),
        fetch('/api/v1/segments'),
        fetch('/api/v1/groups'),
        fetch('/api/v1/lists')
      ])
      
      const contactsData = contactsRes.ok ? await contactsRes.json() : { contacts: [] }
      const segmentsData = segmentsRes.ok ? await segmentsRes.json() : { segments: [] }
      const groupsData = groupsRes.ok ? await groupsRes.json() : { groups: [] }
      const listsData = listsRes.ok ? await listsRes.json() : { lists: [] }
      
      setContacts(contactsData.contacts || [])
      setSegments(segmentsData.segments || [])
      setGroups(groupsData.groups || [])
      setLists(listsData.lists?.filter((list: any) => list.type === 'sms') || [])
    } catch (error) {
      console.error('Failed to fetch audience data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Create audience options from real data
  const audienceOptions = [
    {
      id: 'all-contacts',
      name: 'All Contacts',
      count: contacts.length,
      description: 'All contacts in your database',
      type: 'contacts',
      tags: ['all']
    },
    ...segments.map((segment: any) => ({
      id: `segment-${segment.id}`,
      name: segment.name,
      count: segment.contactCount || 0,
      description: segment.description || 'Dynamic segment based on rules',
      type: 'segment',
      tags: ['segment', 'dynamic']
    })),
    ...groups.map((group: any) => ({
      id: `group-${group.id}`,
      name: group.name,
      count: group.memberCount || 0,
      description: group.description || 'Static contact group',
      type: 'group',
      tags: group.tags || ['group', 'static']
    })),
    ...lists.map((list: any) => ({
      id: `list-${list.id}`,
      name: list.name,
      count: list.subscriberCount || 0,
      description: list.description || 'SMS distribution list',
      type: 'list',
      tags: ['list', 'sms', list.frequency || 'custom']
    }))
  ]

  // Filter audience options based on search
  const filteredAudience = audienceOptions.filter((audience) => {
    const matchesSearch = searchQuery === "" ||
      audience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audience.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch
  })

  // Get type color for badges
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contacts': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'segment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'group': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'list': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) fetchAudienceData()
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" /> Select Audience
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Select SMS Audience</DialogTitle>
          <DialogDescription>Choose contacts, segments, groups, or lists for your SMS campaign</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search audience by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-4"
            />
          </div>
          <ScrollArea className="h-[400px] pr-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading audience data...</span>
              </div>
            ) : filteredAudience.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No audience found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? "Try adjusting your search terms" : "No audience data available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {filteredAudience.map((audience) => (
                  <Card
                    key={audience.id}
                    className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                    onClick={() => handleSelect(audience)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{audience.name}</CardTitle>
                        <Badge variant="secondary" className={getTypeColor(audience.type)}>
                          {audience.type.toUpperCase()}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">{audience.count} recipients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-2">{audience.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {audience.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {audience.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{audience.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default function Page() {
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
  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useCampaigns();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCampaignData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCampaignSelect = (value: string) => {
    setCampaignData((prev) => ({
      ...prev,
      name: value,
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
                  <Select onValueChange={handleCampaignSelect} value={campaignData.name}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingCampaigns ? "Loading campaigns..." : "Select or create campaign"} />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.length > 0 ? (
                        campaigns.map((campaign: any) => (
                          <SelectItem key={campaign.id} value={campaign.name}>{campaign.name}</SelectItem>
                        ))
                      ) : (
                        <SelectItem value="__new__">Create new campaign</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {campaignData.name === "__new__" && (
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter new campaign name"
                      value={campaignData.name === "__new__" ? "" : campaignData.name}
                      onChange={handleInputChange}
                    />
                  )}
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
