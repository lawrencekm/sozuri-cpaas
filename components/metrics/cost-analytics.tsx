"use client"

import { useState } from "react"
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
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from "recharts"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  MessageCircle, 
  Phone, 
  MessagesSquare 
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for cost analytics
const monthlyData = [
  { month: "Jan", sms: 1200, whatsapp: 950, voice: 1800, viber: 650, rcs: 450, chat: 350 },
  { month: "Feb", sms: 1350, whatsapp: 1050, voice: 1950, viber: 700, rcs: 500, chat: 400 },
  { month: "Mar", sms: 1500, whatsapp: 1200, voice: 2100, viber: 800, rcs: 550, chat: 450 },
  { month: "Apr", sms: 1400, whatsapp: 1150, voice: 2000, viber: 750, rcs: 525, chat: 425 },
  { month: "May", sms: 1600, whatsapp: 1300, voice: 2200, viber: 850, rcs: 600, chat: 500 },
  { month: "Jun", sms: 1550, whatsapp: 1250, voice: 2150, viber: 825, rcs: 575, chat: 475 },
]

const channelDistribution = [
  { name: "SMS", value: 1550, color: "#2563eb" },
  { name: "WhatsApp", value: 1250, color: "#22c55e" },
  { name: "Voice", value: 2150, color: "#f97316" },
  { name: "Viber", value: 825, color: "#8b5cf6" },
  { name: "RCS", value: 575, color: "#64748b" },
  { name: "Chat", value: 475, color: "#ec4899" },
]

const costBreakdown = [
  { name: "Base Charges", value: 4500, color: "#2563eb" },
  { name: "Overage Fees", value: 850, color: "#f97316" },
  { name: "Premium Features", value: 1200, color: "#8b5cf6" },
  { name: "Taxes & Fees", value: 650, color: "#64748b" },
]

export function CostAnalytics() {
  const [dateRange, setDateRange] = useState("last-6-months")
  
  // Calculate totals
  const currentMonthTotal = Object.values(monthlyData[5]).reduce((acc, val) => 
    typeof val === 'number' ? acc + val : acc, 0) - monthlyData[5].month.length
  
  const previousMonthTotal = Object.values(monthlyData[4]).reduce((acc, val) => 
    typeof val === 'number' ? acc + val : acc, 0) - monthlyData[4].month.length
  
  const percentChange = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
  const isTrendUp = currentMonthTotal > previousMonthTotal
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cost Analytics</h2>
          <p className="text-muted-foreground">
            Track and analyze your communication costs across all channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="year-to-date">Year to Date</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonthTotal.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              <span>June 2023</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Month-over-Month</CardTitle>
            {isTrendUp ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isTrendUp ? 'text-red-500' : 'text-green-500'}`}>
              {isTrendUp ? '+' : '-'}{Math.abs(Number(percentChange))}%
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Compared to May 2023</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">YTD Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32,450</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Jan 1 - Jun 30, 2023</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Annual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$68,900</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>Based on current usage</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly-trend" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="monthly-trend">Monthly Trend</TabsTrigger>
          <TabsTrigger value="channel-distribution">Channel Distribution</TabsTrigger>
          <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monthly-trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost by Channel</CardTitle>
              <CardDescription>Cost breakdown across all communication channels over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Legend />
                  <Bar dataKey="sms" name="SMS" stackId="a" fill="#2563eb" />
                  <Bar dataKey="whatsapp" name="WhatsApp" stackId="a" fill="#22c55e" />
                  <Bar dataKey="voice" name="Voice" stackId="a" fill="#f97316" />
                  <Bar dataKey="viber" name="Viber" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="rcs" name="RCS" stackId="a" fill="#64748b" />
                  <Bar dataKey="chat" name="Chat" stackId="a" fill="#ec4899" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm font-medium">SMS Cost</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyData[5].sms}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`${monthlyData[5].sms > monthlyData[4].sms ? 'text-red-500' : 'text-green-500'} font-medium`}>
                    {monthlyData[5].sms > monthlyData[4].sms ? '+' : '-'}
                    {Math.abs(((monthlyData[5].sms - monthlyData[4].sms) / monthlyData[4].sms * 100)).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <MessagesSquare className="h-4 w-4 text-green-500" />
                  <CardTitle className="text-sm font-medium">WhatsApp Cost</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyData[5].whatsapp}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`${monthlyData[5].whatsapp > monthlyData[4].whatsapp ? 'text-red-500' : 'text-green-500'} font-medium`}>
                    {monthlyData[5].whatsapp > monthlyData[4].whatsapp ? '+' : '-'}
                    {Math.abs(((monthlyData[5].whatsapp - monthlyData[4].whatsapp) / monthlyData[4].whatsapp * 100)).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <CardTitle className="text-sm font-medium">Voice Cost</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${monthlyData[5].voice}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={`${monthlyData[5].voice > monthlyData[4].voice ? 'text-red-500' : 'text-green-500'} font-medium`}>
                    {monthlyData[5].voice > monthlyData[4].voice ? '+' : '-'}
                    {Math.abs(((monthlyData[5].voice - monthlyData[4].voice) / monthlyData[4].voice * 100)).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="channel-distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Distribution by Channel</CardTitle>
              <CardDescription>Percentage of total cost by communication channel</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cost-breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
              <CardDescription>Breakdown of costs by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Cost']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {costBreakdown.map((item) => (
              <Card key={item.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${item.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>{((item.value / costBreakdown.reduce((acc, curr) => acc + curr.value, 0)) * 100).toFixed(1)}% of total</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
