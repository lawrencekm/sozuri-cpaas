"use client"

import React, { useCallback, useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { messagingAPI, type MessageLog } from "@/lib/api"
import { Calendar, Search } from "lucide-react"

type VoiceLog = {
  id: string
  timestamp: string
  from: string
  to: string
  status: "queued" | "ringing" | "in-progress" | "completed" | "failed"
  durationSeconds?: number
}

export default function VoiceLogsPage() {
  const [logs, setLogs] = useState<VoiceLog[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(50)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)

  // Filters
  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState<string>("")
  const [fromNumber, setFromNumber] = useState<string>("")
  const [toNumber, setToNumber] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await messagingAPI.getMessageLogs({
        page,
        limit,
        channel: "voice",
        status: status || undefined,
        sender: fromNumber || undefined,
        recipient: toNumber || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: search || undefined,
      })

      const normalized: VoiceLog[] = (res.logs as MessageLog[]).map((m) => ({
        id: m.id,
        timestamp: m.timestamp,
        from: m.sender,
        to: m.recipient,
        status: (m.status as VoiceLog["status"]) || "completed",
        durationSeconds: (m as any).durationSeconds ?? (m as any).duration ?? undefined,
      }))

      setLogs(normalized)
      setTotal(res.total)
      setTotalPages(res.totalPages || Math.max(1, Math.ceil(res.total / limit)))
    } catch (e) {
      // Fall back to empty state if API fails; errors are handled globally in api.ts
      setLogs([])
      setTotal(0)
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [page, limit, status, fromNumber, toNumber, startDate, endDate, search])

  useEffect(() => {
    load()
  }, [load])

  const formatDuration = (s?: number) => {
    if (!s && s !== 0) return "-"
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}m ${r}s`
  }

  const statusVariant = (status: VoiceLog["status"]) => {
    switch (status) {
      case "completed":
        return "default" as const
      case "in-progress":
        return "secondary" as const
      case "queued":
        return "outline" as const
      case "ringing":
        return "secondary" as const
      case "failed":
        return "destructive" as const
      default:
        return "outline" as const
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Voice Logs</h1>
          <p className="text-muted-foreground">Recent call activity across your projects</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search call ID, number, status…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="ringing">Ringing</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="From number"
                value={fromNumber}
                onChange={(e) => setFromNumber(e.target.value)}
              />

              <Input
                placeholder="To number"
                value={toNumber}
                onChange={(e) => setToNumber(e.target.value)}
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

              <div className="md:col-span-2 lg:col-span-6">
                <Button onClick={() => { setPage(1); load(); }}>Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
            <CardDescription>
              {loading ? "Loading..." : `Showing ${logs.length} of ${total} (Page ${page} of ${totalPages || 1})`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Call ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">Loading calls…</TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">No calls found</TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.from}</TableCell>
                        <TableCell>{log.to}</TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(log.status)}>{log.status}</Badge>
                        </TableCell>
                        <TableCell>{formatDuration(log.durationSeconds)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.id}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(Math.min(totalPages, page + 1))}>Next</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}


