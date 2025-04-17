"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, FileText, ImageIcon, MessageSquare, Plus, Settings } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function WhatsAppPage() {
  const router = useRouter()

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center gap-2" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business</h1>
              <p className="text-muted-foreground">Engage customers through rich, interactive WhatsApp conversations</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New WhatsApp Campaign
            </Button>
          </div>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 pt-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="bg-green-100 pb-2">
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Business Account</span>
                        <span className="text-sm font-medium">Connected</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Phone Number</span>
                        <span className="text-sm font-medium">+1 (555) 123-4567</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Quality Rating</span>
                        <span className="text-sm font-medium">High</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Message Limit</span>
                        <span className="text-sm font-medium">10,000 / month</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/messaging/whatsapp/settings">
                        <Settings className="mr-2 h-4 w-4" /> Manage Account
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="bg-green-100 pb-2">
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/messaging/whatsapp/send">
                          <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/messaging/whatsapp/templates/create">
                          <FileText className="mr-2 h-4 w-4" /> Create Template
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/messaging/whatsapp/campaigns/create">
                          <Plus className="mr-2 h-4 w-4" /> New Campaign
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start" asChild>
                        <Link href="/dashboard/messaging/whatsapp/media">
                          <ImageIcon className="mr-2 h-4 w-4" /> Upload Media
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="bg-green-100 pb-2">
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Rate</span>
                        <span className="text-sm font-medium">98.7%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Read Rate</span>
                        <span className="text-sm font-medium">87.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Response Rate</span>
                        <span className="text-sm font-medium">42.5%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Opt-out Rate</span>
                        <span className="text-sm font-medium">0.8%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/dashboard/analytics?channel=whatsapp">
                        View Detailed Analytics <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Getting Started with WhatsApp Business</CardTitle>
                  <CardDescription>Follow these steps to set up your WhatsApp Business integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        1
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Connect your WhatsApp Business Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Link your WhatsApp Business account to SOZURI Connect to start sending messages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        2
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Create message templates</h3>
                        <p className="text-sm text-muted-foreground">
                          Design and submit templates for approval to send structured messages to your customers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        3
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Set up automated flows</h3>
                        <p className="text-sm text-muted-foreground">
                          Create automated conversation flows to engage with customers efficiently
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700">
                        4
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Launch your first campaign</h3>
                        <p className="text-sm text-muted-foreground">
                          Send your first WhatsApp campaign to engage with your audience
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard/messaging/whatsapp/setup">
                      Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="templates" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Message Templates</CardTitle>
                      <CardDescription>Manage your WhatsApp message templates</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/messaging/whatsapp/templates/create">
                        <Plus className="mr-2 h-4 w-4" /> Create Template
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileText className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Templates Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create your first WhatsApp message template to get started
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/messaging/whatsapp/templates/create">Create Template</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="campaigns" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>WhatsApp Campaigns</CardTitle>
                      <CardDescription>Manage your WhatsApp messaging campaigns</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/messaging/whatsapp/campaigns/create">
                        <Plus className="mr-2 h-4 w-4" /> New Campaign
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center justify-center text-center">
                      <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Campaigns Yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create your first WhatsApp campaign to engage with your audience
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/messaging/whatsapp/campaigns/create">Create Campaign</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Business Settings</CardTitle>
                  <CardDescription>Configure your WhatsApp Business integration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Settings className="h-10 w-10 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">Account Configuration</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Configure your WhatsApp Business account settings and preferences
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/dashboard/messaging/whatsapp/settings">Configure Settings</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
