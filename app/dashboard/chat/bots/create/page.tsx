"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bot, Check, Info, Plus, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateChatbotPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard/chat/bots")
    }, 1500)
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/chat/bots">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Chatbot</h1>
              <p className="text-muted-foreground">Build a new AI-powered conversation assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat/bots">Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>Creating...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Chatbot
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>General information about your chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Chatbot Name</Label>
                  <Input id="name" placeholder="e.g., Customer Support Bot" />
                  <p className="text-xs text-muted-foreground">This name will be visible to your team only.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="display-name">Display Name</Label>
                  <Input id="display-name" placeholder="e.g., Support Assistant" />
                  <p className="text-xs text-muted-foreground">This name will be shown to your customers in the chat widget.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Describe what this chatbot will be used for..." />
                  <p className="text-xs text-muted-foreground">Internal description to help your team understand the purpose of this chatbot.</p>
                </div>
                
                <div className="space-y-2">
                  <Label>Chatbot Type</Label>
                  <div className="grid gap-4 pt-2 md:grid-cols-2">
                    <div className="flex items-start space-x-4 rounded-md border p-4">
                      <Bot className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium">AI-Powered Chatbot</h3>
                          <div className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Recommended</div>
                        </div>
                        <p className="text-sm text-muted-foreground">Uses AI to understand and respond to customer inquiries.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rounded-md border p-4">
                      <Bot className="mt-0.5 h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-medium">Rule-Based Chatbot</h3>
                        <p className="text-sm text-muted-foreground">Uses predefined rules and decision trees to respond to inquiries.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Information about your business for the chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" placeholder="e.g., Acme Corporation" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" placeholder="e.g., https://www.example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Settings</CardTitle>
                <CardDescription>Configure how your chatbot interacts with users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea 
                    id="welcome-message" 
                    placeholder="e.g., Hi there! I'm your virtual assistant. How can I help you today?" 
                    defaultValue="Hi there! I'm your virtual assistant. How can I help you today?"
                  />
                  <p className="text-xs text-muted-foreground">This message is displayed when a user starts a new conversation.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fallback-message">Fallback Message</Label>
                  <Textarea 
                    id="fallback-message" 
                    placeholder="e.g., I'm sorry, I didn't understand that. Could you rephrase your question?" 
                    defaultValue="I'm sorry, I didn't understand that. Could you rephrase your question?"
                  />
                  <p className="text-xs text-muted-foreground">This message is displayed when the chatbot doesn't understand a user's message.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="handoff-enabled">Human Handoff</Label>
                    <Switch id="handoff-enabled" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow users to request to speak with a human agent.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="handoff-message">Handoff Message</Label>
                  <Textarea 
                    id="handoff-message" 
                    placeholder="e.g., I'll connect you with a human agent shortly. Please wait a moment." 
                    defaultValue="I'll connect you with a human agent shortly. Please wait a moment."
                  />
                  <p className="text-xs text-muted-foreground">This message is displayed when a user is being transferred to a human agent.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Advanced Behavior</CardTitle>
                <CardDescription>Fine-tune your chatbot's behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="proactive-enabled">Proactive Messages</Label>
                    <Switch id="proactive-enabled" />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow the chatbot to initiate conversations with users.</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="typing-indicator">Typing Indicator</Label>
                    <Switch id="typing-indicator" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Show a typing indicator while the chatbot is generating a response.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="response-time">Response Time (seconds)</Label>
                  <div className="flex items-center space-x-2">
                    <Input id="response-time" type="number" min="0" max="10" defaultValue="1" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add a slight delay before showing the chatbot's response to make it feel more natural.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Base</CardTitle>
                <CardDescription>Train your chatbot with information about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Import Knowledge</Label>
                  <div className="grid gap-4 pt-2 md:grid-cols-2">
                    <div className="flex items-start space-x-4 rounded-md border p-4">
                      <div>
                        <h3 className="font-medium">Website Crawling</h3>
                        <p className="text-sm text-muted-foreground">Import content from your website automatically.</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="mr-2 h-3 w-3" /> Add Website URL
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 rounded-md border p-4">
                      <div>
                        <h3 className="font-medium">Document Upload</h3>
                        <p className="text-sm text-muted-foreground">Upload PDFs, DOCs, or other documents.</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="mr-2 h-3 w-3" /> Upload Documents
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>FAQ Builder</Label>
                  <div className="rounded-md border">
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground">Add frequently asked questions and their answers to train your chatbot.</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="mr-2 h-3 w-3" /> Add FAQ
                      </Button>
                    </div>
                    <div className="border-t p-4">
                      <p className="text-xs text-muted-foreground">No FAQs added yet.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Appearance</CardTitle>
                <CardDescription>Customize how your chatbot appears on your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-md bg-primary"></div>
                    <Input type="text" defaultValue="#0284C7" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Chat Icon</Label>
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <Button variant="outline" size="sm">
                      Change Icon
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Widget Position</Label>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
