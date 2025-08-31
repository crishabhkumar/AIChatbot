// API Types matching the backend models
export interface AIPromptRequest {
  prompt: string;
  temperature: number;
  maxTokens: number;
  systemMessage?: string;
  additionalParameters?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed: number;
  temperature?: number;
  timestamp: string;
  isSuccess: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export enum AIProvider {
  AzureOpenAI = 0,
  AmazonBedrock = 1
}

// Helper function to get provider display name
export const getProviderDisplayName = (provider: AIProvider): string => {
  switch (provider) {
    case AIProvider.AzureOpenAI:
      return 'Azure OpenAI';
    case AIProvider.AmazonBedrock:
      return 'Amazon Bedrock';
    default:
      return 'Unknown Provider';
  }
};

// Helper function to get provider model info
export const getProviderModel = (provider: AIProvider): string => {
  switch (provider) {
    case AIProvider.AzureOpenAI:
      return 'GPT-4';
    case AIProvider.AmazonBedrock:
      return 'Claude';
    default:
      return 'Unknown';
  }
};

// Chat specific types
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  provider?: string;
  model?: string;
  tokensUsed?: number;
  error?: string;
}

export interface ChatSettings {
  temperature: number;
  maxTokens: number;
  systemMessage: string;
  selectedProvider?: AIProvider;
}
