"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  MessageCircle, 
  MessagesSquare, 
  Phone, 
  BarChart3, 
  Users,
  ArrowRight
} from "lucide-react"

interface HierarchyItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
}

// Define hierarchy for main sections
const hierarchyMap: Record<string, HierarchyItem[]> = {
  "/dashboard/messaging": [
    {
      title: "SMS",
      href: "/dashboard/messaging/sms",
      icon: <MessageCircle className="h-5 w-5 text-primary" />,
      description: "Send and manage SMS messages",
    },
    {
      title: "WhatsApp",
      href: "/dashboard/messaging/whatsapp",
      icon: <MessageCircle className="h-5 w-5 text-green-500" />,
      description: "Send and manage WhatsApp messages",
    },
    {
      title: "Viber",
      href: "/dashboard/messaging/viber",
      icon: <MessageCircle className="h-5 w-5 text-purple-500" />,
      description: "Send and manage Viber messages",
    },
    {
      title: "RCS",
      href: "/dashboard/messaging/rcs",
      icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
      description: "Send and manage RCS messages",
    },
  ],
  "/dashboard": [
    {
      title: "Messaging",
      href: "/dashboard/messaging",
      icon: <MessagesSquare className="h-5 w-5 text-primary" />,
      description: "Manage all messaging channels",
    },
    {
      title: "Voice",
      href: "/dashboard/voice",
      icon: <Phone className="h-5 w-5 text-orange-500" />,
      description: "Manage voice calls and IVR",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
      description: "View performance metrics",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
      icon: <Users className="h-5 w-5 text-green-500" />,
      description: "Manage your audience",
    },
  ],
}

export function PageHierarchy() {
  const pathname = usePathname()
  
  // Find the exact matching path
  const items = hierarchyMap[pathname]
  
  if (!items) return null
  
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group relative overflow-hidden rounded-lg border p-5 hover:border-primary transition-colors"
        >
          <div className="flex justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
              {item.icon}
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
