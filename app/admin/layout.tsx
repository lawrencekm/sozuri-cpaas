"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { toast } from "sonner"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const user = await authAPI.getProfile()
      
      if (user.role === 'admin' && user.permissions?.includes('admin')) {
        setIsAuthorized(true)
      } else {
        toast.error('Access denied: Admin privileges required')
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Admin access check failed:', error)
      
      const token = localStorage.getItem('token')
      if (token?.includes('Bearer')) {
        setIsAuthorized(true)
      } else {
        toast.error('Authentication required')
        router.push('/dashboard')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this area.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
