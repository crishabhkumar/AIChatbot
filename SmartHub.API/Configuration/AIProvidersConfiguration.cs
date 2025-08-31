using SmartHub.API.Models;

namespace SmartHub.API.Configuration
{
    public class AIProvidersConfiguration
    {
        public const string SectionName = "AIProviders";

        public AzureOpenAIConfiguration? AzureOpenAI { get; set; }
        public AmazonBedrockConfiguration? AmazonBedrock { get; set; }
    }

    public class AzureOpenAIConfiguration : AIProviderConfiguration
    {
        public string DeploymentName { get; set; } = string.Empty;
    }

    public class AmazonBedrockConfiguration : AIProviderConfiguration
    {
        public string Region { get; set; } = string.Empty;
        public string AccessKey { get; set; } = string.Empty;
        public string SecretKey { get; set; } = string.Empty;
    }
}