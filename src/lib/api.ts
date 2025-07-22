import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

// API Configuration for FastAPI backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default configuration for FastAPI
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // Set to true if using cookies for auth
});

// Request interceptor for authentication and logging
api.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('ddas_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add company/tenant ID if available (for multi-tenant FastAPI)
    const companyId = localStorage.getItem('ddas_company_id');
    if (companyId && config.headers) {
      config.headers['X-Company-ID'] = companyId;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle different error scenarios for FastAPI
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('ddas_auth_token');
          localStorage.removeItem('ddas_user_data');
          localStorage.removeItem('ddas_company_id');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('❌ Access Forbidden:', (data as any)?.detail || 'You do not have permission to perform this action');
          break;
        case 404:
          console.error('❌ Resource Not Found:', (data as any)?.detail || 'The requested resource was not found');
          break;
        case 422:
          // FastAPI validation errors
          console.error('❌ Validation Error:', (data as any)?.detail || data);
          break;
        case 429:
          console.error('❌ Rate Limit Exceeded:', (data as any)?.detail || 'Too many requests');
          break;
        case 500:
          console.error('❌ Server Error:', (data as any)?.detail || 'Internal server error occurred');
          break;
        default:
          console.error('❌ API Error:', (data as any)?.detail || `Request failed with status ${status}`);
      }
      
      // Return structured error for FastAPI responses
      return Promise.reject({
        status,
        message: (data as any)?.detail || `Request failed with status ${status}`,
        errors: (data as any)?.detail || null,
        data: data,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ Network Error:', 'No response received from server');
      return Promise.reject({
        status: 0,
        message: 'Network error - please check your internet connection',
        errors: null,
        data: null,
      });
    } else {
      // Something else happened
      console.error('❌ Request Setup Error:', error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred',
        errors: null,
        data: null,
      });
    }
  }
);

// FastAPI response types
export interface FastAPIResponse<T = any> {
  data?: T;
  detail?: string;
  message?: string;
}

export interface FastAPIError {
  detail: string | Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface FastAPIPaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Generic API error type
export interface ApiError {
  status: number;
  message: string;
  errors: any;
  data: any;
}

// Helper functions for common API operations with FastAPI
export const apiHelpers = {
  // GET request with query parameters
  get: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await api.patch<T>(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string): Promise<T> => {
    const response = await api.delete<T>(url);
    return response.data;
  },

  // Upload file (multipart/form-data)
  upload: async <T>(
    url: string, 
    file: File, 
    additionalData?: Record<string, any>,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value));
      });
    }
    
    const response = await api.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },

  // Download file
  download: async (url: string, filename?: string, params?: Record<string, any>): Promise<void> => {
    const response = await api.get(url, {
      params,
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  // Paginated GET request
  getPaginated: async <T>(
    url: string, 
    params?: { page?: number; size?: number; [key: string]: any }
  ): Promise<FastAPIPaginatedResponse<T>> => {
    const response = await api.get<FastAPIPaginatedResponse<T>>(url, { 
      params: {
        page: 1,
        size: 20,
        ...params,
      }
    });
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// FastAPI authentication helpers
export const authHelpers = {
  // Set authentication token
  setToken: (token: string): void => {
    localStorage.setItem('ddas_auth_token', token);
  },

  // Get authentication token
  getToken: (): string | null => {
    return localStorage.getItem('ddas_auth_token');
  },

  // Clear authentication data
  clearAuth: (): void => {
    localStorage.removeItem('ddas_auth_token');
    localStorage.removeItem('ddas_user_data');
    localStorage.removeItem('ddas_company_id');
    localStorage.removeItem('ddas_refresh_token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('ddas_auth_token');
  },

  // Set user data
  setUserData: (userData: any): void => {
    localStorage.setItem('ddas_user_data', JSON.stringify(userData));
  },

  // Get user data
  getUserData: (): any | null => {
    const data = localStorage.getItem('ddas_user_data');
    return data ? JSON.parse(data) : null;
  },

  // Set company ID
  setCompanyId: (companyId: string): void => {
    localStorage.setItem('ddas_company_id', companyId);
  },

  // Get company ID
  getCompanyId: (): string | null => {
    return localStorage.getItem('ddas_company_id');
  },
};

// Export default api instance
export default api;
