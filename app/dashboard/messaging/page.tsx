import { ArrowRight, MessageCircle, MessagesSquare, Phone, Webhook } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ContextualNav } from "@/components/navigation/contextual-nav"

export default function MessagingPage() {
  const channels = [
    {
      title: "SMS",
      description: "Deliver time-sensitive alerts and notifications to any mobile device worldwide",
      icon: <MessageCircle className="h-6 w-6" />,
      color: "bg-primary/10 text-primary",
      href: "/dashboard/messaging/sms",
    },
    {
      title: "WhatsApp",
      description: "Engage customers through rich, interactive conversations on WhatsApp Business",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-green-700"
        >
          <path
            d="M19.05 4.91C18.1332 3.98392 17.0412 3.24931 15.8376 2.75273C14.634 2.25615 13.3481 2.00398 12.05 2.00998C6.53004 2.00998 2.03004 6.52998 2.05004 12.06C2.05004 13.82 2.53004 15.52 3.41004 17.01L2.05004 22L7.30004 20.68C8.75004 21.48 10.38 21.9 12.05 21.9C17.57 21.9 22.07 17.38 22.07 11.84C22.07 8.84998 20.93 6.04998 19.05 4.91Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "bg-green-100 text-green-700",
      href: "/dashboard/messaging/whatsapp",
    },
    {
      title: "Viber",
      description: "Create immersive brand experiences with Viber's multimedia messaging capabilities",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-purple-700"
        >
          <path
            d="M21.25 3H2.75C1.23 3 0 4.24 0 5.75V18.25C0 19.77 1.23 21 2.75 21H21.25C22.77 21 24 19.77 24 18.25V5.75C24 4.24 22.77 3 21.25 3Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "bg-purple-100 text-purple-700",
      href: "/dashboard/messaging/viber",
    },
    {
      title: "RCS",
      description: "Transform SMS with Rich Communication Services for app-like experiences in messaging",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-700"
        >
          <path
            d="M11.2196 19.1922C10.6503 19.1922 10.1055 19.1195 9.58532 18.9742C8.32688 19.9651 6.80151 19.9396 6.16037 19.8669C6.52138 19.4489 6.76874 18.9378 6.90697 18.414C5.59216 17.3767 4.80005 15.9013 4.80005 14.279C4.80005 10.9905 7.66527 8.29102 11.2196 8.29102C14.7738 8.29102 17.6391 10.9905 17.6391 14.279C17.6391 17.5674 14.7738 19.1922 11.2196 19.1922Z"
            fill="currentColor"
          />
        </svg>
      ),
      color: "bg-slate-100 text-slate-700",
      href: "/dashboard/messaging/rcs",
    },
  ]

  const features = [
    {
      title: "Intelligent Omnichannel",
      description: "Orchestrate seamless customer journeys across all messaging channels from one platform",
      icon: <MessagesSquare className="h-5 w-5" />,
    },
    {
      title: "Smart Conversations",
      description: "Enable AI-powered two-way interactions that build meaningful customer relationships",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      title: "Real-Time Intelligence",
      description: "Monitor delivery, engagement, and response metrics through advanced webhooks",
      icon: <Webhook className="h-5 w-5" />,
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Messaging Solutions</h1>
          <p className="text-muted-foreground">
            Deliver personalized, contextual communications through your customers' preferred channels
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started with Messaging</CardTitle>
            <CardDescription>Follow these steps to launch your first messaging campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  1
                </div>
                <div>
                  <h3 className="text-base font-medium">Select your ideal channel mix</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose the right combination of messaging channels based on your audience preferences and location
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  2
                </div>
                <div>
                  <h3 className="text-base font-medium">Configure your brand identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up your verified sender profiles, business accounts, and brand assets for each channel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  3
                </div>
                <div>
                  <h3 className="text-base font-medium">Design engaging message templates</h3>
                  <p className="text-sm text-muted-foreground">
                    Create dynamic, personalized content with our intuitive template designer
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  4
                </div>
                <div>
                  <h3 className="text-base font-medium">Launch and optimize campaigns</h3>
                  <p className="text-sm text-muted-foreground">
                    Deploy your messaging strategy with our AI-driven delivery optimization system
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/dashboard/messaging/getting-started">Launch Your First Campaign</Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel) => (
            <Card key={channel.title} className="overflow-hidden">
              <CardHeader className={`${channel.color} p-4`}>
                <div className="flex items-center gap-2">
                  {channel.icon}
                  <CardTitle>{channel.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardDescription className="text-sm text-foreground/80">{channel.description}</CardDescription>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href={channel.href} className="flex items-center justify-center gap-1">
                    Configure {channel.title} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-foreground/80">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contextual Navigation */}
        <ContextualNav />
      </div>
    </DashboardLayout>
  )
}
