"use client"

import { useState } from "react"
import { 
  Rocket, 
  Building2, 
  ShoppingBag, 
  Stethoscope, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  ChevronRight, 
  ArrowRight, 
  MessageCircle, 
  Phone, 
  BarChart3, 
  Webhook
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IndustryGuide {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  useCases: {
    title: string
    description: string
    icon: React.ReactNode
    link: string
  }[]
  recommendations: {
    title: string
    description: string
    link: string
  }[]
}

export function EnhancedEmptyState() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("general")
  
  const industryGuides: Record<string, IndustryGuide> = {
    general: {
      id: "general",
      title: "Welcome to SOZURI Connect",
      description: "The enterprise communication platform for global businesses",
      icon: <Rocket className="h-8 w-8" />,
      useCases: [
        {
          title: "Customer Engagement",
          description: "Engage customers across multiple channels",
          icon: <MessageCircle className="h-5 w-5" />,
          link: "/dashboard/messaging"
        },
        {
          title: "Voice Solutions",
          description: "Build interactive voice experiences",
          icon: <Phone className="h-5 w-5" />,
          link: "/dashboard/voice"
        },
        {
          title: "Analytics & Insights",
          description: "Track performance and optimize communications",
          icon: <BarChart3 className="h-5 w-5" />,
          link: "/dashboard/analytics"
        }
      ],
      recommendations: [
        {
          title: "Create API Key",
          description: "Generate your first API key to start integrating",
          link: "/dashboard/api-keys"
        },
        {
          title: "Configure Webhooks",
          description: "Set up webhooks for real-time notifications",
          link: "/dashboard/webhooks"
        },
        {
          title: "Explore Documentation",
          description: "Browse our comprehensive API documentation",
          link: "/dashboard/developers"
        }
      ]
    },
    retail: {
      id: "retail",
      title: "Retail & E-commerce Solutions",
      description: "Enhance customer experience and drive sales with omnichannel communications",
      icon: <ShoppingBag className="h-8 w-8" />,
      useCases: [
        {
          title: "Order Notifications",
          description: "Send automated order status updates",
          icon: <MessageCircle className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Abandoned Cart Recovery",
          description: "Re-engage customers who abandoned their carts",
          icon: <ShoppingBag className="h-5 w-5" />,
          link: "/dashboard/messaging/campaigns"
        },
        {
          title: "Customer Support",
          description: "Provide real-time support across channels",
          icon: <Phone className="h-5 w-5" />,
          link: "/dashboard/voice"
        }
      ],
      recommendations: [
        {
          title: "E-commerce Integration",
          description: "Connect your e-commerce platform with our APIs",
          link: "/dashboard/developers/guides/ecommerce"
        },
        {
          title: "Set Up Order Templates",
          description: "Create message templates for order notifications",
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Configure WhatsApp Business",
          description: "Set up WhatsApp for rich customer interactions",
          link: "/dashboard/messaging/whatsapp"
        }
      ]
    },
    healthcare: {
      id: "healthcare",
      title: "Healthcare Communication Solutions",
      description: "Secure, compliant patient engagement and operational efficiency",
      icon: <Stethoscope className="h-8 w-8" />,
      useCases: [
        {
          title: "Appointment Reminders",
          description: "Reduce no-shows with automated reminders",
          icon: <MessageCircle className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Telehealth Notifications",
          description: "Send secure links for virtual appointments",
          icon: <Phone className="h-5 w-5" />,
          link: "/dashboard/messaging/campaigns"
        },
        {
          title: "Patient Follow-ups",
          description: "Automate post-visit care instructions",
          icon: <Stethoscope className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        }
      ],
      recommendations: [
        {
          title: "HIPAA Compliance Setup",
          description: "Configure your account for healthcare compliance",
          link: "/dashboard/settings/compliance"
        },
        {
          title: "Secure Messaging Templates",
          description: "Create compliant message templates",
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Patient Engagement Workflows",
          description: "Set up automated patient communication flows",
          link: "/dashboard/developers/guides/healthcare"
        }
      ]
    },
    financial: {
      id: "financial",
      title: "Financial Services Solutions",
      description: "Secure, compliant customer communications for financial institutions",
      icon: <Briefcase className="h-8 w-8" />,
      useCases: [
        {
          title: "Transaction Alerts",
          description: "Send real-time transaction notifications",
          icon: <MessageCircle className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Fraud Alerts",
          description: "Quickly notify customers of suspicious activity",
          icon: <Phone className="h-5 w-5" />,
          link: "/dashboard/messaging/campaigns"
        },
        {
          title: "Account Updates",
          description: "Keep customers informed about their accounts",
          icon: <Briefcase className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        }
      ],
      recommendations: [
        {
          title: "Security Configuration",
          description: "Set up enhanced security for financial data",
          link: "/dashboard/settings/security"
        },
        {
          title: "Two-Factor Authentication",
          description: "Implement 2FA for customer verification",
          link: "/dashboard/developers/guides/2fa"
        },
        {
          title: "Compliance Templates",
          description: "Create regulatory-compliant message templates",
          link: "/dashboard/messaging/templates"
        }
      ]
    },
    education: {
      id: "education",
      title: "Education Communication Solutions",
      description: "Engage students, faculty, and parents with reliable communications",
      icon: <GraduationCap className="h-8 w-8" />,
      useCases: [
        {
          title: "Class Notifications",
          description: "Send schedule updates and class information",
          icon: <MessageCircle className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        },
        {
          title: "Emergency Alerts",
          description: "Quickly notify everyone during emergencies",
          icon: <Phone className="h-5 w-5" />,
          link: "/dashboard/messaging/campaigns"
        },
        {
          title: "Parent Communications",
          description: "Keep parents informed about student progress",
          icon: <GraduationCap className="h-5 w-5" />,
          link: "/dashboard/messaging/templates"
        }
      ],
      recommendations: [
        {
          title: "Bulk Messaging Setup",
          description: "Configure high-volume messaging for campus-wide alerts",
          link: "/dashboard/messaging/bulk"
        },
        {
          title: "LMS Integration",
          description: "Connect with your Learning Management System",
          link: "/dashboard/developers/guides/education"
        },
        {
          title: "Group Management",
          description: "Organize contacts by classes, departments, or roles",
          link: "/dashboard/contacts/groups"
        }
      ]
    }
  }
  
  const guide = industryGuides[selectedIndustry] || industryGuides.general
  
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-5xl mx-auto">
      <div className="w-full mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              {guide.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{guide.title}</h2>
              <p className="text-muted-foreground">{guide.description}</p>
            </div>
          </div>
          
          <div className="w-full md:w-auto">
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Business</SelectItem>
                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="financial">Financial Services</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your communication platform
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="use-cases">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="use-cases">Industry Use Cases</TabsTrigger>
                <TabsTrigger value="recommendations">Recommended Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="use-cases">
                <div className="grid gap-6 md:grid-cols-3">
                  {guide.useCases.map((useCase, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col h-full"
                    >
                      <Card className="border h-full flex flex-col">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                              {useCase.icon}
                            </div>
                            <CardTitle className="text-lg">{useCase.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                          <p className="text-sm text-muted-foreground">
                            {useCase.description}
                          </p>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            asChild
                          >
                            <Link href={useCase.link} className="flex items-center justify-center gap-1">
                              Explore
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations">
                <div className="space-y-4">
                  {guide.recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border">
                        <div className="flex items-start p-4 gap-4">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{recommendation.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {recommendation.description}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                          >
                            <Link href={recommendation.link}>
                              Start
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <Button 
          size="lg" 
          className="flex-1"
          asChild
        >
          <Link href="/dashboard/api-keys">
            <Rocket className="mr-2 h-5 w-5" />
            Create API Key
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1"
          asChild
        >
          <Link href="/dashboard/developers">
            Explore Documentation
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="lg" 
          className="flex-1"
          asChild
        >
          <Link href="/dashboard/support">
            Contact Support
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
