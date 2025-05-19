'use client'

import React from 'react'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'
import { handleError, ErrorType } from '@/lib/error-handler'

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Log the error
  React.useEffect(() => {
    handleError(error, ErrorType.UNKNOWN, {
      showToast: false, // Don't show toast for errors caught by boundary
      context: { source: 'ErrorBoundary' }
    })
  }, [error])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/80">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h2 className="mt-6 text-xl font-semibold">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error.message || 'An unexpected error occurred. Our team has been notified.'}
      </p>
      <div className="mt-6 flex gap-2">
        <Button onClick={resetErrorBoundary} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function ErrorBoundary({ 
  children, 
  fallbackComponent = ErrorFallback 
}: {
  children: React.ReactNode
  fallbackComponent?: React.ComponentType<FallbackProps>
}) {
  return (
    <ReactErrorBoundary
      FallbackComponent={fallbackComponent}
      onError={(error) => {
        handleError(error, ErrorType.UNKNOWN, {
          showToast: false,
          context: { source: 'ErrorBoundary.onError' }
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// Component-specific error boundary with custom fallback UI
export function ComponentErrorBoundary({ 
  children,
  className = "p-4 text-destructive bg-destructive/10 rounded-md"
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className={className}>
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="text-xs mt-1 mb-2">{error.message}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={resetErrorBoundary}
            className="mt-2"
          >
            <RefreshCw className="mr-2 h-3 w-3" />
            Retry
          </Button>
        </div>
      )}
      onError={(error) => {
        handleError(error, ErrorType.UNKNOWN, {
          showToast: false,
          context: { source: 'ComponentErrorBoundary' }
        });
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}
