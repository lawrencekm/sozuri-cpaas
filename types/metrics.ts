export type TrendType = "up" | "down" | "neutral"

export interface MetricValue {
  value: string | number
  change: string
  trend: TrendType
}

export interface ChannelMetrics {
  deliveryRate: MetricValue
  latency: MetricValue
  errorRate: MetricValue
  cost: MetricValue
  throughput: MetricValue
  conversionRate: MetricValue
}

export interface AnalyticsMetrics {
  deliveryRate: number
  latency: number
  errorRate: number
  cost: number
  throughput: number
  conversionRate: number
  messageVolume: number
  timeSeries: Array<{
    timestamp: string
    value: number
  }>
}

export interface OverallMetrics {
  messages: MetricValue
  calls: MetricValue
  deliveryRate: MetricValue
  contacts: MetricValue
  totalCost: MetricValue
  ai: {
    accuracy: number
    predictions: number
    optimizations: number
  }
}

export interface MetricsData {
  sms: ChannelMetrics
  whatsapp: ChannelMetrics
  viber: ChannelMetrics
  rcs: ChannelMetrics
  voice: ChannelMetrics
  chat: ChannelMetrics
  overall: OverallMetrics
  lastUpdated: Date
}