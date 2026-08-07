using AssignmentManagementSystem.BusinessLogicLayer.DTOs.User;
using AssignmentManagementSystem.BusinessLogicLayer.Enums;
using AssignmentManagementSystem.BusinessLogicLayer.Interfaces.IServices;
using AssignmentManagementSystem.Shared.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AssignmentManagementSystem.API.Controllers
{
    [Authorize(Roles = nameof(UserRole.Admin))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("Profile")]
        public IActionResult Profile()
        {
            return Ok(new
            {
                UserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                Email = User.FindFirstValue(ClaimTypes.Email),
                Role = User.FindFirstValue(ClaimTypes.Role),
                FirstName = User.FindFirstValue("FirstName"),
                LastName = User.FindFirstValue("LastName")
            });
        }

        [Authorize(Roles = "Teacher")]
        [HttpGet("teacher-only")]
        public IActionResult TeacherOnly()
        {
            return Ok("Welcome Teacher");
        }

        [Authorize(Roles = "Student")]
        [HttpGet("student-only")]
        public IActionResult StudentOnly()
        {
            return Ok("Welcome Student");
        }

        [HttpGet]
        [Route("UGID001")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);

                if (user == null)
                {
                    return NotFound(
                        new
                        {
                            message = "User not found"
                        });
                }


                return Ok(user);
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

        [HttpGet]
        [Route("UG001")]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();

                return Ok(users);
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

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("UIN001")]
        public async Task<IActionResult> CreateUser(UserCreateDto dto)
        {
            try
            {
                await _userService.CreateUserAsync(dto);

                return Ok(new
                {
                    Success = true,
                    Message = "User created successfully"
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

        [HttpPost]
        [Route("UED001")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto dto)
        {
            try
            {
                await _userService.UpdateUserAsync(id, dto);

                return Ok(
                    new
                    {
                        Success = true,
                        message = "User updated successfully"
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

        [HttpPost]
        [Route("UD001")]
        public async Task<IActionResult> DeleteUser(int id)
        {

            try
            {
                await _userService.DeleteUserAsync(id);
                return Ok(
                new
                {
                    Success = true,
                    message = "User deleted successfully"
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


    }
}
