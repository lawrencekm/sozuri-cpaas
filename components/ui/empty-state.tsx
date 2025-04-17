"use client"

import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export function EmptyState({
  icon: Icon = Rocket,
  title = "Nothing here yet",
  description = "Get started by creating your first resource",
  action,
}: {
  icon?: React.ComponentType<{ className?: string }>
  title?: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex h-[450px] items-center justify-center">
      <div className="text-center">
        <Icon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="mt-2 text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
} 