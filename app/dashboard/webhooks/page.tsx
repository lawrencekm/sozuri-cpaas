"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowRight, 
  Plus, 
  Webhook,
  Activity,
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

// Mock webhook stats
const webhookStats = {
  total: 12,
  active: 9,
  failed: 2,
  successRate: 94.2,
  avgResponseTime: 145
}

const recentActivity = [
  {
    id: "1",
    webhook: "Order Notifications",
    event: "order.completed",
    status: "success",
    timestamp: "2024-01-20T10:30:00Z",
    responseTime: 120
  },
  {
    id: "2",
    webhook: "Payment Updates",
    event: "payment.failed",
    status: "failed",
    timestamp: "2024-01-20T10:25:00Z",
    responseTime: null
  },
  {
    id: "3",
    webhook: "User Registration",
    event: "user.created",
    status: "success",
    timestamp: "2024-01-20T10:20:00Z",
    responseTime: 89
  },
  {
    id: "4",
    webhook: "SMS Delivery",
    event: "sms.delivered",
    status: "success",
    timestamp: "2024-01-20T10:15:00Z",
    responseTime: 203
  }
]

export default function WebhooksPage() {
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return CheckCircle
      case "failed": return AlertTriangle
      case "pending": return Clock
      default: return Clock
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Webhook Management</h1>
            <p className="text-muted-foreground">Monitor and manage your webhook endpoints and event notifications</p>
          </div>
          <Button asChild>
            <Link href="/dashboard/webhooks/new">
              <Plus className="mr-2 h-4 w-4" /> New Webhook
            </Link>
          </Button>
        </motion.div>

        {/* Webhook Stats */}
        <motion.div className="grid gap-4 md:grid-cols-5" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{webhookStats.total}</div>
              <p className="text-xs text-muted-foreground">Total Webhooks</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{webhookStats.active}</div>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{webhookStats.failed}</div>
              <p className="text-xs text-muted-foreground">Failed (24h)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{webhookStats.successRate}%</div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{webhookStats.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" variants={fadeIn}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/webhooks/manage")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhooks
              </CardTitle>
              <CardDescription>Manage event notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure endpoints to receive real-time event notifications.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/webhooks/manage">
                  Manage Webhooks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/webhooks/logs")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Logs
              </CardTitle>
              <CardDescription>Monitor webhook activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View delivery status, errors, and performance metrics.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/webhooks/logs">
                  View Logs <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/webhooks/security")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Webhook security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Configure signatures, IP whitelisting, and security policies.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/webhooks/security">
                  Security Settings <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/webhooks/testing")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Testing
              </CardTitle>
              <CardDescription>Test webhook endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Send test events and validate webhook configurations.
              </p>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/webhooks/testing">
                  Test Webhooks <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div className="grid gap-6 lg:grid-cols-2" variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest webhook deliveries and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const StatusIcon = getStatusIcon(activity.status)
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-4 w-4 ${
                          activity.status === 'success' ? 'text-green-600' : 
                          activity.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`} />
                        <div>
                          <p className="font-medium text-sm">{activity.webhook}</p>
                          <p className="text-xs text-muted-foreground">{activity.event}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(activity.timestamp)}
                        </p>
                        {activity.responseTime && (
                          <p className="text-xs text-muted-foreground">
                            {activity.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/webhooks/logs">
                    View All Activity <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Overview
              </CardTitle>
              <CardDescription>Webhook delivery metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">94.2%</div>
                    <p className="text-sm text-green-700">Success Rate</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">145ms</div>
                    <p className="text-sm text-blue-700">Avg Response</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Successful Deliveries</span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Failed Deliveries</span>
                    <span className="font-medium text-red-600">23</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Retry Attempts</span>
                    <span className="font-medium">8</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Events (24h)</span>
                    <span className="font-medium">1,278</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/dashboard/webhooks/analytics">
                    View Analytics <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}
