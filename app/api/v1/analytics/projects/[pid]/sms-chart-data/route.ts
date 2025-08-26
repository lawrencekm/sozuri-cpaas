import { NextResponse } from 'next/server'

// Legacy: GET /{pid}/sms-chart-data -> ReportController@getSmsChartData
export async function GET(_: Request, { params }: { params: Promise<{ pid: string }> }) {
  const { pid } = await params
  return NextResponse.json({ projectId: pid, series: [], route: `/api/v1/analytics/projects/${pid}/sms-chart-data` })
}