# SmartHub API - AI Gateway with Multi-Provider Support

SmartHub API is an intelligent AI gateway that provides unified access to multiple AI providers including Azure OpenAI and Amazon Bedrock, with automatic fallback capabilities and robust error handling.

## Configuration

Update your `appsettings.json` with your Azure OpenAI credentials:

```json
{
  "AIProviders": {
    "AzureOpenAI": {
      "ApiKey": "your-azure-openai-api-key",
      "Endpoint": "https://your-resource-name.openai.azure.com/",
      "Model": "gpt-35-turbo",
      "DeploymentName": "gpt-35-turbo",
      "ApiVersion": "2024-02-15-preview"
    }
  }
}
```

## API Endpoints

### 1. Generate AI Response
**POST** `/api/ai/generate`

Generate a response using the specified AI provider.

**Request Body:**
```json
{
  "prompt": "Tell me a joke about programming",
  "temperature": 0.7,
  "maxTokens": 1000,
  "systemMessage": "You are a helpful assistant"
}
```

**Query Parameters:**
- `provider` (optional): Specify the AI provider (AzureOpenAI, AmazonBedrock)

**Response:**
```json
{
  "content": "Why do programmers prefer dark mode? Because light attracts bugs!",
  "provider": "AzureOpenAI",
  "model": "gpt-35-turbo",
  "tokensUsed": 25,
  "temperature": 0.7,
  "timestamp": "2024-01-01T12:00:00Z",
  "isSuccess": true,
  "metadata": {
    "PromptTokens": 15,
    "CompletionTokens": 10,
    "FinishReason": "Stop"
  }
}
```

### 2. Generate with Fallback
**POST** `/api/ai/generate-with-fallback`

Generate a response with automatic fallback to available providers.

### 3. Get Available Providers
**GET** `/api/ai/providers`

Returns list of available and healthy AI providers.

### 4. Health Check
**GET** `/api/ai/health`

Basic health check endpoint.

## Example Usage

### Using cURL:
```bash
curl -X POST "http://localhost:5189/api/ai/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explain what is machine learning",
    "temperature": 0.7,
    "maxTokens": 500
  }'
```

### Using PowerShell:
```powershell
$body = @{
    prompt = "What is the capital of France?"
    temperature = 0.5
    maxTokens = 100
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5189/api/ai/generate" -Method Post -Body $body -ContentType "application/json"
```

## Architecture

The solution follows a provider pattern that allows easy extension to multiple AI services:

1. **Models**: Request/Response models with validation
2. **Interfaces**: Abstractions for providers and services
3. **Providers**: Implementation for specific AI services (Azure OpenAI, Amazon Bedrock)
4. **Services**: Orchestration layer with fallback support
5. **Controllers**: REST API endpoints

## Security

- Store API keys in environment variables or Azure Key Vault in production
- Use HTTPS in production
- Implement rate limiting and authentication as needed

## Future Extensions

To add Amazon Bedrock support:
1. Create `AmazonBedrockProvider` implementing `IAIProvider`
2. Add configuration in `appsettings.json`
3. Register the provider in `Program.cs`

The existing code will automatically use the new provider through the service layer.