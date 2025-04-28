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

// Define route titles for better readability
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
  
  // Skip rendering on main dashboard
  if (pathname === "/dashboard") return null
  
  const segments = pathname.split("/").filter(Boolean)
  
  // Create breadcrumb items with proper paths and titles
  const breadcrumbItems = segments.map((segment, index) => {
    // Build the path up to this segment
    const path = `/${segments.slice(0, index + 1).join("/")}`
    
    // Get a readable title for this segment
    const title = routeTitles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Check if this is the last segment (current page)
    const isLastSegment = index === segments.length - 1
    
    return {
      path,
      title,
      isLastSegment,
    }
  })

  return (
    <div className="bg-muted/50 px-6 py-2 border-b">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard" className="flex items-center">
                <Home className="h-3.5 w-3.5" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          
          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem key={item.path}>
              {item.isLastSegment ? (
                <BreadcrumbPage className="font-medium text-primary">{item.title}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={item.path}>{item.title}</Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator />
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
