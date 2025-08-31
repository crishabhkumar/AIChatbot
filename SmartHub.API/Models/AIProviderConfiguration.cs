namespace SmartHub.API.Models
{
    public enum AIProvider
    {
        AzureOpenAI,
        AmazonBedrock
    }

    public class AIProviderConfiguration
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string? ApiVersion { get; set; }
        public Dictionary<string, string>? AdditionalSettings { get; set; }
    }
}