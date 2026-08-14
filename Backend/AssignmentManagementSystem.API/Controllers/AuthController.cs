using AssignmentManagementSystem.BusinessLogicLayer.DTOs.Auth;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AssignmentManagementSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
        {
            try
            {
                var response = await _authService.LoginAsync(dto);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/",
                    Expires = DateTimeOffset.Now.AddDays(7)
                };

                Response.Cookies.Append(
                    "access_token",
                    response.Token,
                    cookieOptions
                );

                return Ok(new
                {
                    Success = true,
                    Message = "Login successful.",
                    Data = new
                    {
                        response.Id,
                        response.FullName,
                        response.Email,
                        response.Role
                    }
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User identity not found."
                });
            }

            if (!Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "Invalid user identity."
                });
            }

            var user = await _authService.GetUserByIdAsync(userId);

            if (user == null)
            {
                return Unauthorized(new
                {
                    Success = false,
                    Message = "User not found."
                });
            }

            return Ok(new
            {
                Success = true,
                Data = new
                {
                    user.Id,
                    FullName = $"{user.FirstName} {user.LastName}".Trim(),
                    user.Email,
                    user.Role,
                    user.ProfilePictureUrl
                }
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete(
                "access_token",
                new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Path = "/"
                }
            );

            return Ok(new
            {
                Success = true,
                Message = "Logged out successfully."
            });
        }
    }
}