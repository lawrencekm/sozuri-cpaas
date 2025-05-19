"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Code, Copy, MessageCircle, Bot, Check, Globe } from "lucide-react"

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

export default function ChatApiDocumentationPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chat API Documentation</h1>
          <p className="text-muted-foreground">
            Integrate live chat and chatbot functionality into your applications
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="live-chat">Live Chat</TabsTrigger>
            <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Chat API</CardTitle>
                <CardDescription>Learn how to integrate chat functionality into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    SOZURI Connect's Chat API allows you to add real-time chat capabilities to your websites and applications.
                    Our API supports both live chat with human agents and AI-powered chatbots.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        1
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Create an API key</h3>
                        <p className="text-sm text-muted-foreground">
                          Generate an API key in the{" "}
                          <Link href="/dashboard/api-keys" className="text-primary underline">
                            API Keys
                          </Link>{" "}
                          section to authenticate your requests.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        2
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Choose your integration method</h3>
                        <p className="text-sm text-muted-foreground">
                          Integrate using our JavaScript widget for quick setup, or use our RESTful API for more control.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        3
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Configure your chat solution</h3>
                        <p className="text-sm text-muted-foreground">
                          Customize the appearance and behavior of your chat widget to match your brand.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Live Chat API</CardTitle>
                  </div>
                  <CardDescription>Human-powered customer support</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Connect your customers with live support agents through a customizable chat interface.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/developers/chat/live">
                      View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle>Chatbot API</CardTitle>
                  </div>
                  <CardDescription>AI-powered conversation assistants</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Automate customer interactions with intelligent chatbots that can handle common inquiries.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/developers/chat/bots">
                      View Documentation <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="live-chat" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Chat API</CardTitle>
                <CardDescription>Integrate real-time customer support into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Endpoints</h3>
                  <div className="space-y-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/live/session</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Create a new live chat session</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/live/message</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Send a message in a live chat session</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/live/session/{"{session_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Get details of a specific chat session</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/chat/live">
                    View Full Documentation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="chatbots" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot API</CardTitle>
                <CardDescription>Integrate AI-powered chatbots into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">API Endpoints</h3>
                  <div className="space-y-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bot/conversation</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Create a new chatbot conversation</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bot/message</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Send a message to a chatbot</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bot/{"{bot_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Get details of a specific chatbot</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/chat/bots">
                    View Full Documentation <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Sample code for integrating chat functionality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">JavaScript Widget Integration</h3>
                  <CodeBlock 
                    language="HTML" 
                    code={`<!-- Add this script tag to your website -->
<script src="https://cdn.sozuri.com/chat/widget.js" data-id="YOUR_CHAT_ID"></script>`} 
                  />
                  
                  <h3 className="text-lg font-medium">Sending a Message via API</h3>
                  <CodeBlock 
                    language="JavaScript" 
                    code={`// Replace with your API key
const apiKey = 'YOUR_API_KEY';

// API endpoint
const url = 'https://api.sozuri.com/v1/chat/bot/message';

// Message data
const data = {
  conversation_id: 'conv_123456789',
  message: 'Hello, I need help with my order',
  sender: 'user'
};

// Send the request
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${apiKey}\`
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));`} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
