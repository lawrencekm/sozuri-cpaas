"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Activity, 
  Server, 
  Database,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Cpu,
  HardDrive,
  Wifi,
  Users,
  MessageSquare,
  Mail,
  Phone,
  Settings,
  RefreshCw,
  Download,
  Shield
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

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

// Mock system metrics
const systemMetrics = {
  uptime: "99.98%",
  responseTime: "145ms",
  throughput: "1,247 req/min",
  errorRate: "0.02%",
  activeUsers: 342,
  totalMessages: 15678,
  queueSize: 23
}

const serverStatus = [
  {
    id: "api-1",
    name: "API Server 1",
    status: "healthy",
    cpu: 45,
    memory: 67,
    disk: 34,
    uptime: "15d 4h",
    location: "US-East"
  },
  {
    id: "api-2",
    name: "API Server 2",
    status: "healthy",
    cpu: 52,
    memory: 71,
    disk: 28,
    uptime: "15d 4h",
    location: "US-West"
  },
  {
    id: "db-1",
    name: "Database Primary",
    status: "healthy",
    cpu: 23,
    memory: 89,
    disk: 76,
    uptime: "30d 12h",
    location: "US-East"
  },
  {
    id: "queue-1",
    name: "Message Queue",
    status: "warning",
    cpu: 78,
    memory: 45,
    disk: 12,
    uptime: "7d 18h",
    location: "EU-West"
  },
  {
    id: "cache-1",
    name: "Redis Cache",
    status: "healthy",
    cpu: 12,
    memory: 34,
    disk: 8,
    uptime: "22d 6h",
    location: "US-East"
  }
]

const channelMetrics = [
  {
    channel: "SMS",
    icon: MessageSquare,
    sent: 4567,
    delivered: 4521,
    failed: 46,
    deliveryRate: 99.0,
    avgResponseTime: "2.3s",
    status: "healthy"
  },
  {
    channel: "Email",
    icon: Mail,
    sent: 8934,
    delivered: 8876,
    failed: 58,
    deliveryRate: 99.4,
    avgResponseTime: "1.8s",
    status: "healthy"
  },
  {
    channel: "WhatsApp",
    icon: Phone,
    sent: 2341,
    delivered: 2298,
    failed: 43,
    deliveryRate: 98.2,
    avgResponseTime: "3.1s",
    status: "warning"
  },
  {
    channel: "RCS",
    icon: Zap,
    sent: 1234,
    delivered: 1201,
    failed: 33,
    deliveryRate: 97.3,
    avgResponseTime: "4.2s",
    status: "warning"
  }
]

const recentAlerts = [
  {
    id: "1",
    type: "warning",
    message: "High CPU usage on Message Queue server",
    timestamp: "2024-01-20T10:30:00Z",
    severity: "medium",
    resolved: false
  },
  {
    id: "2",
    type: "info",
    message: "Scheduled maintenance completed successfully",
    timestamp: "2024-01-20T09:15:00Z",
    severity: "low",
    resolved: true
  },
  {
    id: "3",
    type: "error",
    message: "WhatsApp API rate limit exceeded",
    timestamp: "2024-01-20T08:45:00Z",
    severity: "high",
    resolved: true
  },
  {
    id: "4",
    type: "warning",
    message: "Database connection pool near capacity",
    timestamp: "2024-01-20T08:20:00Z",
    severity: "medium",
    resolved: false
  }
]

export default function AdminSystemMonitoringPage() {
  const router = useRouter()
  const [selectedTimeframe, setSelectedTimeframe] = useState("1h")
  const [autoRefresh, setAutoRefresh] = useState(true)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return CheckCircle
      case "warning": return AlertTriangle
      case "error": return AlertTriangle
      default: return Clock
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return AlertTriangle
      case "warning": return AlertTriangle
      case "info": return CheckCircle
      default: return Clock
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
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

  const getResourceColor = (percentage: number) => {
    if (percentage >= 80) return "text-red-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="flex flex-col space-y-6">
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
              <p className="text-muted-foreground">Infrastructure health monitoring and performance metrics (Admin Only)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5m">Last 5 min</SelectItem>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </motion.div>

        {/* System Overview */}
        <motion.div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</div>
              <p className="text-xs text-muted-foreground">System Uptime</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{systemMetrics.responseTime}</div>
              <p className="text-xs text-muted-foreground">Avg Response Time</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{systemMetrics.throughput}</div>
              <p className="text-xs text-muted-foreground">Throughput</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{systemMetrics.errorRate}</div>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{systemMetrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{systemMetrics.totalMessages}</div>
              <p className="text-xs text-muted-foreground">Messages Today</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{systemMetrics.queueSize}</div>
              <p className="text-xs text-muted-foreground">Queue Size</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Server Status */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Server Status
              </CardTitle>
              <CardDescription>Infrastructure health and resource utilization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {serverStatus.map((server) => {
                  const StatusIcon = getStatusIcon(server.status)
                  return (
                    <div key={server.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <StatusIcon className={`h-5 w-5 ${
                          server.status === 'healthy' ? 'text-green-600' : 
                          server.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                        }`} />
                        <div>
                          <h3 className="font-medium">{server.name}</h3>
                          <p className="text-sm text-muted-foreground">{server.location} • Uptime: {server.uptime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-1">
                            <Cpu className="h-4 w-4" />
                            <span className={`text-sm font-medium ${getResourceColor(server.cpu)}`}>
                              {server.cpu}%
                            </span>
                          </div>
                          <Progress value={server.cpu} className="w-16 h-2" />
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-1">
                            <Database className="h-4 w-4" />
                            <span className={`text-sm font-medium ${getResourceColor(server.memory)}`}>
                              {server.memory}%
                            </span>
                          </div>
                          <Progress value={server.memory} className="w-16 h-2" />
                        </div>
                        
                        <div className="text-center">
                          <div className="flex items-center gap-2 mb-1">
                            <HardDrive className="h-4 w-4" />
                            <span className={`text-sm font-medium ${getResourceColor(server.disk)}`}>
                              {server.disk}%
                            </span>
                          </div>
                          <Progress value={server.disk} className="w-16 h-2" />
                        </div>
                        
                        <Badge variant="secondary" className={getStatusColor(server.status)}>
                          {server.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Channel Performance & Recent Alerts */}
        <motion.div className="grid gap-6 lg:grid-cols-2" variants={fadeIn}>
          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Channel Performance
              </CardTitle>
              <CardDescription>Messaging channel delivery metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channelMetrics.map((channel) => {
                  const IconComponent = channel.icon
                  return (
                    <div key={channel.channel} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5" />
                        <div>
                          <h3 className="font-medium">{channel.channel}</h3>
                          <p className="text-sm text-muted-foreground">
                            {channel.sent} sent • {channel.delivered} delivered
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            channel.deliveryRate >= 99 ? 'text-green-600' : 
                            channel.deliveryRate >= 95 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {channel.deliveryRate}%
                          </span>
                          <Badge variant="secondary" className={getStatusColor(channel.status)}>
                            {channel.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Avg: {channel.avgResponseTime}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
              <CardDescription>System alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAlerts.map((alert) => {
                  const AlertIcon = getAlertIcon(alert.type)
                  return (
                    <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <AlertIcon className={`h-4 w-4 mt-0.5 ${
                        alert.type === 'error' ? 'text-red-600' : 
                        alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(alert.timestamp)}
                          </span>
                          {alert.resolved && (
                            <Badge variant="secondary" className="text-xs">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4">
                <Button variant="outline" className="w-full" onClick={() => router.push("/admin/monitoring/alerts")}>
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="grid gap-6 md:grid-cols-3" variants={fadeIn}>
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/admin/monitoring/metrics")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Metrics
              </CardTitle>
              <CardDescription>View comprehensive system metrics and charts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Access detailed performance metrics, historical data, and custom dashboards.
              </p>
              <Button variant="outline" className="w-full">
                View Metrics
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/admin/monitoring/logs")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Logs
              </CardTitle>
              <CardDescription>Browse application and system logs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Search and analyze system logs, error traces, and audit trails.
              </p>
              <Button variant="outline" className="w-full">
                View Logs
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/admin/monitoring/settings")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Monitoring Settings
              </CardTitle>
              <CardDescription>Configure alerts and monitoring preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Set up alert thresholds, notification channels, and monitoring policies.
              </p>
              <Button variant="outline" className="w-full">
                Configure
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
