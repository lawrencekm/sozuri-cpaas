"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageCircle, 
  Layers, 
  BarChart3, 
  Users, 
  Webhook, 
  Settings, 
  ArrowRight, 
  CheckCircle2,
  Clock
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo } from "@/components/channel-logos"

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

interface WelcomeDashboardProps {
  userName: string;
  companyName: string;
  userRole: string;
}

export function WelcomeDashboard({ userName, companyName, userRole }: WelcomeDashboardProps) {
  // Setup progress
  const setupProgress = 25;
  
  // Quick action items
  const quickActions = [
    {
      title: "Messaging",
      description: "Configure messaging channels",
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      href: "/dashboard/messaging",
      completed: false
    },
    {
      title: "Projects",
      description: "Create your first project",
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      href: "/dashboard/projects",
      completed: false
    },
    {
      title: "Analytics",
      description: "View performance metrics",
      icon: <BarChart3 className="h-5 w-5 text-green-500" />,
      href: "/dashboard/analytics",
      completed: false
    },
    {
      title: "Contacts",
      description: "Manage your audience",
      icon: <Users className="h-5 w-5 text-orange-500" />,
      href: "/dashboard/contacts",
      completed: false
    },
    {
      title: "Webhooks",
      description: "Set up event notifications",
      icon: <Webhook className="h-5 w-5 text-purple-500" />,
      href: "/dashboard/webhooks",
      completed: false
    },
    {
      title: "Settings",
      description: "Configure your account",
      icon: <Settings className="h-5 w-5 text-gray-500" />,
      href: "/dashboard/settings",
      completed: true
    }
  ];

  // Available channels
  const channels = [
    { name: "SMS", icon: <SMSLogo size={24} />, href: "/dashboard/messaging/sms" },
    { name: "WhatsApp", icon: <WhatsAppLogo size={24} />, href: "/dashboard/messaging/whatsapp" },
    { name: "Viber", icon: <ViberLogo size={24} />, href: "/dashboard/messaging/viber" },
    { name: "RCS", icon: <RCSLogo size={24} />, href: "/dashboard/messaging/rcs" }
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="bg-card rounded-xl border shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome, {userName}!</h1>
            <p className="text-muted-foreground">
              {companyName} • {userRole}
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">Setup Progress</span>
                <span className="text-xs text-muted-foreground">{setupProgress}% Complete</span>
              </div>
              <Progress value={setupProgress} className="h-2" />
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <Button asChild className="flex items-center">
              <Link href="/dashboard/onboarding">
                Continue Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {quickActions.map((action, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      {action.icon}
                    </div>
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  {action.completed && (
                    <div className="flex items-center text-xs text-green-500">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant={action.completed ? "outline" : "default"} className="w-full">
                  <Link href={action.href} className="flex items-center justify-between">
                    <span>{action.completed ? "View" : "Get Started"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4">Available Channels</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {channels.map((channel, index) => (
                <Link 
                  key={index} 
                  href={channel.href}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="mb-2">{channel.icon}</div>
                  <span className="text-sm font-medium">{channel.name}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
