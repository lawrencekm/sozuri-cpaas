'use client'

import { useState, useCallback } from 'react'
import { handleError, ErrorType } from '@/lib/error-handler'
import { toast } from 'react-hot-toast'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignTemplatesAPI, campaignAutomationsAPI, CampaignTemplate, CampaignAutomation } from "@/lib/api";

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

// --- Campaigns Hooks ---
export function useCampaigns() {
  return useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => await campaignsAPI.getAll(),
  });
}

export function useCampaign(id: string) {
  return useQuery<Campaign>({
    queryKey: ["campaigns", id],
    queryFn: async () => await campaignsAPI.getById(id),
    enabled: !!id,
  });
}

// --- Campaign Templates Hooks ---
export function useCampaignTemplates(projectId: string) {
  return useQuery<CampaignTemplate[]>({
    queryKey: ["campaignTemplates", projectId],
    queryFn: async () => await campaignTemplatesAPI.getAll(projectId),
    enabled: !!projectId,
  });
}

export function useCreateCampaignTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: campaignTemplatesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignTemplates"] });
    },
  });
}

export function useUpdateCampaignTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      campaignTemplatesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignTemplates"] });
    },
  });
}

export function useDeleteCampaignTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignTemplatesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignTemplates"] });
    },
  });
}

// --- Campaign Automations Hooks ---
export function useCampaignAutomations(projectId: string) {
  return useQuery<CampaignAutomation[]>({
    queryKey: ["campaignAutomations", projectId],
    queryFn: async () => campaignAutomationsAPI.getAll(projectId),
    enabled: !!projectId,
  });
}

export function useCreateCampaignAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: campaignAutomationsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignAutomations"] });
    },
  });
}

export function useUpdateCampaignAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; [key: string]: any }) =>
      campaignAutomationsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignAutomations"] });
    },
  });
}

export function useDeleteCampaignAutomation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignAutomationsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaignAutomations"] });
    },
  });
}
