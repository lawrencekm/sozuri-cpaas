import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = (searchParams.get('format') || 'json').toLowerCase() as 'json'|'csv'|'txt'
  const logs = await prisma.logEntry.findMany({ orderBy: { createdAt: 'desc' }, take: 1000 })

  if (format === 'csv') {
    const header = 'id,level,message,createdAt\n'
    const rows = logs.map(l => `${l.id},${l.level},${JSON.stringify(l.message).replaceAll(',', ';')},${l.createdAt.toISOString()}`).join('\n')
    return new NextResponse(header + rows, { headers: { 'Content-Type': 'text/csv' } })
  }
  if (format === 'txt') {
    const body = logs.map(l => `[${l.createdAt.toISOString()}] ${l.level.toUpperCase()} ${l.message}`).join('\n')
    return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
  }
  return NextResponse.json(logs)
}