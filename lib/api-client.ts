/**
 * API Client for making requests to the backend
 */

// Base API URL - in a real app, this would come from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sozuri.com';

// Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// API Client class
class ApiClient {
  private token: string | null = null;

  constructor() {
    // In a real app, you might initialize the token from localStorage or cookies
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Set the authentication token
   */
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  /**
   * Clear the authentication token
   */
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Get the headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      
      // Add query parameters if provided
      if (params) {
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key].toString());
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'An error occurred',
            code: errorData.code,
          },
        };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
      };
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'An error occurred',
            code: errorData.code,
          },
        };
      }

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
      };
    }
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'An error occurred',
            code: errorData.code,
          },
        };
      }

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
      };
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          error: {
            message: errorData.message || 'An error occurred',
            code: errorData.code,
          },
        };
      }

      const responseData = await response.json();
      return { data: responseData };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        error: {
          message: error instanceof Error ? error.message : 'An unknown error occurred',
        },
      };
    }
  }
}

// Create a singleton instance
const apiClient = new ApiClient();

export default apiClient;
