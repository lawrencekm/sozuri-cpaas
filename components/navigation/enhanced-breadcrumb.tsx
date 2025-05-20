"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, ChevronRight } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const routeTitles: Record<string, string> = {
  dashboard: "Dashboard",
  messaging: "Messaging",
  sms: "SMS",
  whatsapp: "WhatsApp",
  viber: "Viber",
  rcs: "RCS",
  voice: "Voice",
  chat: "Chat",
  projects: "Projects",
  campaigns: "Campaigns",
  templates: "Templates",
  analytics: "Analytics",
  contacts: "Contacts",
  webhooks: "Webhooks",
  settings: "Settings",
  support: "Help",
  developers: "Developers",
  billing: "Billing",
  "api-keys": "API Keys",
  profile: "Profile",
}

export function EnhancedBreadcrumb() {
  const pathname = usePathname()

  if (pathname === "/dashboard") return null

  const segments = pathname.split("/").filter(Boolean)

  const breadcrumbItems = segments.map((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join("/")}`

    const title = routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

    const isLastSegment = index === segments.length - 1

    return {
      path,
      title,
      isLastSegment,
    }
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" className="flex items-center text-black hover:text-black">
              <Home className="h-3.5 w-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-black" />

        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.path}>
            {item.isLastSegment ? (
              <BreadcrumbPage className="font-medium text-black">{item.title}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink asChild>
                  <Link href={item.path} className="text-black hover:text-black transition-colors">{item.title}</Link>
                </BreadcrumbLink>
                <BreadcrumbSeparator className="text-black" />
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
