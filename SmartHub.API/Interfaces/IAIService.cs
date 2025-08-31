using SmartHub.API.Models;

namespace SmartHub.API.Interfaces
{
    public interface IAIService
    {
        Task<AIResponse> GenerateResponseAsync(AIPromptRequest request, AIProvider? preferredProvider = null, CancellationToken cancellationToken = default);
        Task<IEnumerable<AIProvider>> GetAvailableProvidersAsync(CancellationToken cancellationToken = default);
        Task<AIResponse> GenerateResponseWithFallbackAsync(AIPromptRequest request, CancellationToken cancellationToken = default);
    }
}