"use client"

import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"
import Link from "next/link"

export function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <Rocket className="h-16 w-16 text-primary mb-4" />
      <h3 className="text-2xl font-bold tracking-tight mb-2">
        Let's Get Started!
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Begin your journey with SOZURI Connect by completing these first steps
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/dashboard/api-keys">
            <Rocket className="mr-2 h-4 w-4" />
            Create API Key
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/developers">
            Explore Documentation
          </Link>
        </Button>
      </div>
    </div>
  )
} 