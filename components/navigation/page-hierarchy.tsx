"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessagesSquare,
  BarChart3,
  Users,
  ArrowRight
} from "lucide-react"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo, VoiceLogo } from "@/components/channel-logos"

interface HierarchyItem {
  title: string
  href: string
  icon: React.ReactNode
  description: string
}

const hierarchyMap: Record<string, HierarchyItem[]> = {
  "/dashboard/messaging": [
    {
      title: "SMS",
      href: "/dashboard/messaging/sms",
      icon: <SMSLogo size={20} />,
      description: "Send and manage SMS messages",
    },
    {
      title: "WhatsApp",
      href: "/dashboard/messaging/whatsapp",
      icon: <WhatsAppLogo size={20} />,
      description: "Send and manage WhatsApp messages",
    },
    {
      title: "Viber",
      href: "/dashboard/messaging/viber",
      icon: <ViberLogo size={20} />,
      description: "Send and manage Viber messages",
    },
    {
      title: "RCS",
      href: "/dashboard/messaging/rcs",
      icon: <RCSLogo size={20} />,
      description: "Send and manage RCS messages",
    },
  ],
  "/dashboard": [
    {
      title: "Messaging",
      href: "/dashboard/messaging",
  icon: <img src="/images/messaging.svg" className="h-5 w-5" alt="Messaging" />, 
      description: "Manage all messaging channels",
    },
    {
      title: "Voice",
      href: "/dashboard/voice",
  icon: <img src="/images/voice.svg" className="h-5 w-5" alt="Voice" />, 
      description: "Manage voice calls and IVR",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
  icon: <img src="/images/analytics.svg" className="h-5 w-5" alt="Analytics" />, 
      description: "View performance metrics",
    },
    {
      title: "Contacts",
      href: "/dashboard/contacts",
  icon: <img src="/images/contacts.svg" className="h-5 w-5" alt="Contacts" />, 
      description: "Manage your audience",
    },
  ],
}

export function PageHierarchy() {
  const pathname = usePathname()

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
