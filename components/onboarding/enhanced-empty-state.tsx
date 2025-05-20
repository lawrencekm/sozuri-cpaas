"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket, MessageCircle, Layers, ArrowRight, Zap } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

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

interface QuickStartItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export function EnhancedEmptyState() {
  const quickStartItems: QuickStartItem[] = [
    {
      title: "Send Your First Message",
      description: "Start communicating with your customers through SMS, WhatsApp, or other channels",
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      href: "/dashboard/messaging"
    },
    {
      title: "Create a Project",
      description: "Organize your communications by creating a new project",
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      href: "/dashboard/projects"
    },
    {
      title: "Generate API Keys",
      description: "Set up API keys to integrate with your applications",
      icon: <Zap className="h-5 w-5 text-orange-500" />,
      href: "/dashboard/api-keys"
    }
  ];

  return (
    <motion.div 
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="text-center py-12">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Rocket className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Welcome to SOZURI Connect!</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your communications platform is ready to go. Let's get started by setting up your first project.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4">Quick Start Guide</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {quickStartItems.map((item, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-md hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    {item.icon}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{item.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href={item.href} className="flex items-center justify-between">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-muted/30 rounded-lg p-6 border">
        <h2 className="text-xl font-semibold mb-2">Need Help?</h2>
        <p className="text-muted-foreground mb-4">
          Check out our documentation or contact support if you need assistance.
        </p>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/dashboard/support">View Documentation</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/support">Contact Support</Link>
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
