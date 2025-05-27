import axios, { AxiosError } from "axios"
import { handleError, ErrorType } from './error-handler'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 5000, // 5 seconds timeout for faster fallback
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
  role: 'admin' | 'supervisor' | 'agent' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  last_login?: string;
  company?: string;
  permissions?: string[];
  balance?: number;
  currency?: string;
  project_id?: string;
  project?: Project;
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
  user_id: string;
  status: 'active' | 'inactive' | 'suspended';
  balance: number;
  currency: string;
}



export interface MessagePayload {
  to: string | string[];
  message: string;
  from?: string;
  mediaUrl?: string;
  scheduledAt?: string;
  callbackUrl?: string;
}

export interface MessageLog {
  id: string;
  message_id: string;
  channel: 'sms' | 'whatsapp' | 'viber' | 'rcs' | 'voice';
  direction: 'inbound' | 'outbound';
  sender: string;
  recipient: string;
  content: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  timestamp: string;
  cost?: number;
  currency?: string;
  campaign_id?: string;
  campaign_name?: string;
  template_id?: string;
  template_name?: string;
  user_id: string;
  project_id?: string;
  error_code?: string;
  error_message?: string;
  delivery_attempts?: number;
  metadata?: Record<string, any>;
}

// --- Types for Campaign Templates & Automations ---
export interface CampaignTemplate {
  id: string;
  project_id: string;
  name: string;
  channel: 'sms' | 'whatsapp' | 'viber' | 'rcs' | 'voice';
  content: string;
  type: 'transactional' | 'marketing' | 'notification' | 'reminder';
  variables: string[];
  created_at: string;
  updated_at: string;
}

export interface CampaignAutomation {
  id: string;
  project_id: string;
  name: string;
  trigger_event: string;
  campaign_template_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Auth API with error handling
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

  impersonate: withErrorHandling(
    (userId: string): Promise<AuthResponse> =>
      api.post("/auth/impersonate", { userId }).then(res => res.data),
    ErrorType.AUTHENTICATION
  ),

  stopImpersonation: withErrorHandling(
    (): Promise<AuthResponse> => api.post("/auth/stop-impersonation").then(res => res.data),
    ErrorType.AUTHENTICATION
  ),
}

export const userAPI = {
  getLogs: withErrorHandling(
    (params?: {
      page?: number;
      limit?: number;
      level?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }): Promise<{ logs: LogEntry[]; total: number; page: number; limit: number }> =>
      api.get("/users/logs", { params }).then(res => res.data),
    ErrorType.API
  ),

  downloadLogs: withErrorHandling(
    (params?: {
      startDate?: string;
      endDate?: string;
      level?: string;
      format?: 'json' | 'csv' | 'txt';
    }): Promise<Blob> =>
      api.get("/users/logs/download", {
        params,
        responseType: 'blob'
      }).then(res => res.data),
    ErrorType.API
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



// --- Campaign Templates API ---
export const campaignTemplatesAPI = {
  getAll: withErrorHandling(
    (projectId: string): Promise<CampaignTemplate[]> =>
      api.get(`/templates`, { params: { project_id: projectId } }).then(res => res.data),
    ErrorType.API
  ),
  getById: withErrorHandling(
    (id: string): Promise<CampaignTemplate> =>
      api.get(`/templates/${id}`).then(res => res.data),
    ErrorType.API,
    {}
  ),
  create: withErrorHandling(
    (template: Omit<CampaignTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<CampaignTemplate> =>
      api.post(`/templates`, template).then(res => res.data),
    ErrorType.API
  ),
  update: withErrorHandling(
    (id: string, template: Partial<Omit<CampaignTemplate, 'id' | 'created_at' | 'updated_at'>>): Promise<CampaignTemplate> =>
      api.put(`/templates/${id}`, template).then(res => res.data),
    ErrorType.API
  ),
  delete: withErrorHandling(
    (id: string): Promise<void> =>
      api.delete(`/templates/${id}`).then(res => res.data),
    ErrorType.API
  ),
}

// --- Campaign Automations API ---
export const campaignAutomationsAPI = {
  getAll: withErrorHandling(
    (projectId: string): Promise<CampaignAutomation[]> =>
      api.get(`/automations`, { params: { project_id: projectId } }).then(res => res.data),
    ErrorType.API
  ),
  getById: withErrorHandling(
    (id: string): Promise<CampaignAutomation> =>
      api.get(`/automations/${id}`).then(res => res.data),
    ErrorType.API
  ),
  create: withErrorHandling(
    (automation: Omit<CampaignAutomation, 'id' | 'created_at' | 'updated_at'>): Promise<CampaignAutomation> =>
      api.post(`/automations`, automation).then(res => res.data),
    ErrorType.API
  ),
  update: withErrorHandling(
    (id: string, automation: Partial<Omit<CampaignAutomation, 'id' | 'created_at' | 'updated_at'>>): Promise<CampaignAutomation> =>
      api.put(`/automations/${id}`, automation).then(res => res.data),
    ErrorType.API
  ),
  delete: withErrorHandling(
    (id: string): Promise<void> =>
      api.delete(`/automations/${id}`).then(res => res.data),
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

  // Message Logs
  getMessageLogs: withErrorHandling(
    (params?: {
      page?: number;
      limit?: number;
      channel?: string;
      direction?: string;
      status?: string;
      sender?: string;
      recipient?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
      campaign_id?: string;
      template_id?: string;
    }): Promise<{
      logs: MessageLog[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      summary: any;
    }> =>
      api.get("/messaging/logs", { params }).then(res => res.data),
    ErrorType.API
  ),

  getMessageLogById: withErrorHandling(
    (id: string): Promise<MessageLog> =>
      api.get(`/messaging/logs/${id}`).then(res => res.data),
    ErrorType.API
  ),
}

// Campaigns API with error handling
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
    (campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> =>
      api.post("/campaigns", campaign).then(res => res.data),
    ErrorType.API
  ),

  update: withErrorHandling(
    (id: string, campaign: Partial<Campaign>): Promise<Campaign> =>
      api.put(`/campaigns/${id}`, campaign).then(res => res.data),
    ErrorType.API
  ),

  delete: withErrorHandling(
    (id: string): Promise<void> => api.delete(`/campaigns/${id}`).then(res => res.data),
    ErrorType.API
  ),
}

// Analytics API with error handling
export const analyticsAPI = {
  getEngagement: withErrorHandling(
    (timeframe: string) => api.get(`/analytics/engagement`, { params: { timeframe } }).then(res => res.data),
    ErrorType.API
  ),

  getMetrics: withErrorHandling(
    (channel: string, metric: string, timeframe: string): Promise<AnalyticsMetrics> =>
      api.get(`/analytics/metrics`, { params: { channel, metric, timeframe } }).then(res => res.data),
    ErrorType.API
  ),
}

// Admin API for user management and system administration
export const adminAPI = {
  // User Management
  getAllUsers: withErrorHandling(
    (params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<{ users: User[]; total: number; page: number; limit: number }> =>
      api.get("/admin/users", { params }).then(res => res.data),
    ErrorType.API
  ),

  getUserById: withErrorHandling(
    (id: string): Promise<User> =>
      api.get(`/admin/users/${id}`).then(res => res.data),
    ErrorType.API
  ),

  updateUser: withErrorHandling(
    (id: string, data: Partial<User>): Promise<User> =>
      api.put(`/admin/users/${id}`, data).then(res => res.data),
    ErrorType.API
  ),

  deleteUser: withErrorHandling(
    (id: string): Promise<void> =>
      api.delete(`/admin/users/${id}`).then(res => res.data),
    ErrorType.API
  ),

  // Project Management
  getAllProjects: withErrorHandling(
    (params?: { page?: number; limit?: number; search?: string; user_id?: string }): Promise<{ projects: Project[]; total: number; page: number; limit: number }> =>
      api.get("/admin/projects", { params }).then(res => res.data),
    ErrorType.API
  ),

  getProjectById: withErrorHandling(
    (id: string): Promise<Project> =>
      api.get(`/admin/projects/${id}`).then(res => res.data),
    ErrorType.API
  ),

  updateProject: withErrorHandling(
    (id: string, data: Partial<Project>): Promise<Project> =>
      api.put(`/admin/projects/${id}`, data).then(res => res.data),
    ErrorType.API
  ),

  deleteProject: withErrorHandling(
    (id: string): Promise<void> =>
      api.delete(`/admin/projects/${id}`).then(res => res.data),
    ErrorType.API
  ),

  // Credit Management
  topupUserCredit: withErrorHandling(
    (userId: string, amount: number): Promise<{ balance: number; transaction_id: string }> =>
      api.post(`/admin/users/${userId}/topup`, { amount }).then(res => res.data),
    ErrorType.API
  ),

  getUserTransactions: withErrorHandling(
    (userId: string, params?: {
      page?: number;
      limit?: number;
      type?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    }): Promise<{
      transactions: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      summary: any;
    }> =>
      api.get(`/admin/users/${userId}/transactions`, { params }).then(res => res.data),
    ErrorType.API
  ),

  // System Logs
  getLogs: withErrorHandling(
    (params?: {
      page?: number;
      limit?: number;
      level?: string;
      startDate?: string;
      endDate?: string;
      search?: string;
    }): Promise<{ logs: LogEntry[]; total: number; page: number; limit: number }> =>
      api.get("/admin/logs", { params }).then(res => res.data),
    ErrorType.API
  ),

  downloadLogs: withErrorHandling(
    (params?: {
      startDate?: string;
      endDate?: string;
      level?: string;
      format?: 'json' | 'csv' | 'txt';
    }): Promise<Blob> =>
      api.get("/admin/logs/download", {
        params,
        responseType: 'blob'
      }).then(res => res.data),
    ErrorType.API
  ),

  exportLogs: withErrorHandling(
    (params: {
      startDate: string;
      endDate: string;
      format: 'json' | 'csv' | 'txt';
      email?: string;
    }): Promise<{ exportId: string; status: string }> =>
      api.post("/admin/logs/export", params).then(res => res.data),
    ErrorType.API
  ),

  // Real-time Metrics
  getMetrics: withErrorHandling(
    (params?: {
      type?: 'overview' | 'timeseries' | 'alerts';
      timeframe?: '1h' | '6h' | '12h' | '24h';
    }): Promise<any> =>
      api.get("/admin/metrics", { params }).then(res => res.data),
    ErrorType.API
  ),
}

// Log Entry interface
export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: Record<string, any>;
  source?: string;
  userId?: string;
  requestId?: string;
}

export interface AnalyticsMetrics {
  deliveryRate: string;
  latency: string;
  errorRate: string;
  cost: string;
  throughput: string;
  conversionRate: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  type?: 'sms' | 'whatsapp' | 'voice' | 'email';
  channel?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  created?: string;
  updated?: string;
  project_id?: string;
  projectId?: string;
  target_audience?: string;
  message_content?: string;
  scheduled_at?: string;
  audience?: {
    total: number;
    delivered: number;
    failed: number;
    opened: number;
    clicked: number;
  };
  schedule?: {
    type: string;
    sentAt: string;
  };
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    cost: number;
  };
}
