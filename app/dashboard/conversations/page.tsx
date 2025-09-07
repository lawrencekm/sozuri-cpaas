"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  MessageSquare,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  User,
  Tag,
  Archive,
  Star,
  Reply,
  Forward,
  Trash2,
  Settings
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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

// Mock conversations data
const conversations = [
  {
    id: "1",
    contactName: "Sarah Johnson",
    contactEmail: "sarah@example.com",
    contactPhone: "+1234567890",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Thank you for the quick response! I'll try that solution.",
    lastMessageTime: "2024-01-20T10:30:00Z",
    channel: "email",
    status: "open",
    priority: "high",
    assignedTo: "John Doe",
    tags: ["support", "urgent"],
    unreadCount: 0,
    messageCount: 8
  },
  {
    id: "2",
    contactName: "Mike Chen",
    contactEmail: "mike@techcorp.com",
    contactPhone: "+1987654321",
    avatar: "/api/placeholder/32/32",
    lastMessage: "Can you help me with the integration setup?",
    lastMessageTime: "2024-01-20T09:15:00Z",
    channel: "sms",
    status: "pending",
    priority: "medium",
    assignedTo: "Jane Smith",
    tags: ["integration", "technical"],
    unreadCount: 2,
    messageCount: 5
  },
  {
    id: "3",
    contactName: "Emma Wilson",
    contactEmail: "emma@startup.io",
    contactPhone: "+1555123456",
    avatar: "/api/placeholder/32/32",
    lastMessage: "The new features look amazing! When will they be available?",
    lastMessageTime: "2024-01-20T08:45:00Z",
    channel: "whatsapp",
    status: "open",
    priority: "low",
    assignedTo: "Alex Brown",
    tags: ["product", "inquiry"],
    unreadCount: 1,
    messageCount: 3
  },
  {
    id: "4",
    contactName: "David Rodriguez",
    contactEmail: "david@agency.com",
    contactPhone: "+1777888999",
    avatar: "/api/placeholder/32/32",
    lastMessage: "I need to upgrade my plan. What are the options?",
    lastMessageTime: "2024-01-19T16:20:00Z",
    channel: "email",
    status: "closed",
    priority: "medium",
    assignedTo: "Sarah Lee",
    tags: ["billing", "upgrade"],
    unreadCount: 0,
    messageCount: 12
  },
  {
    id: "5",
    contactName: "Lisa Thompson",
    contactEmail: "lisa@ecommerce.com",
    contactPhone: "+1444555666",
    avatar: "/api/placeholder/32/32",
    lastMessage: "The API documentation is very helpful, thanks!",
    lastMessageTime: "2024-01-19T14:10:00Z",
    channel: "rcs",
    status: "open",
    priority: "low",
    assignedTo: "Mike Johnson",
    tags: ["api", "documentation"],
    unreadCount: 0,
    messageCount: 6
  }
]

export default function ConversationsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")

  // Filter conversations
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = searchQuery === "" || 
      conversation.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = selectedStatus === "all" || conversation.status === selectedStatus
    const matchesChannel = selectedChannel === "all" || conversation.channel === selectedChannel
    const matchesPriority = selectedPriority === "all" || conversation.priority === selectedPriority
    
    return matchesSearch && matchesStatus && matchesChannel && matchesPriority
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "closed": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email": return Mail
      case "sms": return MessageSquare
      case "whatsapp": return MessageCircle
      case "rcs": return Phone
      default: return MessageSquare
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString()
  }

  const handleConversationAction = (action: string, conversationId: string) => {
    switch (action) {
      case "view":
        router.push(`/dashboard/conversations/${conversationId}`)
        break
      case "reply":
        router.push(`/dashboard/conversations/${conversationId}?action=reply`)
        break
      case "forward":
        console.log("Forward conversation:", conversationId)
        break
      case "archive":
        console.log("Archive conversation:", conversationId)
        break
      case "delete":
        console.log("Delete conversation:", conversationId)
        break
      default:
        break
    }
  }

  // Calculate summary stats
  const openConversations = conversations.filter(c => c.status === "open").length
  const pendingConversations = conversations.filter(c => c.status === "pending").length
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0)

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
            <p className="text-muted-foreground">Unified inbox for all customer communications</p>
          </div>
          <Button onClick={() => router.push("/dashboard/conversations/routing")}>
            <Settings className="mr-2 h-4 w-4" />
            Routing Rules
          </Button>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{conversations.length}</div>
              <p className="text-xs text-muted-foreground">Total Conversations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{openConversations}</div>
              <p className="text-xs text-muted-foreground">Open</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{pendingConversations}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalUnread}</div>
              <p className="text-xs text-muted-foreground">Unread Messages</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="rcs">RCS</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Conversations List */}
        <motion.div className="space-y-4" variants={staggerContainer}>
          {filteredConversations.length === 0 ? (
            <motion.div className="text-center py-12" variants={fadeIn}>
              <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No conversations found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || selectedStatus !== "all" || selectedChannel !== "all" || selectedPriority !== "all"
                  ? "Try adjusting your search or filters"
                  : "No conversations available"
                }
              </p>
            </motion.div>
          ) : (
            filteredConversations.map((conversation) => {
              const ChannelIcon = getChannelIcon(conversation.channel)
              return (
                <motion.div key={conversation.id} variants={fadeIn}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleConversationAction("view", conversation.id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar>
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>
                              {conversation.contactName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{conversation.contactName}</h3>
                              <ChannelIcon className="h-4 w-4 text-muted-foreground" />
                              <Badge variant="secondary" className={getStatusColor(conversation.status)}>
                                {conversation.status}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(conversation.priority)}>
                                {conversation.priority}
                              </Badge>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground truncate mb-2">
                              {conversation.lastMessage}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>{conversation.assignedTo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatTime(conversation.lastMessageTime)}</span>
                              </div>
                              <span>{conversation.messageCount} messages</span>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {conversation.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleConversationAction("reply", conversation.id)
                            }}
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleConversationAction("reply", conversation.id)}>
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleConversationAction("forward", conversation.id)}>
                                <Forward className="mr-2 h-4 w-4" />
                                Forward
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleConversationAction("archive", conversation.id)}>
                                <Archive className="mr-2 h-4 w-4" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleConversationAction("delete", conversation.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
