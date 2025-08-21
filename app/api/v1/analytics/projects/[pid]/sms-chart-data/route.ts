import { NextResponse } from 'next/server'

// Legacy: GET /{pid}/sms-chart-data -> ReportController@getSmsChartData
export async function GET(_: Request, { params }: { params: { pid: string } }) {
  return NextResponse.json({ projectId: params.pid, series: [], route: `/api/v1/analytics/projects/${params.pid}/sms-chart-data` })
}