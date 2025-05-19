"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Copy, Info, MessageCircle, Save } from "lucide-react"

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

export default function LiveChatSettingsPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard/chat/live")
    }, 1500)
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
              <h1 className="text-3xl font-bold tracking-tight">Live Chat Settings</h1>
              <p className="text-muted-foreground">Configure your live chat implementation</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat/live">Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="routing">Routing</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic configuration for your live chat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chat-name">Chat Widget Name</Label>
                  <Input id="chat-name" defaultValue="Customer Support" />
                  <p className="text-xs text-muted-foreground">This name will be displayed in the chat header.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    defaultValue="Welcome to our live chat support! How can we help you today?"
                  />
                  <p className="text-xs text-muted-foreground">This message is displayed when a user starts a new chat.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offline-message">Offline Message</Label>
                  <Textarea
                    id="offline-message"
                    defaultValue="We're currently offline. Please leave a message and we'll get back to you as soon as possible."
                  />
                  <p className="text-xs text-muted-foreground">This message is displayed when no agents are available.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat-enabled">Enable Live Chat</Label>
                    <Switch id="chat-enabled" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Turn live chat on or off on your website.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="file-sharing">File Sharing</Label>
                    <Switch id="file-sharing" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow users to upload and share files during chat.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transcript">Email Transcript</Label>
                    <Switch id="transcript" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Allow users to receive chat transcript via email.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set when your live chat is available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="24-7">24/7 Availability</Label>
                    <Switch id="24-7" />
                  </div>
                  <p className="text-xs text-muted-foreground">Enable if your live chat is available 24/7.</p>
                </div>

                <div className="space-y-2">
                  <Label>Custom Business Hours</Label>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Day</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Open</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Close</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Enabled</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">Monday</td>
                          <td className="px-4 py-2 text-sm">
                            <Select defaultValue="09:00">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <Select defaultValue="17:00">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                                <SelectItem value="18:00">6:00 PM</SelectItem>
                                <SelectItem value="19:00">7:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <Switch defaultChecked />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">Tuesday</td>
                          <td className="px-4 py-2 text-sm">
                            <Select defaultValue="09:00">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="09:00">9:00 AM</SelectItem>
                                <SelectItem value="10:00">10:00 AM</SelectItem>
                                <SelectItem value="11:00">11:00 AM</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <Select defaultValue="17:00">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="17:00">5:00 PM</SelectItem>
                                <SelectItem value="18:00">6:00 PM</SelectItem>
                                <SelectItem value="19:00">7:00 PM</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-2 text-sm">
                            <Switch defaultChecked />
                          </td>
                        </tr>
                        {/* More days would go here */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Widget Appearance</CardTitle>
                <CardDescription>Customize how your chat widget looks</CardDescription>
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
                      <MessageCircle className="h-5 w-5" />
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

                <div className="space-y-2">
                  <Label>Widget Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Routing</CardTitle>
                <CardDescription>Configure how chats are assigned to agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Routing Method</Label>
                  <Select defaultValue="round-robin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round-robin">Round Robin</SelectItem>
                      <SelectItem value="least-active">Least Active Agent</SelectItem>
                      <SelectItem value="skills-based">Skills Based</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Determines how incoming chats are assigned to available agents.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-chats">Maximum Concurrent Chats per Agent</Label>
                  <Input id="max-chats" type="number" min="1" max="10" defaultValue="3" />
                  <p className="text-xs text-muted-foreground">Maximum number of chats an agent can handle simultaneously.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="queue-timeout">Queue Timeout (seconds)</Label>
                  <Input id="queue-timeout" type="number" min="0" defaultValue="120" />
                  <p className="text-xs text-muted-foreground">Time a chat can wait in queue before being marked as abandoned.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation</CardTitle>
                <CardDescription>Configure automated responses and actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pre-chat-form">Pre-Chat Form</Label>
                    <Switch id="pre-chat-form" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Collect information from visitors before starting a chat.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="canned-responses">Canned Responses</Label>
                    <Switch id="canned-responses" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Enable pre-defined responses for common questions.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chatbot-fallback">Chatbot Fallback</Label>
                    <Switch id="chatbot-fallback" defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">Use a chatbot when no agents are available.</p>
                </div>

                <div className="space-y-2">
                  <Label>Chatbot Selection</Label>
                  <Select defaultValue="support-bot">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support-bot">Customer Support Bot</SelectItem>
                      <SelectItem value="sales-bot">Sales Assistant Bot</SelectItem>
                      <SelectItem value="new-bot">Create New Bot</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Select which chatbot to use when no agents are available.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Integration</CardTitle>
                <CardDescription>Add live chat to your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Installation Code</Label>
                  <div className="relative">
                    <div className="rounded-md bg-slate-950 p-4 text-slate-50">
                      <pre className="text-sm">
                        <code>{`<script src="https://cdn.sozuri.com/chat/widget.js" data-id="YOUR_CHAT_ID"></script>`}</code>
                      </pre>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2"
                      onClick={() => {
                        navigator.clipboard.writeText('<script src="https://cdn.sozuri.com/chat/widget.js" data-id="YOUR_CHAT_ID"></script>')
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Add this code to your website to enable live chat.</p>
                </div>

                <div className="space-y-2">
                  <Label>Allowed Domains</Label>
                  <Textarea placeholder="e.g., example.com, app.example.com" defaultValue="example.com" />
                  <p className="text-xs text-muted-foreground">List of domains where the chat widget is allowed to load. One domain per line.</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="page-targeting">Page Targeting</Label>
                    <Switch id="page-targeting" />
                  </div>
                  <p className="text-xs text-muted-foreground">Show the chat widget only on specific pages.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
