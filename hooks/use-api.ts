'use client'

import { useState, useCallback } from 'react'
import { handleError, ErrorType } from '@/lib/error-handler'
import { toast } from 'react-hot-toast'

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  errorType?: ErrorType
  successMessage?: string
  errorMessage?: string
}

/**
 * Custom hook for making API calls with consistent error handling
 */
export function useApi<T = any, P = any[]>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    onSuccess,
    onError,
    errorType = ErrorType.API,
    successMessage,
    errorMessage
  } = options

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await apiFunction(...args)
        
        setData(result)
        
        if (successMessage) {
          toast.success(successMessage)
        }
        
        if (onSuccess) {
          onSuccess(result)
        }
        
        return result
      } catch (err: any) {
        setError(err)
        
        // Use our centralized error handler
        handleError(err, errorType, {
          toastMessage: errorMessage,
          context: { 
            functionName: apiFunction.name || 'unknown',
            args: JSON.stringify(args)
          }
        })
        
        if (onError) {
          onError(err)
        }
        
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [apiFunction, onSuccess, onError, errorType, successMessage, errorMessage]
  )

  return {
    data,
    error,
    isLoading,
    execute,
    reset: useCallback(() => {
      setData(null)
      setError(null)
      setIsLoading(false)
    }, [])
  }
}
