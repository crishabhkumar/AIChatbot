namespace SmartHub.API.Models
{
    public class AIResponse
    {
        public string Content { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public int TokensUsed { get; set; }
        public double? Temperature { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsSuccess { get; set; } = true;
        public string? ErrorMessage { get; set; }
        public Dictionary<string, object>? Metadata { get; set; }
    }
}