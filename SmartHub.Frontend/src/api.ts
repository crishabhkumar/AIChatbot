import axios from 'axios';
import { AIPromptRequest, AIResponse, AIProvider } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5189/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

export const aiApi = {
  // Generate response with specific provider
  generateResponse: async (
    request: AIPromptRequest,
    provider?: AIProvider
  ): Promise<AIResponse> => {
    const url = provider !== undefined 
      ? `/ai/generate?provider=${provider}` 
      : '/ai/generate';
    
    const response = await apiClient.post<AIResponse>(url, request);
    return response.data;
  },

  // Generate response with automatic fallback
  generateResponseWithFallback: async (
    request: AIPromptRequest
  ): Promise<AIResponse> => {
    const response = await apiClient.post<AIResponse>('/ai/generate-with-fallback', request);
    return response.data;
  },

  // Get available providers
  getAvailableProviders: async (): Promise<AIProvider[]> => {
    const response = await apiClient.get<AIProvider[]>('/ai/providers');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; timestamp: string }> => {
    const response = await apiClient.get('/AI/health');
    return response.data;
  },
};

// Error handler for API calls
export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.errorMessage || error.message;
      return `Server Error (${error.response.status}): ${message}`;
    } else if (error.request) {
      // Request was made but no response received
      return 'Network Error: Unable to connect to the server';
    }
  }
  
  return error.message || 'An unexpected error occurred';
};
