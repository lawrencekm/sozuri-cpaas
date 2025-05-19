"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Download, MessageCircle, ThumbsUp, Timer, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardLayout from "@/components/layout/dashboard-layout"

// Mock chart component
const Chart = ({ type, data, height = 300 }: { type: string; data: any; height?: number }) => {
  return (
    <div 
      className="w-full bg-muted/30 rounded-md flex items-center justify-center"
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <p className="text-muted-foreground">{type} Chart</p>
        <p className="text-xs text-muted-foreground">(Visualization would appear here)</p>
      </div>
    </div>
  )
}

export default function LiveChatAnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')
  
  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/chat/live">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Live Chat Analytics</h1>
              <p className="text-muted-foreground">Performance metrics for your live chat support</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45s</div>
              <p className="text-xs text-muted-foreground">
                -8.3% from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction Rate</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from previous period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +2 from previous period
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Volume</CardTitle>
                <CardDescription>Number of conversations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="Line" data={{}} />
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Conversation Duration</CardTitle>
                  <CardDescription>Average time spent in conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart type="Bar" data={{}} height={250} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Busiest Hours</CardTitle>
                  <CardDescription>When your customers are most active</CardDescription>
                </CardHeader>
                <CardContent>
                  <Chart type="Bar" data={{}} height={250} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your chat conversations are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <Chart type="Pie" data={{}} height={250} />
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span>Direct</span>
                      </div>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span>Organic Search</span>
                      </div>
                      <span className="font-medium">32%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span>Social Media</span>
                      </div>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span>Referral</span>
                      </div>
                      <span className="font-medium">8%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Metrics</CardTitle>
                <CardDescription>Key performance indicators for conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">First Response Time</h3>
                      <div className="text-2xl font-bold">28s</div>
                      <p className="text-xs text-muted-foreground">-15% from previous period</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Average Resolution Time</h3>
                      <div className="text-2xl font-bold">8m 12s</div>
                      <p className="text-xs text-muted-foreground">-5% from previous period</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Messages per Conversation</h3>
                      <div className="text-2xl font-bold">12.4</div>
                      <p className="text-xs text-muted-foreground">+3% from previous period</p>
                    </div>
                  </div>
                  
                  <Chart type="Line" data={{}} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversation Topics</CardTitle>
                <CardDescription>Most common topics discussed in conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="Bar" data={{}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
                <CardDescription>Metrics for individual agent performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-border">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Agent</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Conversations</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Avg. Response Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Satisfaction</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Resolution Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 text-sm">Sarah Johnson</td>
                        <td className="px-4 py-3 text-sm">342</td>
                        <td className="px-4 py-3 text-sm">32s</td>
                        <td className="px-4 py-3 text-sm">95%</td>
                        <td className="px-4 py-3 text-sm">98%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Michael Chen</td>
                        <td className="px-4 py-3 text-sm">287</td>
                        <td className="px-4 py-3 text-sm">40s</td>
                        <td className="px-4 py-3 text-sm">92%</td>
                        <td className="px-4 py-3 text-sm">95%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">Jessica Williams</td>
                        <td className="px-4 py-3 text-sm">256</td>
                        <td className="px-4 py-3 text-sm">45s</td>
                        <td className="px-4 py-3 text-sm">90%</td>
                        <td className="px-4 py-3 text-sm">92%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">David Rodriguez</td>
                        <td className="px-4 py-3 text-sm">198</td>
                        <td className="px-4 py-3 text-sm">38s</td>
                        <td className="px-4 py-3 text-sm">93%</td>
                        <td className="px-4 py-3 text-sm">94%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agent Workload</CardTitle>
                <CardDescription>Distribution of conversations among agents</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="Pie" data={{}} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="satisfaction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Satisfaction</CardTitle>
                <CardDescription>Feedback and ratings from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Overall Satisfaction</h3>
                      <div className="text-2xl font-bold">92%</div>
                      <p className="text-xs text-muted-foreground">+2.1% from previous period</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Response Quality</h3>
                      <div className="text-2xl font-bold">88%</div>
                      <p className="text-xs text-muted-foreground">+1.5% from previous period</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-muted-foreground">Issue Resolution</h3>
                      <div className="text-2xl font-bold">94%</div>
                      <p className="text-xs text-muted-foreground">+3.2% from previous period</p>
                    </div>
                  </div>
                  
                  <Chart type="Line" data={{}} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>Common themes from customer feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <Chart type="Bar" data={{}} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
