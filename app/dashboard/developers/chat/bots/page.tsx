"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, Code, Copy, Check } from "lucide-react"

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

export default function ChatbotApiDocumentationPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Chatbot API Documentation</h1>
          <p className="text-muted-foreground">
            Integrate AI-powered chatbots into your applications
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with Chatbot API</CardTitle>
                <CardDescription>Learn how to integrate AI-powered chatbots into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    SOZURI Connect's Chatbot API allows you to add intelligent, conversational AI to your websites and applications.
                    Our chatbots can handle common customer inquiries, qualify leads, and provide 24/7 support.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        1
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Create a chatbot</h3>
                        <p className="text-sm text-muted-foreground">
                          Build a chatbot in the{" "}
                          <Link href="/dashboard/chat/bots" className="text-primary underline">
                            Chatbots
                          </Link>{" "}
                          section of your dashboard.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        2
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Configure your chatbot</h3>
                        <p className="text-sm text-muted-foreground">
                          Train your chatbot with knowledge base articles, FAQs, and custom responses.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        3
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Integrate with your application</h3>
                        <p className="text-sm text-muted-foreground">
                          Add the chatbot to your website using our JavaScript widget or integrate via our API.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
                <CardDescription>Capabilities of our chatbot platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-md border p-4">
                    <h3 className="text-base font-medium">Natural Language Understanding</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Advanced NLU capabilities to understand user intent and extract entities.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h3 className="text-base font-medium">Multi-language Support</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Support for over 50 languages with automatic language detection.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h3 className="text-base font-medium">Contextual Conversations</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Maintain context throughout the conversation for more natural interactions.
                    </p>
                  </div>
                  <div className="rounded-md border p-4">
                    <h3 className="text-base font-medium">Human Handoff</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Seamless transfer to human agents when the conversation requires human intervention.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Available endpoints for the Chatbot API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Chatbot Management</h3>
                  <div className="space-y-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bots</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">List all chatbots in your account</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-700">GET</div>
                        <code className="text-sm">/v1/chat/bots/{"{bot_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Get details of a specific chatbot</p>
                    </div>
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bots</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Create a new chatbot</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-medium mt-6">Conversation Management</h3>
                  <div className="space-y-2">
                    <div className="rounded-md border p-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">POST</div>
                        <code className="text-sm">/v1/chat/bot/conversation</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Create a new conversation with a chatbot</p>
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
                        <code className="text-sm">/v1/chat/bot/conversation/{"{conversation_id}"}</code>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">Get conversation history</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/chat/bots/api">
                    View Full API Reference <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Options</CardTitle>
                <CardDescription>Ways to integrate chatbots into your applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">JavaScript Widget</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      The easiest way to add a chatbot to your website is with our JavaScript widget.
                      Simply add the following script tag to your HTML:
                    </p>
                    <CodeBlock 
                      language="HTML" 
                      code={`<!-- Add this script tag to your website -->
<script src="https://cdn.sozuri.com/bot/widget.js" data-id="YOUR_BOT_ID"></script>`} 
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">REST API</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      For more control or for integrating chatbots into mobile apps or other platforms,
                      use our REST API to create conversations and exchange messages.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">SDK Integration</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      We provide SDKs for popular programming languages to make integration easier:
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/developers/sdks/javascript">
                          <Code className="mr-2 h-4 w-4" /> JavaScript SDK
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/dashboard/developers/sdks/python">
                          <Code className="mr-2 h-4 w-4" /> Python SDK
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-6 pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Sample code for integrating chatbots</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Creating a Conversation</h3>
                    <CodeBlock 
                      language="JavaScript" 
                      code={`// Replace with your API key
const apiKey = 'YOUR_API_KEY';

// API endpoint
const url = 'https://api.sozuri.com/v1/chat/bot/conversation';

// Request data
const data = {
  bot_id: 'bot_123456789',
  user_id: 'user_987654321',
  metadata: {
    name: 'John Doe',
    email: 'john@example.com'
  }
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
.then(data => {
  console.log('Conversation created:', data);
  // Store the conversation_id for future messages
  const conversationId = data.conversation_id;
})
.catch(error => console.error('Error:', error));`} 
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Sending a Message</h3>
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
.then(data => {
  console.log('Bot response:', data);
  // Handle the bot's response
  const botMessage = data.message;
})
.catch(error => console.error('Error:', error));`} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/developers/chat/bots/examples">
                    View More Examples <ArrowRight className="ml-2 h-4 w-4" />
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
