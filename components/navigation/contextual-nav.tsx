"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RelatedLink {
  title: string
  href: string
  description: string
}

// Define related links for different sections
const contextualNavMap: Record<string, { title: string; links: RelatedLink[] }> = {
  "/dashboard/messaging": {
    title: "Messaging Resources",
    links: [
      {
        title: "Templates",
        href: "/dashboard/messaging/templates",
        description: "Manage reusable message templates",
      },
      {
        title: "Campaigns",
        href: "/dashboard/campaigns",
        description: "Create and manage messaging campaigns",
      },
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        description: "View messaging performance metrics",
      },
    ],
  },
  "/dashboard/voice": {
    title: "Voice Resources",
    links: [
      {
        title: "Call Logs",
        href: "/dashboard/voice/logs",
        description: "View history of voice calls",
      },
      {
        title: "IVR Setup",
        href: "/dashboard/voice/ivr",
        description: "Configure interactive voice response",
      },
      {
        title: "Voice Analytics",
        href: "/dashboard/analytics/voice",
        description: "View voice call metrics",
      },
    ],
  },
  "/dashboard/chat": {
    title: "Chat Resources",
    links: [
      {
        title: "Chatbots",
        href: "/dashboard/chat/bots",
        description: "Manage automated chat assistants",
      },
      {
        title: "Live Chat",
        href: "/dashboard/chat/live",
        description: "Handle real-time customer conversations",
      },
      {
        title: "Chat Analytics",
        href: "/dashboard/analytics/chat",
        description: "View chat engagement metrics",
      },
    ],
  },
  "/dashboard/analytics": {
    title: "Analytics Resources",
    links: [
      {
        title: "Messaging Reports",
        href: "/dashboard/analytics/messaging",
        description: "Detailed messaging performance reports",
      },
      {
        title: "Voice Reports",
        href: "/dashboard/analytics/voice",
        description: "Detailed voice call analytics",
      },
      {
        title: "Engagement Metrics",
        href: "/dashboard/analytics/engagement",
        description: "Customer engagement across channels",
      },
    ],
  },
  "/dashboard/contacts": {
    title: "Contact Resources",
    links: [
      {
        title: "Import Contacts",
        href: "/dashboard/contacts/import",
        description: "Import contacts from external sources",
      },
      {
        title: "Segments",
        href: "/dashboard/contacts/segments",
        description: "Create and manage contact segments",
      },
      {
        title: "Contact Analytics",
        href: "/dashboard/analytics/contacts",
        description: "View contact engagement metrics",
      },
    ],
  },
}

export function ContextualNav() {
  const pathname = usePathname()
  
  // Find the most specific matching path
  const matchingPath = Object.keys(contextualNavMap)
    .filter(path => pathname.startsWith(path))
    .sort((a, b) => b.length - a.length)[0]
  
  if (!matchingPath) return null
  
  const { title, links } = contextualNavMap[matchingPath]
  
  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Related resources to help you navigate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-muted"
            >
              <div className="flex flex-col gap-1">
                <div className="font-medium">{link.title}</div>
                <div className="text-xs text-muted-foreground">{link.description}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
