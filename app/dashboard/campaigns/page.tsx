"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Filter, Plus, Search } from "lucide-react"
import { formatShortDate } from "@/lib/date-formatter"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import DashboardLayout from "@/components/layout/dashboard-layout"
import { useApi, useCampaigns } from "@/hooks/use-api"
import { campaignsAPI, Campaign } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

// New Campaign Dialog
function NewCampaignDialog() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel: "",
    status: "draft",
    projectId: ""
  })
  const [open, setOpen] = useState(false)
  const { data: projects } = useQuery<Array<{ id: string; name: string }>>({ 
    queryKey: ['projects'], 
    queryFn: () => fetch('/api/v1/projects').then(res => res.json()) 
  })

  const { execute: createCampaign, isLoading } = useApi<Campaign>(campaignsAPI.create, {
    successMessage: "Campaign created successfully",
    onSuccess: (campaign) => {
      setOpen(false)
      router.push(`/dashboard/projects/${formData.projectId}/campaigns/${campaign.id}`)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createCampaign(formData)
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
            <DialogDescription>Set up a new communication campaign.</DialogDescription>
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
                placeholder="Enter campaign description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select onValueChange={(value) => handleSelectChange("projectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map((project: any) => (
                    <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel">Channel</Label>
              <Select onValueChange={(value) => handleSelectChange("channel", value)}>
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
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { CampaignCard } from "@/components/dashboard/campaign-card"

export default function CampaignsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: campaignsData, isLoading, error } = useCampaigns()

  // Use sample data if API call fails or is loading
  const campaigns: Campaign[] = campaignsData ?? ([
    {
      id: "1",
      project_id: "proj_1",
      name: "Welcome Message",
      description: "Initial welcome message sent to new customers",
      channel: "sms",
      status: "active",
      created: "2023-05-15T10:30:00Z",
      updated: "2023-05-15T10:30:00Z",
      audience: {
        total: 1000,
        delivered: 850,
        failed: 50,
        opened: 700,
        clicked: 450
      }
    },
    {
      id: "2",
      project_id: "proj_1",
      name: "Appointment Reminder",
      description: "Automated appointment reminders for customers",
      channel: "whatsapp",
      status: "scheduled",
      created: "2023-05-10T14:20:00Z",
      updated: "2023-05-12T09:15:00Z",
      audience: {
        total: 500,
        delivered: 0,
        failed: 0,
        opened: 0,
        clicked: 0
      }
    },
    {
      id: "3",
      project_id: "proj_2",
      name: "Feedback Survey",
      description: "Post-service customer feedback collection",
      channel: "email",
      status: "draft",
      created: "2023-05-08T11:45:00Z",
      updated: "2023-05-08T11:45:00Z",
      audience: {
        total: 2000,
        delivered: 1950,
        failed: 50,
        opened: 1500,
        clicked: 800
      }
    },
    {
      id: "4",
      project_id: "proj_2",
      name: "Service Outage Alert",
      description: "Emergency notification for service disruptions",
      channel: "sms",
      status: "completed",
      created: "2023-05-01T08:30:00Z",
      updated: "2023-05-01T16:45:00Z",
      audience: {
        total: 5000,
        delivered: 4975,
        failed: 25,
        opened: 4800,
        clicked: 3200
      }
    },
  ] as Campaign[])

  // Filter campaigns based on search query
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">Create and manage your communication campaigns</p>
          </div>
          <NewCampaignDialog />
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search campaigns..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        <Tabs defaultValue="grid" className="w-full">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="table">Table View</TabsTrigger>
          </TabsList>
          <TabsContent value="grid" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="table" className="pt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell>{campaign.channel}</TableCell>
                        <TableCell>
                          <Badge variant={
                            campaign.status === "active" ? "default" :
                            campaign.status === "draft" ? "outline" :
                            campaign.status === "scheduled" ? "secondary" :
                            "destructive"
                          }>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatShortDate(campaign.created_at || campaign.created)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
