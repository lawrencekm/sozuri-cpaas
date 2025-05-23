"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showCredentials, setShowCredentials] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token)
      
      toast.success("Login successful!")
      
      // Redirect based on user role
      if (data.user.role === 'admin') {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

    } catch (error: any) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    
    // Auto-submit after setting credentials
    setTimeout(() => {
      const form = document.getElementById('login-form') as HTMLFormElement
      form?.requestSubmit()
    }, 100)
  }

  const loadDemoCredentials = async () => {
    try {
      const response = await fetch("/api/auth/login")
      const data = await response.json()
      setShowCredentials(true)
    } catch (error) {
      console.error("Failed to load demo credentials:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to SOZURI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your admin dashboard
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="login-form" onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@demo.com"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Access</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("admin@demo.com", "admin123")}
                >
                  Login as Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("demo@admin.com", "demo123")}
                >
                  Login as Demo Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => handleDemoLogin("user@demo.com", "user123")}
                >
                  Login as User
                </Button>
              </div>

              {!showCredentials && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full mt-4 text-sm"
                  onClick={loadDemoCredentials}
                >
                  Show Demo Credentials
                </Button>
              )}

              {showCredentials && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                  <p className="font-medium mb-2">Demo Credentials:</p>
                  <p>Admin: admin@demo.com / admin123</p>
                  <p>Demo Admin: demo@admin.com / demo123</p>
                  <p>User: user@demo.com / user123</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
