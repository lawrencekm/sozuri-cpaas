import { ArrowRight, MessageCircle, Plus } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Chat Applications</h1>
            <p className="text-muted-foreground">Manage chat solutions for your website and applications</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Chat App
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>Real-time customer support</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Set up and manage live chat for your website to provide real-time customer support.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/chat/live">
                  Manage Live Chat <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chatbots</CardTitle>
              <CardDescription>Automated conversation assistants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Create and manage AI-powered chatbots to handle common customer inquiries and tasks.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/chat/bots">
                  Manage Chatbots <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Omnichannel Inbox</CardTitle>
              <CardDescription>Unified messaging management</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage all customer conversations from different channels in a single unified inbox.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/chat/inbox">
                  Open Inbox <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chat Analytics</CardTitle>
            <CardDescription>Key metrics for your chat applications</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Chat Performance</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                View detailed metrics and performance data for your chat applications
              </p>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/analytics?channel=chat">View Analytics</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
