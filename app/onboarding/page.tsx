"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, Rocket } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

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
      staggerChildren: 0.2,
    },
  },
}

const stepVariants = {
  active: { scale: 1.1, backgroundColor: "hsl(var(--primary))", color: "white", borderColor: "hsl(var(--primary))" },
  inactive: { scale: 1, backgroundColor: "transparent" },
  completed: { backgroundColor: "hsl(var(--primary))", color: "white", borderColor: "hsl(var(--primary))" },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    size: "small",
    name: "",
    email: "",
    password: "",
  })

  // Update form field values
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle radio group changes
  const handleSizeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      size: value,
    }))
  }

  // Complete onboarding and redirect to dashboard
  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this data to your backend
    router.push("/dashboard")
  }

  // Add validation states to inputs
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Add this handler
  const toggleChannel = (channelName: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelName)
        ? prev.filter(name => name !== channelName)
        : [...prev, channelName]
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="container flex h-20 items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Image src="/images/logo.png" alt="SOZURI Logo" width={160} height={50} priority className="h-auto drop-shadow-lg" />
            <span className="ml-2 text-lg font-bold text-blue-700 tracking-tight hidden md:inline">SOZURI Connect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-blue-700/70 hover:text-blue-900 transition-colors font-semibold">
              Sign in
            </Link>
            <Button size="sm" variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold shadow-sm" asChild>
              <Link href="/">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container flex-1 py-10 flex flex-col items-center justify-center">
        <motion.div
          className="mx-auto flex max-w-[1100px] flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div className="mb-10 text-center" variants={fadeIn}>
            <div className="flex flex-col items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-4 py-1 text-blue-700 font-semibold text-xs shadow-md mb-4 animate-fade-in">AI-FIRST ONBOARDING</span>
              <Rocket className="h-10 w-10 text-blue-500 drop-shadow-lg animate-bounce-slow mb-2" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 bg-clip-text text-transparent mb-3">Welcome to SOZURI Connect</h1>
            <p className="mt-2 max-w-2xl mx-auto text-lg md:text-xl text-blue-900/80 font-medium mb-1">The intelligent communications platform that transforms how you engage with customers.</p>
            <p className="max-w-2xl mx-auto text-base text-blue-900/60">Complete this quick setup to unlock powerful AI-driven messaging capabilities and join the future of customer engagement.</p>
          </motion.div>

          <div className="w-full mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-blue-700">Step {currentStep} of 3</span>
              <span className="text-sm text-blue-700/80">{Math.round((currentStep/3)*100)}% Complete</span>
            </div>
            <Progress value={(currentStep/3)*100} className="h-2 bg-blue-100" />
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className={`p-6 rounded-2xl shadow-lg bg-white/80 border-2 transition-all ${currentStep === 1 ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Check className={`h-5 w-5 ${currentStep >= 1 ? 'text-blue-500' : 'text-gray-300'}`} />
                <h3 className="text-base font-semibold">Company Setup</h3>
              </div>
              <p className="text-xs text-blue-800/80">Basic business information</p>
            </div>
            <div className={`p-6 rounded-2xl shadow-lg bg-white/80 border-2 transition-all ${currentStep === 2 ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Check className={`h-5 w-5 ${currentStep >= 2 ? 'text-blue-500' : 'text-gray-300'}`} />
                <h3 className="text-base font-semibold">Admin Account</h3>
              </div>
              <p className="text-xs text-blue-800/80">Create administrator credentials</p>
            </div>
            <div className={`p-6 rounded-2xl shadow-lg bg-white/80 border-2 transition-all ${currentStep === 3 ? 'border-blue-500 scale-105' : 'border-transparent'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Check className={`h-5 w-5 ${currentStep >= 3 ? 'text-blue-500' : 'text-gray-300'}`} />
                <h3 className="text-base font-semibold">Configuration</h3>
              </div>
              <p className="text-xs text-blue-800/80">Select communication channels</p>
            </div>
          </div>

          <motion.div className="mb-10 flex w-full max-w-md justify-between" variants={staggerContainer}>
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className="flex flex-col items-center"
                variants={fadeIn}
                animate={step < currentStep ? "completed" : step === currentStep ? "active" : "inactive"}
              >
                <motion.div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-4 shadow-lg bg-white/90 transition-all duration-300 ${
                    step < currentStep
                      ? "border-blue-400 bg-blue-100 text-blue-700"
                      : step === currentStep
                        ? "border-blue-600 text-blue-700 scale-110 animate-bounce-slow"
                        : "border-blue-100 text-blue-300"
                  }`}
                  variants={stepVariants}
                >
                  {step < currentStep ? <Check className="h-6 w-6" /> : step}
                </motion.div>
                <span
                  className={`mt-3 text-sm font-semibold ${
                    step <= currentStep ? "text-blue-900" : "text-blue-300"
                  }`}
                >
                  {step === 1 ? "Company Details" : step === 2 ? "Your Profile" : "Communication Needs"}
                </span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="w-full max-w-md" variants={fadeIn}>
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card className="rounded-2xl shadow-xl bg-white/80 backdrop-blur-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-blue-700 text-xl font-bold">Tell us about your company</CardTitle>
                    <CardDescription className="text-blue-900/70">Help us tailor SOZURI Connect to your specific business needs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div className="grid gap-4" variants={staggerContainer} initial="hidden" animate="visible">
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label htmlFor="businessName" className="font-semibold text-blue-900">Company name</Label>
                        <Input
                          id="businessName"
                          name="businessName"
                          placeholder="Enter your company name"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        />
                      </motion.div>
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label htmlFor="industry" className="font-semibold text-blue-900">Industry</Label>
                        <Input
                          id="industry"
                          name="industry"
                          placeholder="e.g., Retail, Healthcare, Finance"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="rounded-lg border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        />
                      </motion.div>
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label className="font-semibold text-blue-900">Company size</Label>
                        <RadioGroup value={formData.size} onValueChange={handleSizeChange} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="small" id="small" />
                            <Label htmlFor="small">Small (1-50 employees)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium (51-500 employees)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="large" id="large" />
                            <Label htmlFor="large">Large (500+ employees)</Label>
                          </div>
                        </RadioGroup>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-500 transition-all"
                      onClick={() => setCurrentStep(2)}
                      disabled={!formData.businessName || !formData.industry}
                    >
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Create your administrator account</CardTitle>
                    <CardDescription>
                      You'll use these credentials to access the SOZURI Connect platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div className="grid gap-4" variants={staggerContainer} initial="hidden" animate="visible">
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label htmlFor="name">Full name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </motion.div>
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label htmlFor="email">Work email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your.name@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={cn(
                            formData.email && !isValidEmail(formData.email) && "border-destructive"
                          )}
                        />
                        {formData.email && !isValidEmail(formData.email) && (
                          <p className="text-xs text-destructive mt-1">Please enter a valid email address</p>
                        )}
                      </motion.div>
                      <motion.div className="grid gap-2" variants={fadeIn}>
                        <Label htmlFor="password">Create password</Label>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Create a secure password"
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!formData.name || !formData.email || !formData.password}
                    >
                      Next Step <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Select your communication channels</CardTitle>
                    <CardDescription>Choose which messaging platforms best reach your audience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="messaging">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="messaging">Messaging</TabsTrigger>
                        <TabsTrigger value="voice">Voice</TabsTrigger>
                        <TabsTrigger value="chat">Chat Apps</TabsTrigger>
                      </TabsList>
                      <TabsContent value="messaging" className="space-y-4 pt-4">
                        <div className="grid gap-3">
                          <Label>Select all channels you're interested in:</Label>
                          <motion.div
                            className="flex flex-col gap-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {[
                              { name: "SMS", description: "Reach customers via text messages" },
                              { name: "WhatsApp", description: "Connect through the world's most popular messenger" },
                              { name: "Viber", description: "Engage users on Viber messaging platform" },
                              { name: "RCS", description: "Use rich communication services for Android users" },
                            ].map((channel) => (
                              <motion.div
                                key={channel.name}
                                className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${
                                  selectedChannels.includes(channel.name)
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent"
                                }`}
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleChannel(channel.name)}
                              >
                                <div className="flex-shrink-0">
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                    selectedChannels.includes(channel.name)
                                      ? "bg-primary text-white"
                                      : "bg-primary/10 text-primary"
                                  }`}>
                                    {selectedChannels.includes(channel.name) && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{channel.name}</h4>
                                  <p className="text-xs text-muted-foreground">{channel.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </TabsContent>
                      <TabsContent value="voice" className="space-y-4 pt-4">
                        <div className="grid gap-3">
                          <Label>Select all voice services you're interested in:</Label>
                          <motion.div
                            className="flex flex-col gap-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {[
                              { name: "Voice Calls", description: "Make and receive phone calls" },
                              { name: "IVR", description: "Interactive Voice Response systems" },
                              { name: "Voice Bot", description: "AI-powered voice assistants" },
                            ].map((service) => (
                              <motion.div
                                key={service.name}
                                className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${
                                  selectedChannels.includes(service.name)
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent"
                                }`}
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleChannel(service.name)}
                              >
                                <div className="flex-shrink-0">
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                    selectedChannels.includes(service.name)
                                      ? "bg-primary text-white"
                                      : "bg-primary/10 text-primary"
                                  }`}>
                                    {selectedChannels.includes(service.name) && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{service.name}</h4>
                                  <p className="text-xs text-muted-foreground">{service.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </TabsContent>
                      <TabsContent value="chat" className="space-y-4 pt-4">
                        <div className="grid gap-3">
                          <Label>Select all chat services you're interested in:</Label>
                          <motion.div
                            className="flex flex-col gap-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {[
                              { name: "Live Chat", description: "Real-time website chat solution" },
                              { name: "Chatbot", description: "AI-powered conversation assistant" },
                              { name: "Omnichannel Inbox", description: "Unified messaging inbox" },
                            ].map((service) => (
                              <motion.div
                                key={service.name}
                                className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer ${
                                  selectedChannels.includes(service.name)
                                    ? "border-primary bg-primary/5"
                                    : "hover:bg-accent"
                                }`}
                                variants={fadeIn}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => toggleChannel(service.name)}
                              >
                                <div className="flex-shrink-0">
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
                                    selectedChannels.includes(service.name)
                                      ? "bg-primary text-white"
                                      : "bg-primary/10 text-primary"
                                  }`}>
                                    {selectedChannels.includes(service.name) && (
                                      <Check className="h-4 w-4" />
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium">{service.name}</h4>
                                  <p className="text-xs text-muted-foreground">{service.description}</p>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setCurrentStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleComplete} className="bg-primary hover:bg-primary/90">
                      Complete Setup <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>🎉 Setup Complete!</CardTitle>
                    <CardDescription>You're ready to start using SOZURI Connect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 border rounded-lg">
                        <Rocket className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-medium">Next Steps</h4>
                          <p className="text-sm text-muted-foreground">
                            Create your first API key and explore documentation
                          </p>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => router.push('/dashboard')}>
                        Go to Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
      <footer className="border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SOZURI Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/" className="hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
