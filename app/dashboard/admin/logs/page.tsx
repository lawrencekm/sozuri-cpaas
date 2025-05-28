"use client"

import { useState, useEffect, useCallback } from "react"
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
import { adminAPI, type LogEntry } from "@/lib/api"
import {
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  AlertCircle,
  Info,
  AlertTriangle,
  XCircle,
  Zap
} from "lucide-react"
import { toast } from "sonner"

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalLogs, setTotalLogs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const logsPerPage = 50

  const loadLogs = useCallback(async () => {
    try {
      setLoading(true)
      const response = await adminAPI.getLogs({
        page: currentPage,
        limit: logsPerPage,
        level: levelFilter && levelFilter !== 'all' ? levelFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchQuery || undefined
      })
      setLogs(response.logs)
      setTotalLogs(response.total)
      setTotalPages(Math.ceil(response.total / logsPerPage))
    } catch (error) {
      console.error('Failed to load logs:', error)

      // Provide fallback mock logs for demo purposes
      const mockLogs: LogEntry[] = [
        {
          id: 'log_1',
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'User login successful',
          source: 'auth',
          userId: 'user_1',
          requestId: 'req_123',
          context: { ip: '192.168.1.100', endpoint: '/auth/login' }
        },
        {
          id: 'log_2',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          level: 'error',
          message: 'API timeout error',
          source: 'api',
          requestId: 'req_124',
          context: { ip: '192.168.1.101', endpoint: '/admin/users' }
        },
        {
          id: 'log_3',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          level: 'warn',
          message: 'Rate limit approaching',
          source: 'messaging',
          userId: 'user_2',
          requestId: 'req_125',
          context: { ip: '192.168.1.102', endpoint: '/messaging/sms' }
        }
      ]

      setLogs(mockLogs)
      setTotalLogs(mockLogs.length)
      setTotalPages(1)
      toast.error('Using demo data - API connection failed')
    } finally {
      setLoading(false)
    }
  }, [currentPage, levelFilter, startDate, endDate, searchQuery])

  // Load logs on component mount and when filters change
  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  const handleSearch = () => {
    setCurrentPage(1)
    loadLogs()
  }

  const handleDownload = async (format: 'json' | 'csv' | 'txt') => {
    try {
      setDownloading(true)
      toast.info(`Preparing ${format.toUpperCase()} download... This may take a moment for large datasets.`)

      const blob = await adminAPI.downloadLogs({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        level: levelFilter || undefined,
        format
      })

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `logs_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Logs downloaded successfully as ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Failed to download logs:', error)

      // For demo purposes, create a sample download
      const sampleData = format === 'json'
        ? JSON.stringify(logs, null, 2)
        : format === 'csv'
        ? 'ID,Timestamp,Level,Message,Source\n' + logs.map(log =>
            `${log.id},${log.timestamp},${log.level},"${log.message}",${log.source}`
          ).join('\n')
        : logs.map(log =>
            `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
          ).join('\n')

      const blob = new Blob([sampleData], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `demo_logs_${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success(`Demo: Downloaded sample ${format.toUpperCase()} file`)
    } finally {
      setDownloading(false)
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug': return <Info className="h-4 w-4 text-blue-500" />
      case 'info': return <Info className="h-4 w-4 text-green-500" />
      case 'warn': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'fatal': return <Zap className="h-4 w-4 text-red-700" />
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'debug': return 'secondary'
      case 'info': return 'default'
      case 'warn': return 'outline'
      case 'error': return 'destructive'
      case 'fatal': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground">View and download system logs</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleDownload('json')}
              disabled={downloading}
            >
              <Download className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload('csv')}
              disabled={downloading}
            >
              <Download className="mr-2 h-4 w-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => handleDownload('txt')}
              disabled={downloading}
            >
              <Download className="mr-2 h-4 w-4" />
              TXT
            </Button>
          </div>
        </div>

        {/* Download Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Bulk Log Download
            </CardTitle>
            <CardDescription>
              Download large volumes of logs (1-2M+ entries) in various formats.
              Use filters to narrow down the dataset before downloading.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">JSON</div>
                <div className="text-sm text-muted-foreground">Structured data format</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">CSV</div>
                <div className="text-sm text-muted-foreground">Spreadsheet compatible</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">TXT</div>
                <div className="text-sm text-muted-foreground">Human readable format</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Log level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warn">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="fatal">Fatal</SelectItem>
                </SelectContent>
              </Select>

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

              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>
              Showing {logs.length} of {totalLogs} logs (Page {currentPage} of {totalPages})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Request ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading logs...
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No logs found
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
                            {getLevelIcon(log.level)}
                            <Badge variant={getLevelBadgeVariant(log.level)}>
                              {log.level}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {log.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.source}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.userId || '-'}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.requestId || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
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
