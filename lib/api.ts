import axios, { AxiosError } from "axios"
import { handleError, ErrorType } from './error-handler'
import { ErrorBoundary, ErrorBoundaryProps, FallbackProps } from "react-error-boundary"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 15000, // 15 seconds timeout
})

api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    handleError(error, ErrorType.NETWORK, {
      toastMessage: "Request configuration error",
      context: { source: 'request_interceptor' }
    })
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    
    const requestUrl = error.config?.url || 'unknown endpoint'
    const method = error.config?.method?.toUpperCase() || 'unknown method'

    // Handle authentication errors
    if (error.response?.status === 401) {
      handleError(error, ErrorType.AUTHENTICATION, {
        toastMessage: "Your session has expired. Please sign in again.",
        context: { requestUrl, method }
      })

      // Clear auth token and redirect to login
      localStorage.removeItem("token")
      window.location.href = "/onboarding"
      return Promise.reject(error)
    }

    // Handle rate limiting
    if (error.response?.status === 429) {
      handleError(error, ErrorType.API, {
        toastMessage: "Rate limit exceeded. Please try again later.",
        context: { requestUrl, method }
      })
      return Promise.reject(error)
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      handleError(error, ErrorType.NETWORK, {
        toastMessage: "Network error. Please check your connection and try again.",
        context: { requestUrl, method, timeout: error.code === 'ECONNABORTED' }
      })
      return Promise.reject(error)
    }

    // Handle all other API errors
    handleError(error, ErrorType.API, {
      context: {
        requestUrl,
        method,
        status: error.response?.status,
        data: error.response?.data
      }
    })

    return Promise.reject(error)
  }
)

// --- Helper function to wrap API calls with error handling ---
function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  errorType: ErrorType,
  options: { toastMessage?: string; context?: Record<string, any> } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorType, {
        toastMessage: options.toastMessage,
        context: {
          source: fn.name || 'api_call', // Use function name if available
          ...(options.context || {}),
        },
      });
      throw error;
    }
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  campaigns?: number;
  messages?: number;
  engagement?: number;
  created: string;
  updated: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  projectId: string;
  created: string;
  updated: string;
}

export interface MessagePayload {
  to: string | string[];
  message: string;
  from?: string;
  mediaUrl?: string;
  scheduledAt?: string;
  callbackUrl?: string;
}

export const authAPI = {
  login: withErrorHandling(
    (credentials: { email: string; password: string }): Promise<AuthResponse> =>
      api.post("/auth/login", credentials).then(res => res.data),
    ErrorType.AUTHENTICATION
  ),

  register: withErrorHandling(
    (userData: { name: string; email: string; password: string }): Promise<AuthResponse> =>
      api.post("/auth/register", userData).then(res => res.data),
    ErrorType.AUTHENTICATION
  ),

  logout: withErrorHandling(
    (): Promise<void> => api.post("/auth/logout").then(res => res.data),
    ErrorType.AUTHENTICATION
  ),

  getProfile: withErrorHandling(
    (): Promise<User> => api.get("/auth/me").then(res => res.data),
    ErrorType.AUTHENTICATION
  ),
}

export const projectsAPI = {
  getAll: withErrorHandling(
    (): Promise<Project[]> => api.get("/projects").then(res => res.data),
    ErrorType.API
  ),

  getById: withErrorHandling(
    (id: string): Promise<Project> => api.get(`/projects/${id}`).then(res => res.data),
    ErrorType.API
  ),

  create: withErrorHandling(
    (project: Omit<Project, 'id' | 'created' | 'updated'>): Promise<Project> =>
      api.post("/projects", project).then(res => res.data),
    ErrorType.API
  ),

  update: withErrorHandling(
    (id: string, project: Partial<Omit<Project, 'id' | 'created' | 'updated'>>): Promise<Project> =>
      api.put(`/projects/${id}`, project).then(res => res.data),
    ErrorType.API
  ),

  delete: withErrorHandling(
    (id: string): Promise<void> => api.delete(`/projects/${id}`).then(res => res.data),
    ErrorType.API
  ),
}

export const campaignsAPI = {
  getAll: withErrorHandling(
    (): Promise<Campaign[]> => api.get("/campaigns").then(res => res.data),
    ErrorType.API
  ),

  getById: withErrorHandling(
    (id: string): Promise<Campaign> => api.get(`/campaigns/${id}`).then(res => res.data),
    ErrorType.API
  ),

  create: withErrorHandling(
    (campaign: Omit<Campaign, 'id' | 'created' | 'updated'>): Promise<Campaign> =>
      api.post("/campaigns", campaign).then(res => res.data),
    ErrorType.API
  ),

  update: withErrorHandling(
    (id: string, campaign: Partial<Omit<Campaign, 'id' | 'created' | 'updated'>>): Promise<Campaign> =>
      api.put(`/campaigns/${id}`, campaign).then(res => res.data),
    ErrorType.API
  ),

  delete: withErrorHandling(
    (id: string): Promise<void> => api.delete(`/campaigns/${id}`).then(res => res.data),
    ErrorType.API
  ),
}

export const messagingAPI = {
  // SMS
  getSMS: withErrorHandling(
    (params?: Record<string, any>) => api.get("/messaging/sms", { params }).then(res => res.data),
    ErrorType.API
  ),

  getSMSById: withErrorHandling(
    (id: string) => api.get(`/messaging/sms/${id}`).then(res => res.data),
    ErrorType.API
  ),

  sendSMS: withErrorHandling(
    (data: MessagePayload) => api.post("/messaging/sms/send", data).then(res => res.data),
    ErrorType.API,
    { toastMessage: "Failed to send SMS message. Please try again." }
  ),

  sendBulkSMS: withErrorHandling(
    (data: { messages: MessagePayload[] }) => api.post("/messaging/sms/bulk", data).then(res => res.data),
    ErrorType.API,
    { toastMessage: "Failed to send bulk SMS messages. Please try again." }
  ),
}
