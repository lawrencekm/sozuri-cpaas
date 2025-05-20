"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Check, AlertTriangle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { handleError, ErrorType } from "@/lib/error-handler"
import { ErrorBoundary } from "@/components/error-handling/error-boundary"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSizeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      size: value,
    }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
 
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Onboarding completed successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      setError(error instanceof Error ? error : new Error('An unexpected error occurred'))
      handleError(error, ErrorType.API, {
        toastMessage: "Failed to complete onboarding. Please try again.",
        context: {
          formData,
          selectedChannels,
          source: 'OnboardingPage.handleComplete'
        }
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const toggleChannel = (channelName: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelName)
        ? prev.filter(name => name !== channelName)
        : [...prev, channelName]
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col onboarding-container">
        <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="SOZURI Logo" width={160} height={50} priority className="h-auto" />
              <span className="ml-2 text-lg font-bold text-onboarding-accent tracking-tight hidden md:inline">SOZURI Connect</span>
            </div>
          </div>
        </header>
        <main className="container flex-1 py-10 flex flex-col items-center justify-center">
          <div className="onboarding-card flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">Onboarding Error</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground text-center">
              {error.message || 'An unexpected error occurred during onboarding. Please try again.'}
            </p>
            <Button
              onClick={() => setError(null)}
              className="mt-6"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col onboarding-container">
        <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur-lg shadow-sm">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <Image src="/images/logo.png" alt="SOZURI Logo" width={160} height={50} priority className="h-auto" />
              <span className="ml-2 text-lg font-bold text-foreground tracking-tight hidden md:inline">SOZURI Connect</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                Sign in
              </Link>
              <Button size="sm" variant="outline" className="font-medium shadow-sm" asChild>
                <Link href="/">
                  Help
                </Link>
              </Button>
            </div>
          </div>
        </header>
        
        <main className="container flex-1 py-10">
          {/* Progress indicator */}
          <div className="mb-10 flex justify-center">
            <div className="relative flex w-full max-w-xl items-center justify-between">
              {/* Progress bar connecting steps */}
              <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
              
              {/* Step circles */}
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all",
                    step < currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : step === currentStep
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground"
                  )}
                >
                  {step < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mx-auto w-full max-w-2xl">
            {currentStep === 1 && (
              <Card className="onboarding-card w-full overflow-hidden">
                <CardHeader className="space-y-2 pb-6">
                  <CardTitle className="text-2xl">Welcome to SOZURI</CardTitle>
                  <CardDescription className="text-base">
                    Let's set up your business on our platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="businessName"
                        name="businessName"
                        placeholder="Enter your business name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        name="industry"
                        placeholder="E.g. Retail, Healthcare, Technology"
                        value={formData.industry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label>Business Size</Label>
                      <RadioGroup
                        value={formData.size}
                        onValueChange={handleSizeChange}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small" className="font-normal">
                            Small (1-50 employees)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium" className="font-normal">
                            Medium (51-500 employees)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large" className="font-normal">
                            Large (500+ employees)
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.businessName || !formData.industry}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="onboarding-card">
                <CardHeader className="space-y-2 pb-6">
                  <CardTitle className="text-2xl">Create your account</CardTitle>
                  <CardDescription className="text-base">
                    You'll use these credentials to access the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
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
                        required
                      />
                      {formData.email && !isValidEmail(formData.email) && (
                        <p className="text-xs text-destructive mt-1">Please enter a valid email address</p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Create password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.name || !formData.email || !formData.password}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="onboarding-card">
                <CardHeader className="space-y-2 pb-6">
                  <CardTitle className="text-2xl">Select communication channels</CardTitle>
                  <CardDescription className="text-base">Choose which platforms best reach your audience</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="messaging">
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="messaging">Messaging</TabsTrigger>
                      <TabsTrigger value="voice">Voice</TabsTrigger>
                      <TabsTrigger value="chat">Chat Apps</TabsTrigger>
                    </TabsList>
                    <TabsContent value="messaging" className="space-y-5">
                      <div className="grid gap-4">
                        <Label>Select all channels you're interested in:</Label>
                        <div className="flex flex-col gap-3">
                          {[
                            { name: "SMS", description: "Reach customers via text messages" },
                            { name: "WhatsApp", description: "Connect through the world's most popular messenger" },
                            { name: "Viber", description: "Engage users on Viber messaging platform" },
                            { name: "RCS", description: "Use rich communication services for Android users" },
                          ].map((channel) => (
                            <div
                              key={channel.name}
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer transition-colors ${
                                selectedChannels.includes(channel.name)
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-accent"
                              }`}
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="voice" className="space-y-5">
                      <div className="grid gap-4">
                        <Label>Select all voice services you're interested in:</Label>
                        <div className="flex flex-col gap-3">
                          {[
                            { name: "Voice Calls", description: "Make and receive phone calls" },
                            { name: "IVR", description: "Interactive Voice Response systems" },
                            { name: "Voice Bot", description: "AI-powered voice assistants" },
                          ].map((service) => (
                            <div
                              key={service.name}
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer transition-colors ${
                                selectedChannels.includes(service.name)
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-accent"
                              }`}
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="chat" className="space-y-5">
                      <div className="grid gap-4">
                        <Label>Select all chat services you're interested in:</Label>
                        <div className="flex flex-col gap-3">
                          {[
                            { name: "Live Chat", description: "Real-time website chat solution" },
                            { name: "Chatbot", description: "AI-powered conversation assistant" },
                            { name: "Omnichannel Inbox", description: "Unified messaging inbox" },
                          ].map((service) => (
                            <div
                              key={service.name}
                              className={`flex items-start space-x-3 rounded-md border p-3 cursor-pointer transition-colors ${
                                selectedChannels.includes(service.name)
                                  ? "border-primary bg-primary/5"
                                  : "hover:bg-accent"
                              }`}
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
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing <RefreshCw className="ml-2 h-4 w-4 animate-spin" /></>
                    ) : (
                      <>Complete Setup <ArrowRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  )
}
