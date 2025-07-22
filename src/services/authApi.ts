// Authentication API service for FastAPI backend
import { api, authHelpers, type FastAPIResponse } from '../lib/api';

export interface LoginRequest {
  username: string; // FastAPI OAuth2 uses 'username' field
  password: string;
  grant_type?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  company_name: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  is_superuser: boolean;
  company_id?: string;
  company_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  user: User;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const authApi = {
  // Login user (OAuth2 compatible)
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    formData.append('grant_type', credentials.grant_type || 'password');

    const response = await api.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    // Store auth data
    if (response.data) {
      authHelpers.setToken(response.data.access_token);
      authHelpers.setUserData(response.data.user);
      if (response.data.user.company_id) {
        authHelpers.setCompanyId(response.data.user.company_id);
      }
    }
    
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<FastAPIResponse<User>> => {
    const response = await api.post<FastAPIResponse<User>>('/auth/register', userData);
    return response.data;
  },

  // Logout user
  logout: async (): Promise<FastAPIResponse> => {
    try {
      const response = await api.post<FastAPIResponse>('/auth/logout');
      return response.data;
    } finally {
      // Clear auth data regardless of API response
      authHelpers.clearAuth();
    }
  },

  // Refresh token
  refreshToken: async (): Promise<TokenRefreshResponse> => {
    const refreshToken = localStorage.getItem('ddas_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<TokenRefreshResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (response.data) {
      authHelpers.setToken(response.data.access_token);
    }

    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    
    // Update stored user data
    if (response.data) {
      authHelpers.setUserData(response.data);
    }
    
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>('/auth/me', userData);
    
    // Update stored user data
    if (response.data) {
      authHelpers.setUserData(response.data);
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (passwords: { 
    current_password: string; 
    new_password: string; 
  }): Promise<FastAPIResponse> => {
    const response = await api.post<FastAPIResponse>('/auth/change-password', passwords);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<FastAPIResponse> => {
    const response = await api.post<FastAPIResponse>('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, new_password: string): Promise<FastAPIResponse> => {
    const response = await api.post<FastAPIResponse>('/auth/reset-password', { 
      token, 
      new_password 
    });
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string): Promise<FastAPIResponse> => {
    const response = await api.post<FastAPIResponse>('/auth/verify-email', { token });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (): Promise<FastAPIResponse> => {
    const response = await api.post<FastAPIResponse>('/auth/resend-verification');
    return response.data;
  },
};
