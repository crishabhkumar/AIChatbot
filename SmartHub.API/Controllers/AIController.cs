using Microsoft.AspNetCore.Mvc;
using SmartHub.API.Interfaces;
using SmartHub.API.Models;
using System.ComponentModel.DataAnnotations;

namespace SmartHub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly ILogger<AIController> _logger;

        public AIController(IAIService aiService, ILogger<AIController> logger)
        {
            _aiService = aiService ?? throw new ArgumentNullException(nameof(aiService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Generate a response from AI based on the provided prompt
        /// </summary>
        /// <param name="request">The prompt request containing the message and parameters</param>
        /// <param name="provider">Optional preferred AI provider</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>AI generated response</returns>
        [HttpPost("generate")]
        [ProducesResponseType(typeof(AIResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AIResponse>> GenerateResponse(
            [FromBody] AIPromptRequest request,
            [FromQuery] AIProvider? provider = null,
            CancellationToken cancellationToken = default)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Received AI generation request with provider: {Provider}", provider?.ToString() ?? "Default");

                var response = await _aiService.GenerateResponseAsync(request, provider, cancellationToken);

                if (response.IsSuccess)
                {
                    return Ok(response);
                }

                _logger.LogWarning("AI service returned unsuccessful response: {Error}", response.ErrorMessage);
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid request parameters");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing AI generation request");
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Generate a response with automatic fallback to available providers
        /// </summary>
        /// <param name="request">The prompt request containing the message and parameters</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>AI generated response</returns>
        [HttpPost("generate-with-fallback")]
        [ProducesResponseType(typeof(AIResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<AIResponse>> GenerateResponseWithFallback(
            [FromBody] AIPromptRequest request,
            CancellationToken cancellationToken = default)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Received AI generation request with fallback");

                var response = await _aiService.GenerateResponseWithFallbackAsync(request, cancellationToken);

                if (response.IsSuccess)
                {
                    return Ok(response);
                }

                _logger.LogWarning("All AI providers failed: {Error}", response.ErrorMessage);
                return StatusCode(StatusCodes.Status503ServiceUnavailable, response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid request parameters");
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing AI generation request with fallback");
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Get list of available AI providers
        /// </summary>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>List of available providers</returns>
        [HttpGet("providers")]
        [ProducesResponseType(typeof(IEnumerable<AIProvider>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<AIProvider>>> GetAvailableProviders(CancellationToken cancellationToken = default)
        {
            try
            {
                var providers = await _aiService.GetAvailableProvidersAsync(cancellationToken);
                return Ok(providers);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available providers");
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "An internal error occurred" });
            }
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        /// <returns>Health status</returns>
        [HttpGet("health")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }
    }
}