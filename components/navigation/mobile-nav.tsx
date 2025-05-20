"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  LayoutDashboard,
  MessagesSquare,
  Phone,
  MessageCircle,
  BarChart3,
  Users,
  Webhook,
  Settings,
  HelpCircle,
  Menu,
  X,
  Layers
} from "lucide-react"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo, VoiceLogo, ChatLogo } from "@/components/channel-logos"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<any>
  subItems?: NavItem[]
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: "COMMUNICATIONS",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
      },
      {
        title: "Projects",
        href: "/dashboard/projects",
        icon: LayoutDashboard,
      },
      {
        title: "Messaging",
        href: "/dashboard/messaging",
        icon: MessagesSquare,
        subItems: [
          { title: "SMS", href: "/dashboard/messaging/sms", icon: SMSLogo },
          { title: "WhatsApp", href: "/dashboard/messaging/whatsapp", icon: WhatsAppLogo },
          { title: "Viber", href: "/dashboard/messaging/viber", icon: ViberLogo },
          { title: "Templates", href: "/dashboard/messaging/templates" },
        ],
      },
      {
        title: "Voice",
        href: "/dashboard/voice",
        icon: VoiceLogo,
      },
      {
        title: "Chat Apps",
        href: "/dashboard/chat",
        icon: ChatLogo,
      },
    ],
  },
  {
    title: "DATA & INSIGHTS",
    items: [
      {
        title: "Analytics",
        href: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "Campaigns",
        href: "/dashboard/campaigns",
        icon: Layers,
      },
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: Users,
      },
    ],
  },
  {
    title: "INTEGRATIONS & API",
    items: [
      {
        title: "Webhooks",
        href: "/dashboard/webhooks",
        icon: Webhook,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
      {
        title: "Help",
        href: "/dashboard/support",
        icon: HelpCircle,
      },
    ],
  },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85%] max-w-[300px] p-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-muted">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-sidebar-muted p-4">
            <div className="font-semibold text-sidebar-foreground">SOZURI Connect</div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-sidebar-foreground hover:bg-sidebar-muted/30">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <div className="space-y-2 px-2">
              {navGroups.map((group) => (
                <div key={group.title} className="pb-2">
                  <div className="px-3 py-2 text-xs font-medium text-blue-500 uppercase tracking-wider">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <div key={item.title}>
                        {item.subItems ? (
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={item.title} className="border-none">
                              <AccordionTrigger className={`px-3 py-2 text-sm rounded-md hover:bg-sidebar-muted/30 transition-colors focus:bg-transparent ${
                                isActive(item.href) ? "bg-sidebar-accent/20 text-sidebar-accent font-medium" : ""
                              }`}>
                                <div className="flex items-center gap-3">
                                  {item.icon && <item.icon className="h-4 w-4 text-sidebar-accent" />}
                                  <span className="font-medium">{item.title}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-9 space-y-1 pt-1">
                                  {item.subItems.map((subItem) => (
                                    <Link
                                      key={subItem.title}
                                      href={subItem.href}
                                      className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                                        isActive(subItem.href)
                                          ? "bg-sidebar-accent/20 text-sidebar-accent font-medium"
                                          : "text-sidebar-muted-foreground hover:bg-sidebar-muted/30 hover:text-sidebar-foreground focus:bg-transparent"
                                      }`}
                                      onClick={() => setOpen(false)}
                                    >
                                      {subItem.icon && <subItem.icon size={16} />}
                                      {subItem.title}
                                    </Link>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ) : (
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
                              isActive(item.href)
                                ? "bg-sidebar-accent/20 text-sidebar-accent font-medium"
                                : "hover:bg-sidebar-muted/30 focus:bg-transparent"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            {item.icon && <item.icon className="h-4 w-4 text-sidebar-accent" />}
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-sidebar-muted p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-sidebar-foreground">John Doe</div>
              <Button variant="outline" size="sm" className="bg-sidebar-muted/30 text-sidebar-foreground border-sidebar-muted hover:bg-sidebar-muted/50">Logout</Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
