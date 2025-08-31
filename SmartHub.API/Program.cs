using SmartHub.API.Configuration;
using SmartHub.API.Interfaces;
using SmartHub.API.Providers;
using SmartHub.API.Services;
using SmartHub.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { 
        Title = "SmartHub API", 
        Version = "v1",
        Description = "AI API Gateway providing unified access to multiple AI providers with fallback support"
    });
    
    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Configure AI Providers
var aiProvidersConfig = builder.Configuration.GetSection(AIProvidersConfiguration.SectionName).Get<AIProvidersConfiguration>();

if (aiProvidersConfig?.AzureOpenAI != null)
{
    // Override with environment variables if available
    var apiKey = Environment.GetEnvironmentVariable("AZURE_OPENAI_API_KEY") ?? aiProvidersConfig.AzureOpenAI.ApiKey;
    var endpoint = Environment.GetEnvironmentVariable("AZURE_OPENAI_ENDPOINT") ?? aiProvidersConfig.AzureOpenAI.Endpoint;
    var model = Environment.GetEnvironmentVariable("AZURE_OPENAI_MODEL") ?? aiProvidersConfig.AzureOpenAI.Model;

    if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(endpoint))
    {
        throw new InvalidOperationException("Azure OpenAI API Key and Endpoint must be configured either in appsettings.json or environment variables");
    }

    var config = new AzureOpenAIConfiguration
    {
        ApiKey = apiKey,
        Endpoint = endpoint,
        Model = model,
        DeploymentName = aiProvidersConfig.AzureOpenAI.DeploymentName,
        ApiVersion = aiProvidersConfig.AzureOpenAI.ApiVersion
    };

    // Register Azure OpenAI provider
    builder.Services.AddSingleton<IAIProvider>(serviceProvider =>
    {
        var logger = serviceProvider.GetRequiredService<ILogger<AzureOpenAIProvider>>();
        return new AzureOpenAIProvider(config, logger);
    });
}

// Register AI Service
builder.Services.AddSingleton<IAIService, AIService>();

// Add logging
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Add CORS if needed
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AI API Endpoints v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at app root
    });
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
