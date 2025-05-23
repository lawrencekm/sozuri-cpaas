"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User, Settings, Database } from "lucide-react"
import Link from "next/link"

export default function AdminAccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    if (token?.includes('Bearer')) {
      router.push('/admin')
    }
  }, [router])

  const handleQuickLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        router.push("/admin")
      }
    } catch (error) {
      console.error("Quick login failed:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SOZURI Admin Access
          </h1>
          <p className="text-xl text-gray-600">
            Secure administration portal for system management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-blue-200 shadow-lg">
            <CardHeader className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-2" />
              <CardTitle>Quick Admin Login</CardTitle>
              <CardDescription>
                One-click access for administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => handleQuickLogin("admin@demo.com", "admin123")}
              >
                Login as Primary Admin
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleQuickLogin("demo@admin.com", "demo123")}
              >
                Login as Demo Admin
              </Button>
              <div className="pt-2 border-t">
                <Button variant="link" className="w-full" asChild>
                  <Link href="/login">Use Custom Login Form</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 shadow-lg">
            <CardHeader className="text-center">
              <Settings className="mx-auto h-12 w-12 text-green-600 mb-2" />
              <CardTitle>Admin Features</CardTitle>
              <CardDescription>
                Available administrative functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  User Management & Permissions
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  System Logs & Monitoring
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Credit Management & Top-ups
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  User Impersonation
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Project Oversight
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Bulk Data Export
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Database className="h-5 w-5" />
              Demo Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Primary Admin</p>
                <p className="text-gray-600">admin@demo.com</p>
                <p className="text-gray-600">admin123</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Demo Admin</p>
                <p className="text-gray-600">demo@admin.com</p>
                <p className="text-gray-600">demo123</p>
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="font-medium text-gray-900">Regular User</p>
                <p className="text-gray-600">user@demo.com</p>
                <p className="text-gray-600">user123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
