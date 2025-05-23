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
  FileText,
  Globe,
  HelpCircle,
  Home,
  KeyRound,
  Layers,
  LayoutDashboard,
  Link as LinkIcon,
  MessageCircle,
  MessagesSquare,
  Phone,
  Settings,
  Shield,
  Sparkles,
  Users,
  Webhook,
} from "lucide-react"
import { SMSLogo, WhatsAppLogo, ViberLogo, RCSLogo, VoiceLogo, ChatLogo } from "@/components/channel-logos"

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
import { EnterpriseGuidedTour } from "@/components/onboarding/enterprise-guided-tour"
import { EnhancedBreadcrumb } from "@/components/navigation/enhanced-breadcrumb"
import { MobileNav } from "@/components/navigation/mobile-nav"
import { ProductTour } from "@/components/onboarding/product-tour"

interface LucideProps extends React.SVGProps<SVGSVGElement> {
  className?: string
}

interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<LucideProps>
  subItems?: NavItem[]
  channels?: Array<{ name: string; logo: React.ComponentType<LucideProps> }>
  badge?: string
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "COMMUNICATIONS",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        badge: "New",
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
        channels: [
          { name: "SMS", logo: SMSLogo },
          { name: "WhatsApp", logo: WhatsAppLogo },
          { name: "Viber", logo: ViberLogo },
        ],
        subItems: [
          { title: "SMS", href: "/dashboard/messaging/sms" },
          { title: "WhatsApp", href: "/dashboard/messaging/whatsapp" },
          { title: "Viber", href: "/dashboard/messaging/viber" },
          { title: "Templates", href: "/dashboard/messaging/templates" },
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
        title: "AI Suggestions",
        href: "/dashboard/ai-suggestions",
        icon: Sparkles,
        badge: "New",
      },
      {
        title: "Contacts",
        href: "/dashboard/contacts",
        icon: Users,
      },
      {
        title: "Logs",
        href: "/dashboard/logs",
        icon: FileText,
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
        title: "API Keys",
        href: "/dashboard/api-keys",
        icon: KeyRound,
      },
      {
        title: "Integrations",
        href: "/dashboard/integrations",
        icon: LinkIcon,
      },
    ],
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

  const isMenuActive = (item: NavItem) => {
    if (isActive(item.href)) return true
    if (item.subItems) {
      return item.subItems.some((subItem: NavItem) => isActive(subItem.href))
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
          <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
            <SidebarHeader className="border-b border-sidebar-muted py-4">
              <div className="flex items-center justify-center px-4">
                <Image src="/images/logo.png" alt="SOZURI Logo" width={120} height={40} priority className="h-auto" />
              </div>
            </SidebarHeader>
            <SidebarContent className="modern-scrollbar">
              {navGroups.map((group) => (
                <SidebarGroup key={group.title}>
                  <div className="px-4 pt-4 pb-1 text-xs font-bold text-blue-500 tracking-widest uppercase">
                    {group.title}
                  </div>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title} className="my-0.5 px-2 transition-colors duration-200">
                        {item.subItems ? (
                          <div className="flex flex-col">
                            <SidebarMenuButton
                              isActive={isMenuActive(item)}
                              onClick={() => toggleMenu(item.title)}
                              className="flex justify-between items-center rounded-md py-2 px-3 hover:bg-sidebar-muted/30 transition-colors focus:bg-transparent"
                            >
                              <div className="flex items-center gap-3">
                                {item.icon && <item.icon className="h-4 w-4 text-sidebar-accent flex-shrink-0" />}
                                <span className="font-medium text-black">{item.title}</span>
                                {item.channels && (
                                  <div className="flex space-x-1 ml-auto">
                                    {item.channels.map((channel) => (
                                      <div
                                        key={channel.name}
                                        className="h-4 w-4 flex-shrink-0"
                                        title={channel.name}
                                      >
                                        <channel.logo className="h-4 w-4" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {item.badge && (
                                  <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 ml-2 flex-shrink-0 transition-transform ${openMenus[item.title] ? "rotate-180" : ""}`}
                              />
                            </SidebarMenuButton>
                            {openMenus[item.title] && (
                              <div className="ml-7 mt-1 flex flex-col space-y-1 border-l-2 border-sidebar-muted pl-3 py-1">
                                {item.subItems.map((subItem) => (
                                  <Link
                                    key={subItem.title}
                                    href={subItem.href}
                                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                                      isActive(subItem.href)
                                        ? "bg-sidebar-accent/15 font-medium text-black"
                                        : "text-black/80 hover:bg-sidebar-muted/20 hover:text-black"
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
                            <Link href={item.href} className="flex items-center gap-3 rounded-md py-2 px-3 hover:bg-sidebar-muted/30 transition-colors focus:bg-transparent">
                              {item.icon && <item.icon className="h-4 w-4 text-sidebar-accent flex-shrink-0" />}
                              <span className="font-medium text-black">{item.title}</span>
                              {item.channels && (
                                <div className="flex space-x-1 ml-auto">
                                  {item.channels.map((channel) => (
                                    <div
                                      key={channel.name}
                                      className="h-4 w-4 flex-shrink-0"
                                      title={channel.name}
                                    >
                                      <channel.logo className="h-4 w-4" />
                                    </div>
                                  ))}
                                </div>
                              )}
                              {item.badge && (
                                <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              ))}
            </SidebarContent>
            <SidebarFooter className="border-t">
              <SidebarMenu>
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.title} className="my-0.5 px-2">
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link href={item.href} className="flex items-center gap-3 rounded-md py-2 px-3 hover:bg-sidebar-muted/30 transition-colors focus:bg-transparent">
                        {item.icon && <item.icon className="h-4 w-4 text-sidebar-accent flex-shrink-0" />}
                        <span className="font-medium text-black">{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <div className="flex w-full flex-1 flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="md:hidden">
                  <MobileNav />
                </div>
                <div className="hidden md:block">
                  <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                </div>
                <h1 className="hidden text-xl font-semibold sm:block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">SOZURI Connect</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center mr-2">
                  <div className="status-dot active mr-2"></div>
                  <span className="text-sm text-muted-foreground">System: Operational</span>
                </div>
                <Button variant="outline" size="icon" className="relative hover:bg-muted/80 transition-colors">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground animate-pulse-subtle">
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
            {/* Enhanced Breadcrumbs */}
<div className="border-b border-border bg-white shadow-sm z-10">
  <div className="container mx-auto px-6 py-2">
    <EnhancedBreadcrumb />
  </div>
</div>
<main className="flex-1 p-4 md:p-6 animate-fade-in">
  <div className="container mx-auto">
    {children}
  </div>
</main>
          </div>
        </div>
      </SidebarProvider>
      <EnterpriseGuidedTour />
      <ProductTour />
    </ErrorBoundary>
  )
}
