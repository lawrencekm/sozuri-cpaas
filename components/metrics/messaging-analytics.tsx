"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyticsAPI } from "@/lib/api"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { MessageCircle, MessagesSquare, CheckCircle, AlertCircle } from "lucide-react"

export function MessagingAnalytics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChannel, setSelectedChannel] = useState("sms")
  const [timeframe, setTimeframe] = useState("1d")

  const fetchMessagingMetrics = async () => {
    try {
      const data = await analyticsAPI.getMetrics(selectedChannel, "all", timeframe)
      setMetrics(data)
    } catch (error) {
      console.error("Error fetching messaging metrics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true;
    const fetchMessagingMetricsAsync = async () => {
      try {
        const data = await analyticsAPI.getMetrics(selectedChannel, "all", timeframe);
        if (isMounted) {
          setMetrics(data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching messaging metrics:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    if (isMounted) {
      setIsLoading(true);
      fetchMessagingMetricsAsync();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedChannel, timeframe]) // Keep existing dependencies

  if (isLoading || !metrics) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading messaging metrics...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Messaging Analytics</h2>
          <p className="text-muted-foreground">
            Performance metrics for your messaging channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="viber">Viber</SelectItem>
              <SelectItem value="rcs">RCS</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.deliveryRate}%</div>
            <p className="text-xs text-muted-foreground">Messages successfully delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latency</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.latency}ms</div>
            <p className="text-xs text-muted-foreground">Average delivery time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.errorRate}%</div>
            <p className="text-xs text-muted-foreground">Failed message rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.throughput}/sec</div>
            <p className="text-xs text-muted-foreground">Messages per second</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Message Volume</CardTitle>
            <CardDescription>Number of messages over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.timeSeries}>
                <defs>
                  <linearGradient id="messageVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: any) => [value, "Messages"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#messageVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Delivery rate and latency trends</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
                />
                <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                <YAxis yAxisId="right" orientation="right" stroke="#eab308" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="deliveryRate" 
                  name="Delivery Rate" 
                  stroke="#22c55e" 
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="latency" 
                  name="Latency" 
                  stroke="#eab308" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}