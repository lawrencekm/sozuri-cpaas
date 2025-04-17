"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, MessageSquare, Send } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import DashboardLayout from "@/components/layout/dashboard-layout"

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

export default function QuickSendPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    recipient: "",
    message: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send this to your backend
      console.log("Sending message:", formData)
      setIsSending(false)
      setIsSent(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard/messaging/sms")
      }, 2000)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center gap-2" variants={fadeIn}>
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/sms")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quick Send SMS</h1>
            <p className="text-muted-foreground">Send a one-time SMS message to a single recipient</p>
          </div>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-2" variants={staggerContainer}>
          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Message Details</CardTitle>
                <CardDescription>Enter the recipient and message content</CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="recipient">Recipient Phone Number</Label>
                    <Input
                      id="recipient"
                      name="recipient"
                      placeholder="Enter phone number with country code"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Format: +1234567890 (include country code)</p>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="message">Message Content</Label>
                      <span className="text-xs text-muted-foreground">{formData.message.length}/160 characters</span>
                    </div>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Type your message here"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard/messaging/sms/templates">
                      <FileText className="mr-2 h-4 w-4" /> Use Template
                    </Link>
                  </Button>
                  <Button type="submit" disabled={!formData.recipient || !formData.message || isSending || isSent}>
                    {isSending ? (
                      <>Sending...</>
                    ) : isSent ? (
                      <>Message Sent</>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview how your message will appear to the recipient</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">SOZURI</p>
                      <div className="rounded-lg bg-white p-3 shadow-sm">
                        <p className="text-sm">{formData.message || "Your message preview will appear here"}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Delivered • Now</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Recipient:</span>
                    <span className="font-medium">{formData.recipient || "Not specified"}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Message Length:</span>
                    <span className="font-medium">{formData.message.length} / 160 characters</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">SMS Segments:</span>
                    <span className="font-medium">{Math.ceil(formData.message.length / 160) || 1}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Tips</CardTitle>
                <CardDescription>Best practices for SMS messaging</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      1
                    </div>
                    <p>Keep messages concise and to the point</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      2
                    </div>
                    <p>Include a clear call-to-action if applicable</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      3
                    </div>
                    <p>Always identify yourself at the beginning of the message</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      4
                    </div>
                    <p>Include opt-out instructions for marketing messages</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
