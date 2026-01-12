"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  Mail, 
  Server, 
  Shield, 
  Settings,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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

export default function EmailSettingsPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle")

  const [smtpSettings, setSmtpSettings] = useState({
    host: "smtp.sozuri.com",
    port: "587",
    username: "noreply@sozuri.com",
    password: "",
    encryption: "tls",
    fromName: "SOZURI",
    fromEmail: "noreply@sozuri.com",
    replyToEmail: "support@sozuri.com"
  })

  const [emailSettings, setEmailSettings] = useState({
    enableTracking: true,
    enableUnsubscribe: true,
    enableBounceHandling: true,
    enableSpamCompliance: true,
    maxSendRate: "1000",
    dailyLimit: "10000",
    enableDKIM: true,
    enableSPF: true,
    enableDMARC: false
  })

  const handleSmtpChange = (field: string, value: string) => {
    setSmtpSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleEmailSettingChange = (field: string, value: boolean | string) => {
    setEmailSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const testConnection = async () => {
    setIsTestingConnection(true)
    setConnectionStatus("idle")
    
    // Simulate API call
    setTimeout(() => {
      setConnectionStatus("success")
      setIsTestingConnection(false)
    }, 2000)
  }

  const saveSettings = () => {
    console.log("Saving email settings:", { smtpSettings, emailSettings })
    // In real app, make API call to save settings
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/messaging/email")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Email Settings</h1>
              <p className="text-muted-foreground">Configure SMTP and email delivery settings</p>
            </div>
          </div>
          <Button onClick={saveSettings}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Tabs defaultValue="smtp" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="smtp">SMTP Configuration</TabsTrigger>
              <TabsTrigger value="delivery">Delivery Settings</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
            </TabsList>

            <TabsContent value="smtp" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    SMTP Server Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your SMTP server settings for sending emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="smtp-host">SMTP Host</Label>
                      <Input
                        id="smtp-host"
                        value={smtpSettings.host}
                        onChange={(e) => handleSmtpChange("host", e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Select value={smtpSettings.port} onValueChange={(value) => handleSmtpChange("port", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25">25 (Standard)</SelectItem>
                          <SelectItem value="587">587 (TLS)</SelectItem>
                          <SelectItem value="465">465 (SSL)</SelectItem>
                          <SelectItem value="2525">2525 (Alternative)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="smtp-username">Username</Label>
                      <Input
                        id="smtp-username"
                        value={smtpSettings.username}
                        onChange={(e) => handleSmtpChange("username", e.target.value)}
                        placeholder="username@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="smtp-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="smtp-password"
                          type={showPassword ? "text" : "password"}
                          value={smtpSettings.password}
                          onChange={(e) => handleSmtpChange("password", e.target.value)}
                          placeholder="Enter SMTP password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="encryption">Encryption</Label>
                    <Select value={smtpSettings.encryption} onValueChange={(value) => handleSmtpChange("encryption", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Button 
                      onClick={testConnection} 
                      disabled={isTestingConnection}
                      variant="outline"
                    >
                      {isTestingConnection ? "Testing..." : "Test Connection"}
                    </Button>
                    {connectionStatus === "success" && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Connection successful</span>
                      </div>
                    )}
                    {connectionStatus === "error" && (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Connection failed</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Default Sender Information
                  </CardTitle>
                  <CardDescription>
                    Set default sender details for outgoing emails
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="from-name">From Name</Label>
                      <Input
                        id="from-name"
                        value={smtpSettings.fromName}
                        onChange={(e) => handleSmtpChange("fromName", e.target.value)}
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="from-email">From Email</Label>
                      <Input
                        id="from-email"
                        type="email"
                        value={smtpSettings.fromEmail}
                        onChange={(e) => handleSmtpChange("fromEmail", e.target.value)}
                        placeholder="noreply@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reply-to">Reply-To Email</Label>
                    <Input
                      id="reply-to"
                      type="email"
                      value={smtpSettings.replyToEmail}
                      onChange={(e) => handleSmtpChange("replyToEmail", e.target.value)}
                      placeholder="support@example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="delivery" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Settings</CardTitle>
                  <CardDescription>Configure email delivery and rate limiting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="send-rate">Max Send Rate (emails/hour)</Label>
                      <Input
                        id="send-rate"
                        type="number"
                        value={emailSettings.maxSendRate}
                        onChange={(e) => handleEmailSettingChange("maxSendRate", e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="daily-limit">Daily Send Limit</Label>
                      <Input
                        id="daily-limit"
                        type="number"
                        value={emailSettings.dailyLimit}
                        onChange={(e) => handleEmailSettingChange("dailyLimit", e.target.value)}
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Email Tracking</Label>
                        <p className="text-sm text-muted-foreground">Track opens and clicks in emails</p>
                      </div>
                      <Switch
                        checked={emailSettings.enableTracking}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableTracking", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Bounce Handling</Label>
                        <p className="text-sm text-muted-foreground">Automatically handle bounced emails</p>
                      </div>
                      <Switch
                        checked={emailSettings.enableBounceHandling}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableBounceHandling", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Enable Unsubscribe Links</Label>
                        <p className="text-sm text-muted-foreground">Include unsubscribe links in marketing emails</p>
                      </div>
                      <Switch
                        checked={emailSettings.enableUnsubscribe}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableUnsubscribe", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Email Authentication
                  </CardTitle>
                  <CardDescription>
                    Configure email authentication protocols to improve deliverability
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Label>DKIM Signing</Label>
                          <Badge variant={emailSettings.enableDKIM ? "default" : "secondary"}>
                            {emailSettings.enableDKIM ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          DomainKeys Identified Mail for email authentication
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.enableDKIM}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableDKIM", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Label>SPF Records</Label>
                          <Badge variant={emailSettings.enableSPF ? "default" : "secondary"}>
                            {emailSettings.enableSPF ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Sender Policy Framework for email validation
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.enableSPF}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableSPF", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <Label>DMARC Policy</Label>
                          <Badge variant={emailSettings.enableDMARC ? "default" : "secondary"}>
                            {emailSettings.enableDMARC ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Domain-based Message Authentication, Reporting & Conformance
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.enableDMARC}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableDMARC", checked)}
                      />
                    </div>
                  </div>

                  {emailSettings.enableDKIM && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        DKIM is enabled. Make sure to add the DKIM DNS records to your domain for proper authentication.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Settings</CardTitle>
                  <CardDescription>Configure compliance and anti-spam settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Spam Compliance</Label>
                        <p className="text-sm text-muted-foreground">
                          Automatically check emails for spam compliance
                        </p>
                      </div>
                      <Switch
                        checked={emailSettings.enableSpamCompliance}
                        onCheckedChange={(checked) => handleEmailSettingChange("enableSpamCompliance", checked)}
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Ensure your emails comply with CAN-SPAM Act, GDPR, and other applicable regulations.
                      Always include unsubscribe links in marketing emails.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
