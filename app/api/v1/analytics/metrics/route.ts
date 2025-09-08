import { NextRequest, NextResponse } from 'next/server'

// Simple utility to generate mock metrics based on timeframe
function generateMockMetrics(channel: string, timeframe: string) {
  // Determine number of points and step (ms)
  const now = Date.now()
  let count = 24
  let stepMs = 60 * 60 * 1000 // 1 hour

  switch (timeframe) {
    case '7d':
      count = 7
      stepMs = 24 * 60 * 60 * 1000 // 1 day
      break
    case '30d':
      count = 30
      stepMs = 24 * 60 * 60 * 1000 // 1 day
      break
    case '1d':
    default:
      count = 24
      stepMs = 60 * 60 * 1000 // 1 hour
      break
  }

  // Base factors by channel to make data feel different
  const baseByChannel: Record<string, { vol: number; latency: number; success: number }> = {
    sms: { vol: 120, latency: 220, success: 0.96 },
    whatsapp: { vol: 80, latency: 260, success: 0.93 },
    rcs: { vol: 60, latency: 300, success: 0.91 },
    voice: { vol: 40, latency: 450, success: 0.89 },
  }
  const base = baseByChannel[channel?.toLowerCase()] ?? { vol: 70, latency: 300, success: 0.92 }

  const timeSeries: Array<{ timestamp: number; value: number; deliveryRate: number; latency: number }> = []

  // Pseudo-random seeded by channel for stability across reloads
  let seed = [...(channel || 'sms')].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const rand = () => {
    // Linear congruential generator
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }

  for (let i = count - 1; i >= 0; i--) {
    const ts = now - i * stepMs

    // Volume fluctuates +/- 30%
    const volume = Math.max(0, Math.round(base.vol * (0.7 + rand() * 0.6)))

    // Delivery rate fluctuates around base success
    const delivery = Math.min(99.5, Math.max(70, (base.success * 100) + (rand() - 0.5) * 6))

    // Latency fluctuates +/- 40%
    const latency = Math.max(40, Math.round(base.latency * (0.8 + rand() * 0.8)))

    timeSeries.push({ timestamp: ts, value: volume, deliveryRate: Number(delivery.toFixed(2)), latency })
  }

  // Aggregate metrics
  const avgDelivery = timeSeries.reduce((a, b) => a + b.deliveryRate, 0) / timeSeries.length
  const avgLatency = Math.round(timeSeries.reduce((a, b) => a + b.latency, 0) / timeSeries.length)
  // Assume small error rate as complement of success within a band
  const errorRate = Number((Math.max(0, 100 - avgDelivery) * 0.6).toFixed(2))
  // Throughput rough estimate from last point (per second)
  const last = timeSeries[timeSeries.length - 1]
  // Convert hourly/day volume to per second estimate
  const windowSeconds = timeframe === '1d' ? 3600 : 24 * 3600
  const throughput = Number((last.value / windowSeconds).toFixed(2))

  return {
    channel,
    timeframe,
    deliveryRate: Number(avgDelivery.toFixed(2)),
    latency: avgLatency,
    errorRate,
    throughput,
    timeSeries,
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const channel = searchParams.get('channel') || 'sms'
  // metric is currently unused but kept for API contract compatibility
  const timeframe = searchParams.get('timeframe') || '1d'

  // In a real implementation, validate inputs and query your datastore
  const data = generateMockMetrics(channel, timeframe)
  return NextResponse.json(data)
}