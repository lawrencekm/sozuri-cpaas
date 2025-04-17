import axios from "axios"
import logger from './logger'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
})

// Add request interceptor for authentication
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
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logger.error({ 
      message: 'API Error',
      error: error.response?.data || error.message,
      status: error.response?.status,
      url: error.config?.url
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/onboarding"
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) => api.post("/auth/login", credentials),
  register: (userData: { name: string; email: string; password: string }) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/me"),
}

// Projects API
export const projectsAPI = {
  getAll: () => api.get("/projects"),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (project: any) => api.post("/projects", project),
  update: (id: string, project: any) => api.put(`/projects/${id}`, project),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

// Campaigns API
export const campaignsAPI = {
  getAll: () => api.get("/campaigns"),
  getById: (id: string) => api.get(`/campaigns/${id}`),
  create: (campaign: any) => api.post("/campaigns", campaign),
  update: (id: string, campaign: any) => api.put(`/campaigns/${id}`, campaign),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
}

// Messaging API
export const messagingAPI = {
  // SMS
  getSMS: (params?: any) => api.get("/messaging/sms", { params }),
  getSMSById: (id: string) => api.get(`/messaging/sms/${id}`),
  sendSMS: (data: any) => api.post("/messaging/sms/send", data),
  sendBulkSMS: (data: any) => api.post("/messaging/sms/bulk", data),
}
