"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Bell,
  ChevronDown,
  Globe,
  HelpCircle,
  Home,
  LayoutDashboard,
  MessageCircle,
  MessagesSquare,
  Phone,
  Settings,
  Users,
  Webhook,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ErrorBoundary } from "react-error-boundary"

const mainNavItems = [
  {
    title: "Overview",
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
      {
        title: "SMS",
        href: "/dashboard/messaging/sms",
      },
      {
        title: "WhatsApp",
        href: "/dashboard/messaging/whatsapp",
      },
      {
        title: "Viber",
        href: "/dashboard/messaging/viber",
      },
      {
        title: "RCS",
        href: "/dashboard/messaging/rcs",
      },
    ],
  },
  {
    title: "Voice",
    href: "/dashboard/voice",
    icon: Phone,
  },
  {
    title: "Chat Apps",
    href: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Webhooks",
    href: "/dashboard/webhooks",
    icon: Webhook,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Contacts",
    href: "/dashboard/contacts",
    icon: Users,
  },
]

const bottomNavItems = [
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
  {
    title: "Developers",
    href: "/dashboard/developers",
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
  },
  {
    title: "API Keys",
    href: "/dashboard/api-keys",
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (href: string) => pathname === href

  const isMenuActive = (item: any) => {
    if (isActive(item.href)) return true
    if (item.subItems) {
      return item.subItems.some((subItem: any) => isActive(subItem.href))
    }
    return false
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout')
    router.push('/login')
  }

  return (
    <ErrorBoundary
      fallback={<div className="p-4 text-destructive">Critical error - please refresh</div>}
    >
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <Sidebar className="border-r">
            <SidebarHeader className="border-b py-4">
              <div className="flex items-center justify-center px-4">
                <Image src="/images/logo.png" alt="SOZURI Logo" width={120} height={40} priority className="h-auto" />
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarMenu>
                  {mainNavItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      {item.subItems ? (
                        <div className="flex flex-col">
                          <SidebarMenuButton
                            isActive={isMenuActive(item)}
                            onClick={() => toggleMenu(item.title)}
                            className="flex justify-between"
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && <item.icon className="h-4 w-4" />}
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${openMenus[item.title] ? "rotate-180" : ""}`}
                            />
                          </SidebarMenuButton>
                          {openMenus[item.title] && (
                            <div className="ml-8 mt-1 flex flex-col space-y-1">
                              {item.subItems.map((subItem) => (
                                <Link
                                  key={subItem.title}
                                  href={subItem.href}
                                  className={`rounded-md px-2 py-1.5 text-sm ${
                                    isActive(subItem.href)
                                      ? "bg-primary/10 font-medium text-primary"
                                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                  }`}
                                >
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <SidebarMenuButton asChild isActive={isActive(item.href)}>
                          <Link href={item.href} className="flex items-center gap-2">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t">
              <SidebarMenu>
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href} className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <div className="flex w-full flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="hidden text-xl font-semibold sm:block">SOZURI Connect</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    3
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                        JD
                      </div>
                      <span className="hidden md:block">John Doe</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/billing">Billing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/api-keys">API Keys</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button onClick={handleLogout}>Logout</Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Globe className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>Spanish</DropdownMenuItem>
                    <DropdownMenuItem>French</DropdownMenuItem>
                    <DropdownMenuItem>German</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </ErrorBoundary>
  )
}
