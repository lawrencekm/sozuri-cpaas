"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle, 
  Phone, 
  BarChart3, 
  Zap, 
  ShoppingBag, 
  Stethoscope, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Building2, 
  Users, 
  Shield, 
  Layers,
  ChevronRight,
  ExternalLink
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

interface IndustryCase {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  useCases: {
    title: string
    description: string
  }[]
  stats: {
    value: string
    label: string
  }[]
  testimonial?: {
    quote: string
    author: string
    company: string
  }
}

export default function OverviewPage() {
  const [activeIndustry, setActiveIndustry] = useState<string>("retail")
  
  const industries: IndustryCase[] = [
    {
      id: "retail",
      title: "Retail & E-commerce",
      description: "Enhance customer experience and drive sales with omnichannel communications",
      icon: <ShoppingBag className="h-6 w-6" />,
      color: "bg-emerald-500",
      useCases: [
        {
          title: "Order Notifications",
          description: "Send automated order confirmations, shipping updates, and delivery notifications to keep customers informed throughout their purchase journey."
        },
        {
          title: "Abandoned Cart Recovery",
          description: "Re-engage customers who abandoned their shopping carts with timely, personalized reminders that drive conversion."
        },
        {
          title: "Promotional Campaigns",
          description: "Deliver targeted promotions, flash sales, and special offers across preferred customer channels."
        }
      ],
      stats: [
        { value: "24%", label: "Increase in conversion rates" },
        { value: "18%", label: "Reduction in cart abandonment" },
        { value: "3.2x", label: "ROI on messaging campaigns" }
      ],
      testimonial: {
        quote: "SOZURI Connect has transformed how we engage with customers throughout their shopping journey. The platform's omnichannel capabilities ensure we reach customers on their preferred channels, resulting in higher engagement and conversion rates.",
        author: "Sarah Johnson",
        company: "Global Retail Inc."
      }
    },
    {
      id: "healthcare",
      title: "Healthcare",
      description: "Secure, compliant patient engagement and operational efficiency",
      icon: <Stethoscope className="h-6 w-6" />,
      color: "bg-blue-500",
      useCases: [
        {
          title: "Appointment Reminders",
          description: "Reduce no-shows with automated appointment reminders and confirmations that include easy rescheduling options."
        },
        {
          title: "Medication Adherence",
          description: "Improve patient outcomes with timely medication reminders and refill notifications."
        },
        {
          title: "Patient Follow-ups",
          description: "Automate post-visit care instructions and follow-up surveys to improve patient satisfaction and outcomes."
        }
      ],
      stats: [
        { value: "42%", label: "Reduction in appointment no-shows" },
        { value: "37%", label: "Improvement in medication adherence" },
        { value: "4.8/5", label: "Patient satisfaction rating" }
      ],
      testimonial: {
        quote: "The HIPAA-compliant messaging capabilities of SOZURI Connect have revolutionized our patient communication strategy. We've seen dramatic improvements in appointment attendance and patient satisfaction.",
        author: "Dr. Michael Chen",
        company: "Metropolitan Health Network"
      }
    },
    {
      id: "financial",
      title: "Financial Services",
      description: "Secure, compliant customer communications for financial institutions",
      icon: <Briefcase className="h-6 w-6" />,
      color: "bg-indigo-500",
      useCases: [
        {
          title: "Transaction Alerts",
          description: "Send real-time notifications for account activities, helping customers stay informed and reducing fraud."
        },
        {
          title: "Secure Document Delivery",
          description: "Deliver statements, tax documents, and other sensitive information through secure messaging channels."
        },
        {
          title: "Loan & Payment Reminders",
          description: "Reduce late payments with timely, automated payment reminders and confirmations."
        }
      ],
      stats: [
        { value: "64%", label: "Reduction in payment delinquencies" },
        { value: "82%", label: "Digital document delivery adoption" },
        { value: "29%", label: "Decrease in call center volume" }
      ],
      testimonial: {
        quote: "Security and compliance are non-negotiable in financial services. SOZURI Connect provides the enterprise-grade security we need while delivering an exceptional customer experience across all our communication channels.",
        author: "James Wilson",
        company: "Global Financial Group"
      }
    },
    {
      id: "education",
      title: "Education",
      description: "Engage students, faculty, and parents with reliable communications",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "bg-amber-500",
      useCases: [
        {
          title: "Emergency Notifications",
          description: "Quickly distribute critical information to students, faculty, and parents during emergencies."
        },
        {
          title: "Attendance & Grade Updates",
          description: "Keep parents informed about student attendance, grades, and academic progress."
        },
        {
          title: "Campus Events & Deadlines",
          description: "Promote campus events, application deadlines, and important academic dates."
        }
      ],
      stats: [
        { value: "94%", label: "Message delivery rate" },
        { value: "56%", label: "Increase in parent engagement" },
        { value: "3.5x", label: "Faster emergency response" }
      ],
      testimonial: {
        quote: "SOZURI Connect has bridged the communication gap between our institution, students, and parents. The platform's reliability and ease of use have made it an essential tool for our administrative operations.",
        author: "Professor Amanda Rodriguez",
        company: "University of Innovation"
      }
    }
  ]
  
  const features = [
    {
      title: "Omnichannel Messaging",
      description: "Reach customers on their preferred channels including SMS, WhatsApp, Viber, and RCS, all from a single platform.",
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      title: "Voice & IVR Solutions",
      description: "Create interactive voice experiences with programmable voice APIs and intelligent IVR systems.",
      icon: <Phone className="h-5 w-5" />
    },
    {
      title: "Advanced Analytics",
      description: "Gain actionable insights with real-time delivery, engagement, and conversion metrics across all channels.",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: "Enterprise Security",
      description: "Protect sensitive data with enterprise-grade security, compliance controls, and data encryption.",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Seamless Integration",
      description: "Connect with your existing systems through our comprehensive API, webhooks, and pre-built integrations.",
      icon: <Zap className="h-5 w-5" />
    },
    {
      title: "Global Reach",
      description: "Deliver messages worldwide with carrier-grade reliability and local number support in over 190 countries.",
      icon: <Globe className="h-5 w-5" />
    }
  ]
  
  const selectedIndustry = industries.find(industry => industry.id === activeIndustry) || industries[0]
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container flex h-20 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.png" alt="SOZURI Logo" width={160} height={50} priority className="h-auto drop-shadow-lg" />
            <span className="ml-2 text-lg font-bold text-primary tracking-tight hidden md:inline">SOZURI Connect</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/overview" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Platform
              </Link>
              <Link href="/overview#industries" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Industries
              </Link>
              <Link href="/overview#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/dashboard/developers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Developers
              </Link>
              <Link href="/dashboard/support" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Support
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/onboarding">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/onboarding">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 to-primary/70 py-20 text-white">
          <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] opacity-20"></div>
          <div className="container relative z-10">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <motion.div variants={fadeIn}>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 border-none mb-4">
                    Enterprise CPaaS Platform
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
                    Intelligent Communication Platform for Global Enterprises
                  </h1>
                  <p className="text-xl text-white/90 max-w-lg">
                    Connect with customers across every channel with our enterprise-grade CPaaS platform. Messaging, voice, and analytics in one powerful solution.
                  </p>
                </motion.div>
                
                <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={fadeIn}>
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                    <Link href="/onboarding">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                    <Link href="/dashboard/developers">
                      View Documentation
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div className="flex flex-wrap gap-6 pt-6" variants={fadeIn}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium">99.99% Uptime SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium">Enterprise Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-sm font-medium">Global Coverage</span>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                  <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white/20 backdrop-blur-sm rounded-full p-3 border border-white/20">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <Image 
                    src="/images/dashboard-preview.png" 
                    alt="SOZURI Connect Dashboard" 
                    width={600} 
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Trusted By Section */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-muted-foreground">Trusted by leading enterprises worldwide</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
              {/* In a real implementation, these would be actual client logos */}
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
              <div className="h-8 w-32 bg-muted rounded"></div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4">Enterprise Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Powerful Communication Capabilities
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform provides everything you need to build exceptional customer experiences across all communication channels.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-primary/10 text-primary">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="gap-1" asChild>
                        <Link href={`/dashboard/developers/features/${feature.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          Learn more
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Industry Solutions Section */}
        <section id="industries" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge className="mb-4">Industry Solutions</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Tailored for Your Industry
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover how SOZURI Connect addresses the unique communication challenges in your industry.
              </p>
            </div>
            
            <Tabs 
              defaultValue={activeIndustry} 
              value={activeIndustry} 
              onValueChange={setActiveIndustry}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {industries.map((industry) => (
                    <TabsTrigger 
                      key={industry.id} 
                      value={industry.id}
                      className="flex items-center gap-2 px-4 py-2"
                    >
                      <div className={`p-1 rounded-full ${industry.color} text-white`}>
                        {industry.icon}
                      </div>
                      <span className="hidden md:inline">{industry.title}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {industries.map((industry) => (
                <TabsContent key={industry.id} value={industry.id} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                      <div className={`inline-flex p-2 rounded-full ${industry.color} text-white mb-2`}>
                        {industry.icon}
                      </div>
                      <h3 className="text-3xl font-bold tracking-tight">{industry.title}</h3>
                      <p className="text-xl text-muted-foreground">{industry.description}</p>
                      
                      <div className="pt-4 space-y-4">
                        {industry.useCases.map((useCase, index) => (
                          <motion.div 
                            key={useCase.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex gap-4"
                          >
                            <div className={`flex-shrink-0 p-2 rounded-full ${industry.color} text-white h-8 w-8 flex items-center justify-center`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{useCase.title}</h4>
                              <p className="text-muted-foreground">{useCase.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="pt-6">
                        <Button size="lg" className={industry.color} asChild>
                          <Link href={`/onboarding?industry=${industry.id}`}>
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      <Card className="border shadow-md">
                        <CardHeader>
                          <CardTitle>Key Metrics</CardTitle>
                          <CardDescription>Results achieved by our {industry.title.toLowerCase()} customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            {industry.stats.map((stat) => (
                              <div key={stat.label} className="text-center p-4">
                                <div className={`text-3xl font-bold text-${industry.color.split('-')[1]}-500 mb-1`}>
                                  {stat.value}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {stat.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      {industry.testimonial && (
                        <Card className="border shadow-md bg-muted/30">
                          <CardContent className="pt-6">
                            <div className="flex flex-col gap-4">
                              <div className="text-lg italic text-muted-foreground">
                                "{industry.testimonial.quote}"
                              </div>
                              <div>
                                <div className="font-semibold">{industry.testimonial.author}</div>
                                <div className="text-sm text-muted-foreground">{industry.testimonial.company}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/90 to-primary/70 text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ready to transform your customer communications?
              </h2>
              <p className="text-xl text-white/90">
                Join thousands of enterprises that trust SOZURI Connect for their mission-critical communications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/onboarding">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20" asChild>
                  <Link href="/dashboard/support">
                    Contact Sales
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-muted py-12 border-t">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/images/logo.png" alt="SOZURI Logo" width={120} height={40} className="h-auto" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Enterprise-grade communication platform for global businesses.
              </p>
              <div className="flex gap-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/overview#features" className="text-sm text-muted-foreground hover:text-primary">Features</Link></li>
                <li><Link href="/overview#industries" className="text-sm text-muted-foreground hover:text-primary">Industries</Link></li>
                <li><Link href="/dashboard/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
                <li><Link href="/dashboard/support" className="text-sm text-muted-foreground hover:text-primary">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Developers</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/developers" className="text-sm text-muted-foreground hover:text-primary">Documentation</Link></li>
                <li><Link href="/dashboard/developers/api-reference" className="text-sm text-muted-foreground hover:text-primary">API Reference</Link></li>
                <li><Link href="/dashboard/developers/guides" className="text-sm text-muted-foreground hover:text-primary">Guides</Link></li>
                <li><Link href="/dashboard/developers/examples" className="text-sm text-muted-foreground hover:text-primary">Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
                <li><Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">Careers</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/security" className="text-sm text-muted-foreground hover:text-primary">Security</Link></li>
                <li><Link href="/compliance" className="text-sm text-muted-foreground hover:text-primary">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SOZURI Connect. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms</Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy</Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-primary">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
