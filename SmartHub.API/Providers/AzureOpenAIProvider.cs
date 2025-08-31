using Azure.AI.OpenAI;
using Azure;
using SmartHub.API.Interfaces;
using SmartHub.API.Models;
using OpenAI.Chat;

namespace SmartHub.API.Providers
{
    public class AzureOpenAIProvider : IAIProvider, IDisposable
    {
        private readonly AzureOpenAIClient _client;
        private readonly AIProviderConfiguration _configuration;
        private readonly ILogger<AzureOpenAIProvider> _logger;
        private readonly ChatClient _chatClient;
        
        // Health check caching to avoid frequent API calls
        private DateTime _lastHealthCheck = DateTime.MinValue;
        private bool _lastHealthStatus = false;
        private readonly TimeSpan _healthCheckCacheDuration = TimeSpan.FromMinutes(5);
        private readonly SemaphoreSlim _healthCheckSemaphore = new(1, 1);

        public AIProvider ProviderType => AIProvider.AzureOpenAI;

        public AzureOpenAIProvider(AIProviderConfiguration configuration, ILogger<AzureOpenAIProvider> logger)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            var credential = new AzureKeyCredential(_configuration.ApiKey);
            _client = new AzureOpenAIClient(new Uri(_configuration.Endpoint), credential);
            _chatClient = _client.GetChatClient(_configuration.Model);
        }

        public async Task<AIResponse> GenerateResponseAsync(AIPromptRequest request, CancellationToken cancellationToken = default)
        {
            try
            {
                _logger.LogInformation("Generating response using Azure OpenAI for prompt: {Prompt}", request.Prompt[..Math.Min(50, request.Prompt.Length)]);

                var messages = new List<ChatMessage>();

                if (!string.IsNullOrEmpty(request.SystemMessage))
                {
                    messages.Add(ChatMessage.CreateSystemMessage(request.SystemMessage));
                }

                messages.Add(ChatMessage.CreateUserMessage(request.Prompt));

                var chatCompletionOptions = new ChatCompletionOptions();

                var response = await _chatClient.CompleteChatAsync(messages, chatCompletionOptions, cancellationToken);

                var aiResponse = new AIResponse
                {
                    Content = response.Value.Content[0].Text,
                    Provider = ProviderType.ToString(),
                    Model = _configuration.Model,
                    TokensUsed = response.Value.Usage?.TotalTokenCount ?? 0,
                    Temperature = request.Temperature,
                    IsSuccess = true,
                    Metadata = new Dictionary<string, object>
                    {
                        ["PromptTokens"] = response.Value.Usage?.InputTokenCount ?? 0,
                        ["CompletionTokens"] = response.Value.Usage?.OutputTokenCount ?? 0,
                        ["FinishReason"] = response.Value.FinishReason.ToString()
                    }
                };

                _logger.LogInformation("Successfully generated response using Azure OpenAI. Tokens used: {TokensUsed}", aiResponse.TokensUsed);

                return aiResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating response using Azure OpenAI");

                return new AIResponse
                {
                    Provider = ProviderType.ToString(),
                    Model = _configuration.Model,
                    IsSuccess = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default)
        {
            // Check if we have a recent cached result
            if (DateTime.UtcNow - _lastHealthCheck < _healthCheckCacheDuration)
            {
                _logger.LogDebug("Returning cached health status: {Status}", _lastHealthStatus);
                return _lastHealthStatus;
            }

            // Use semaphore to prevent multiple concurrent health checks
            await _healthCheckSemaphore.WaitAsync(cancellationToken);
            try
            {
                // Double-check after acquiring lock
                if (DateTime.UtcNow - _lastHealthCheck < _healthCheckCacheDuration)
                {
                    return _lastHealthStatus;
                }

                _logger.LogDebug("Performing fresh health check for Azure OpenAI provider");
                
                bool isHealthy = await PerformActualHealthCheckAsync(cancellationToken);
                
                // Update cache
                _lastHealthCheck = DateTime.UtcNow;
                _lastHealthStatus = isHealthy;
                
                return isHealthy;
            }
            finally
            {
                _healthCheckSemaphore.Release();
            }
        }

        private async Task<bool> PerformActualHealthCheckAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Make a minimal chat completion request with very low token limit
                var healthCheckMessages = new List<ChatMessage>
                {
                    ChatMessage.CreateUserMessage("Hi")
                };

                var healthCheckOptions = new ChatCompletionOptions
                {
                    MaxOutputTokenCount = 1, // Minimal token usage
                    Temperature = 0 // Deterministic for consistent health checks
                };

                // Set a shorter timeout for health checks
                using var timeoutCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                timeoutCts.CancelAfter(TimeSpan.FromSeconds(10)); // 10 second timeout

                var response = await _chatClient.CompleteChatAsync(
                    healthCheckMessages, 
                    healthCheckOptions, 
                    timeoutCts.Token);

                // If we get here, the service is responding
                _logger.LogDebug("Health check successful for Azure OpenAI provider");
                return true;
            }
            catch (RequestFailedException ex) when (ex.Status == 401)
            {
                _logger.LogWarning("Health check failed: Authentication error - {Message}", ex.Message);
                return false;
            }
            catch (RequestFailedException ex) when (ex.Status == 429)
            {
                _logger.LogWarning("Health check failed: Rate limit exceeded - {Message}", ex.Message);
                return false;
            }
            catch (RequestFailedException ex) when (ex.Status >= 500)
            {
                _logger.LogWarning("Health check failed: Server error - {Message}", ex.Message);
                return false;
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                _logger.LogWarning("Health check was cancelled");
                return false;
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("Health check failed: Request timeout");
                return false;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogWarning("Health check failed: Network error - {Message}", ex.Message);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed with unexpected error");
                return false;
            }
        }

        public void Dispose()
        {
            _healthCheckSemaphore?.Dispose();
        }
    }
}