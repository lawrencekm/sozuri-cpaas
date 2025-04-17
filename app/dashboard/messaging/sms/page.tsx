"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, MessageCircle, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function SmsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SMS Messaging</h1>
            <p className="text-muted-foreground">Send and manage SMS messages to your audience</p>
          </div>
          <Button onClick={() => router.push("/dashboard/messaging/sms/bulk")}>
            <Plus className="mr-2 h-4 w-4" /> New SMS Campaign
          </Button>
        </div>

        <div className="flex items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8" />
          </div>
        </div>

        <Tabs defaultValue="standard" className="w-full">
          <TabsList>
            <TabsTrigger value="standard">Standard SMS</TabsTrigger>
            <TabsTrigger value="interactive">Interactive 2-Way SMS</TabsTrigger>
            <TabsTrigger value="premium">Premium SMS</TabsTrigger>
          </TabsList>

          <TabsContent value="standard" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Send</CardTitle>
                  <CardDescription>Send a one-time SMS message to a single recipient</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Send a quick SMS message without creating a full campaign. Perfect for testing or one-off
                    communications.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/quick-send">
                      Send SMS <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bulk Messaging</CardTitle>
                  <CardDescription>Send SMS messages to multiple recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create and send SMS campaigns to segments of your audience with personalized content.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/bulk">
                      Create Campaign <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Manage your SMS message templates</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create and manage reusable SMS templates with personalization variables for consistent messaging.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/templates">
                      Manage Templates <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="interactive" className="space-y-4 pt-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Campaigns</CardTitle>
                  <CardDescription>Create two-way SMS conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Design interactive SMS campaigns that allow recipients to respond and engage in two-way
                    conversations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/interactive/campaigns">
                      Create Campaign <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Response Management</CardTitle>
                  <CardDescription>Manage and respond to incoming messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View, manage, and respond to incoming SMS messages from your campaigns in a unified inbox.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/interactive/inbox">
                      Open Inbox <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Automated Responses</CardTitle>
                  <CardDescription>Set up automated response workflows</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create automated response workflows to handle incoming messages based on keywords and patterns.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/messaging/sms/interactive/automations">
                      Configure Automations <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="premium" className="pt-4">
            <Tabs defaultValue="inbox" className="w-full">
              <TabsList>
                <TabsTrigger value="inbox">Premium Inbox</TabsTrigger>
                <TabsTrigger value="outbox">Premium Outbox</TabsTrigger>
                <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                <TabsTrigger value="subscription">Subscription Service</TabsTrigger>
              </TabsList>

              <TabsContent value="inbox" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Premium SMS Inbox</CardTitle>
                    <CardDescription>Manage incoming premium SMS messages</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading inbox...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Premium SMS Inbox</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          View and manage incoming premium SMS messages
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/dashboard/messaging/sms/premium/inbox">Open Inbox</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="outbox" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Premium SMS Outbox</CardTitle>
                    <CardDescription>Manage outgoing premium SMS messages</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading outbox...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Premium SMS Outbox</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          View and manage outgoing premium SMS messages
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/dashboard/messaging/sms/premium/outbox">Open Outbox</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscribers" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Premium SMS Subscribers</CardTitle>
                    <CardDescription>Manage your premium SMS subscribers</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading subscribers...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Premium SMS Subscribers</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          View and manage your premium SMS subscribers
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/dashboard/messaging/sms/premium/subscribers">Manage Subscribers</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="subscription" className="space-y-4 pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Service</CardTitle>
                    <CardDescription>Manage your premium SMS subscription services</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading subscription services...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">Subscription Service</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Create and manage premium SMS subscription services
                        </p>
                        <Button className="mt-4" asChild>
                          <Link href="/dashboard/messaging/sms/premium/subscription">Manage Services</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>SMS Dashboard</CardTitle>
            <CardDescription>Key metrics for your SMS messaging</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading analytics...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">SMS Analytics</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  View detailed metrics and performance data for your SMS campaigns
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/analytics?channel=sms">View Analytics</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
