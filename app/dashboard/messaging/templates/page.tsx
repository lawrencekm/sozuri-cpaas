"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Copy, Edit, FileText, Mail, MessageCircle, MoreHorizontal, Phone, Plus, Search, Tag, Trash2 } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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

// Channel icons mapping
const channelIcons = {
  sms: MessageCircle,
  whatsapp: MessageCircle,
  email: Mail,
  voice: Phone,
}

// Channel colors mapping
const channelColors = {
  sms: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  whatsapp: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  email: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  voice: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

// New Template Dialog
function NewTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    type: "",
    channel: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      console.error('Name is not defined')
      return
    }
    // In a real app, you would save this to your backend
    console.log("Creating template:", formData)
    setOpen(false)
    // Reset form
    setFormData({
      name: "",
      content: "",
      type: "",
      channel: "",
    })
  }

  const getCharacterLimit = () => {
    switch (formData.channel) {
      case 'sms': return 160
      case 'whatsapp': return 4096
      case 'email': return 10000
      case 'voice': return 500
      default: return 160
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription>Create a reusable message template for your campaigns</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter template name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel">Channel</Label>
              <Select value={formData.channel} onValueChange={handleSelectChange('channel')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Message Content</Label>
                <span className="text-xs text-muted-foreground">{formData.content.length}/{getCharacterLimit()} characters</span>
              </div>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Type your message here. Use {{variable}} for personalization."
                className="min-h-[120px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use variables like {'{{ name }}'}, {'{{ date }}'}, or {'{{ company }}'} for personalization.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="type">Template Type</Label>
              <Select value={formData.type} onValueChange={handleSelectChange('type')} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="customer_service">Customer Service</SelectItem>
                  <SelectItem value="alerts">Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.content || !formData.type || !formData.channel}>
              Create Template
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Template Card Component
function TemplateCard({ template }: { template: any }) {
  const router = useRouter()
  const IconComponent = channelIcons[template.channel as keyof typeof channelIcons] || MessageCircle

  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all" variant="interactive">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{template.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/messaging/templates/${template.id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Badge variant="secondary" className={channelColors[template.channel as keyof typeof channelColors]}>
            <IconComponent className="h-3 w-3 mr-1" />
            {template.channel.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" /> {template.type}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{template.content}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Last used: {template.lastUsed}</span>
          <span>{template.content.length} chars</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/messaging/templates/${template.id}`}>Edit</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/messaging/${template.channel}/bulk?template=${template.id}`}>Use Template</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function MessagingTemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedType, setSelectedType] = useState("all")

  // Built-in templates to guide users on structure and examples
  const builtInTemplates = [
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
      name: "WhatsApp Welcome",
      content: "👋 Welcome to {{company}}, {{name}}!\n\nWe're thrilled to have you on board. Here's what you can do:\n\n✅ Browse our products\n✅ Get instant support\n✅ Track your orders\n\nReply with 'HELP' for assistance anytime!",
      type: "Transactional",
      channel: "whatsapp",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-7",
      name: "Email Newsletter",
      content: "Subject: {{subject}}\n\nHi {{name}},\n\nWelcome to our newsletter! Stay updated with the latest news, offers, and insights from {{company}}.\n\nBest regards,\nThe {{company}} Team",
      type: "Marketing",
      channel: "email",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
    {
      id: "builtin-8",
      name: "Voice Call Script",
      content: "Hello {{name}}, this is a reminder call from {{company}}. Your appointment is scheduled for {{date}} at {{time}}. Please press 1 to confirm or 2 to reschedule.",
      type: "Reminder",
      channel: "voice",
      lastUsed: "Built-in template",
      isBuiltIn: true,
    },
  ]

  // Filter templates based on search, channel, and type
  const filteredTemplates = builtInTemplates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesChannel = selectedChannel === "all" || template.channel === selectedChannel
    const matchesType = selectedType === "all" || template.type.toLowerCase() === selectedType
    
    return matchesSearch && matchesChannel && matchesType
  })

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Message Templates</h1>
            <p className="text-muted-foreground">Create and manage reusable message templates across all channels</p>
          </div>
          <NewTemplateDialog />
        </motion.div>

        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" variants={fadeIn}>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedChannel} onValueChange={setSelectedChannel}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="voice">Voice</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="reminder">Reminder</SelectItem>
                <SelectItem value="customer_service">Customer Service</SelectItem>
                <SelectItem value="alerts">Alerts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Templates ({filteredTemplates.length})</TabsTrigger>
              <TabsTrigger value="recent">Recently Used</TabsTrigger>
              <TabsTrigger value="builtin">Built-in Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              {filteredTemplates.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No templates found</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {searchQuery || selectedChannel !== "all" || selectedType !== "all" 
                        ? "Try adjusting your search or filters" 
                        : "Create your first template to get started"}
                    </p>
                    <NewTemplateDialog />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.slice(0, 6).map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="builtin" className="pt-4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Built-in Template Examples</CardTitle>
                  <CardDescription>
                    These are example templates to help you understand the structure and best practices. 
                    You can duplicate and customize them for your needs.
                  </CardDescription>
                </CardHeader>
              </Card>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {builtInTemplates.filter(template => template.isBuiltIn).map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Template Variables</CardTitle>
              <CardDescription>Available personalization variables for your templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{name}}"}</p>
                  <p className="text-xs text-muted-foreground">Recipient's name</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{company}}"}</p>
                  <p className="text-xs text-muted-foreground">Your company name</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{date}}"}</p>
                  <p className="text-xs text-muted-foreground">Current or specified date</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{time}}"}</p>
                  <p className="text-xs text-muted-foreground">Time value</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{order_id}}"}</p>
                  <p className="text-xs text-muted-foreground">Order identifier</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{amount}}"}</p>
                  <p className="text-xs text-muted-foreground">Payment or order amount</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{email}}"}</p>
                  <p className="text-xs text-muted-foreground">Recipient's email address</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{phone}}"}</p>
                  <p className="text-xs text-muted-foreground">Recipient's phone number</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="font-mono text-sm font-medium">{"{{promo_code}}"}</p>
                  <p className="text-xs text-muted-foreground">Promotional code</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/messaging/templates/variables">
                  View All Variables <FileText className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with templates across different channels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/dashboard/messaging/sms">
                    <MessageCircle className="h-6 w-6" />
                    <span>SMS Templates</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/dashboard/whatsapp">
                    <MessageCircle className="h-6 w-6" />
                    <span>WhatsApp Templates</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/dashboard/messaging/email">
                    <Mail className="h-6 w-6" />
                    <span>Email Templates</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2" asChild>
                  <Link href="/dashboard/messaging/voice">
                    <Phone className="h-6 w-6" />
                    <span>Voice Templates</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}