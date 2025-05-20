"use client"

import { redirect } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/onboarding"
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to SozuDash</h1>
        <p className="text-muted-foreground">
          You will be redirected to the onboarding page in a moment.
        </p>

        <div className="flex flex-col space-y-3">
          <Button asChild>
            <Link href="/onboarding">Go to Onboarding</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
