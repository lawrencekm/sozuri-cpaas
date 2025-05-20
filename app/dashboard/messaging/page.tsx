import { ArrowRight, MessagesSquare, Phone, Webhook } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { ContextualNav } from "@/components/navigation/contextual-nav"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo, VoiceLogo, ChatLogo } from "@/components/channel-logos"

export default function MessagingPage() {
  const channels = [
    {
      title: "SMS",
      description: "Deliver time-sensitive alerts and notifications to any mobile device worldwide",
      icon: <SMSLogo size={24} />,
      color: "bg-primary/10 text-primary",
      href: "/dashboard/messaging/sms",
    },
    {
      title: "WhatsApp",
      description: "Engage customers through rich, interactive conversations on WhatsApp Business",
      icon: <WhatsAppLogo size={24} />,
      color: "bg-green-100 text-green-700",
      href: "/dashboard/messaging/whatsapp",
    },
    {
      title: "Viber",
      description: "Create immersive brand experiences with Viber's multimedia messaging capabilities",
      icon: <ViberLogo size={24} />,
      color: "bg-purple-100 text-purple-700",
      href: "/dashboard/messaging/viber",
    },
    {
      title: "RCS",
      description: "Transform SMS with Rich Communication Services for app-like experiences in messaging",
      icon: <RCSLogo size={24} />,
      color: "bg-blue-100 text-blue-700",
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
