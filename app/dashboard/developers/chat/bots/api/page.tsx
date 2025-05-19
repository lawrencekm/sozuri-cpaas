"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Copy, Check, Bot, Code } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Code Block Component
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-md bg-slate-950 text-slate-50">
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2">
        <span className="text-xs font-medium text-slate-400">{language}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400" onClick={copyToClipboard}>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export default function ChatbotApiReferencePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chatbot API Reference</h1>
          <p className="text-muted-foreground">
            Complete reference for the Chatbot API endpoints
          </p>
        </div>

        <Tabs defaultValue="bots" className="w-full">
          <TabsList>
            <TabsTrigger value="bots">Bots</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="bots" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Bots Endpoints</CardTitle>
                <CardDescription>Manage your chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">List Bots</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bots</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Returns a list of all chatbots in your account</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Parameter</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="px-4 py-2 text-sm">limit</td>
                              <td className="px-4 py-2 text-sm">integer</td>
                              <td className="px-4 py-2 text-sm">Maximum number of bots to return (default: 10, max: 100)</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 text-sm">offset</td>
                              <td className="px-4 py-2 text-sm">integer</td>
                              <td className="px-4 py-2 text-sm">Number of bots to skip (default: 0)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "bots": [
    {
      "id": "bot_123456789",
      "name": "Customer Support Bot",
      "description": "Handles common customer support inquiries",
      "created_at": "2023-05-15T10:30:00Z",
      "updated_at": "2023-06-20T14:45:00Z",
      "status": "active"
    },
    {
      "id": "bot_987654321",
      "name": "Lead Generation Bot",
      "description": "Qualifies leads and books meetings",
      "created_at": "2023-04-10T08:15:00Z",
      "updated_at": "2023-06-18T11:20:00Z",
      "status": "active"
    }
  ],
  "total": 2,
  "limit": 10,
  "offset": 0
}`} 
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Get Bot</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bots/{"{bot_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Returns details of a specific chatbot</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Parameter</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="px-4 py-2 text-sm">bot_id</td>
                              <td className="px-4 py-2 text-sm">string</td>
                              <td className="px-4 py-2 text-sm">ID of the chatbot to retrieve</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "id": "bot_123456789",
  "name": "Customer Support Bot",
  "description": "Handles common customer support inquiries",
  "created_at": "2023-05-15T10:30:00Z",
  "updated_at": "2023-06-20T14:45:00Z",
  "status": "active",
  "settings": {
    "welcome_message": "Hello! How can I help you today?",
    "fallback_message": "I'm sorry, I didn't understand that. Could you rephrase?",
    "handoff_message": "I'll connect you with a human agent shortly."
  },
  "statistics": {
    "total_conversations": 1250,
    "total_messages": 8750,
    "avg_conversation_length": 7
  }
}`} 
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Create Bot</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bots</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Creates a new chatbot</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "name": "Sales Assistant Bot",
  "description": "Helps customers with product inquiries and purchases",
  "settings": {
    "welcome_message": "Hi there! I'm your sales assistant. How can I help you today?",
    "fallback_message": "I'm not sure I understand. Could you try asking in a different way?",
    "handoff_message": "I'll connect you with a sales representative for more assistance."
  }
}`} 
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "id": "bot_456789123",
  "name": "Sales Assistant Bot",
  "description": "Helps customers with product inquiries and purchases",
  "created_at": "2023-07-01T09:45:00Z",
  "updated_at": "2023-07-01T09:45:00Z",
  "status": "active",
  "settings": {
    "welcome_message": "Hi there! I'm your sales assistant. How can I help you today?",
    "fallback_message": "I'm not sure I understand. Could you try asking in a different way?",
    "handoff_message": "I'll connect you with a sales representative for more assistance."
  }
}`} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/developers/chat/bots">
                    Back to Chatbot API <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Conversations Endpoints</CardTitle>
                <CardDescription>Manage chatbot conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Create Conversation</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bot/conversation</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Creates a new conversation with a chatbot</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "bot_id": "bot_123456789",
  "user_id": "user_987654321",
  "metadata": {
    "name": "John Doe",
    "email": "john@example.com",
    "source": "website"
  }
}`} 
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "conversation_id": "conv_123456789",
  "bot_id": "bot_123456789",
  "user_id": "user_987654321",
  "created_at": "2023-07-01T10:15:00Z",
  "status": "active",
  "metadata": {
    "name": "John Doe",
    "email": "john@example.com",
    "source": "website"
  },
  "messages": [
    {
      "id": "msg_123456789",
      "conversation_id": "conv_123456789",
      "sender": "bot",
      "message": "Hello! How can I help you today?",
      "created_at": "2023-07-01T10:15:00Z"
    }
  ]
}`} 
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Get Conversation</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bot/conversation/{"{conversation_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Returns details of a specific conversation</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Path Parameters</h4>
                      <div className="rounded-md border">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr className="bg-muted/50">
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Parameter</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Type</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="px-4 py-2 text-sm">conversation_id</td>
                              <td className="px-4 py-2 text-sm">string</td>
                              <td className="px-4 py-2 text-sm">ID of the conversation to retrieve</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages Endpoints</CardTitle>
                <CardDescription>Send and receive messages in chatbot conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Send Message</h3>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bot/message</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Sends a message to a chatbot</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "conversation_id": "conv_123456789",
  "message": "I need help with my recent order",
  "sender": "user"
}`} 
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Response</h4>
                      <CodeBlock 
                        language="JSON" 
                        code={`{
  "id": "msg_987654321",
  "conversation_id": "conv_123456789",
  "sender": "bot",
  "message": "I'd be happy to help with your order. Could you please provide your order number?",
  "created_at": "2023-07-01T10:16:00Z"
}`} 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Receive real-time notifications for chatbot events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Webhooks allow you to receive real-time notifications when events occur in your chatbot conversations.
                    You can configure webhooks in the{" "}
                    <Link href="/dashboard/webhooks" className="text-primary underline">
                      Webhooks
                    </Link>{" "}
                    section of your dashboard.
                  </p>
                  
                  <h3 className="text-lg font-medium">Available Events</h3>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Event</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">conversation.created</td>
                          <td className="px-4 py-2 text-sm">Triggered when a new conversation is created</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">message.created</td>
                          <td className="px-4 py-2 text-sm">Triggered when a new message is sent or received</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">conversation.ended</td>
                          <td className="px-4 py-2 text-sm">Triggered when a conversation is ended</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">handoff.requested</td>
                          <td className="px-4 py-2 text-sm">Triggered when a handoff to a human agent is requested</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/webhooks">
                    Configure Webhooks <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
