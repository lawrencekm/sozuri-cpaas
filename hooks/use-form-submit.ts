'use client'

import { useState, useCallback } from 'react'
import { handleError, ErrorType } from '@/lib/error-handler'
import { toast } from 'react-hot-toast'

interface UseFormSubmitOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
  errorType?: ErrorType
  successMessage?: string
  errorMessage?: string
  context?: Record<string, any>
}

/**
 * Custom hook for handling form submissions with consistent error handling
 */
export function useFormSubmit<T = any>(
  submitFn: (formData: any) => Promise<T>,
  options: UseFormSubmitOptions<T> = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<T | null>(null)

  const {
    onSuccess,
    onError,
    errorType = ErrorType.VALIDATION,
    successMessage,
    errorMessage,
    context = {}
  } = options

  const submit = useCallback(
    async (formData: any) => {
      try {
        setIsSubmitting(true)
        setError(null)

        const result = await submitFn(formData)
        
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
            formData,
            ...context
          }
        })
        
        if (onError) {
          onError(err)
        }
        
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [submitFn, onSuccess, onError, errorType, successMessage, errorMessage, context]
  )

  return {
    submit,
    isSubmitting,
    error,
    data,
    reset: useCallback(() => {
      setError(null)
      setData(null)
    }, [])
  }
}
