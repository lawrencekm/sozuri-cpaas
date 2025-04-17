"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Edit,
  Layers,
  MessageCircle,
  MoreHorizontal,
  Phone,
  Plus,
  Settings,
  Share2,
  Trash2,
  Users,
} from "lucide-react"

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
import DashboardLayout from "@/components/layout/dashboard-layout"

// New Campaign Dialog
function NewCampaignDialog() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel: "",
  })
  const [open, setOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, channel: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this to your backend
    console.log("Creating campaign:", formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>Set up a new communication campaign for this project.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
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
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your campaign"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel">Primary Channel</Label>
              <Select value={formData.channel} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="viber">Viber</SelectItem>
                  <SelectItem value="rcs">RCS</SelectItem>
                  <SelectItem value="voice">Voice</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!formData.name || !formData.channel}>
              Create Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Campaign Card Component
function CampaignCard({ campaign }: { campaign: any }) {
  const router = useRouter()
  const { id } = useParams()

  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${id}/campaigns/${campaign.id}`)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push(`/dashboard/projects/${id}/campaigns/${campaign.id}/edit`)}>
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Channel</p>
            <div className="flex items-center font-medium">
              {campaign.channel === "SMS" && <MessageCircle className="mr-1 h-3 w-3" />}
              {campaign.channel === "Voice" && <Phone className="mr-1 h-3 w-3" />}
              {campaign.channel}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Messages</p>
            <p className="font-medium">{campaign.messages}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Engagement</p>
            <p className="font-medium">{campaign.engagement}%</p>
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <Calendar className="mr-1 h-3 w-3" /> Last sent {campaign.lastSent}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => router.push(`/dashboard/projects/${id}/campaigns/${campaign.id}`)}
        >
          View Campaign
        </Button>
      </CardFooter>
    </Card>
  )
}

// Metric Card Component
function MetricCard({
  title,
  value,
  icon,
  description,
}: { title: string; value: string; icon: React.ReactNode; description?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()

  // Sample project data
  const project = {
    id: Number(id),
    name: "Customer Onboarding",
    description: "Welcome messages and setup guides for new customers",
    campaigns: 3,
    messages: "2,451",
    engagement: 76,
    updated: "2 days ago",
    type: "Transactional",
    created: "June 15, 2023",
    audience: "1,245",
  }

  // Sample campaigns data
  const campaigns = [
    {
      id: 1,
      name: "Welcome Message",
      description: "Initial welcome message sent to new customers",
      channel: "SMS",
      messages: "1,245",
      engagement: 82,
      lastSent: "Today",
    },
    {
      id: 2,
      name: "Setup Guide",
      description: "Step-by-step guide for account setup",
      channel: "WhatsApp",
      messages: "856",
      engagement: 68,
      lastSent: "Yesterday",
    },
    {
      id: 3,
      name: "Verification Call",
      description: "Automated verification call for new accounts",
      channel: "Voice",
      messages: "350",
      engagement: 95,
      lastSent: "3 days ago",
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/projects")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" /> Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" /> Share Project
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" /> Project Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <NewCampaignDialog />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Campaigns"
            value={project.campaigns.toString()}
            icon={<Layers className="h-5 w-5" />}
          />
          <MetricCard title="Total Messages" value={project.messages} icon={<MessageCircle className="h-5 w-5" />} />
          <MetricCard
            title="Engagement Rate"
            value={`${project.engagement}%`}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <MetricCard title="Audience Size" value={project.audience} icon={<Users className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="campaigns" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Analytics</CardTitle>
                <CardDescription>Performance metrics for all campaigns in this project</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Analytics Dashboard</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    View detailed performance metrics for this project
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="audience" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Audience Management</CardTitle>
                <CardDescription>Manage contacts and audience segments for this project</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Users className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Audience Segments</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create and manage audience segments for targeted messaging
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
                <CardDescription>Configure project settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-center">
                  <Settings className="h-10 w-10 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-medium">Project Configuration</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Manage project settings, integrations, and permissions
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
