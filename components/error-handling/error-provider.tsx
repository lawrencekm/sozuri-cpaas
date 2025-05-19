'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ErrorBoundary } from './error-boundary'
import { handleError, ErrorType } from '@/lib/error-handler'

// Define the context type
interface ErrorContextType {
  captureError: (error: Error, options?: any) => void;
  clearErrors: () => void;
  errors: Error[];
}

// Create the context with default values
const ErrorContext = createContext<ErrorContextType>({
  captureError: () => {},
  clearErrors: () => {},
  errors: [],
})

// Hook to use the error context
export const useErrorContext = () => useContext(ErrorContext)

interface ErrorProviderProps {
  children: React.ReactNode;
}

/**
 * Global error handling provider that wraps the application
 * and provides error handling functionality
 */
export function ErrorProvider({ children }: ErrorProviderProps) {
  const [errors, setErrors] = useState<Error[]>([])

  // Function to capture and handle errors
  const captureError = (error: Error, options: any = {}) => {
    // Add error to the list
    setErrors(prev => [...prev, error])
    
    // Use the centralized error handler
    handleError(
      error, 
      options.errorType || ErrorType.UNKNOWN, 
      options
    )
  }

  // Function to clear all errors
  const clearErrors = () => {
    setErrors([])
  }

  // Set up global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      
      captureError(
        error,
        { 
          errorType: ErrorType.UNKNOWN,
          context: { source: 'unhandledRejection' },
          showToast: true
        }
      )
      
      // Prevent the default browser behavior
      event.preventDefault()
    }

    // Add event listener for unhandled promise rejections
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    // Clean up
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return (
    <ErrorContext.Provider value={{ captureError, clearErrors, errors }}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </ErrorContext.Provider>
  )
}
