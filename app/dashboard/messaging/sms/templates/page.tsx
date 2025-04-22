"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Copy, Edit, FileText, MoreHorizontal, Plus, Search, Tag, Trash2 } from "lucide-react"
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

// New Template Dialog
function NewTemplateDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    type: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
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
    })
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
          <DialogDescription>Create a reusable SMS template for your campaigns</DialogDescription>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="content">Message Content</Label>
                <span className="text-xs text-muted-foreground">{formData.content.length}/160 characters</span>
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
              <Select value={formData.type} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.content || !formData.type}>
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

  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
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
              <DropdownMenuItem onClick={() => router.push(`/dashboard/messaging/sms/templates/${template.id}`)}>
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
          <Tag className="h-3 w-3" /> {template.type}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{template.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/messaging/sms/templates/${template.id}`}>Edit</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/messaging/sms/bulk?template=${template.id}`}>Use Template</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // This would be fetched from your API in a real application
  const templates = [
    {
      id: 1,
      name: "Welcome Message",
      content: "Welcome to {{company}}! We're excited to have you join us.",
      type: "Transactional",
      lastUsed: "2 days ago",
    },
    {
      id: 2,
      name: "Appointment Reminder",
      content: "Reminder: Your appointment is scheduled for {{date}} at {{time}}.",
      type: "Notification",
      lastUsed: "1 week ago",
    },
    {
      id: 3,
      name: "Order Confirmation",
      content: "Your order #{{order_id}} has been confirmed and will be shipped on {{ship_date}}.",
      type: "Transactional",
      lastUsed: "3 days ago",
    },
    {
      id: 4,
      name: "Promotional Offer",
      content: "Special offer for you! Use code {{promo_code}} to get {{discount}}% off your next purchase.",
      type: "Marketing",
      lastUsed: "5 days ago",
    },
    {
      id: 5,
      name: "Payment Confirmation",
      content: "Thank you for your payment of {{amount}}. Your receipt has been sent to your email.",
      type: "Transactional",
      lastUsed: "1 day ago",
    },
    {
      id: 6,
      name: "Event Reminder",
      content: "Don't forget! The {{event_name}} is happening on {{date}} at {{time}}. We look forward to seeing you!",
      type: "Reminder",
      lastUsed: "4 days ago",
    },
  ]

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center gap-2" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/sms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">SMS Templates</h1>
              <p className="text-muted-foreground">Create and manage reusable SMS message templates</p>
            </div>
            <NewTemplateDialog />
          </div>
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="transactional">Transactional</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="notification">Notification</SelectItem>
              <SelectItem value="reminder">Reminder</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="recent">Recently Used</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates
                  .filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="recent" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates
                  .filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .sort((a, b) => (a.lastUsed < b.lastUsed ? -1 : 1))
                  .slice(0, 3)
                  .map((template) => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites" className="pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates
                  .filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, 2)
                  .map((template) => (
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
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/messaging/sms/templates/variables">
                  View All Variables <FileText className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
