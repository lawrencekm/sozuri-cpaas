"use client"

import { Bell, CheckCircle, AlertTriangle } from "lucide-react"

export function ActivityFeed() {
  return (
    <div className="space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium">SMS sent successfully</p>
          <p className="text-sm text-muted-foreground">To: +1234567890</p>
          <div className="mt-1 text-xs text-muted-foreground">2 minutes ago</div>
        </div>
      </div>
    </div>
  )
} 