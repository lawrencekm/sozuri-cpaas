import { ChannelMetrics, MetricsData, MetricValue } from "@/types/metrics"
import { AnalyticsMetrics } from "./api"

export const createMetricValue = (
  value: string | number,
  change: string,
  trend: "up" | "down" | "neutral"
): MetricValue => ({
  value,
  change,
  trend,
})

export const createDefaultChannelMetrics = (): ChannelMetrics => ({
  deliveryRate: createMetricValue("0", "0%", "neutral"),
  latency: createMetricValue("0", "0ms", "neutral"),
  errorRate: createMetricValue("0", "0%", "neutral"),
  cost: createMetricValue("0", "$0", "neutral"),
  throughput: createMetricValue("0", "0/sec", "neutral"),
  conversionRate: createMetricValue("0", "0%", "neutral"),
})

export const createChannelMetricsWithData = (data: AnalyticsMetrics, costChange: string): ChannelMetrics => ({
  deliveryRate: createMetricValue(data.deliveryRate, `+${(Math.random() * 1).toFixed(1)}%`, "up"),
  latency: createMetricValue(data.latency, `-${Math.floor(Math.random() * 5)}ms`, "down"),
  errorRate: createMetricValue(data.errorRate, `-${(Math.random() * 0.2).toFixed(1)}%`, "down"),
  cost: createMetricValue(data.cost, costChange, "up"),
  throughput: createMetricValue(data.throughput, `+${Math.floor(Math.random() * 10)}/sec`, "up"),
  conversionRate: createMetricValue(data.conversionRate, `+${(Math.random() * 0.5).toFixed(1)}%`, "up"),
})

export const createDefaultMetrics = (): MetricsData => ({
  sms: createDefaultChannelMetrics(),
  whatsapp: createDefaultChannelMetrics(),
  viber: createDefaultChannelMetrics(),
  rcs: createDefaultChannelMetrics(),
  voice: createDefaultChannelMetrics(),
  chat: createDefaultChannelMetrics(),
  overall: {
    messages: createMetricValue("0", "0%", "neutral"),
    calls: createMetricValue("0", "0%", "neutral"),
    deliveryRate: createMetricValue("0%", "0%", "neutral"),
    contacts: createMetricValue("0", "0%", "neutral"),
    totalCost: createMetricValue("0", "$0", "neutral"),
    ai: {
      accuracy: 0,
      predictions: 0,
      optimizations: 0,
    },
  },
  lastUpdated: new Date(),
})