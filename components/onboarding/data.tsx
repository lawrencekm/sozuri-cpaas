import {
  Key,
  MessageCircle,
  Settings,
  Zap,
  Code,
  Rocket,
  BarChart3,
  Users,
  Layers,
  Webhook,
  Phone
} from "lucide-react"
import type { OnboardingStep, TourStep, WalkthroughStep } from "./types"

// Enterprise Onboarding Steps
export const enterpriseOnboardingSteps: OnboardingStep[] = [
  {
    id: "api-key",
    title: "Generate API Keys",
    description: "Create secure API keys for your integration",
    icon: <Key className="h-5 w-5" />,
    target: "/dashboard/api-keys",
    category: "setup",
    estimatedTime: "2 min",
    recommended: true,
    documentationLink: "/dashboard/developers/api-keys"
  },
  {
    id: "messaging-setup",
    title: "Configure Messaging",
    description: "Set up your messaging channels and templates",
    icon: <MessageCircle className="h-5 w-5" />,
    target: "/dashboard/messaging",
    category: "setup",
    estimatedTime: "5 min",
    recommended: true,
    documentationLink: "/dashboard/developers/messaging"
  },
  {
    id: "account-settings",
    title: "Account Settings",
    description: "Complete your account profile and preferences",
    icon: <Settings className="h-5 w-5" />,
    target: "/dashboard/settings",
    category: "setup",
    estimatedTime: "3 min",
    documentationLink: "/dashboard/developers/account"
  },
  {
    id: "webhook-setup",
    title: "Configure Webhooks",
    description: "Set up webhooks for real-time event notifications",
    icon: <Zap className="h-5 w-5" />,
    target: "/dashboard/webhooks",
    category: "integration",
    estimatedTime: "7 min",
    documentationLink: "/dashboard/developers/webhooks"
  },
  {
    id: "code-examples",
    title: "Explore Code Examples",
    description: "View sample code for common integration scenarios",
    icon: <Code className="h-5 w-5" />,
    target: "/dashboard/developers/examples",
    category: "integration",
    estimatedTime: "10 min",
    documentationLink: "/dashboard/developers/examples"
  },
  {
    id: "test-api",
    title: "Test API Endpoints",
    description: "Try out API endpoints in an interactive console",
    icon: <Rocket className="h-5 w-5" />,
    target: "/dashboard/developers/api-console",
    category: "integration",
    estimatedTime: "8 min",
    documentationLink: "/dashboard/developers/api-reference"
  },
  {
    id: "analytics-dashboard",
    title: "Explore Analytics",
    description: "Discover insights from your communication data",
    icon: <BarChart3 className="h-5 w-5" />,
    target: "/dashboard/analytics",
    category: "analytics",
    estimatedTime: "5 min",
    documentationLink: "/dashboard/developers/analytics"
  },
  {
    id: "contact-management",
    title: "Manage Contacts",
    description: "Import and organize your contact database",
    icon: <Users className="h-5 w-5" />,
    target: "/dashboard/contacts",
    category: "analytics",
    estimatedTime: "6 min",
    documentationLink: "/dashboard/developers/contacts"
  },
  {
    id: "project-setup",
    title: "Create First Project",
    description: "Organize your communications with projects",
    icon: <Layers className="h-5 w-5" />,
    target: "/dashboard/projects",
    category: "analytics",
    estimatedTime: "4 min",
    documentationLink: "/dashboard/developers/projects"
  }
];

// Product Tour Steps
export const productTourSteps: TourStep[] = [
  {
    id: "messaging",
    title: "Unified Messaging Platform",
    description: "Connect with your customers across multiple channels from a single platform. Send SMS, WhatsApp, Viber, and RCS messages with consistent delivery and tracking.",
    image: "/images/tour/messaging-platform.jpg",
    features: [
      {
        title: "Multi-Channel Messaging",
        description: "Send messages across SMS, WhatsApp, Viber, and RCS",
        icon: <MessageCircle className="h-5 w-5" />
      },
      {
        title: "Template Management",
        description: "Create and manage reusable message templates",
        icon: <Layers className="h-5 w-5" />
      },
      {
        title: "Delivery Tracking",
        description: "Monitor message delivery status in real-time",
        icon: <Zap className="h-5 w-5" />
      }
    ],
    cta: {
      label: "Explore Messaging",
      href: "/dashboard/messaging"
    }
  },
  {
    id: "voice",
    title: "Enterprise Voice Solutions",
    description: "Build interactive voice experiences with our programmable voice API. Create IVR systems, voice bots, and automated call flows to enhance customer engagement.",
    image: "/images/tour/voice-platform.jpg",
    features: [
      {
        title: "Programmable Voice",
        description: "Create custom voice applications and IVR systems",
        icon: <Phone className="h-5 w-5" />
      },
      {
        title: "Call Tracking",
        description: "Monitor call quality, duration, and outcomes",
        icon: <BarChart3 className="h-5 w-5" />
      },
      {
        title: "Voice Transcription",
        description: "Convert voice to text for analysis and records",
        icon: <MessageCircle className="h-5 w-5" />
      }
    ],
    cta: {
      label: "Explore Voice",
      href: "/dashboard/voice"
    }
  },
  {
    id: "analytics",
    title: "Advanced Analytics & Insights",
    description: "Gain valuable insights into your communication performance with detailed analytics. Track delivery rates, engagement metrics, and optimize your messaging strategy.",
    image: "/images/tour/analytics-platform.jpg",
    features: [
      {
        title: "Real-time Dashboards",
        description: "Monitor key metrics in real-time with customizable views",
        icon: <BarChart3 className="h-5 w-5" />
      },
      {
        title: "Performance Reports",
        description: "Generate detailed reports on message performance",
        icon: <Layers className="h-5 w-5" />
      },
      {
        title: "AI-Powered Insights",
        description: "Get intelligent recommendations to improve engagement",
        icon: <Zap className="h-5 w-5" />
      }
    ],
    cta: {
      label: "Explore Analytics",
      href: "/dashboard/analytics"
    }
  },
  {
    id: "integration",
    title: "Seamless Integration",
    description: "Integrate our platform with your existing systems using our comprehensive API and webhooks. Connect to CRM, marketing automation, and customer service platforms.",
    image: "/images/tour/integration-platform.jpg",
    features: [
      {
        title: "RESTful API",
        description: "Integrate with our platform using standard REST APIs",
        icon: <Webhook className="h-5 w-5" />
      },
      {
        title: "Webhooks",
        description: "Receive real-time notifications for events",
        icon: <Zap className="h-5 w-5" />
      },
      {
        title: "SDK Libraries",
        description: "Use our libraries for popular programming languages",
        icon: <Layers className="h-5 w-5" />
      }
    ],
    cta: {
      label: "Explore Integration",
      href: "/dashboard/developers"
    }
  }
];

// Default Walkthrough Steps
export const defaultWalkthroughSteps: WalkthroughStep[] = [
  {
    target: '#create-api-key-button',
    title: "API Key Creation",
    content: "Generate your first API key to authenticate your integration requests",
    position: "right"
  },
  {
    target: '#messaging-nav-item',
    title: "Messaging Hub",
    content: "Configure and manage all your messaging channels from this central location",
    position: "right"
  },
  {
    target: '#analytics-nav-item',
    title: "Analytics Dashboard",
    content: "Monitor performance metrics and gain insights into your communications",
    position: "right"
  }
]; 