"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Search, 
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  MoreHorizontal
} from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
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

// Mock webhook logs data
const webhookLogs = [
  {
    id: "log_1",
    webhookName: "Order Notifications",
    webhookUrl: "https://api.example.com/webhooks/orders",
    event: "order.completed",
    status: "success",
    statusCode: 200,
    responseTime: 145,
    timestamp: "2024-01-20T10:30:00Z",
    attempts: 1,
    payload: { orderId: "12345", status: "completed", amount: 99.99 },
    response: { success: true, message: "Order processed" }
  },
  {
    id: "log_2",
    webhookName: "Payment Updates",
    webhookUrl: "https://payments.example.com/webhook",
    event: "payment.failed",
    status: "failed",
    statusCode: 500,
    responseTime: null,
    timestamp: "2024-01-20T10:25:00Z",
    attempts: 3,
    payload: { paymentId: "pay_67890", status: "failed", reason: "insufficient_funds" },
    response: { error: "Internal server error" }
  },
  {
    id: "log_3",
    webhookName: "User Registration",
    webhookUrl: "https://crm.example.com/api/users",
    event: "user.created",
    status: "success",
    statusCode: 201,
    responseTime: 89,
    timestamp: "2024-01-20T10:20:00Z",
    attempts: 1,
    payload: { userId: "user_123", email: "john@example.com", plan: "premium" },
    response: { id: "crm_456", created: true }
  },
  {
    id: "log_4",
    webhookName: "SMS Delivery",
    webhookUrl: "https://analytics.example.com/events",
    event: "sms.delivered",
    status: "success",
    statusCode: 200,
    responseTime: 203,
    timestamp: "2024-01-20T10:15:00Z",
    attempts: 1,
    payload: { messageId: "sms_789", to: "+1234567890", status: "delivered" },
    response: { tracked: true, eventId: "evt_999" }
  },
  {
    id: "log_5",
    webhookName: "Email Campaign",
    webhookUrl: "https://marketing.example.com/webhook",
    event: "email.opened",
    status: "timeout",
    statusCode: null,
    responseTime: null,
    timestamp: "2024-01-20T10:10:00Z",
    attempts: 2,
    payload: { emailId: "email_456", recipient: "jane@example.com", campaign: "newsletter" },
    response: null
  }
]

export default function WebhookLogsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedWebhook, setSelectedWebhook] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h")

  // Filter logs
  const filteredLogs = webhookLogs.filter(log => {
    const matchesSearch = searchQuery === "" || 
      log.webhookName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.webhookUrl.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
    const matchesWebhook = selectedWebhook === "all" || log.webhookName === selectedWebhook
    
    return matchesSearch && matchesStatus && matchesWebhook
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "failed": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "timeout": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "pending": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return CheckCircle
      case "failed": return AlertTriangle
      case "timeout": return Clock
      case "pending": return Clock
      default: return Clock
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const handleViewDetails = (logId: string) => {
    router.push(`/dashboard/webhooks/logs/${logId}`)
  }

  const handleRetryWebhook = (logId: string) => {
    console.log("Retry webhook:", logId)
    // Implement retry logic
  }

  const handleExportLogs = () => {
    console.log("Export logs")
    // Implement export functionality
  }

  // Get unique webhook names for filter
  const uniqueWebhooks = Array.from(new Set(webhookLogs.map(log => log.webhookName)))

  // Calculate summary stats
  const totalLogs = filteredLogs.length
  const successfulLogs = filteredLogs.filter(log => log.status === "success").length
  const failedLogs = filteredLogs.filter(log => log.status === "failed").length
  const timeoutLogs = filteredLogs.filter(log => log.status === "timeout").length

  return (
    <DashboardLayout>
      <motion.div className="flex flex-col space-y-6" initial="hidden" animate="visible" variants={staggerContainer}>
        {/* Header */}
        <motion.div className="flex items-center justify-between" variants={fadeIn}>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/webhooks")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Webhook Logs</h1>
              <p className="text-muted-foreground">Monitor webhook delivery attempts and responses</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div className="grid gap-4 md:grid-cols-4" variants={fadeIn}>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{totalLogs}</div>
              <p className="text-xs text-muted-foreground">Total Requests</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{successfulLogs}</div>
              <p className="text-xs text-muted-foreground">Successful</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{failedLogs}</div>
              <p className="text-xs text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{timeoutLogs}</div>
              <p className="text-xs text-muted-foreground">Timeouts</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeIn}>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="timeout">Timeout</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedWebhook} onValueChange={setSelectedWebhook}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Webhook" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Webhooks</SelectItem>
              {uniqueWebhooks.map((webhook) => (
                <SelectItem key={webhook} value={webhook}>{webhook}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Logs Table */}
        <motion.div variants={fadeIn}>
          <Card>
            <CardHeader>
              <CardTitle>Webhook Delivery Logs</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {webhookLogs.length} webhook delivery attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No logs found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedStatus !== "all" || selectedWebhook !== "all"
                      ? "Try adjusting your search or filters"
                      : "No webhook logs available"}
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Status</TableHead>
                      <TableHead>Webhook</TableHead>
                      <TableHead className="hidden md:table-cell">Event</TableHead>
                      <TableHead className="hidden lg:table-cell">Response Time</TableHead>
                      <TableHead className="hidden sm:table-cell">Attempts</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const StatusIcon = getStatusIcon(log.status)
                      return (
                        <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(log.id)}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <StatusIcon className={`h-4 w-4 ${
                                log.status === 'success' ? 'text-green-600' : 
                                log.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                              }`} />
                              <Badge variant="secondary" className={getStatusColor(log.status)}>
                                {log.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-sm">{log.webhookName}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {log.webhookUrl}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className="text-xs">
                              {log.event}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {log.responseTime ? `${log.responseTime}ms` : "-"}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant={log.attempts > 1 ? "destructive" : "secondary"}>
                              {log.attempts}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatTime(log.timestamp)}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewDetails(log.id)
                                }}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {log.status === "failed" && (
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation()
                                    handleRetryWebhook(log.id)
                                  }}>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Retry
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
}