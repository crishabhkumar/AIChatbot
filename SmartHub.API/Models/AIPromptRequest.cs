using System.ComponentModel.DataAnnotations;

namespace SmartHub.API.Models
{
    public class AIPromptRequest
    {
        [Required]
        [StringLength(10000, MinimumLength = 1)]
        public string Prompt { get; set; } = string.Empty;

        [Range(0.0, 2.0)]
        public double Temperature { get; set; } = 0.7;

        [Range(1, 4000)]
        public int MaxTokens { get; set; } = 1000;

        public string? SystemMessage { get; set; }

        public Dictionary<string, object>? AdditionalParameters { get; set; }
    }
}