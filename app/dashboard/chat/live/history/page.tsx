"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Download, Eye, Filter, MessageCircle, MoreHorizontal, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

interface ChatHistory {
  id: string
  customer: {
    name: string
    email: string
    avatar?: string
  }
  agent: {
    name: string
    avatar?: string
  }
  startTime: string
  duration: string
  status: 'resolved' | 'abandoned' | 'transferred'
  rating?: number
  tags: string[]
}

// Mock data for chat history
const mockChatHistory: ChatHistory[] = [
  {
    id: 'chat1',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/avatars/john.png'
    },
    agent: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.png'
    },
    startTime: '2023-07-01 10:30 AM',
    duration: '12m 45s',
    status: 'resolved',
    rating: 5,
    tags: ['billing', 'subscription']
  },
  {
    id: 'chat2',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    agent: {
      name: 'Michael Chen',
      avatar: '/avatars/michael.png'
    },
    startTime: '2023-07-01 11:15 AM',
    duration: '8m 20s',
    status: 'resolved',
    rating: 4,
    tags: ['technical', 'login']
  },
  {
    id: 'chat3',
    customer: {
      name: 'Robert Johnson',
      email: 'robert@example.com',
      avatar: '/avatars/robert.png'
    },
    agent: {
      name: 'Jessica Williams'
    },
    startTime: '2023-07-01 01:45 PM',
    duration: '5m 10s',
    status: 'abandoned',
    tags: ['product', 'pricing']
  },
  {
    id: 'chat4',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com'
    },
    agent: {
      name: 'David Rodriguez',
      avatar: '/avatars/david.png'
    },
    startTime: '2023-07-01 03:20 PM',
    duration: '15m 35s',
    status: 'transferred',
    rating: 3,
    tags: ['returns', 'shipping']
  },
  {
    id: 'chat5',
    customer: {
      name: 'Michael Wilson',
      email: 'michael@example.com',
      avatar: '/avatars/michael-w.png'
    },
    agent: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.png'
    },
    startTime: '2023-07-01 04:10 PM',
    duration: '9m 15s',
    status: 'resolved',
    rating: 5,
    tags: ['account', 'password']
  }
]

export default function LiveChatHistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('7d')
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
  // Filter chat history based on search query and status filter
  const filteredHistory = mockChatHistory.filter(chat => {
    const matchesSearch = 
      chat.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || chat.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
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
              <h1 className="text-3xl font-bold tracking-tight">Chat History</h1>
              <p className="text-muted-foreground">View past chat conversations</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chat History</CardTitle>
            <CardDescription>View and search past chat conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by customer, agent, or tags..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                    <SelectItem value="transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> More Filters
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length > 0 ? (
                      filteredHistory.map((chat) => (
                        <TableRow key={chat.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={chat.customer.avatar} />
                                <AvatarFallback>{chat.customer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{chat.customer.name}</div>
                                <div className="text-xs text-muted-foreground">{chat.customer.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={chat.agent.avatar} />
                                <AvatarFallback>{chat.agent.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{chat.agent.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{chat.startTime}</TableCell>
                          <TableCell>{chat.duration}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                chat.status === 'resolved' ? 'default' : 
                                chat.status === 'abandoned' ? 'destructive' : 'secondary'
                              }
                              className="capitalize"
                            >
                              {chat.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {chat.rating ? (
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div 
                                    key={i}
                                    className={`h-3 w-3 rounded-full ${
                                      i < chat.rating! ? 'bg-yellow-400' : 'bg-muted'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {chat.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs capitalize">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog open={isViewDialogOpen && selectedChat?.id === chat.id} onOpenChange={(open) => {
                              setIsViewDialogOpen(open)
                              if (!open) setSelectedChat(null)
                            }}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem onClick={() => setSelectedChat(chat)}>
                                      <Eye className="mr-2 h-4 w-4" /> View Transcript
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" /> Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <DialogContent className="max-w-3xl">
                                <DialogHeader>
                                  <DialogTitle>Chat Transcript</DialogTitle>
                                  <DialogDescription>
                                    Conversation between {chat.customer.name} and {chat.agent.name} on {chat.startTime}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4 border rounded-md">
                                  <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-muted p-3 text-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.customer.name}</div>
                                      <div className="text-sm">Hello, I need help with my recent order.</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:30 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-lg bg-primary p-3 text-primary-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.agent.name}</div>
                                      <div className="text-sm">Hi {chat.customer.name}, I'd be happy to help you with your order. Could you please provide your order number?</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:32 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-muted p-3 text-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.customer.name}</div>
                                      <div className="text-sm">Sure, it's #12345.</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:33 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-lg bg-primary p-3 text-primary-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.agent.name}</div>
                                      <div className="text-sm">Thank you. I can see your order was shipped yesterday. It should arrive within 2-3 business days.</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:35 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-muted p-3 text-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.customer.name}</div>
                                      <div className="text-sm">Great, thank you for the information!</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:36 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <div className="max-w-[80%] rounded-lg bg-primary p-3 text-primary-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.agent.name}</div>
                                      <div className="text-sm">You're welcome! Is there anything else I can help you with today?</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:37 AM</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-start">
                                    <div className="max-w-[80%] rounded-lg bg-muted p-3 text-foreground">
                                      <div className="text-xs font-medium mb-1">{chat.customer.name}</div>
                                      <div className="text-sm">No, that's all. Thanks for your help!</div>
                                      <div className="text-xs mt-1 opacity-70 text-right">10:38 AM</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                  <div>
                                    <span className="text-sm font-medium">Status: </span>
                                    <Badge 
                                      variant={
                                        chat.status === 'resolved' ? 'default' : 
                                        chat.status === 'abandoned' ? 'destructive' : 'secondary'
                                      }
                                      className="capitalize"
                                    >
                                      {chat.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Duration: </span>
                                    <span>{chat.duration}</span>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium">Rating: </span>
                                    {chat.rating ? (
                                      <div className="inline-flex items-center">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <div 
                                            key={i}
                                            className={`h-3 w-3 rounded-full ${
                                              i < chat.rating! ? 'bg-yellow-400' : 'bg-muted'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">N/A</span>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center">
                            <MessageCircle className="h-8 w-8 text-muted-foreground/50" />
                            <p className="mt-2 text-muted-foreground">No chat history found</p>
                            <Button 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => {
                                setSearchQuery('')
                                setStatusFilter('all')
                              }}
                            >
                              Clear filters
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
