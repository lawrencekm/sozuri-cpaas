"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Edit, MoreHorizontal, Plus, Search, Trash, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface Agent {
  id: string
  name: string
  email: string
  role: 'admin' | 'supervisor' | 'agent'
  status: 'online' | 'offline' | 'away'
  avatar?: string
  activeChats: number
  totalChats: number
  avgResponseTime: string
  skills: string[]
}

// Mock data for agents
const mockAgents: Agent[] = [
  {
    id: 'agent1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'admin',
    status: 'online',
    avatar: '/avatars/sarah.png',
    activeChats: 2,
    totalChats: 1250,
    avgResponseTime: '45s',
    skills: ['Technical Support', 'Billing', 'Returns']
  },
  {
    id: 'agent2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    role: 'supervisor',
    status: 'online',
    avatar: '/avatars/michael.png',
    activeChats: 1,
    totalChats: 980,
    avgResponseTime: '32s',
    skills: ['Sales', 'Product Information']
  },
  {
    id: 'agent3',
    name: 'Jessica Williams',
    email: 'jessica@example.com',
    role: 'agent',
    status: 'away',
    avatar: '/avatars/jessica.png',
    activeChats: 0,
    totalChats: 750,
    avgResponseTime: '50s',
    skills: ['Customer Support', 'Shipping', 'Returns']
  },
  {
    id: 'agent4',
    name: 'David Rodriguez',
    email: 'david@example.com',
    role: 'agent',
    status: 'offline',
    activeChats: 0,
    totalChats: 520,
    avgResponseTime: '38s',
    skills: ['Technical Support', 'Product Information']
  }
]

export default function LiveChatAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddAgentDialogOpen, setIsAddAgentDialogOpen] = useState(false)

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent => {
    const query = searchQuery.toLowerCase()
    return (
      agent.name.toLowerCase().includes(query) ||
      agent.email.toLowerCase().includes(query) ||
      agent.role.toLowerCase().includes(query) ||
      agent.skills.some(skill => skill.toLowerCase().includes(query))
    )
  })

  const handleAddAgent = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this to your API

    // Close the dialog
    setIsAddAgentDialogOpen(false)
  }

  const handleDeleteAgent = (agentId: string) => {
    // In a real app, you would send this to your API
    setAgents(agents.filter(agent => agent.id !== agentId))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/chat/live">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Chat Agents</h1>
              <p className="text-muted-foreground">Manage your support team members</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isAddAgentDialogOpen} onOpenChange={setIsAddAgentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" /> Add Agent
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Agent</DialogTitle>
                  <DialogDescription>
                    Invite a new agent to your live chat support team.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddAgent}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter agent name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter agent email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="skill-technical" />
                          <Label htmlFor="skill-technical">Technical Support</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="skill-billing" />
                          <Label htmlFor="skill-billing">Billing</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="skill-sales" />
                          <Label htmlFor="skill-sales">Sales</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="skill-returns" />
                          <Label htmlFor="skill-returns">Returns</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddAgentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Agent</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Management</CardTitle>
            <CardDescription>View and manage your live chat support agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Active Chats</TableHead>
                    <TableHead>Total Chats</TableHead>
                    <TableHead>Avg. Response</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.length > 0 ? (
                    filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={agent.avatar} />
                              <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{agent.name}</div>
                              <div className="text-xs text-muted-foreground">{agent.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {agent.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                agent.status === 'online' ? 'bg-green-500' :
                                agent.status === 'away' ? 'bg-yellow-500' : 'bg-gray-300'
                              }`}
                            />
                            <span className="capitalize">{agent.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{agent.activeChats}</TableCell>
                        <TableCell>{agent.totalChats}</TableCell>
                        <TableCell>{agent.avgResponseTime}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {agent.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {agent.skills.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{agent.skills.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Check className="mr-2 h-4 w-4" /> Set as {agent.status === 'online' ? 'Away' : 'Online'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteAgent(agent.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-muted-foreground">No agents found</p>
                          <Button
                            variant="outline"
                            className="mt-2"
                            onClick={() => setSearchQuery('')}
                          >
                            Clear search
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agent Settings</CardTitle>
            <CardDescription>Configure global settings for all agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-assignment">Automatic Chat Assignment</Label>
                <Switch id="auto-assignment" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">Automatically assign incoming chats to available agents.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-chats">Maximum Concurrent Chats per Agent</Label>
              <Input id="max-chats" type="number" min="1" max="10" defaultValue="3" />
              <p className="text-xs text-muted-foreground">Maximum number of chats an agent can handle simultaneously.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="offline-notification">Agent Offline Notification</Label>
                <Switch id="offline-notification" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground">Notify administrators when agents go offline during their shift.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}
