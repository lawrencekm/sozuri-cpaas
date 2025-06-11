"use client"
export const dynamic = 'force-dynamic'; // Opt out of prerendering

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Check, CheckCheck, Clock, File, Image, MoreHorizontal, PaperclipIcon, Phone, Send, Settings, User, Video } from "lucide-react"
import { formatDistanceToNow } from 'date-fns'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/layout/dashboard-layout"

import { ChatProvider, useChat } from "@/lib/contexts/chat-context"
import { formatTime } from "@/lib/date-formatter"

// Wrapper component to provide chat context
function LiveChatInboxContent() {
  const {
    conversations,
    activeConversation,
    setActiveConversation,
    conversationsLoading,
    conversationsError,
    loadConversations,
    messages,
    messagesLoading,
    messagesError,
    loadMessages,
    sendMessage,
    typingUsers,
    setTyping,
    isConnected
  } = useChat()

  const [newMessage, setNewMessage] = useState('')
  const [activeTab, setActiveTab] = useState('active')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Add this useEffect for cleanup
  useEffect(() => {
    const timeoutId = typingTimeoutRef.current; // Capture the current value
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []); // Empty dependency array for mount/unmount effect

  // Load conversations when the component mounts
  useEffect(() => {
    loadConversations(activeTab !== 'all' ? activeTab : undefined)
  }, [loadConversations, activeTab])

  // Load messages when the active conversation changes
  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.id)
    }
  }, [activeConversation, loadMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    loadConversations(value !== 'all' ? value : undefined)
  }

  // Handle sending a message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    sendMessage(activeConversation.id, newMessage)
    setNewMessage('')

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = null
    }
    setTyping(activeConversation.id, false)
    setIsTyping(false)
  }

  // Handle typing indicator
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    if (!activeConversation) return

    // Set typing indicator
    if (!isTyping && e.target.value.trim()) {
      setTyping(activeConversation.id, true)
      setIsTyping(true)
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set timeout to clear typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping(activeConversation.id, false)
      setIsTyping(false)
    }, 2000)
  }

  // Format conversation time
  const formatConversationTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch (error) {
      return timestamp
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/chat/live">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Chat Inbox</h1>
              <p className="text-muted-foreground">Manage customer conversations in real-time</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isConnected && (
              <Alert variant="destructive" className="py-1 px-2 h-9">
                <AlertDescription className="text-xs flex items-center">
                  <span className="animate-pulse mr-1">●</span> Reconnecting...
                </AlertDescription>
              </Alert>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat/live/settings">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Link>
            </Button>
          </div>
        </div>

        {conversationsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Error loading conversations: {conversationsError}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid flex-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {/* Conversation List */}
          <div className="md:col-span-1">
            <Card className="h-full flex flex-col">
              <div className="p-4 border-b">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="w-full">
                    <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
                    <TabsTrigger value="waiting" className="flex-1">Waiting</TabsTrigger>
                    <TabsTrigger value="resolved" className="flex-1">Resolved</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardContent className="flex-1 overflow-auto p-0">
                {conversationsLoading ? (
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="divide-y">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-muted/50 ${activeConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                        onClick={() => setActiveConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarImage src={conversation.user.avatar} alt={`${conversation.user.name} avatar`} />
                            <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{conversation.user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {conversation.last_message ? formatConversationTime(conversation.last_message.timestamp) : formatConversationTime(conversation.created_at)}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground truncate">
                              {conversation.last_message ? conversation.last_message.message : 'New conversation'}
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  conversation.status === 'active' ? 'default' :
                                  conversation.status === 'waiting' ? 'secondary' : 'outline'
                                }
                                className="capitalize"
                              >
                                {conversation.status}
                              </Badge>
                              {conversation.last_message && conversation.last_message.sender !== 'agent' && conversation.last_message.status !== 'read' && (
                                <div className="h-2 w-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full p-4">
                    <div className="text-center">
                      <p className="text-muted-foreground">No conversations found</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 lg:col-span-3">
            {activeConversation ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={activeConversation.user.avatar} alt={`${activeConversation.user.name} avatar`} />
                      <AvatarFallback>{activeConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{activeConversation.user.name}</div>
                      <div className="text-xs text-muted-foreground">{activeConversation.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Call customer</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Video call</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <User className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View customer profile</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Transfer Chat</DropdownMenuItem>
                        <DropdownMenuItem>Email Transcript</DropdownMenuItem>
                        <DropdownMenuItem>Block User</DropdownMenuItem>
                        <Separator />
                        <DropdownMenuItem className="text-destructive">End Chat</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {messagesError && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        Error loading messages: {messagesError}
                      </AlertDescription>
                    </Alert>
                  )}

                  {messagesLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                        >
                          <Skeleton
                            className={`h-16 w-2/3 rounded-lg ${
                              index % 2 === 0 ? 'bg-muted/50' : 'bg-primary/20'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === 'agent'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mb-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className="rounded bg-background/50 p-2 flex items-center gap-2">
                                    {attachment.type.startsWith('image/') ? (
                                      <Image className="h-4 w-4" aria-label="Image attachment" />
                                    ) : (
                                      <File className="h-4 w-4" aria-label="File attachment" />
                                    )}
                                    <span className="text-xs truncate">{attachment.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            <div className="text-sm">{message.message}</div>
                            <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
                              {formatTime(message.timestamp)}
                              {message.sender === 'agent' && (
                                <span>
                                  {message.status === 'sent' && <Clock className="h-3 w-3" />}
                                  {message.status === 'delivered' && <Check className="h-3 w-3" />}
                                  {message.status === 'read' && <CheckCheck className="h-3 w-3" />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Typing indicator */}
                      {activeConversation && typingUsers[activeConversation.id]?.length > 0 && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                            <div className="flex items-center gap-2">
                              <div className="flex space-x-1">
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                <div className="h-2 w-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '600ms' }}></div>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {activeConversation.user.name} is typing...
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Invisible div for scrolling to bottom */}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={handleTyping}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <PaperclipIcon className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Attach file</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <h3 className="text-lg font-medium">No conversation selected</h3>
                  <p className="text-muted-foreground">Select a conversation from the list to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// Export the page component with ChatProvider
export default function LiveChatInboxPage() {
  return (
    <ChatProvider>
      <LiveChatInboxContent />
    </ChatProvider>
  )
}
