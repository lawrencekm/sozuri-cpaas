"use client"

import { useState, useEffect, useRef } from "react"
import { formatTime } from "@/lib/date-formatter"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  RefreshCw,
  Clock,
  BarChart3,
  ArrowUpRight,
  MessageCircle,
  Phone,
  MessagesSquare
} from "lucide-react"
import {
  DeliveryRateMetricCard,
  LatencyMetricCard,
  ErrorRateMetricCard,
  CostMetricCard,
  ThroughputMetricCard,
  ConversionRateMetricCard
} from "./advanced-metric-card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

// Mock data for real-time metrics
const generateMockData = () => {
  return {
    sms: {
      deliveryRate: (95 + Math.random() * 4).toFixed(1),
      latency: Math.floor(80 + Math.random() * 50),
      errorRate: (0.5 + Math.random() * 1).toFixed(1),
      cost: (1250 + Math.random() * 200).toFixed(2),
      throughput: Math.floor(150 + Math.random() * 50),
      conversionRate: (8 + Math.random() * 4).toFixed(1),
    },
    whatsapp: {
      deliveryRate: (97 + Math.random() * 2.5).toFixed(1),
      latency: Math.floor(60 + Math.random() * 40),
      errorRate: (0.2 + Math.random() * 0.8).toFixed(1),
      cost: (980 + Math.random() * 150).toFixed(2),
      throughput: Math.floor(120 + Math.random() * 40),
      conversionRate: (10 + Math.random() * 5).toFixed(1),
    },
    voice: {
      deliveryRate: (98 + Math.random() * 1.8).toFixed(1),
      latency: Math.floor(40 + Math.random() * 30),
      errorRate: (0.1 + Math.random() * 0.7).toFixed(1),
      cost: (2100 + Math.random() * 300).toFixed(2),
      throughput: Math.floor(90 + Math.random() * 30),
      conversionRate: (12 + Math.random() * 6).toFixed(1),
    }
  }
}

// Mock time-series data for charts
const generateTimeSeriesData = () => {
  const now = new Date()
  const data = []

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 15 * 60000) // 15-minute intervals
    data.push({
      time: formatTime(time),
      sms: Math.floor(80 + Math.random() * 40),
      whatsapp: Math.floor(60 + Math.random() * 30),
      voice: Math.floor(30 + Math.random() * 20),
      deliveryRate: 95 + Math.random() * 4,
      errorRate: 0.5 + Math.random() * 1.5,
      latency: 80 + Math.random() * 50,
    })
  }

  return data
}

export function RealTimeDashboard() {
  const [metrics, setMetrics] = useState(generateMockData())
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData())
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("sms")
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30000) // 30 seconds default
  const mounted = useRef(true); // Mounted ref

  // Add this useEffect for mounted ref management
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Function to refresh data
  const refreshData = () => {
    if (!mounted.current) return; // Check if component is mounted before starting refresh
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      if (mounted.current) { // Check again inside timeout callback
        setMetrics(generateMockData())
        setTimeSeriesData(prev => {
          const newData = [...prev]
          const now = new Date()

          // Add new data point
          newData.push({
            time: formatTime(now),
            sms: Math.floor(80 + Math.random() * 40),
            whatsapp: Math.floor(60 + Math.random() * 30),
            voice: Math.floor(30 + Math.random() * 20),
            deliveryRate: 95 + Math.random() * 4,
            errorRate: 0.5 + Math.random() * 1.5,
            latency: 80 + Math.random() * 50,
          })

          // Remove oldest data point to keep 24 points
          if (newData.length > 24) {
            newData.shift()
          }

          return newData
        })

        setLastUpdated(new Date())
        setIsLoading(false)
      }
    }, 800)
  }

  // Set up auto-refresh
  useEffect(() => {
    if (!refreshInterval) return

    const intervalId = setInterval(refreshData, refreshInterval)

    return () => clearInterval(intervalId)
  }, [refreshInterval])

  // Format the last updated time
  const formattedLastUpdated = formatTime(lastUpdated)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real-Time Metrics</h2>
          <p className="text-muted-foreground">
            Live performance metrics across all communication channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {formattedLastUpdated}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={refreshInterval === 10000 ? "default" : "ghost"}
              size="sm"
              onClick={() => setRefreshInterval(10000)}
              className="h-8 rounded-none px-2"
            >
              10s
            </Button>
            <Button
              variant={refreshInterval === 30000 ? "default" : "ghost"}
              size="sm"
              onClick={() => setRefreshInterval(30000)}
              className="h-8 rounded-none px-2"
            >
              30s
            </Button>
            <Button
              variant={refreshInterval === 60000 ? "default" : "ghost"}
              size="sm"
              onClick={() => setRefreshInterval(60000)}
              className="h-8 rounded-none px-2"
            >
              1m
            </Button>
            <Button
              variant={refreshInterval === null ? "default" : "ghost"}
              size="sm"
              onClick={() => setRefreshInterval(null)}
              className="h-8 rounded-none px-2"
            >
              Off
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="sms" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="sms" className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span>SMS</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-1.5">
            <MessagesSquare className="h-4 w-4" />
            <span>WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" />
            <span>Voice</span>
          </TabsTrigger>
        </TabsList>

        {/* SMS Metrics */}
        <TabsContent value="sms" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DeliveryRateMetricCard
              value={metrics.sms.deliveryRate}
              change="+1.2%"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?metric=delivery-rate"
              isLoading={isLoading}
            />
            <LatencyMetricCard
              value={metrics.sms.latency}
              change="-5ms"
              trend="down"
              detailsLink="/dashboard/analytics/messaging?metric=latency"
              isLoading={isLoading}
            />
            <ErrorRateMetricCard
              value={metrics.sms.errorRate}
              change="-0.3%"
              trend="down"
              detailsLink="/dashboard/analytics/messaging?metric=error-rate"
              isLoading={isLoading}
            />
            <CostMetricCard
              value={metrics.sms.cost}
              change="+$120.50"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?metric=cost"
              isLoading={isLoading}
            />
            <ThroughputMetricCard
              value={metrics.sms.throughput}
              change="+15/sec"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?metric=throughput"
              isLoading={isLoading}
            />
            <ConversionRateMetricCard
              value={metrics.sms.conversionRate}
              change="+0.8%"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?metric=conversion"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Message Volume (Last 6 Hours)</CardTitle>
                <CardDescription>Number of SMS messages sent over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="smsColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sms" stroke="#2563eb" fillOpacity={1} fill="url(#smsColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                <CardDescription>Delivery rate, error rate, and latency trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                    <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="deliveryRate" stroke="#2563eb" name="Delivery Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Error Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#eab308" name="Latency (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WhatsApp Metrics */}
        <TabsContent value="whatsapp" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DeliveryRateMetricCard
              value={metrics.whatsapp.deliveryRate}
              change="+0.8%"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=delivery-rate"
              isLoading={isLoading}
            />
            <LatencyMetricCard
              value={metrics.whatsapp.latency}
              change="-8ms"
              trend="down"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=latency"
              isLoading={isLoading}
            />
            <ErrorRateMetricCard
              value={metrics.whatsapp.errorRate}
              change="-0.2%"
              trend="down"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=error-rate"
              isLoading={isLoading}
            />
            <CostMetricCard
              value={metrics.whatsapp.cost}
              change="+$85.30"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=cost"
              isLoading={isLoading}
            />
            <ThroughputMetricCard
              value={metrics.whatsapp.throughput}
              change="+12/sec"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=throughput"
              isLoading={isLoading}
            />
            <ConversionRateMetricCard
              value={metrics.whatsapp.conversionRate}
              change="+1.2%"
              trend="up"
              detailsLink="/dashboard/analytics/messaging?channel=whatsapp&metric=conversion"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Message Volume (Last 6 Hours)</CardTitle>
                <CardDescription>Number of WhatsApp messages sent over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="whatsappColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="whatsapp" stroke="#22c55e" fillOpacity={1} fill="url(#whatsappColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                <CardDescription>Delivery rate, error rate, and latency trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" stroke="#22c55e" />
                    <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="deliveryRate" stroke="#22c55e" name="Delivery Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Error Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#eab308" name="Latency (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Metrics */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DeliveryRateMetricCard
              value={metrics.voice.deliveryRate}
              change="+0.5%"
              trend="up"
              detailsLink="/dashboard/analytics/voice?metric=delivery-rate"
              isLoading={isLoading}
            />
            <LatencyMetricCard
              value={metrics.voice.latency}
              change="-12ms"
              trend="down"
              detailsLink="/dashboard/analytics/voice?metric=latency"
              isLoading={isLoading}
            />
            <ErrorRateMetricCard
              value={metrics.voice.errorRate}
              change="-0.1%"
              trend="down"
              detailsLink="/dashboard/analytics/voice?metric=error-rate"
              isLoading={isLoading}
            />
            <CostMetricCard
              value={metrics.voice.cost}
              change="+$210.75"
              trend="up"
              detailsLink="/dashboard/analytics/voice?metric=cost"
              isLoading={isLoading}
            />
            <ThroughputMetricCard
              value={metrics.voice.throughput}
              change="+8/sec"
              trend="up"
              detailsLink="/dashboard/analytics/voice?metric=throughput"
              isLoading={isLoading}
            />
            <ConversionRateMetricCard
              value={metrics.voice.conversionRate}
              change="+1.5%"
              trend="up"
              detailsLink="/dashboard/analytics/voice?metric=conversion"
              isLoading={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Call Volume (Last 6 Hours)</CardTitle>
                <CardDescription>Number of voice calls over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeSeriesData}>
                    <defs>
                      <linearGradient id="voiceColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="voice" stroke="#f97316" fillOpacity={1} fill="url(#voiceColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                <CardDescription>Delivery rate, error rate, and latency trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" orientation="left" stroke="#f97316" />
                    <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                    <Tooltip />
                    <Line yAxisId="left" type="monotone" dataKey="deliveryRate" stroke="#f97316" name="Connection Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Drop Rate (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="latency" stroke="#eab308" name="Setup Time (ms)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
