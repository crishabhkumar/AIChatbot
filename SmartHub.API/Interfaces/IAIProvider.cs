using SmartHub.API.Models;

namespace SmartHub.API.Interfaces
{
    public interface IAIProvider
    {
        AIProvider ProviderType { get; }
        Task<AIResponse> GenerateResponseAsync(AIPromptRequest request, CancellationToken cancellationToken = default);
        Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default);
    }
}