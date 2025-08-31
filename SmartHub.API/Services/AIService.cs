using SmartHub.API.Interfaces;
using SmartHub.API.Models;

namespace SmartHub.API.Services
{
    public class AIService : IAIService
    {
        private readonly IEnumerable<IAIProvider> _providers;
        private readonly ILogger<AIService> _logger;

        public AIService(IEnumerable<IAIProvider> providers, ILogger<AIService> logger)
        {
            _providers = providers ?? throw new ArgumentNullException(nameof(providers));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<AIResponse> GenerateResponseAsync(AIPromptRequest request, AIProvider? preferredProvider = null, CancellationToken cancellationToken = default)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            IAIProvider? provider = null;

            if (preferredProvider.HasValue)
            {
                provider = _providers.FirstOrDefault(p => p.ProviderType == preferredProvider.Value);
                if (provider == null)
                {
                    _logger.LogWarning("Preferred provider {Provider} not found, using default", preferredProvider);
                }
            }

            provider ??= _providers.FirstOrDefault();

            if (provider == null)
            {
                throw new InvalidOperationException("No AI providers are configured");
            }

            _logger.LogInformation("Using provider {Provider} for request", provider.ProviderType);

            return await provider.GenerateResponseAsync(request, cancellationToken);
        }

        public async Task<IEnumerable<AIProvider>> GetAvailableProvidersAsync(CancellationToken cancellationToken = default)
        {
            var availableProviders = new List<AIProvider>();

            foreach (var provider in _providers)
            {
                try
                {
                    if (await provider.IsHealthyAsync(cancellationToken))
                    {
                        availableProviders.Add(provider.ProviderType);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Provider {Provider} health check failed", provider.ProviderType);
                }
            }

            return availableProviders;
        }

        public async Task<AIResponse> GenerateResponseWithFallbackAsync(AIPromptRequest request, CancellationToken cancellationToken = default)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            var availableProviders = await GetAvailableProvidersAsync(cancellationToken);

            foreach (var providerType in availableProviders)
            {
                try
                {
                    var response = await GenerateResponseAsync(request, providerType, cancellationToken);
                    
                    if (response.IsSuccess)
                    {
                        return response;
                    }

                    _logger.LogWarning("Provider {Provider} returned unsuccessful response: {Error}", providerType, response.ErrorMessage);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Provider {Provider} failed, trying next provider", providerType);
                }
            }

            return new AIResponse
            {
                IsSuccess = false,
                ErrorMessage = "All providers failed to generate a response"
            };
        }
    }
}