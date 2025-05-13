"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Define types for our metrics data
export interface ChannelMetrics {
  deliveryRate: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
  latency: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
  errorRate: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
  cost: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
  throughput: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
  conversionRate: {
    value: string | number
    change: string
    trend: "up" | "down" | "neutral"
  }
}

export interface MetricsData {
  sms: ChannelMetrics
  whatsapp: ChannelMetrics
  viber: ChannelMetrics
  rcs: ChannelMetrics
  voice: ChannelMetrics
  chat: ChannelMetrics
  overall: {
    messages: {
      value: string | number
      change: string
      trend: "up" | "down" | "neutral"
    }
    calls: {
      value: string | number
      change: string
      trend: "up" | "down" | "neutral"
    }
    deliveryRate: {
      value: string | number
      change: string
      trend: "up" | "down" | "neutral"
    }
    contacts: {
      value: string | number
      change: string
      trend: "up" | "down" | "neutral"
    }
    totalCost: {
      value: string | number
      change: string
      trend: "up" | "down" | "neutral"
    }
    ai: {
      accuracy: number
      predictions: number
      optimizations: number
    }
  }
  lastUpdated: Date
}

// Create default metrics data
const createDefaultMetrics = (): MetricsData => {
  const createDefaultChannelMetrics = (): ChannelMetrics => ({
    deliveryRate: { value: "0", change: "0%", trend: "neutral" },
    latency: { value: "0", change: "0ms", trend: "neutral" },
    errorRate: { value: "0", change: "0%", trend: "neutral" },
    cost: { value: "0", change: "$0", trend: "neutral" },
    throughput: { value: "0", change: "0/sec", trend: "neutral" },
    conversionRate: { value: "0", change: "0%", trend: "neutral" },
  })

  return {
    sms: createDefaultChannelMetrics(),
    whatsapp: createDefaultChannelMetrics(),
    viber: createDefaultChannelMetrics(),
    rcs: createDefaultChannelMetrics(),
    voice: createDefaultChannelMetrics(),
    chat: createDefaultChannelMetrics(),
    overall: {
      messages: { value: "0", change: "0%", trend: "neutral" },
      calls: { value: "0", change: "0%", trend: "neutral" },
      deliveryRate: { value: "0%", change: "0%", trend: "neutral" },
      contacts: { value: "0", change: "0%", trend: "neutral" },
      totalCost: { value: "0", change: "$0", trend: "neutral" },
      ai: {
        accuracy: 0,
        predictions: 0,
        optimizations: 0,
      },
    },
    lastUpdated: new Date(),
  }
}

// Create mock metrics data for development
const createMockMetrics = (): MetricsData => {
  const createMockChannelMetrics = (
    baseDeliveryRate: number,
    baseLatency: number,
    baseErrorRate: number,
    baseCost: number,
    baseThroughput: number,
    baseConversionRate: number
  ): ChannelMetrics => ({
    deliveryRate: {
      value: (baseDeliveryRate + Math.random() * 2).toFixed(1),
      change: "+0.8%",
      trend: "up",
    },
    latency: {
      value: Math.floor(baseLatency + Math.random() * 20),
      change: "-5ms",
      trend: "down",
    },
    errorRate: {
      value: (baseErrorRate + Math.random() * 0.5).toFixed(1),
      change: "-0.2%",
      trend: "down",
    },
    cost: {
      value: (baseCost + Math.random() * 100).toFixed(2),
      change: "+$45.30",
      trend: "up",
    },
    throughput: {
      value: Math.floor(baseThroughput + Math.random() * 20),
      change: "+10/sec",
      trend: "up",
    },
    conversionRate: {
      value: (baseConversionRate + Math.random() * 2).toFixed(1),
      change: "+0.5%",
      trend: "up",
    },
  })

  return {
    sms: createMockChannelMetrics(95, 80, 0.8, 1200, 150, 8),
    whatsapp: createMockChannelMetrics(97, 60, 0.4, 950, 120, 10),
    viber: createMockChannelMetrics(96, 70, 0.6, 850, 100, 9),
    rcs: createMockChannelMetrics(94, 90, 1.0, 750, 80, 7),
    voice: createMockChannelMetrics(98, 40, 0.3, 2000, 90, 12),
    chat: createMockChannelMetrics(99, 30, 0.2, 600, 70, 15),
    overall: {
      messages: { value: "24,234", change: "+12.3%", trend: "up" },
      calls: { value: "5,678", change: "+8.7%", trend: "up" },
      deliveryRate: { value: "96.8%", change: "+0.5%", trend: "up" },
      contacts: { value: "12,450", change: "+3.2%", trend: "up" },
      totalCost: { value: "6,350.75", change: "+$420.50", trend: "up" },
      ai: {
        accuracy: 95,
        predictions: 1234,
        optimizations: 156,
      },
    },
    lastUpdated: new Date(),
  }
}

// Create the context
interface MetricsContextType {
  metrics: MetricsData | null
  isLoading: boolean
  isInitialized: boolean
  refreshMetrics: () => Promise<void>
  setAutoRefresh: (intervalMs: number | null) => void
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined)

// Create the provider component
export function MetricsProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null)
  const [refreshIntervalId, setRefreshIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Function to fetch metrics data with reduced delay in development
  const fetchMetrics = async (): Promise<MetricsData> => {
    // In a real application, this would be an API call
    // For now, we'll use mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(createMockMetrics())
      }, process.env.NODE_ENV === 'production' ? 800 : 100) // Reduced delay in development
    })
  }

  // Function to refresh metrics - lazy loading
  const refreshMetrics = async () => {
    setIsLoading(true)
    try {
      const newMetrics = await fetchMetrics()
      setMetrics(newMetrics)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error fetching metrics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to set auto-refresh
  const setAutoRefresh = (intervalMs: number | null) => {
    // Clear existing interval if any
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId)
      setRefreshIntervalId(null)
    }

    // Set new interval if requested
    if (intervalMs) {
      setRefreshInterval(intervalMs)
      // Ensure metrics are loaded before setting interval
      if (!isInitialized) {
        refreshMetrics().then(() => {
          const id = setInterval(refreshMetrics, intervalMs)
          setRefreshIntervalId(id)
        })
      } else {
        const id = setInterval(refreshMetrics, intervalMs)
        setRefreshIntervalId(id)
      }
    } else {
      setRefreshInterval(null)
    }
  }

  // No initial fetch - we'll load data only when needed

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId)
      }
    }
  }, [refreshIntervalId])

  // Get metrics with fallback to default if null
  const getMetrics = () => metrics || createDefaultMetrics()

  return (
    <MetricsContext.Provider
      value={{
        metrics: getMetrics(),
        isLoading,
        isInitialized,
        refreshMetrics,
        setAutoRefresh,
      }}
    >
      {children}
    </MetricsContext.Provider>
  )
}

// Custom hook to use the metrics context
export function useMetrics() {
  const context = useContext(MetricsContext)
  if (context === undefined) {
    throw new Error("useMetrics must be used within a MetricsProvider")
  }
  return context
}
