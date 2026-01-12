"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { useCampaignTemplates, useCreateCampaignTemplate, useDeleteCampaignTemplate, useUpdateCampaignTemplate, useCampaignAutomations, useCreateCampaignAutomation, useDeleteCampaignAutomation, useUpdateCampaignAutomation } from "@/hooks/use-api"
import { projectsAPI, campaignsAPI, Project as ApiProject, Campaign as ApiCampaign } from "@/lib/api"

// New Campaign Dialog
function NewCampaignDialog() {
  const router = useRouter()
  const { id: projectId } = useParams()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    channel: "",
  })
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, channel: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectId) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/v1/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          name: formData.name,
          description: formData.description,
          channel: formData.channel, // will be mapped to `type` on the server
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to create campaign')
      }
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
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

// --- Campaign Template Dialog ---
function NewTemplateDialog({ onCreate }: { onCreate: (template: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    channel: "",
    content: "",
    type: "marketing",
    variables: "",
  })
  const [open, setOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, channel: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreate({ ...formData, variables: formData.variables.split(",").map(v => v.trim()) })
    setOpen(false)
    setFormData({ name: "", channel: "", content: "", type: "marketing", variables: "" })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> New Template</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Campaign Template</DialogTitle>
            <DialogDescription>Save a reusable template for future campaigns.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Template Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="channel">Channel</Label>
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
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="transactional">Transactional</SelectItem>
                  <SelectItem value="notification">Notification</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="variables">Variables (comma separated)</Label>
              <Input id="variables" name="variables" value={formData.variables} onChange={handleChange} placeholder="e.g. firstName, orderId" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Enter content"
                className="border rounded p-2 min-h-[80px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!formData.name || !formData.channel || !formData.content}>Save Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

import { CampaignCard } from "@/components/dashboard/campaign-card"

// --- Templates Tab Section ---
function TemplatesTab() {
  const { id: projectId } = useParams();
  const { data: templates, isLoading, error } = useCampaignTemplates(projectId as string);
  const createTemplate = useCreateCampaignTemplate();
  const deleteTemplate = useDeleteCampaignTemplate();
  const updateTemplate = useUpdateCampaignTemplate();

  const handleCreate = (template: any) => {
    createTemplate.mutate({ ...template, project_id: projectId });
  };

  const handleDelete = (id: string) => {
    deleteTemplate.mutate(id);
  };

  const handleUpdate = (id: string, updatedData: any) => {
    updateTemplate.mutate({ id, ...updatedData });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Campaign Templates</h2>
        <NewTemplateDialog onCreate={handleCreate} />
      </div>
      {isLoading ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">Loading templates...</CardContent></Card>
      ) : error ? (
        <Card><CardContent className="p-6 text-center text-red-600">Failed to load templates.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(!templates || templates.length === 0) ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No templates yet.</CardContent></Card>
          ) : (
            templates.map((tpl: any) => (
              <Card key={tpl.id}>
                <CardHeader>
                  <CardTitle>{tpl.name}</CardTitle>
                  <CardDescription>{tpl.type.charAt(0).toUpperCase() + tpl.type.slice(1)} template for {tpl.channel.toUpperCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 text-sm text-muted-foreground">Variables: {tpl.variables.join(", ") || "None"}</div>
                  <div className="bg-muted rounded p-2 text-sm whitespace-pre-line">{tpl.content}</div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                  <span>Last updated {tpl.updated_at}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdate(tpl.id, { name: tpl.name + " (Updated)" })}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(tpl.id)}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// --- Automations Tab Section ---
function AutomationsTab() {
  const { id: projectId } = useParams();
  const { data: automations, isLoading, error } = useCampaignAutomations(projectId as string);
  const createAutomation = useCreateCampaignAutomation();
  const deleteAutomation = useDeleteCampaignAutomation();
  const updateAutomation = useUpdateCampaignAutomation();
  const [form, setForm] = useState({
    name: "",
    description: "",
    trigger_type: "webhook",
    trigger_config: {},
    action_type: "send_sms",
    action_config: {},
    is_active: true,
  });
  const [open, setOpen] = useState(false);

  // No need for templates since we're using the new automation schema

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleTriggerTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, trigger_type: value }));
  };

  const handleActionTypeChange = (value: string) => {
    setForm((prev) => ({ ...prev, action_type: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAutomation.mutate({ ...form, projectId: projectId as string });
    setOpen(false);
    setForm({ name: "", description: "", trigger_type: "webhook", trigger_config: {}, action_type: "send_sms", action_config: {}, is_active: true });
  };

  const handleDelete = (id: string) => {
    deleteAutomation.mutate(id);
  };

  const handleUpdate = (id: string, updatedData: any) => {
    updateAutomation.mutate({ id, ...updatedData });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Automations & Triggers</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline"><Plus className="mr-2 h-4 w-4" /> New Automation</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Automation</DialogTitle>
                <DialogDescription>Set up a trigger to launch a campaign template automatically.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Automation Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" name="description" value={form.description} onChange={handleChange} placeholder="What does this automation do?" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="trigger_type">Trigger Type</Label>
                  <Select value={form.trigger_type} onValueChange={handleTriggerTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="action_type">Action Type</Label>
                  <Select value={form.action_type} onValueChange={handleActionTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send_sms">Send SMS</SelectItem>
                      <SelectItem value="send_whatsapp">Send WhatsApp</SelectItem>
                      <SelectItem value="update_contact">Update Contact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!form.name || !form.trigger_type || !form.action_type}>Save Automation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? (
        <Card><CardContent className="p-6 text-center text-muted-foreground">Loading automations...</CardContent></Card>
      ) : error ? (
        <Card><CardContent className="p-6 text-center text-red-600">Failed to load automations.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {(!automations || automations.length === 0) ? (
            <Card><CardContent className="p-6 text-center text-muted-foreground">No automations yet.</CardContent></Card>
          ) : (
            automations.map((auto: any) => (
              <Card key={auto.id}>
                <CardHeader>
                  <CardTitle>{auto.name}</CardTitle>
                  <CardDescription>
                    {auto.description || `${auto.triggerType} trigger → ${auto.actionType} action`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={auto.isActive ? "text-green-600" : "text-red-600"}>{auto.isActive ? "Active" : "Inactive"}</span>
                    {auto.executionCount > 0 && (
                      <span className="text-muted-foreground">• {auto.executionCount} executions</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between text-xs text-muted-foreground">
                  <span>Updated {new Date(auto.updatedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleUpdate(auto.id, { name: auto.name + " (Updated)" })}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(auto.id)}>Delete</Button>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
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

  const [project, setProject] = useState<ApiProject | null>(null)
  const [campaigns, setCampaigns] = useState<ApiCampaign[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const [p, cs] = await Promise.all([
          projectsAPI.getById(id as string),
          campaignsAPI.getAll({ projectId: id as string })
        ])
        setProject(p)
        setCampaigns(cs || [])
      } catch (e: any) {
        setError(e?.message || 'Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id])

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card><CardContent className="p-6">Loading project...</CardContent></Card>
      </DashboardLayout>
    )
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-red-600 text-sm">{error || 'Project not found'}</div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/projects")}>Back to Projects</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const projectStats = {
    campaigns: project?._count?.campaigns ?? 0,
    messages: project?._count?.messageLogs ?? 0,
    engagement: project?.successRate ?? 0,
    audience: project?.balance ? project.balance.toString() : "-",
  }

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
            value={projectStats.campaigns.toString()}
            icon={<Layers className="h-5 w-5" />}
          />
          <MetricCard title="Total Messages" value={projectStats.messages.toString()} icon={<MessageCircle className="h-5 w-5" />} />
          <MetricCard
            title="Engagement Rate"
            value={`${projectStats.engagement || 0}%`}
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <MetricCard title="Audience Size" value={projectStats.audience} icon={<Users className="h-5 w-5" />} />
        </div>

        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
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
          <TabsContent value="templates" className="pt-4">
            <TemplatesTab />
          </TabsContent>
          <TabsContent value="automations" className="pt-4">
            <AutomationsTab />
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
