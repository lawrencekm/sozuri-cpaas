"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User, Settings, Database } from "lucide-react"
import Link from "next/link"

export default function AdminAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in via NextAuth
    // This will be handled by the session provider
  }, [router])

  // Removed quick login for security

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SOZURI Admin Access
          </h1>
          <p className="text-xl text-gray-600">
            Secure administration portal for system management
          </p>
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <Link href="/login">Sign in with your admin account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
