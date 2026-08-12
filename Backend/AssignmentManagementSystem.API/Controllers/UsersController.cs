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
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Route("UGID001")]
        public async Task<IActionResult> GetUserById(Guid id)
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

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("UED001")]
        public async Task<IActionResult> UpdateUser(Guid id, UserUpdateDto dto)
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

        [Authorize(Roles = nameof(UserRole.Admin))]
        [HttpPost]
        [Route("UD001")]
        public async Task<IActionResult> DeleteUser(Guid id)
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
