"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { messagingAPI, MessageLog } from "@/lib/api"
import { 
  ArrowLeft,
  MessageSquare,
  Phone,
  Send,
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  Copy,
  ExternalLink,
  User,
  Calendar,
  DollarSign,
  Hash,
  Globe,
  Smartphone
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface DetailedMessageLog extends MessageLog {
  delivery_history?: Array<{
    status: string;
    timestamp: string;
    description: string;
    error_code?: string;
    error_message?: string;
  }>;
  related_messages?: Array<{
    id: string;
    direction: string;
    content: string;
    timestamp: string;
    status: string;
  }>;
}

export default function MessageLogDetailPage() {
  const params = useParams()
  const logId = params.id as string
  
  const [log, setLog] = useState<DetailedMessageLog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (logId) {
      loadMessageLog()
    }
  }, [logId])

  const loadMessageLog = async () => {
    try {
      setLoading(true)
      const response = await messagingAPI.getMessageLogById(logId)
      setLog(response as DetailedMessageLog)
    } catch (error) {
      console.error('Failed to load message log:', error)
      toast.error('Failed to load message log details')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
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
      case 'sms': return <MessageSquare className="h-5 w-5" />
      case 'whatsapp': return <MessageSquare className="h-5 w-5 text-green-600" />
      case 'voice': return <Phone className="h-5 w-5" />
      default: return <MessageSquare className="h-5 w-5" />
    }
  }

  const getDirectionIcon = (direction: string) => {
    return direction === 'inbound' ? 
      <Inbox className="h-5 w-5 text-blue-500" /> : 
      <Send className="h-5 w-5 text-green-500" />
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading message details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!log) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="mt-2 text-muted-foreground">Message log not found</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/messaging/logs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Logs
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/messaging/logs">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Message Details</h1>
            <p className="text-muted-foreground">Message ID: {log.message_id}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getChannelIcon(log.channel)}
                Message Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Channel</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getChannelIcon(log.channel)}
                    <span className="capitalize font-medium">{log.channel}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Direction</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getDirectionIcon(log.direction)}
                    <span className="capitalize font-medium">{log.direction}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(log.status)}
                  <Badge variant={getStatusBadgeVariant(log.status)}>
                    {log.status}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {log.cost && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cost</label>
                  <div className="flex items-center gap-2 mt-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-medium">${log.cost.toFixed(4)} {log.currency}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Sender</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-medium">{log.sender}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.sender)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono font-medium">{log.recipient}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.recipient)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {log.campaign_name && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Campaign</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">{log.campaign_name}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/campaigns/${log.campaign_id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

              {log.template_name && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Template</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">{log.template_name}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/messaging/sms/templates/${log.template_id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Message Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="whitespace-pre-wrap">{log.content}</p>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
              <span>{log.content.length} characters</span>
              <span>{Math.ceil(log.content.length / 160)} SMS segments</span>
            </div>
          </CardContent>
        </Card>

        {log.delivery_history && log.delivery_history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>Timeline of message delivery events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {log.delivery_history.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(event.status)}>
                          {event.status}
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                      {event.error_code && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                          <span className="font-medium text-red-700">Error {event.error_code}:</span>
                          <span className="text-red-600 ml-1">{event.error_message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {log.metadata && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Technical Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message ID</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-sm">{log.message_id}</span>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.message_id)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {log.metadata.reference_id && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Reference ID</label>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-sm">{log.metadata.reference_id}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(log.metadata.reference_id)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {log.metadata.country_code && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{log.metadata.country_code}</span>
                    </div>
                  </div>
                )}

                {log.metadata.device_type && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Device Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium capitalize">{log.metadata.device_type}</span>
                    </div>
                  </div>
                )}

                {log.delivery_attempts && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Delivery Attempts</label>
                    <div className="mt-1">
                      <span className="font-medium">{log.delivery_attempts}</span>
                    </div>
                  </div>
                )}

                {log.metadata.carrier && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Carrier</label>
                    <div className="mt-1">
                      <span className="font-medium">{log.metadata.carrier}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {log.related_messages && log.related_messages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Messages</CardTitle>
              <CardDescription>Other messages in this conversation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {log.related_messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {getDirectionIcon(message.direction)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" size="sm">
                          {message.direction}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(message.status)} size="sm">
                          {message.status}
                        </Badge>
                        <span className="text-xs font-mono text-muted-foreground">
                          {new Date(message.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
