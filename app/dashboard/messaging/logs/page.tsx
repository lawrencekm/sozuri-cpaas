"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { messagingAPI, MessageLog } from "@/lib/api"
import {
  Search,
  Filter,
  Download,
  Calendar,
  MessageSquare,
  Phone,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface MessageLogSummary {
  total_messages: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  total_cost: number;
  channels: {
    sms: number;
    whatsapp: number;
    viber: number;
    rcs: number;
    voice: number;
  };
  directions: {
    inbound: number;
    outbound: number;
  };
}

export default function MessageLogsPage() {
  const [logs, setLogs] = useState<MessageLog[]>([])
  const [summary, setSummary] = useState<MessageLogSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [channelFilter, setChannelFilter] = useState('')
  const [directionFilter, setDirectionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [senderFilter, setSenderFilter] = useState('')
  const [recipientFilter, setRecipientFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  const logsPerPage = 25

  useEffect(() => {
    loadLogs()
  }, [currentPage])

  const loadLogs = async () => {
    try {
      setLoading(true)
      const response = await messagingAPI.getMessageLogs({
        page: currentPage,
        limit: logsPerPage,
        channel: channelFilter || undefined,
        direction: directionFilter || undefined,
        status: statusFilter || undefined,
        sender: senderFilter || undefined,
        recipient: recipientFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchQuery || undefined
      })

      setLogs(response.logs)
      setSummary(response.summary)
      setTotalPages(response.totalPages || Math.ceil(response.total / logsPerPage))
    } catch (error) {
      console.error('Failed to load message logs:', error)
      toast.error('Failed to load message logs')
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    setCurrentPage(1)
    loadLogs()
  }

  const clearFilters = () => {
    setSearchQuery('')
    setChannelFilter('')
    setDirectionFilter('')
    setStatusFilter('')
    setSenderFilter('')
    setRecipientFilter('')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
    loadLogs()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'sent': return <Send className="h-4 w-4 text-blue-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'read': return <Eye className="h-4 w-4 text-purple-500" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered': return 'default'
      case 'sent': return 'secondary'
      case 'pending': return 'outline'
      case 'failed': return 'destructive'
      case 'read': return 'default'
      default: return 'outline'
    }
  }

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'sms': return <MessageSquare className="h-4 w-4" />
      case 'whatsapp': return <MessageSquare className="h-4 w-4 text-green-600" />
      case 'voice': return <Phone className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ?
      <Inbox className="h-4 w-4 text-blue-500" /> :
      <Send className="h-4 w-4 text-green-500" />
  }

  const formatCurrency = (amount: number | null | undefined) => {
    return amount ? `$${amount.toFixed(4)}` : '-'
  }

  const truncateContent = (content: string, maxLength: number = 50) => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Message Logs</h1>
            <p className="text-muted-foreground">Search and filter all message activity across channels</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadLogs} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {summary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.total_messages.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.directions.outbound} sent, {summary.directions.inbound} received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{summary.delivered.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((summary.delivered / summary.total_messages) * 100).toFixed(1)}% delivery rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Failed</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{summary.failed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((summary.failed / summary.total_messages) * 100).toFixed(1)}% failure rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{summary.pending.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting delivery
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <Send className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${summary.total_cost.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  ${(summary.total_cost / summary.total_messages).toFixed(4)} avg per message
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Search & Filters</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages, sender, recipient, campaign..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                />
              </div>

              {showFilters && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Select value={channelFilter} onValueChange={setChannelFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Channels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Channels</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="viber">Viber</SelectItem>
                      <SelectItem value="rcs">RCS</SelectItem>
                      <SelectItem value="voice">Voice</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={directionFilter} onValueChange={setDirectionFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Directions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Directions</SelectItem>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Sender filter..."
                    value={senderFilter}
                    onChange={(e) => setSenderFilter(e.target.value)}
                  />

                  <Input
                    placeholder="Recipient filter..."
                    value={recipientFilter}
                    onChange={(e) => setRecipientFilter(e.target.value)}
                  />

                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="Start date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  <div className="relative">
                    <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="date"
                      placeholder="End date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Logs</CardTitle>
            <CardDescription>
              Showing {logs.length} messages (Page {currentPage} of {totalPages})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        Loading message logs...
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        No message logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getChannelIcon(log.channel)}
                            <span className="capitalize">{log.channel}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDirectionIcon(log.direction)}
                            <span className="capitalize">{log.direction}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.sender}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {log.recipient}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={log.content}>
                            {truncateContent(log.content)}
                          </div>
                          {log.campaign_name && (
                            <div className="text-xs text-muted-foreground">
                              Campaign: {log.campaign_name}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge variant={getStatusBadgeVariant(log.status)}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {formatCurrency(log.cost)}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/messaging/logs/${log.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
