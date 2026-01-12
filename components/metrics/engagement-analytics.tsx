"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyticsAPI } from "@/lib/api"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Users, Clock, TrendingUp, MessagesSquare } from "lucide-react"

// Map metrics API response to engagementData shape
function mapMetricsToEngagementData(metrics: any, channel: string) {
  return {
    activeUsers: metrics.timeSeries?.reduce((max: number, point: any) => Math.max(max, point.value), 0) || 0,
    responseRate: metrics.deliveryRate || 0,
    messagesSent: metrics.timeSeries?.reduce((sum: number, point: any) => sum + point.value, 0) || 0,
    averageResponseTime: metrics.latency || 0,
    channelPreferences: { [metrics.channel || channel]: metrics.throughput || 0 },
    userSegments: [
      { segment: "Highly Engaged", count: Math.round((metrics.deliveryRate || 0) * 0.5) },
      { segment: "Moderately Engaged", count: Math.round((metrics.deliveryRate || 0) * 0.3) },
      { segment: "Low Engagement", count: Math.round((metrics.deliveryRate || 0) * 0.2) },
    ],
  }
}

export function EngagementAnalytics() {
  const [engagementData, setEngagementData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("1d")
  const [channel] = useState("sms") // Default channel, can be made dynamic if needed
  const [metric] = useState("engagement") // Placeholder metric, can be customized

  const fetchEngagementData = async () => {
    try {
      const metrics = await analyticsAPI.getMetrics(channel, metric, timeframe)
      setEngagementData(mapMetricsToEngagementData(metrics, channel))
    } catch (error) {
      console.error("Error fetching engagement data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true;
    const fetchEngagementDataAsync = async () => {
      try {
        const metrics = await analyticsAPI.getMetrics(channel, metric, timeframe);
        if (isMounted) {
          setEngagementData(mapMetricsToEngagementData(metrics, channel));
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching engagement data:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    setIsLoading(true);
    fetchEngagementDataAsync();
    return () => {
      isMounted = false;
    };
  }, [timeframe, channel, metric]);

  if (isLoading || !engagementData) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading engagement data...</div>
      </div>
    )
  }

  const segmentColors = {
    "Highly Engaged": "#22c55e",
    "Moderately Engaged": "#f59e0b",
    "Low Engagement": "#ef4444"
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Last {timeframe === "1d" ? "24 hours" : "7 days"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.responseRate}%</div>
            <p className="text-xs text-muted-foreground">Average response rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessagesSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.messagesSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementData.averageResponseTime}m</div>
            <p className="text-xs text-muted-foreground">Average time to respond</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Channel Preferences</CardTitle>
            <CardDescription>User engagement by channel</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(engagementData.channelPreferences).map(([channel, value]) => ({
                channel,
                value
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="channel" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Segments</CardTitle>
            <CardDescription>Distribution of user engagement levels</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={engagementData.userSegments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="segment"
                  label={({ segment, percent }) => `${segment}: ${(percent * 100).toFixed(1)}%`}
                >
                  {engagementData.userSegments.map((entry: any, index: number) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={segmentColors[entry.segment as keyof typeof segmentColors]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}